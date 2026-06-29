import pytest

from app.services.knowledge_gap import (
    GapPriority,
    TopicMetrics,
    calculate_gap_priority,
    TopicMetrics,
    aggregate_topic_metrics,
    normalize_question,
)

from app.services.confidence import ConfidenceLevel


@pytest.mark.parametrize(
    "question, expected",
    [
        ("How do I reset my password?", "password reset"),
        ("Forgot password", "password reset"),
        ("Need a refund", "refund"),
        ("Refund my purchase", "refund"),
        ("Cancel my subscription", "subscription"),
        ("Slack integration isn't working", "slack integration"),
        ("What are the API rate limits?", "rate limits"),
        ("Random Mars question", "other"),
    ],
)
def test_normalize_question(question, expected):
    assert normalize_question(question) == expected

def test_calculate_gap_priority_high():
    metrics = TopicMetrics(
        topic="refund",
        frequency=12,
        unanswered_count=3,
        low_confidence_count=2,
        medium_confidence_count=1,
    )

    calculate_gap_priority(metrics)

    assert metrics.priority_score == 19
    assert metrics.priority == GapPriority.HIGH

def test_calculate_gap_priority_medium():
    metrics = TopicMetrics(
        topic="billing",
        frequency=4,
        unanswered_count=1,
        low_confidence_count=1,
        medium_confidence_count=1,
    )

    calculate_gap_priority(metrics)

    assert metrics.priority_score == 10
    assert metrics.priority == GapPriority.MEDIUM

def test_calculate_gap_priority_low():
    metrics = TopicMetrics(
        topic="api",
        frequency=1,
        unanswered_count=0,
        low_confidence_count=0,
        medium_confidence_count=1,
    )

    calculate_gap_priority(metrics)

    assert metrics.priority_score == 2
    assert metrics.priority == GapPriority.LOW

def test_aggregate_topic_metrics():
    rows = [
        {
            "question": "Forgot password",
            "answered": False,
            "confidence": ConfidenceLevel.LOW,
            "retrieval_score": 0.40,
        },
        {
            "question": "Reset my password",
            "answered": True,
            "confidence": ConfidenceLevel.HIGH,
            "retrieval_score": 0.90,
        },
        {
            "question": "Need a refund",
            "answered": False,
            "confidence": ConfidenceLevel.MEDIUM,
            "retrieval_score": 0.60,
        },
    ]

    metrics = aggregate_topic_metrics(rows)

    password = metrics["password reset"]

    assert password.frequency == 2
    assert password.unanswered_count == 1
    assert password.high_confidence_count == 1
    assert password.medium_confidence_count == 0
    assert password.low_confidence_count == 1
    assert password.average_retrieval_score == 0.65
