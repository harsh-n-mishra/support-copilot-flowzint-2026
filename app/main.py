import logging

from fastapi import FastAPI, HTTPException

from app.analytics import get_analytics_summary, init_analytics_db, record_chat_analytics
from app.ingest import build_or_refresh_index
from app.rag import ask_support_question, clear_memory
from app.schemas import AnalyticsResponse, ChatRequest, ChatResponse, SourceChunk

logger = logging.getLogger(__name__)

app = FastAPI(title="AI Support Chatbot API", version="2.2.1")


@app.on_event("startup")
def startup_event() -> None:
    init_analytics_db()


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    try:
        result = ask_support_question(payload.question, payload.session_id)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    try:
        record_chat_analytics(
            session_id=payload.session_id,
            question=payload.question,
            intent=result.intent,
            retrieval_score=result.retrieval_score,
            handoff_triggered=result.handoff is not None,
            escalation_target=result.escalation_target,
        )
    except Exception:
        logger.exception("Analytics write failed for session_id=%s", payload.session_id)

    sources = [SourceChunk(**item) for item in result.sources]
    return ChatResponse(
        answer=result.answer,
        sources=sources,
        intent=result.intent,
        escalation_target=result.escalation_target,
        handoff=result.handoff,
        ticket_draft=result.ticket_draft,
    )


@app.post("/reindex")
def reindex() -> dict[str, str | int]:
    try:
        chunks = build_or_refresh_index()
        return {"status": "ok", "chunks_indexed": chunks}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.delete("/memory/{session_id}")
def delete_memory(session_id: str) -> dict[str, str]:
    clear_memory(session_id)
    return {"status": "ok", "session_id": session_id, "message": "Memory cleared."}


@app.get("/analytics", response_model=AnalyticsResponse)
def analytics() -> AnalyticsResponse:
    try:
        summary = get_analytics_summary()
        return AnalyticsResponse(**summary)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc