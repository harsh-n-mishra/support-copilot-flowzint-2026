from dataclasses import dataclass
from enum import Enum

from app.services.confidence import ConfidenceLevel
from app.services.verification import VerificationStatus
from app.analytics import get_chat_interactions

RETRIEVAL_WEIGHT = 30
VERIFICATION_WEIGHT = 25
RESOLUTION_WEIGHT = 25
ESCALATION_WEIGHT = 20


class HealthCategory(str, Enum):
    EXCELLENT = "EXCELLENT"
    HEALTHY = "HEALTHY"
    NEEDS_ATTENTION = "NEEDS_ATTENTION"
    CRITICAL = "CRITICAL"


@dataclass(frozen=True)
class HealthDrivers:
    retrieval_quality: float
    verification_quality: float
    resolution_quality: float
    escalation_management: float


@dataclass(frozen=True)
class SupportHealthScore:
    score: int
    category: HealthCategory
    drivers: HealthDrivers
    summary: str


def calculate_support_health(
    interactions: list[dict],
) -> SupportHealthScore:
    """
    Expected interaction format:

    {
        "confidence": ConfidenceLevel,
        "verification": VerificationStatus,
        "answered": bool,
        "handoff": bool,
    }
    """

    if not interactions:
        drivers = HealthDrivers(
            retrieval_quality=0.0,
            verification_quality=0.0,
            resolution_quality=0.0,
            escalation_management=0.0,
        )

        return SupportHealthScore(
            score=0,
            category=HealthCategory.CRITICAL,
            drivers=drivers,
            summary=_generate_summary(0),
        )

    retrieval = _calculate_retrieval_quality(interactions)
    verification = _calculate_verification_quality(interactions)
    resolution = _calculate_resolution_quality(interactions)
    escalation = _calculate_escalation_management(interactions)

    score = round(
        retrieval * RETRIEVAL_WEIGHT
        + verification * VERIFICATION_WEIGHT
        + resolution * RESOLUTION_WEIGHT
        + escalation * ESCALATION_WEIGHT
    )

    category = _categorize(score)

    return SupportHealthScore(
        score=score,
        category=category,
        drivers=HealthDrivers(
            retrieval_quality=retrieval,
            verification_quality=verification,
            resolution_quality=resolution,
            escalation_management=escalation,
        ),
        summary=_generate_summary(score),
    )


def _calculate_retrieval_quality(
    interactions: list[dict],
) -> float:
    values = {
        ConfidenceLevel.HIGH: 1.0,
        ConfidenceLevel.MEDIUM: 0.7,
        ConfidenceLevel.LOW: 0.3,
    }

    return sum(
        values.get(
            interaction["confidence"],
            0.0,
        )
        for interaction in interactions
    ) / len(interactions)


def _calculate_verification_quality(
    interactions: list[dict],
) -> float:
    values = {
        VerificationStatus.VERIFIED: 1.0,
        VerificationStatus.PARTIALLY_VERIFIED: 0.6,
        VerificationStatus.LOW_EVIDENCE: 0.2,
    }

    return sum(
        values.get(
            interaction["verification"],
            0.0,
        )
        for interaction in interactions
    ) / len(interactions)


def _calculate_resolution_quality(
    interactions: list[dict],
) -> float:
    answered = sum(
        interaction["answered"]
        for interaction in interactions
    )

    return answered / len(interactions)


def _calculate_escalation_management(
    interactions: list[dict],
) -> float:
    handoffs = sum(
        interaction["handoff"]
        for interaction in interactions
    )

    return 1 - (handoffs / len(interactions))


def _categorize(
    score: int,
) -> HealthCategory:
    if score >= 90:
        return HealthCategory.EXCELLENT

    if score >= 75:
        return HealthCategory.HEALTHY

    if score >= 50:
        return HealthCategory.NEEDS_ATTENTION

    return HealthCategory.CRITICAL


def _generate_summary(
    score: int,
) -> str:
    if score >= 90:
        return (
            "Support quality is excellent with consistently verified "
            "answers and minimal escalations."
        )

    if score >= 75:
        return (
            "Support quality is healthy. "
            "The largest opportunity is reducing escalations."
        )

    if score >= 50:
        return (
            "Support quality needs attention. Improve documentation "
            "coverage and answer verification."
        )

    return (
        "Support quality is critical. Frequent low-evidence answers "
        "and escalations require immediate attention."
    )


def _to_health_interaction(row: dict) -> dict:
    return {
        "confidence": ConfidenceLevel(row["confidence"]),
        "verification": VerificationStatus(
            row["verification_status"]
        ),
        "answered": bool(row["answered"]),
        "handoff": bool(row["handoff_triggered"]),
    }


def get_support_health() -> SupportHealthScore:
    rows = get_chat_interactions()

    interactions = [
        _to_health_interaction(row)
        for row in rows
    ]

    return calculate_support_health(interactions)