from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=2, description="User support question")
    session_id: str = Field(default="default", description="Conversation/session identifier")


class SourceChunk(BaseModel):
    id: int
    source: str
    snippet: str
    score: float


class DebugChunk(BaseModel):
    source: str
    score: float
    snippet: str


class DebugInfo(BaseModel):
    retrieved_chunks: list[DebugChunk]
    top_score: float
    handoff_reason: str | None = None
    prompt_context_preview: str


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
    debug: DebugInfo
    handoff: HandoffTicket | None = None
    ticket_draft: TicketDraft | None = None


class IntentCount(BaseModel):
    intent: str
    count: int


class FailedQuery(BaseModel):
    question: str
    retrieval_score: float
    timestamp: str


class AnalyticsResponse(BaseModel):
    total_chats: int
    handoff_rate: float
    avg_retrieval_score: float
    top_intents: list[IntentCount]
    failed_queries: list[FailedQuery]