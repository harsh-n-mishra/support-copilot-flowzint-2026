from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_support_health_endpoint(monkeypatch):
    monkeypatch.setattr(
        "app.main.get_support_health",
        lambda: {
            "total_interactions": 4,
            "average_confidence": 0.625,
            "unanswered_rate": 0.5,
            "handoff_rate": 0.5,
            "average_response_time_ms": 250.0,
        },
    )

    response = client.get("/support-health")

    assert response.status_code == 200

    assert response.json() == {
        "total_interactions": 4,
        "average_confidence": 0.625,
        "unanswered_rate": 0.5,
        "handoff_rate": 0.5,
        "average_response_time_ms": 250.0,
    }


def test_analytics_summary_endpoint(monkeypatch):
    monkeypatch.setattr(
        "app.main.get_analytics_summary",
        lambda: {
            "total_interactions": 4,
            "top_questions": [
                "Forgot password",
                "Refund request",
            ],
            "top_failures": [
                "Refund request",
            ],
            "average_retrieval_score": 0.675,
        },
    )

    response = client.get("/analytics-summary")

    assert response.status_code == 200

    assert response.json() == {
        "total_interactions": 4,
        "top_questions": [
            "Forgot password",
            "Refund request",
        ],
        "top_failures": [
            "Refund request",
        ],
        "average_retrieval_score": 0.675,
    }


def test_analytics_endpoint(monkeypatch):
    monkeypatch.setattr(
        "app.main.get_analytics",
        lambda: {
            "total_chats": 4,
            "handoff_rate": 0.5,
            "avg_retrieval_score": 0.675,
            "top_intents": [
                {
                    "intent": "password_reset",
                    "count": 2,
                },
                {
                    "intent": "refund",
                    "count": 2,
                },
            ],
            "failed_queries": [
                {
                    "question": "Refund request",
                    "retrieval_score": 0.4,
                    "timestamp": "2025-01-01T00:00:00",
                },
            ],
        },
    )

    response = client.get("/analytics")

    assert response.status_code == 200

    body = response.json()

    assert body["total_chats"] == 4
    assert body["handoff_rate"] == 0.5
    assert body["avg_retrieval_score"] == 0.675
    assert len(body["top_intents"]) == 2
    assert len(body["failed_queries"]) == 1


def test_knowledge_gaps_endpoint(monkeypatch):
    monkeypatch.setattr(
        "app.main.get_knowledge_gaps",
        lambda: [
            {
                "topic": "password reset",
                "frequency": 2,
                "average_retrieval_score": 0.6,
                "priority": "HIGH",
                "severity": "MAJOR",
                "missing_documentation": False,
            }
        ],
    )

    response = client.get("/knowledge-gaps")

    assert response.status_code == 200

    assert response.json() == [
        {
            "topic": "password reset",
            "frequency": 2,
            "average_retrieval_score": 0.6,
            "priority": "HIGH",
            "severity": "MAJOR",
            "missing_documentation": False,
        }
    ]