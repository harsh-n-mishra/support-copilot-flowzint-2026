from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    gemini_api_key: str
    gemini_model: str = "gemini-1.5-flash"
    gemini_embedding_model: str = "models/text-embedding-004"
    vector_db_dir: str = ".vectorstore"
    analytics_db_path: str = "analytics.db"
    docs_dir: str = "data/docs"
    top_k: int = 4
    memory_turns: int = 6
    min_relevance_score: float = 0.2
    support_email: str = "support@example.com"
    system_prompt: str = (
        "You are a support assistant. Answer only using retrieved context. "
        "Always include citations like [1], [2] that map to the provided sources. "
        "If the answer is not in context, say you do not know and trigger handoff."
    )

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()