from __future__ import annotations

from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

from app.config import settings


PROMPT = ChatPromptTemplate.from_messages(
    [
        ("system", "{system_prompt}"),
        (
            "human",
            "Question: {question}\n\n"
            "Context:\n{context}\n\n"
            "Write a concise support answer. If missing context, say you do not know.",
        ),
    ]
)


def _get_vectorstore() -> Chroma:
    embeddings = OpenAIEmbeddings(model=settings.embedding_model, api_key=settings.openai_api_key)
    return Chroma(
        persist_directory=settings.vector_db_dir,
        embedding_function=embeddings,
    )


def ask_support_question(question: str) -> tuple[str, list[dict[str, str]]]:
    vectorstore = _get_vectorstore()
    retriever = vectorstore.as_retriever(search_kwargs={"k": settings.top_k})

    docs = retriever.invoke(question)
    context = "\n\n".join(doc.page_content for doc in docs)

    llm = ChatOpenAI(model=settings.openai_model, api_key=settings.openai_api_key, temperature=0)
    chain = PROMPT | llm
    response = chain.invoke(
        {
            "system_prompt": settings.system_prompt,
            "question": question,
            "context": context or "No relevant documentation found.",
        }
    )

    sources = [
        {
            "source": doc.metadata.get("source", "unknown"),
            "snippet": doc.page_content[:220].replace("\n", " "),
        }
        for doc in docs
    ]

    return response.content, sources