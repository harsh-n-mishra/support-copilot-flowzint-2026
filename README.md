# AI Support Copilot

Production-style monorepo with:
- **FastAPI backend** (RAG + memory + ticket handoff + support workflow metadata + analytics)
- **React + TypeScript frontend** (Vite + Tailwind)
- **Gemini API** for embeddings + chat generation
- **SQLite analytics** for chat interaction tracking

## Features
- RAG over Chroma vectorstore
- Inline citations in answers (`[1]`, `[2]`)
- Source list rendering
- Debug inspector for retrieval transparency (development/demo)
- Conversation memory by `session_id`
- Rolling conversation summary per session
- Intent classification for each user query
- Escalation target recommendation
- Handoff ticket generation + structured ticket draft
- Chat analytics tracking + dashboard
- Memory clear endpoint (`DELETE /memory/{session_id}`)

## Repository Structure

```text
.
├── app/
│   ├── analytics.py
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

Backend endpoints:
- `GET /health`
- `POST /chat`
- `POST /reindex`
- `DELETE /memory/{session_id}`
- `GET /analytics`

## Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Default frontend URL: `http://localhost:5173`

## Analytics

Every chat interaction is recorded in SQLite (`analytics.db`) with:
- session ID
- timestamp
- question
- intent
- retrieval score
- handoff status
- escalation target

`GET /analytics` returns aggregate metrics and failed-query rows for dashboard display.

## Debug Inspector Safety

`ENABLE_DEBUG_INSPECTOR=true` enables retrieval debug data in chat responses for development/demo visibility.

Debug payload includes retrieved chunk snippets and prompt context previews, which may expose internal retrieval context.
For production deployments, set `ENABLE_DEBUG_INSPECTOR=false` or enforce access controls around debug-capable interfaces.