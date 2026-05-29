from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=2, description="User support question")
    session_id: str = Field(default="default", description="Conversation/session identifier")


class SourceChunk(BaseModel):
    id: int
    source: str
    snippet: str
    score: float


class HandoffTicket(BaseModel):
    ticket_id: str
    reason: str
    contact: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceChunk]
    handoff: HandoffTicket | None = None