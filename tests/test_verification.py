import pytest

from app.services.confidence import ConfidenceLevel
from app.services.verification import (
    VerificationStatus,
    verify_answer,
)


@pytest.mark.parametrize(
    "confidence,evidence_count,expected_status",
    [
        (
            ConfidenceLevel.HIGH,
            4,
            VerificationStatus.VERIFIED,
        ),
        (
            ConfidenceLevel.MEDIUM,
            3,
            VerificationStatus.PARTIALLY_VERIFIED,
        ),
        (
            ConfidenceLevel.LOW,
            4,
            VerificationStatus.LOW_EVIDENCE,
        ),
        (
            ConfidenceLevel.HIGH,
            1,
            VerificationStatus.LOW_EVIDENCE,
        ),
    ],
)
def test_verify_answer(
    confidence,
    evidence_count,
    expected_status,
):
    result = verify_answer(
        confidence,
        evidence_count,
    )

    assert result.status == expected_status
    assert result.reason != ""
    assert result.evidence_count == evidence_count