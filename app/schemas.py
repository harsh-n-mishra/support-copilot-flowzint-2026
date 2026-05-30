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


class TicketDraft(BaseModel):
    title: str
    summary: str
    intent: str
    escalation_target: str
    conversation_summary: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceChunk]
    intent: str
    escalation_target: str
    handoff: HandoffTicket | None = None
    ticket_draft: TicketDraft | None = None