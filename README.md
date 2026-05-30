# AI Support Chatbot / FAQ Assistant

Production-style monorepo with:
- **FastAPI backend** (RAG + memory + ticket handoff)
- **React + TypeScript frontend** (Vite + Tailwind)
- **Gemini API** for embeddings + chat generation

## Features
- RAG over Chroma vectorstore
- Inline citations in answers (`[1]`, `[2]`)
- Source list rendering
- Conversation memory by `session_id`
- Memory clear endpoint (`DELETE /memory/{session_id}`)
- Ticket handoff fallback for low-confidence answers

## Repository Structure

```text
.
├── app/
│   ├── config.py
│   ├── ingest.py
│   ├── main.py
│   ├── rag.py
│   └── schemas.py
├── data/docs/
│   └── faq.md
├── frontend/
│   ├── src/components/
│   ├── src/lib/api.ts
│   ├── src/types/chat.ts
│   └── ...
├── .env.example
├── requirements.txt
└── README.md
```

## Backend Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Set `GEMINI_API_KEY` in `.env`.

### Ingest docs

```bash
python -m app.ingest
```

### Run backend

```bash
uvicorn app.main:app --reload
```

Backend endpoints preserved:
- `GET /health`
- `POST /chat`
- `POST /reindex`
- `DELETE /memory/{session_id}`

## Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Default frontend URL: `http://localhost:5173`

## API Example

```bash
curl -X POST http://127.0.0.1:8000/chat \
  -H 'Content-Type: application/json' \
  -d '{"session_id":"user-123","question":"How do I reset my password?"}'
```