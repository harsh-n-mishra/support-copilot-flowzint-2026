from __future__ import annotations

import sqlite3
from datetime import datetime, timezone

from app.config import settings
from app.services.confidence import ConfidenceLevel
from app.services.verification import VerificationStatus


def _get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(settings.analytics_db_path)
    conn.row_factory = sqlite3.Row
    return conn


def init_analytics_db() -> None:
    with _get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS chat_analytics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                question TEXT NOT NULL,
                intent TEXT NOT NULL,
                retrieval_score REAL NOT NULL,
                confidence TEXT NOT NULL,
                answered INTEGER NOT NULL,
                verification_status TEXT NOT NULL,
                retrieved_chunk_count INTEGER NOT NULL,
                response_time_ms INTEGER NOT NULL,
                handoff_triggered INTEGER NOT NULL,
                escalation_target TEXT NOT NULL
            )
            """
        )


def record_chat_analytics(
    *,
    session_id: str,
    question: str,
    intent: str,
    retrieval_score: float,
    confidence: ConfidenceLevel,
    answered: bool,
    verification_status: VerificationStatus,
    retrieved_chunk_count: int,
    response_time_ms: int,
    handoff_triggered: bool,
    escalation_target: str,
) -> None:
    timestamp = datetime.now(timezone.utc).isoformat()

    with _get_connection() as conn:
        conn.execute(
            """
            INSERT INTO chat_analytics (
                session_id,
                timestamp,
                question,
                intent,
                retrieval_score,
                confidence,
                answered,
                verification_status,
                retrieved_chunk_count,
                response_time_ms,
                handoff_triggered,
                escalation_target
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                session_id,
                timestamp,
                question,
                intent,
                retrieval_score,
                confidence.value,
                1 if answered else 0,
                verification_status.value,
                retrieved_chunk_count,
                response_time_ms,
                1 if handoff_triggered else 0,
                escalation_target,
            ),
        )


def get_chat_interactions() -> list[sqlite3.Row]:
    """Return all recorded chat interactions."""

    with _get_connection() as conn:
        return conn.execute(
            """
            SELECT
                question,
                intent,
                retrieval_score,
                confidence,
                answered,
                verification_status,
                handoff_triggered,
                response_time_ms,
                escalation_target,
                timestamp
            FROM chat_analytics
            """
        ).fetchall()