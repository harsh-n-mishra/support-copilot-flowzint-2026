from app.services.confidence import ConfidenceLevel
from app.services.support_health import (
    HealthCategory,
    calculate_support_health,
)
from app.services.verification import VerificationStatus


def test_support_health_excellent():
    interactions = [
        {
            "confidence": ConfidenceLevel.HIGH,
            "verification": VerificationStatus.VERIFIED,
            "answered": True,
            "handoff": False,
        }
        for _ in range(10)
    ]

    result = calculate_support_health(interactions)

    assert result.score >= 95
    assert result.category == HealthCategory.EXCELLENT


def test_support_health_healthy():
    interactions = []

    interactions.extend(
        {
            "confidence": ConfidenceLevel.MEDIUM,
            "verification": VerificationStatus.PARTIALLY_VERIFIED,
            "answered": True,
            "handoff": False,
        }
        for _ in range(6)
    )

    interactions.extend(
        {
            "confidence": ConfidenceLevel.HIGH,
            "verification": VerificationStatus.VERIFIED,
            "answered": True,
            "handoff": True,
        }
        for _ in range(4)
    )

    result = calculate_support_health(interactions)

    assert result.category == HealthCategory.HEALTHY


def test_support_health_needs_attention():
    interactions = [
        {
            "confidence": ConfidenceLevel.MEDIUM,
            "verification": VerificationStatus.LOW_EVIDENCE,
            "answered": False,
            "handoff": True,
        }
        for _ in range(10)
    ]

    result = calculate_support_health(interactions)

    assert result.category == HealthCategory.NEEDS_ATTENTION


def test_support_health_critical():
    interactions = [
        {
            "confidence": ConfidenceLevel.LOW,
            "verification": VerificationStatus.LOW_EVIDENCE,
            "answered": False,
            "handoff": True,
        }
        for _ in range(10)
    ]

    result = calculate_support_health(interactions)

    assert result.category == HealthCategory.CRITICAL
    assert result.score < 50