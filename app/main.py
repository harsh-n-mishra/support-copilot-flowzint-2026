from fastapi import FastAPI, HTTPException

from app.ingest import build_or_refresh_index
from app.rag import ask_support_question, clear_memory
from app.schemas import ChatRequest, ChatResponse, SourceChunk

app = FastAPI(title="AI Support Chatbot API", version="2.0.0")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    try:
        answer, source_dicts, handoff = ask_support_question(payload.question, payload.session_id)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    sources = [SourceChunk(**item) for item in source_dicts]
    return ChatResponse(answer=answer, sources=sources, handoff=handoff)


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