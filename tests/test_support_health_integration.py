from app.services.support_health import (
    HealthCategory,
    get_support_health,
)


def test_get_support_health(monkeypatch):
    rows = [
        {
            "confidence": "HIGH",
            "verification_status": "VERIFIED",
            "answered": 1,
            "handoff_triggered": 0,
        }
    ]

    monkeypatch.setattr(
        "app.services.support_health.get_chat_interactions",
        lambda: rows,
    )

    result = get_support_health()

    assert result.category == HealthCategory.EXCELLENT
    assert result.score >= 90