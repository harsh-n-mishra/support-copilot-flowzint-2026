from pydantic import BaseModel, Field

from app.services.confidence import ConfidenceLevel
from app.services.verification import VerificationStatus
from app.services.gap_ranking import (
    GapPriority,
    GapSeverity,
)


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=2, description="User support question")
    session_id: str = Field(
        default="default",
        description="Conversation/session identifier",
    )


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


class VerificationResponse(BaseModel):
    status: VerificationStatus
    reason: str
    evidence_count: int


class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceChunk]
    intent: str
    confidence: ConfidenceLevel
    escalation_target: str
    debug: DebugInfo
    handoff: HandoffTicket | None = None
    ticket_draft: TicketDraft | None = None
    verification: VerificationResponse


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


class KnowledgeGapResponse(BaseModel):
    topic: str
    frequency: int
    average_retrieval_score: float
    priority: GapPriority
    severity: GapSeverity
    missing_documentation: bool


class SupportHealthResponse(BaseModel):
    total_interactions: int
    average_confidence: float
    unanswered_rate: float
    handoff_rate: float
    average_response_time_ms: float


class AnalyticsSummaryResponse(BaseModel):
    total_interactions: int
    top_questions: list[str]
    top_failures: list[str]
    average_retrieval_score: float