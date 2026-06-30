import pytest

from app.analytics_summary import (
    get_analytics,
    get_analytics_summary,
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
            "answered": False,
            "handoff_triggered": True,
            "response_time_ms": 400,
            "timestamp": "2025-01-01T00:03:00",
        },
    ]


def test_support_health(sample_rows, monkeypatch):
    monkeypatch.setattr(
        "app.analytics_summary.get_chat_interactions",
        lambda: sample_rows,
    )

    result = get_support_health()

    assert result["total_interactions"] == 4
    assert result["average_confidence"] == 0.625
    assert result["unanswered_rate"] == 0.5
    assert result["handoff_rate"] == 0.5
    assert result["average_response_time_ms"] == 250.0


def test_analytics_summary(sample_rows, monkeypatch):
    monkeypatch.setattr(
        "app.analytics_summary.get_chat_interactions",
        lambda: sample_rows,
    )

    result = get_analytics_summary()

    assert result["total_interactions"] == 4
    assert result["top_questions"][0] == "Forgot password"
    assert result["top_failures"][0] == "Refund request"
    assert result["average_retrieval_score"] == 0.675


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