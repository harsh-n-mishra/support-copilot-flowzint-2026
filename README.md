# AI Support Chatbot / FAQ Assistant (RAG)

A complete end-to-end project to build a **retrieval-based support chatbot** using **Python + OpenAI + LangChain + Chroma + FastAPI**.

It indexes your support docs (FAQs, markdown, text files) and answers user queries grounded in those docs.

---

## 1) Project architecture

1. **Ingestion**
   - Read docs from `data/docs/`
   - Split into chunks
   - Create embeddings with OpenAI
   - Store vectors in local Chroma DB
2. **Retrieval + Generation**
   - Receive user question via API
   - Retrieve top-k relevant chunks
   - Ask LLM to answer based only on retrieved context
3. **Serving**
   - Expose REST endpoints through FastAPI

---

## 2) Folder structure

```text
.
├── app
│   ├── __init__.py
│   ├── config.py         # Env/config management
│   ├── ingest.py         # Build/update vector index
│   ├── main.py           # FastAPI app and endpoints
│   ├── rag.py            # Retrieval + answer pipeline
│   └── schemas.py        # Request/response models
├── data
│   └── docs
│       └── faq.md        # Example support knowledge base
├── .env.example
├── requirements.txt
└── README.md
```

---

## 3) Setup (end-to-end)

### Prerequisites
- Python 3.10+
- OpenAI API key

### Install

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### Configure env

```bash
cp .env.example .env
# edit .env and set OPENAI_API_KEY
```

### Add your docs

Put knowledge files in `data/docs/` (`.md`, `.txt`).

### Build vector index

```bash
python -m app.ingest
```

### Run API

```bash
uvicorn app.main:app --reload
```

Open API docs at: `http://127.0.0.1:8000/docs`

---

## 4) Example API usage

### Health

```bash
curl http://127.0.0.1:8000/health
```

### Ask a question

```bash
curl -X POST http://127.0.0.1:8000/chat \
  -H 'Content-Type: application/json' \
  -d '{"question":"How do I reset my password?"}'
```

### Re-index docs (after updates)

```bash
curl -X POST http://127.0.0.1:8000/reindex
```

---

## 5) How this reduces manual support effort

- Centralizes scattered documentation.
- Gives instant, consistent answers.
- Grounds responses in source content (retrieval-based).
- Can be extended with ticketing handoff when context is missing.

---

## 6) Production improvements

- Add auth + rate limiting.
- Add confidence score / citation links in response.
- Add conversation memory (bounded + safe).
- Periodic background indexing job.
- Add observability (logs/traces) and prompt/version tracking.