import pytest

from app.services.knowledge_gap import (
    TopicMetrics,
    aggregate_topic_metrics,
    normalize_question,
)


@pytest.mark.parametrize(
    "question, expected",
    [
        ("How do I reset my password?", "password reset"),
        ("Forgot password", "password reset"),
        ("I forgot my password", "password reset"),
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


def test_aggregate_topic_metrics():
    rows = [
        {
            "question": "forgot password",
            "answered": True,
            "confidence": "HIGH",
            "verification_status": "VERIFIED",
            "retrieval_score": 0.90,
        },
        {
            "question": "reset password",
            "answered": False,
            "confidence": "LOW",
            "verification_status": "LOW_EVIDENCE",
            "retrieval_score": 0.30,
        },
    ]

    metrics = aggregate_topic_metrics(rows)

    assert len(metrics) == 1

    metric = metrics[0]

    assert metric.topic == "password reset"

    assert metric.frequency == 2

    assert metric.unanswered_count == 1

    assert metric.high_confidence_count == 1
    assert metric.medium_confidence_count == 0
    assert metric.low_confidence_count == 1

    assert metric.verified_count == 1
    assert metric.partially_verified_count == 0
    assert metric.low_evidence_count == 1

    assert metric.average_retrieval_score == 0.6

    assert metric.success_rate == 0.5