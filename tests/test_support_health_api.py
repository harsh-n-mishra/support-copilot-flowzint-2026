from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_support_health_endpoint(monkeypatch):
    from app.services.support_health import (
        HealthCategory,
        HealthDrivers,
        SupportHealthScore,
    )

    monkeypatch.setattr(
        "app.main.get_support_health",
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

    response = client.get("/support-health")

    assert response.status_code == 200

    body = response.json()

    assert body["score"] == 91
    assert body["category"] == "EXCELLENT"

    assert "drivers" in body

    assert "retrieval_quality" in body["drivers"]
    assert "verification_quality" in body["drivers"]
    assert "resolution_quality" in body["drivers"]
    assert "escalation_management" in body["drivers"]

    assert body["summary"] == "Support quality is excellent."