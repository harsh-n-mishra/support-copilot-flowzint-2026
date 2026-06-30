from __future__ import annotations

from dataclasses import dataclass
from enum import Enum

from app.services.knowledge_gap import TopicMetrics


class GapPriority(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class GapSeverity(str, Enum):
    CRITICAL = "CRITICAL"
    MAJOR = "MAJOR"
    MINOR = "MINOR"


@dataclass(frozen=True)
class GapRanking:
    topic: str

    priority: GapPriority

    severity: GapSeverity

    missing_documentation: bool

    priority_score: int


@dataclass(frozen=True)
class KnowledgeGap:
    topic: str

    frequency: int

    average_retrieval_score: float

    priority: GapPriority

    severity: GapSeverity

    missing_documentation: bool


def rank_gap(metrics: TopicMetrics) -> GapRanking:
    """
    Rank a topic's knowledge gap using aggregated topic metrics.
    """

    score = (
        metrics.unanswered_count * 3
        + metrics.low_confidence_count * 2
        + metrics.low_evidence_count * 3
        + metrics.partially_verified_count
        + min(metrics.frequency, 5)
    )

    if score >= 12:
        priority = GapPriority.HIGH
    elif score >= 6:
        priority = GapPriority.MEDIUM
    else:
        priority = GapPriority.LOW

    if (
        metrics.success_rate < 0.25
        and metrics.low_evidence_count >= 2
    ):
        severity = GapSeverity.CRITICAL

    elif metrics.success_rate < 0.60:
        severity = GapSeverity.MAJOR

    else:
        severity = GapSeverity.MINOR

    missing_documentation = (
        metrics.success_rate < 0.40
        and metrics.low_evidence_count >= 2
    )

    return GapRanking(
        topic=metrics.topic,
        priority=priority,
        severity=severity,
        missing_documentation=missing_documentation,
        priority_score=score,
    )