from app.config import settings
from app.services.confidence import (
    ConfidenceLevel,
    calculate_confidence,
)


def test_high_confidence():
    assert (
        calculate_confidence(
            settings.confidence_high_threshold + 0.10,
            5,
        )
        == ConfidenceLevel.HIGH
    )


def test_medium_confidence():
    score = (
        settings.confidence_medium_threshold
        + settings.confidence_high_threshold
    ) / 2

    assert calculate_confidence(score, 5) == ConfidenceLevel.MEDIUM


def test_low_confidence():
    assert (
        calculate_confidence(
            settings.confidence_medium_threshold - 0.01,
            5,
        )
        == ConfidenceLevel.LOW
    )


def test_high_threshold_boundary():
    assert (
        calculate_confidence(
            settings.confidence_high_threshold,
            5,
        )
        == ConfidenceLevel.HIGH
    )


def test_medium_threshold_boundary():
    assert (
        calculate_confidence(
            settings.confidence_medium_threshold,
            5,
        )
        == ConfidenceLevel.MEDIUM
    )


def test_below_medium_threshold():
    assert (
        calculate_confidence(
            settings.confidence_medium_threshold - 0.0001,
            5,
        )
        == ConfidenceLevel.LOW
    )