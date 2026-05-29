from __future__ import annotations

from pathlib import Path

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_community.document_loaders import TextLoader, UnstructuredMarkdownLoader
from langchain_openai import OpenAIEmbeddings

from app.config import settings

SUPPORTED_SUFFIXES = {".md", ".txt"}


def _load_documents():
    docs_path = Path(settings.docs_dir)
    if not docs_path.exists():
        raise FileNotFoundError(f"Docs directory not found: {docs_path}")

    documents = []
    for file_path in docs_path.rglob("*"):
        if file_path.suffix.lower() not in SUPPORTED_SUFFIXES:
            continue

        if file_path.suffix.lower() == ".md":
            loader = UnstructuredMarkdownLoader(str(file_path))
        else:
            loader = TextLoader(str(file_path), encoding="utf-8")

        loaded = loader.load()
        for doc in loaded:
            doc.metadata["source"] = str(file_path)
        documents.extend(loaded)

    if not documents:
        raise ValueError("No documents found. Add .md or .txt files under data/docs.")

    return documents


def build_or_refresh_index() -> int:
    documents = _load_documents()
    splitter = RecursiveCharacterTextSplitter(chunk_size=900, chunk_overlap=150)
    chunks = splitter.split_documents(documents)

    embeddings = OpenAIEmbeddings(model=settings.embedding_model, api_key=settings.openai_api_key)

    vectorstore = Chroma(
        persist_directory=settings.vector_db_dir,
        embedding_function=embeddings,
    )
    try:
        vectorstore.delete_collection()
    except Exception:
        # collection may not exist on first run
        pass

    # Recreate fresh collection
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=settings.vector_db_dir,
    )
    vectorstore.persist()

    return len(chunks)


if __name__ == "__main__":
    total = build_or_refresh_index()
    print(f"Indexed {total} chunks into {settings.vector_db_dir}")