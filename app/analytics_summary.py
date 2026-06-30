from __future__ import annotations

from collections import Counter

from app.analytics import get_chat_interactions
from app.services.confidence import ConfidenceLevel

CONFIDENCE_WEIGHTS = {
    ConfidenceLevel.HIGH: 1.0,
    ConfidenceLevel.MEDIUM: 0.5,
    ConfidenceLevel.LOW: 0.0,
}


def get_analytics_summary() -> dict:
    """
    Compute analytics dashboard summary.
    """

    rows = get_chat_interactions()

    total = len(rows)

    if total == 0:
        return {
            "total_interactions": 0,
            "top_questions": [],
            "top_failures": [],
            "average_retrieval_score": 0.0,
        }

    average_retrieval_score = (
        sum(
            row["retrieval_score"]
            for row in rows
        )
        / total
    )

    top_questions = [
        question
        for question, _ in Counter(
            row["question"]
            for row in rows
        ).most_common(5)
    ]

    top_failures = [
        question
        for question, _ in Counter(
            row["question"]
            for row in rows
            if not row["answered"]
        ).most_common(5)
    ]

    return {
        "total_interactions": total,
        "top_questions": top_questions,
        "top_failures": top_failures,
        "average_retrieval_score": round(
            average_retrieval_score,
            4,
        ),
    }


def get_analytics() -> dict:
    """
    Compute analytics overview.
    """

    rows = get_chat_interactions()

    total = len(rows)

    if total == 0:
        return {
            "total_chats": 0,
            "handoff_rate": 0.0,
            "avg_retrieval_score": 0.0,
            "top_intents": [],
            "failed_queries": [],
        }

    handoff_rate = (
        sum(
            row["handoff_triggered"]
            for row in rows
        )
        / total
    )

    avg_retrieval_score = (
        sum(
            row["retrieval_score"]
            for row in rows
        )
        / total
    )

    top_intents = [
        {
            "intent": intent,
            "count": count,
        }
        for intent, count in Counter(
            row["intent"]
            for row in rows
        ).most_common(5)
    ]

    failed_queries = [
        {
            "question": row["question"],
            "retrieval_score": row["retrieval_score"],
            "timestamp": row["timestamp"],
        }
        for row in rows
        if row["handoff_triggered"]
    ]

    return {
        "total_chats": total,
        "handoff_rate": round(
            handoff_rate,
            4,
        ),
        "avg_retrieval_score": round(
            avg_retrieval_score,
            4,
        ),
        "top_intents": top_intents,
        "failed_queries": failed_queries,
    }