from fastapi import FastAPI, HTTPException

from app.ingest import build_or_refresh_index
from app.rag import ask_support_question
from app.schemas import ChatRequest, ChatResponse, SourceChunk

app = FastAPI(title="AI Support Chatbot API", version="1.0.0")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    try:
        answer, source_dicts = ask_support_question(payload.question)
    except Exception as exc:  # surface indexing/config issues clearly
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    sources = [SourceChunk(**item) for item in source_dicts]
    return ChatResponse(answer=answer, sources=sources)


@app.post("/reindex")
def reindex() -> dict[str, str | int]:
    try:
        chunks = build_or_refresh_index()
        return {"status": "ok", "chunks_indexed": chunks}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc