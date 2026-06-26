from enum import Enum

from app.config import settings

class ConfidenceLevel(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


def calculate_confidence(score: float) -> ConfidenceLevel:
    """
    Maps a retrieval score to a confidence level.

    Thresholds are configured through application settings.

    HIGH   : score >= confidence_high_threshold
    MEDIUM : score >= confidence_medium_threshold
    LOW    : otherwise
    """

    if score >= settings.confidence_high_threshold:
        return ConfidenceLevel.HIGH

    if score >= settings.confidence_medium_threshold:
        return ConfidenceLevel.MEDIUM

    return ConfidenceLevel.LOW