from __future__ import annotations

from collections import defaultdict, deque
from uuid import uuid4

from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

from app.config import settings
from app.schemas import HandoffTicket

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

_MEMORY: dict[str, deque[tuple[str, str]]] = defaultdict(lambda: deque(maxlen=settings.memory_turns))


def _get_vectorstore() -> Chroma:
    embeddings = GoogleGenerativeAIEmbeddings(
        model=settings.gemini_embedding_model,
        google_api_key=settings.gemini_api_key,
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


def _format_sources(raw_results: list[tuple]) -> list[dict]:
    sources = []
    for idx, (doc, score) in enumerate(raw_results, start=1):
        sources.append(
            {
                "id": idx,
                "source": doc.metadata.get("source", "unknown"),
                "snippet": doc.page_content[:220].replace("\n", " "),
                "score": round(float(score), 4),
            }
        )
    return sources


def _needs_handoff(answer: str, top_score: float) -> bool:
    unsure = ("i don't know" in answer.lower()) or ("i do not know" in answer.lower())
    return top_score < settings.min_relevance_score or unsure


def ask_support_question(question: str, session_id: str) -> tuple[str, list[dict], HandoffTicket | None]:
    vectorstore = _get_vectorstore()
    results = vectorstore.similarity_search_with_relevance_scores(question, k=settings.top_k)

    if not results:
        handoff = _create_handoff("No relevant documentation found for this request.")
        answer = (
            "I could not find relevant documentation to answer that confidently. "
            f"I created support ticket **{handoff.ticket_id}** for human follow-up."
        )
        _MEMORY[session_id].append((question, answer))
        return answer, [], handoff

    top_score = max(score for _, score in results)
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

    sources = _format_sources(results)
    answer = str(response.content)

    handoff = None
    if _needs_handoff(answer, top_score):
        handoff = _create_handoff(
            "Low retrieval confidence or unknown answer. Requires human support follow-up."
        )
        answer += f"\n\nI have also created ticket **{handoff.ticket_id}** for a support specialist."

    _MEMORY[session_id].append((question, answer))
    return answer, sources, handoff


def clear_memory(session_id: str) -> None:
    _MEMORY.pop(session_id, None)