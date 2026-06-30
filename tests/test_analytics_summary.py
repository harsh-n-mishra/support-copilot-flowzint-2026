import pytest

from app.analytics_summary import (
    get_analytics,
    get_analytics_summary,
)
from app.services.support_health import (
    HealthCategory,
    HealthDrivers,
    SupportHealthScore,
    get_support_health,
)


@pytest.fixture
def sample_rows():
    return [
        {
            "question": "Forgot password",
            "intent": "password_reset",
            "retrieval_score": 0.90,
            "confidence": "HIGH",
            "verification_status": "VERIFIED",
            "answered": True,
            "handoff_triggered": False,
            "response_time_ms": 100,
            "timestamp": "2025-01-01T00:00:00",
        },
        {
            "question": "Forgot password",
            "intent": "password_reset",
            "retrieval_score": 0.80,
            "confidence": "HIGH",
            "verification_status": "VERIFIED",
            "answered": True,
            "handoff_triggered": False,
            "response_time_ms": 200,
            "timestamp": "2025-01-01T00:01:00",
        },
        {
            "question": "Refund request",
            "intent": "refund",
            "retrieval_score": 0.60,
            "confidence": "MEDIUM",
            "verification_status": "PARTIALLY_VERIFIED",
            "answered": False,
            "handoff_triggered": True,
            "response_time_ms": 300,
            "timestamp": "2025-01-01T00:02:00",
        },
        {
            "question": "Refund request",
            "intent": "refund",
            "retrieval_score": 0.40,
            "confidence": "LOW",
            "verification_status": "LOW_EVIDENCE",
            "answered": False,
            "handoff_triggered": True,
            "response_time_ms": 400,
            "timestamp": "2025-01-01T00:03:00",
        },
    ]


def test_support_health(sample_rows, monkeypatch):
    monkeypatch.setattr(
        "app.services.support_health.get_chat_interactions",
        lambda: sample_rows,
    )

    result = get_support_health()

    assert result.score > 0
    assert result.category is not None
    assert result.drivers.retrieval_quality > 0
    assert result.summary != ""


def test_analytics_summary(sample_rows, monkeypatch):
    monkeypatch.setattr(
        "app.analytics_summary.get_chat_interactions",
        lambda: sample_rows,
    )

    monkeypatch.setattr(
        "app.services.support_health.get_chat_interactions",
        lambda: sample_rows,
    )

    result = get_analytics_summary()

    assert result.total_interactions == 4
    assert result.top_questions[0] == "Forgot password"
    assert result.top_failures[0] == "Refund request"
    assert result.average_retrieval_score == 0.675


def test_analytics_summary_composes_support_health(
    sample_rows,
    monkeypatch,
):
    monkeypatch.setattr(
        "app.analytics_summary.get_chat_interactions",
        lambda: sample_rows,
    )

    monkeypatch.setattr(
        "app.analytics_summary.get_support_health",
        lambda: SupportHealthScore(
            score=91,
            category=HealthCategory.EXCELLENT,
            drivers=HealthDrivers(
                retrieval_quality=0.9,
                verification_quality=0.9,
                resolution_quality=1.0,
                escalation_management=1.0,
            ),
            summary="Support quality is excellent.",
        ),
    )

    summary = get_analytics_summary()

    assert summary.support_health.score == 91
    assert (
        summary.support_health.category
        == HealthCategory.EXCELLENT
    )


def test_operational_analytics(sample_rows, monkeypatch):
    monkeypatch.setattr(
        "app.analytics_summary.get_chat_interactions",
        lambda: sample_rows,
    )

    result = get_analytics()

    assert result["total_chats"] == 4
    assert result["handoff_rate"] == 0.5
    assert result["avg_retrieval_score"] == 0.675

    assert result["top_intents"] == [
        {"intent": "password_reset", "count": 2},
        {"intent": "refund", "count": 2},
    ]

    assert len(result["failed_queries"]) == 2