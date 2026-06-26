from app.services.confidence import (
    ConfidenceLevel,
    calculate_confidence,
)


def test_high_confidence():
    assert calculate_confidence(0.95) == ConfidenceLevel.HIGH


def test_medium_confidence():
    assert calculate_confidence(0.65) == ConfidenceLevel.MEDIUM


def test_low_confidence():
    assert calculate_confidence(0.30) == ConfidenceLevel.LOW

def test_high_threshold_boundary():
    assert calculate_confidence(0.80) == ConfidenceLevel.HIGH


def test_medium_threshold_boundary():
    assert calculate_confidence(0.55) == ConfidenceLevel.MEDIUM


def test_below_medium_threshold():
    assert calculate_confidence(0.5499) == ConfidenceLevel.LOW