from dataclasses import dataclass
from enum import Enum


class GapPriority(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


@dataclass
class TopicMetrics:
    """Internal metrics used to analyze support knowledge gaps."""

    topic: str

    frequency: int = 0

    unanswered_count: int = 0

    high_confidence_count: int = 0
    medium_confidence_count: int = 0
    low_confidence_count: int = 0

    average_retrieval_score: float = 0.0

    success_rate: float = 0.0

    priority_score: int = 0

    priority: GapPriority = GapPriority.LOW


@dataclass
class KnowledgeGap:
    """Public API model returned by the knowledge gaps endpoint."""

    topic: str

    frequency: int

    average_retrieval_score: float

    priority: GapPriority