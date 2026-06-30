from __future__ import annotations

import re
from collections import defaultdict
from dataclasses import dataclass

from app.analytics import get_chat_interactions
from app.services.confidence import ConfidenceLevel
from app.services.verification import VerificationStatus
from app.services.gap_ranking import (
    KnowledgeGap,
    build_knowledge_gap,
    rank_gap,
)


@dataclass(frozen=True)
class TopicMetrics:
    """Immutable aggregated metrics for a normalized support topic."""

    topic: str

    frequency: int

    unanswered_count: int

    high_confidence_count: int
    medium_confidence_count: int
    low_confidence_count: int

    verified_count: int
    partially_verified_count: int
    low_evidence_count: int

    average_retrieval_score: float

    success_rate: float


@dataclass
class _TopicAccumulator:
    """Internal mutable accumulator used while aggregating analytics rows."""

    frequency: int = 0

    unanswered_count: int = 0

    high_confidence_count: int = 0
    medium_confidence_count: int = 0
    low_confidence_count: int = 0

    verified_count: int = 0
    partially_verified_count: int = 0
    low_evidence_count: int = 0

    retrieval_score_sum: float = 0.0


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


def aggregate_topic_metrics(rows) -> list[TopicMetrics]:
    """Aggregate analytics rows into immutable topic metrics."""

    accumulators: dict[str, _TopicAccumulator] = defaultdict(_TopicAccumulator)

    for row in rows:
        topic = normalize_question(row["question"])
        metrics = accumulators[topic]

        metrics.frequency += 1

        if not row["answered"]:
            metrics.unanswered_count += 1

        confidence = ConfidenceLevel(row["confidence"])

        if confidence == ConfidenceLevel.HIGH:
            metrics.high_confidence_count += 1
        elif confidence == ConfidenceLevel.MEDIUM:
            metrics.medium_confidence_count += 1
        else:
            metrics.low_confidence_count += 1

        status = VerificationStatus(row["verification_status"])

        if status == VerificationStatus.VERIFIED:
            metrics.verified_count += 1
        elif status == VerificationStatus.PARTIALLY_VERIFIED:
            metrics.partially_verified_count += 1
        elif status == VerificationStatus.LOW_EVIDENCE:
            metrics.low_evidence_count += 1

        metrics.retrieval_score_sum += row["retrieval_score"]

    results: list[TopicMetrics] = []

    for topic, metrics in accumulators.items():
        average_score = (
            metrics.retrieval_score_sum / metrics.frequency
            if metrics.frequency
            else 0.0
        )

        success_rate = (
            (metrics.frequency - metrics.unanswered_count) / metrics.frequency
            if metrics.frequency
            else 0.0
        )

        results.append(
            TopicMetrics(
                topic=topic,
                frequency=metrics.frequency,
                unanswered_count=metrics.unanswered_count,
                high_confidence_count=metrics.high_confidence_count,
                medium_confidence_count=metrics.medium_confidence_count,
                low_confidence_count=metrics.low_confidence_count,
                verified_count=metrics.verified_count,
                partially_verified_count=metrics.partially_verified_count,
                low_evidence_count=metrics.low_evidence_count,
                average_retrieval_score=average_score,
                success_rate=success_rate,
            )
        )

    return results


def get_topic_metrics() -> list[TopicMetrics]:
    """
    Return aggregated analytics metrics grouped by normalized topic.
    """

    rows = get_chat_interactions()
    return aggregate_topic_metrics(rows)


def get_knowledge_gaps() -> list[KnowledgeGap]:
    """
    Transform aggregated topic metrics into ranked knowledge gaps.
    """

    metrics = get_topic_metrics()

    return [
        build_knowledge_gap(
            metric,
            rank_gap(metric),
        )
        for metric in metrics
    ]