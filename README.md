# AI Support Chatbot / FAQ Assistant (RAG)

A complete end-to-end support chatbot using **Python + OpenAI + LangChain + Chroma + FastAPI + Streamlit**.

## What was added
- Chat API with RAG retrieval.
- Source citations in response body (`[1]`, `[2]`) plus structured source list.
- Conversation memory by `session_id`.
- Automatic support ticket handoff when confidence is low.
- Streamlit chat UI.

---

## Folder structure

```text
.
├── app
│   ├── __init__.py
│   ├── config.py
│   ├── ingest.py
│   ├── main.py
│   ├── rag.py
│   └── schemas.py
├── data
│   └── docs
│       └── faq.md
├── streamlit_app.py
├── .env.example
├── requirements.txt
└── README.md
```

---

## Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Set your `OPENAI_API_KEY` in `.env`.

---

## Ingest docs

```bash
python -m app.ingest
```

---

## Run backend API

```bash
uvicorn app.main:app --reload
```

API docs: `http://127.0.0.1:8000/docs`

---

## Run Streamlit UI

```bash
streamlit run streamlit_app.py
```

UI opens in browser (default `http://localhost:8501`).

---

## API examples

### Chat with citations + memory

```bash
curl -X POST http://127.0.0.1:8000/chat \
  -H 'Content-Type: application/json' \
  -d '{"session_id":"user-123","question":"How do I reset my password?"}'
```

### Clear memory for a session

```bash
curl -X DELETE http://127.0.0.1:8000/memory/user-123
```

### Reindex docs

```bash
curl -X POST http://127.0.0.1:8000/reindex
```

---

## Notes
- Handoff creates a ticket ID and returns support contact.
- Memory is in-process (ephemeral). For production, use Redis/Postgres.