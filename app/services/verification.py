from dataclasses import dataclass
from enum import Enum

from app.services.confidence import ConfidenceLevel


class VerificationStatus(str, Enum):
    VERIFIED = "VERIFIED"
    PARTIALLY_VERIFIED = "PARTIALLY_VERIFIED"
    LOW_EVIDENCE = "LOW_EVIDENCE"


@dataclass(frozen=True)
class VerificationResult:
    status: VerificationStatus
    reason: str
    evidence_count: int


def verify_answer(
    confidence: ConfidenceLevel,
    evidence_count: int,
) -> VerificationResult:
    if (
        confidence == ConfidenceLevel.HIGH
        and evidence_count >= 3
    ):
        return VerificationResult(
            status=VerificationStatus.VERIFIED,
            reason="High retrieval confidence with multiple supporting documents.",
            evidence_count=evidence_count,
        )

    if (
        confidence == ConfidenceLevel.MEDIUM
        and evidence_count >= 2
    ):
        return VerificationResult(
            status=VerificationStatus.PARTIALLY_VERIFIED,
            reason="Moderate retrieval confidence with supporting evidence.",
            evidence_count=evidence_count,
        )

    return VerificationResult(
        status=VerificationStatus.LOW_EVIDENCE,
        reason="Insufficient supporting evidence for a reliable answer.",
        evidence_count=evidence_count,
    )