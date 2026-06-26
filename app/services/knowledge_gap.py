import re
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


TOPIC_RULES = {
    "password reset": [
        {"password", "reset"},
        {"forgot", "password"},
    ],
    "refund": [
        {"refund"},
    ],
    "subscription": [
        {"subscription"},
    ],
    "slack integration": [
        {"slack"},
    ],
    "rate limits": [
        {"rate", "limit"},
        {"rate", "limits"},
    ],
}


def normalize_question(question: str) -> str:
    """
    Normalize a user's support question into a canonical topic.

    Returns the matching topic name or "other" if no topic matches.
    """
    words = set(re.findall(r"\w+", question.lower()))

    for topic, keyword_sets in TOPIC_RULES.items():
        for keywords in keyword_sets:
            if keywords.issubset(words):
                return topic

    return "other"