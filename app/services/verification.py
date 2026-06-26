from enum import Enum


class VerificationStatus(str, Enum):
    UNKNOWN = "UNKNOWN"
    VERIFIED = "VERIFIED"
    PARTIALLY_VERIFIED = "PARTIALLY_VERIFIED"
    LOW_EVIDENCE = "LOW_EVIDENCE"