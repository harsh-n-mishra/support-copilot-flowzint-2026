from enum import Enum

from app.config import settings


class ConfidenceLevel(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


def calculate_confidence(
    score: float,
    retrieved_chunk_count: int,
) -> ConfidenceLevel:
    """
    Maps retrieval metadata to a confidence level.

    Currently only top_score is used. retrieved_chunk_count is
    accepted for future confidence improvements.
    """

    if score >= settings.confidence_high_threshold:
        return ConfidenceLevel.HIGH

    if score >= settings.confidence_medium_threshold:
        return ConfidenceLevel.MEDIUM

    return ConfidenceLevel.LOW