import pytest

from app.services.knowledge_gap import normalize_question


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