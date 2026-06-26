from __future__ import annotations

from collections import defaultdict, deque
from dataclasses import dataclass
from uuid import uuid4

from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.embeddings import HuggingFaceEmbeddings

from app.config import settings
from app.schemas import DebugInfo, HandoffTicket, TicketDraft

from time import perf_counter

from app.services.confidence import (
    ConfidenceLevel,
    calculate_confidence,
)
from app.services.verification import VerificationStatus

PROMPT = ChatPromptTemplate.from_messages(
    [
        ("system", "{system_prompt}"),
        (
            "human",
            "Conversation history:\n{history}\n\n"
            "Question: {question}\n\n"
            "Context:\n{context}\n\n"
            "Respond with concise support guidance and include citation markers like [1], [2].",
        ),
    ]
)

ESCALATION_BUFFER = 0.05
MAX_CONTEXT_PREVIEW = 500

_MEMORY: dict[str, deque[tuple[str, str]]] = defaultdict(lambda: deque(maxlen=settings.memory_turns))
_SESSION_SUMMARY: dict[str, str] = defaultdict(str)


@dataclass
class RagResult:
    answer: str

    sources: list[dict]

    intent: str

    retrieval_score: float

    confidence: ConfidenceLevel

    answered: bool

    verification_status: VerificationStatus

    retrieved_chunk_count: int

    response_time_ms: int

    escalation_target: str

    debug: DebugInfo

    handoff: HandoffTicket | None

    ticket_draft: TicketDraft | None


def _get_vectorstore() -> Chroma:
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    return Chroma(
        persist_directory=settings.vector_db_dir,
        embedding_function=embeddings,
    )


def _build_history_text(session_id: str) -> str:
    turns = list(_MEMORY.get(session_id, []))
    if not turns:
        return "No previous conversation."
    return "\n".join(f"User: {q}\nAssistant: {a}" for q, a in turns)


def _create_handoff(reason: str) -> HandoffTicket:
    return HandoffTicket(
        ticket_id=f"TKT-{uuid4().hex[:8].upper()}",
        reason=reason,
        contact=settings.support_email,
    )


def _build_chunk_views(raw_results: list[tuple]) -> tuple[list[dict], list[dict]]:
    """Build response source chunks and debug chunks from a single pass."""
    sources: list[dict] = []
    debug_chunks: list[dict] = []

    for idx, (doc, score) in enumerate(raw_results, start=1):
        source = doc.metadata.get("source", "unknown")
        normalized_score = round(float(score), 4)
        snippet = doc.page_content[:220].replace("\n", " ")

        sources.append(
            {
                "id": idx,
                "source": source,
                "snippet": snippet,
                "score": normalized_score,
            }
        )

        debug_chunks.append(
            {
                "source": source,
                "score": normalized_score,
                "snippet": snippet,
            }
        )

    return sources, debug_chunks


def _build_context_preview(context: str) -> str:
    preview = " ".join(context.split())
    if len(preview) <= MAX_CONTEXT_PREVIEW:
        return preview
    return f"{preview[:MAX_CONTEXT_PREVIEW]}..."


def _build_debug_info(
    *,
    debug_chunks: list[dict],
    top_score: float,
    handoff_reason: str | None,
    prompt_context_preview: str,
) -> DebugInfo:
    if settings.enable_debug_inspector:
        return DebugInfo(
            retrieved_chunks=debug_chunks,
            top_score=round(float(top_score), 4),
            handoff_reason=handoff_reason,
            prompt_context_preview=prompt_context_preview,
        )

    return DebugInfo(
        retrieved_chunks=[],
        top_score=0.0,
        handoff_reason=None,
        prompt_context_preview="Debug inspector is disabled.",
    )


def _classify_intent(question: str) -> str:
    text = question.lower()
    if any(x in text for x in ["bill", "invoice", "payment", "refund", "charge", "subscription"]):
        return "billing"
    if any(x in text for x in ["password", "login", "sign in", "locked", "2fa", "otp", "account access"]):
        return "account_access"
    if any(x in text for x in ["bug", "error", "crash", "broken", "not working", "timeout", "500"]):
        return "technical_issue"
    if any(
        x in text
        for x in ["feature request", "new feature", "enhancement", "roadmap", "add support for"]
    ):
        return "feature_request"
    if any(x in text for x in ["how", "what", "where", "when", "can i", "do you"]):
        return "general_question"
    return "other"


def _needs_handoff(answer: str, top_score: float) -> bool:
    unsure = ("i don't know" in answer.lower()) or ("i do not know" in answer.lower())
    return top_score < settings.min_relevance_score or unsure


def _determine_answered( handoff_reason: str | None, ) -> bool:
    return handoff_reason is None


def _recommend_escalation(intent: str, top_score: float, handoff: bool) -> str:
    if handoff:
        if intent == "billing":
            return "billing_team"
        if intent in {"technical_issue", "feature_request"}:
            return "engineering"
        return "support_agent"

    if top_score < settings.min_relevance_score + ESCALATION_BUFFER:
        return "support_agent"

    return "self_service"


def _substantive_answer_for_summary(answer: str) -> str:
    marker = "\n\nI have also created ticket **"
    cleaned = answer.split(marker, maxsplit=1)[0]

    cleaned = cleaned.replace("I created support ticket ", "")
    cleaned = cleaned.replace("for human follow-up.", "")
    cleaned = cleaned.replace("**", "")
    cleaned = " ".join(cleaned.split())
    return cleaned.strip()


