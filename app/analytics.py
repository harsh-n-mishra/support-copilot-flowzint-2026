from __future__ import annotations

import sqlite3
from datetime import datetime, timezone
from typing import Any

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


def get_analytics_summary(limit_failed_queries: int = 10) -> dict[str, Any]:
    with _get_connection() as conn:
        total_chats = conn.execute(
            "SELECT COUNT(*) AS c FROM chat_analytics"
        ).fetchone()["c"]

        handoff_count = conn.execute(
            "SELECT COUNT(*) AS c FROM chat_analytics WHERE handoff_triggered = 1"
        ).fetchone()["c"]

        avg_score = conn.execute(
            """
            SELECT COALESCE(AVG(retrieval_score), 0) AS avg_score
            FROM chat_analytics
            """
        ).fetchone()["avg_score"]

        top_intents_rows = conn.execute(
            """
            SELECT intent, COUNT(*) AS count
            FROM chat_analytics
            GROUP BY intent
            ORDER BY count DESC
            LIMIT 5
            """
        ).fetchall()

        failed_query_rows = conn.execute(
            """
            SELECT question, retrieval_score, timestamp
            FROM chat_analytics
            WHERE handoff_triggered = 1
            ORDER BY timestamp DESC
            LIMIT ?
            """,
            (limit_failed_queries,),
        ).fetchall()

    handoff_rate = (handoff_count / total_chats) if total_chats else 0.0

    return {
        "total_chats": int(total_chats),
        "handoff_rate": round(handoff_rate, 4),
        "avg_retrieval_score": round(float(avg_score or 0.0), 4),
        "top_intents": [
            {
                "intent": row["intent"],
                "count": int(row["count"]),
            }
            for row in top_intents_rows
        ],
        "failed_queries": [
            {
                "question": row["question"],
                "retrieval_score": float(row["retrieval_score"]),
                "timestamp": row["timestamp"],
            }
            for row in failed_query_rows
        ],
    }