import re
from dataclasses import dataclass
from enum import Enum
from collections import defaultdict

from app.services.confidence import ConfidenceLevel

from app.analytics import get_chat_interactions

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

def calculate_gap_priority(
    metrics: TopicMetrics,
) -> TopicMetrics:
    """
    Calculate the priority of a knowledge gap based on support metrics.

    Priority is determined using a weighted score:
    - unanswered questions are weighted most heavily
    - low-confidence answers are weighted next
    - medium-confidence answers contribute slightly
    - frequency is capped so common topics don't dominate
    """

    metrics.priority_score = (
        metrics.unanswered_count * 3
        + metrics.low_confidence_count * 2
        + metrics.medium_confidence_count
        + min(metrics.frequency, 5)
    )

    if metrics.priority_score >= 12:
        metrics.priority = GapPriority.HIGH
    elif metrics.priority_score >= 6:
        metrics.priority = GapPriority.MEDIUM
    else:
        metrics.priority = GapPriority.LOW

    return metrics

def aggregate_topic_metrics(rows) -> dict[str, TopicMetrics]:
    metrics: dict[str, TopicMetrics] = {}

    for row in rows:
        topic = normalize_question(row["question"])

        if topic not in metrics:
            metrics[topic] = TopicMetrics(topic=topic)

        topic_metrics = metrics[topic]

        topic_metrics.frequency += 1

        if not row["answered"]:
            topic_metrics.unanswered_count += 1

        confidence = ConfidenceLevel(row["confidence"])

        if confidence == ConfidenceLevel.HIGH:
            topic_metrics.high_confidence_count += 1

        elif confidence == ConfidenceLevel.MEDIUM:
            topic_metrics.medium_confidence_count += 1

        else:
            topic_metrics.low_confidence_count += 1

        topic_metrics.average_retrieval_score += row["retrieval_score"]

    for topic_metrics in metrics.values():
        topic_metrics.average_retrieval_score /= topic_metrics.frequency

        answered = (
            topic_metrics.frequency
            - topic_metrics.unanswered_count
        )

        topic_metrics.success_rate = (
            answered / topic_metrics.frequency
        )

    return metrics

def get_knowledge_gaps() -> list[KnowledgeGap]:
    """
    Generate a knowledge gap report from recorded chat interactions.
    """

    rows = get_chat_interactions()

    metrics = aggregate_topic_metrics(rows)

    for metric in metrics.values():
        calculate_gap_priority(metric)

    sorted_metrics = sorted(
        metrics.values(),
        key=lambda m: (
            m.priority_score,
            m.frequency,
        ),
        reverse=True,
    )

    return [
        KnowledgeGap(
            topic=metric.topic,
            frequency=metric.frequency,
            average_retrieval_score=round(
                metric.average_retrieval_score,
                4,
            ),
            priority=metric.priority,
        )
        for metric in sorted_metrics
    ]