def _update_session_summary(session_id: str, question: str, answer: str) -> str:
    prev = _SESSION_SUMMARY.get(session_id, "")
    q_snippet = question.strip().replace("\n", " ")[:160]
    substantive_answer = _substantive_answer_for_summary(answer)
    a_snippet = substantive_answer[:220]
    update = f"User asked: {q_snippet}. Assistant responded: {a_snippet}."

    merged = f"{prev} {update}".strip() if prev else update
    _SESSION_SUMMARY[session_id] = merged[-1200:]
    return _SESSION_SUMMARY[session_id]


def _build_ticket_draft(
    question: str,
    intent: str,
    escalation_target: str,
    conversation_summary: str,
) -> TicketDraft:
    return TicketDraft(
        title=f"[{intent}] Support escalation required",
        summary=question.strip()[:240],
        intent=intent,
        escalation_target=escalation_target,
        conversation_summary=conversation_summary,
    )


def _apply_workflow(
    *,
    question: str,
    intent: str,
    answer: str,
    top_score: float,
    handoff_reason: str | None,
    sources: list[dict],
    debug_chunks: list[dict],
    prompt_context_preview: str,
    session_id: str,
    confidence: ConfidenceLevel,
    answered: bool,
    verification_status: VerificationStatus,
    retrieved_chunk_count: int,
    response_time_ms: int,
) -> RagResult:
    handoff = _create_handoff(handoff_reason) if handoff_reason else None

    if (
        handoff is not None
        and handoff_reason != "No relevant documentation found for this request."
    ):
        answer += (
            f"\n\nI have also created ticket **{handoff.ticket_id}** "
            "for a support specialist."
        )

    _MEMORY[session_id].append((question, answer))
    conversation_summary = _update_session_summary(
        session_id,
        question,
        answer,
    )

    escalation_target = _recommend_escalation(
        intent,
        top_score=top_score,
        handoff=handoff is not None,
    )

    ticket_draft = (
        _build_ticket_draft(
            question,
            intent,
            escalation_target,
            conversation_summary,
        )
        if handoff is not None
        else None
    )

    debug = _build_debug_info(
        debug_chunks=debug_chunks,
        top_score=top_score,
        handoff_reason=handoff_reason,
        prompt_context_preview=prompt_context_preview,
    )

    return RagResult(
        answer=answer,
        sources=sources,
        intent=intent,
        retrieval_score=top_score,
        confidence=confidence,
        answered=answered,
        verification_status=verification_status,
        retrieved_chunk_count=retrieved_chunk_count,
        response_time_ms=response_time_ms,
        escalation_target=escalation_target,
        debug=debug,
        handoff=handoff,
        ticket_draft=ticket_draft,
    )


def ask_support_question(question: str, session_id: str) -> RagResult:
    start_time = perf_counter()

    intent = _classify_intent(question)

    vectorstore = _get_vectorstore()
    results = vectorstore.similarity_search_with_relevance_scores(
        question,
        k=settings.top_k,
    )

    retrieved_chunk_count = len(results)

    if not results:
        answer = "I could not find relevant documentation to answer that confidently."
        response_time_ms = round((perf_counter() - start_time) * 1000)

        confidence = ConfidenceLevel.LOW

        verification_status = VerificationStatus.UNKNOWN

        handoff_reason = "No relevant documentation found for this request."

        answered = _determine_answered(handoff_reason)

        return _apply_workflow(
            question=question,
            intent=intent,
            answer=answer,
            top_score=0.0,
            handoff_reason=handoff_reason,
            sources=[],
            debug_chunks=[],
            prompt_context_preview="No retrieved context.",
            session_id=session_id,
            confidence=confidence,
            answered=answered,
            verification_status=verification_status,
            retrieved_chunk_count=retrieved_chunk_count,
            response_time_ms=response_time_ms,
        )

    top_score = max(score for _, score in results)
    confidence = calculate_confidence(top_score)
    verification_status = VerificationStatus.UNKNOWN
    docs = [doc for doc, _ in results]
    context = "\n\n".join(doc.page_content for doc in docs)
    history = _build_history_text(session_id)

    llm = ChatGoogleGenerativeAI(
        model=settings.gemini_model,
        google_api_key=settings.gemini_api_key,
        temperature=0,
    )

    chain = PROMPT | llm

    response = chain.invoke(
        {
            "system_prompt": settings.system_prompt,
            "question": question,
            "history": history,
            "context": context,
        }
    )

    answer = str(response.content)
    sources, debug_chunks = _build_chunk_views(results)
    prompt_context_preview = _build_context_preview(context)

    handoff_reason = (
        "Low retrieval confidence or unknown answer. Requires human support follow-up."
        if _needs_handoff(answer, top_score)
        else None
    )

    answered = _determine_answered(handoff_reason)

    response_time_ms = round((perf_counter() - start_time) * 1000)

    return _apply_workflow(
        question=question,
        intent=intent,
        answer=answer,
        top_score=top_score,
        handoff_reason=handoff_reason,
        sources=sources,
        debug_chunks=debug_chunks,
        prompt_context_preview=prompt_context_preview,
        session_id=session_id,
        confidence=confidence,
        answered=answered,
        verification_status=verification_status,
        retrieved_chunk_count=retrieved_chunk_count,
        response_time_ms=response_time_ms,
    )


def clear_memory(session_id: str) -> None:
    _MEMORY.pop(session_id, None)
    _SESSION_SUMMARY.pop(session_id, None)