# AI Support Copilot Platform

A production-style support assistant built with FastAPI, React, Gemini, ChromaDB, and Docker.

The platform combines Retrieval-Augmented Generation (RAG), session memory, ticket handoff workflows, analytics, and debugging tools into a unified support operations experience.

---

## Quick Start

```bash
cp .env.docker.example .env.docker

# Add GEMINI_API_KEY to .env.docker

docker compose up --build
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8000
```

---

## Architecture Overview

```text
                User
                  │
                  ▼
        React + TypeScript UI
                  │
                  ▼
           FastAPI Backend
                  │
       ┌──────────┼──────────┐
       ▼          ▼          ▼
     RAG      Analytics   Workflow
    Engine      Engine     Engine
       │
       ▼
 Chroma Vector Store
       │
       ▼
 Documentation Corpus

External Services
────────────────────────
Gemini API
├─ Chat Generation
└─ Embedding Generation

Persistent Storage
────────────────────────
storage/chroma
storage/analytics
```

---

## Docker Architecture

```text
Frontend Container
        │
        ▼
Backend Container
        │
        ├── Chroma Vector Store
        │       ▼
        │   storage/chroma
        │
        └── Analytics Database
                ▼
          storage/analytics
```

The Docker deployment persists vector indexes and analytics data across container restarts using mounted volumes.

---

## Technology Stack

### Backend

* FastAPI
* LangChain
* ChromaDB
* Sentence Transformers
* Google Gemini
* SQLite
* Pydantic Settings

### Frontend

* React
* TypeScript
* Vite
* TailwindCSS

### Infrastructure

* Docker
* Docker Compose

---

## Features

### RAG & Knowledge Retrieval

* Retrieval-Augmented Generation (RAG)
* Chroma vector database
* Source citation support
* Context-grounded responses
* Similarity search with relevance scoring

### Support Operations

* Intent classification
* Escalation target recommendation
* Human handoff workflow
* Structured ticket drafting
* Support workflow metadata

### Memory

* Session-based conversation memory
* Rolling conversation summaries
* Memory reset endpoint

### Analytics

* Chat interaction tracking
* Retrieval score monitoring
* Handoff rate tracking
* Intent analytics
* Analytics dashboard

### Debugging & Observability

* Debug inspector
* Retrieved chunk previews
* Prompt context previews
* Retrieval transparency

### Deployment

* Dockerized backend
* Dockerized frontend
* Docker Compose orchestration
* Persistent Chroma storage
* Persistent analytics storage
* Automatic vector index initialization
* Automatic analytics database initialization
* Persistent vector index reuse

---

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
│
├── data/
│   └── docs/
│       ├── faq.md
│       ├── onboarding.md
│       ├── authentication.md
│       ├── billing.md
│       ├── subscriptions.md
│       ├── api.md
│       ├── integrations.md
│       ├── security.md
│       ├── troubleshooting.md
│       ├── account_recovery.md
│       ├── enterprise.md
│       ├── escalation_policy.md
│       ├── internal_support_playbook.md
│       ├── release_notes_q1.md
│       ├── release_notes_q2.md
│       ├── sla.md
│       ├── user_roles.md
│       ├── notifications.md
│       ├── data_retention.md
│       ├── incident_management.md
│       ├── integrations_slack.md
│       ├── integrations_jira.md
│       ├── api_rate_limits.md
│       ├── api_webhooks.md
│       ├── refund_policy.md
│       ├── migration_guide.md
│       ├── ai_assistant_usage.md
│       └── outage_playbook.md
│
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   └── ...
│
├── storage/
│   ├── analytics/
│   └── chroma/
│
├── Dockerfile.backend
├── docker-compose.yml
├── requirements.txt
├── .env.example
├── .env.docker.example
├── README.md
└── .dockerignore
```

---

## Knowledge Base

The platform ships with a multi-domain documentation corpus used by the RAG pipeline.

### Current Documentation Corpus

```text
data/docs/
├── faq.md
├── onboarding.md
├── authentication.md
├── billing.md
├── subscriptions.md
├── api.md
├── integrations.md
├── security.md
├── troubleshooting.md
├── account_recovery.md
├── enterprise.md
├── escalation_policy.md
├── internal_support_playbook.md
├── release_notes_q1.md
├── release_notes_q2.md
├── sla.md
├── user_roles.md
├── notifications.md
├── data_retention.md
├── incident_management.md
├── integrations_slack.md
├── integrations_jira.md
├── api_rate_limits.md
├── api_webhooks.md
├── refund_policy.md
├── migration_guide.md
├── ai_assistant_usage.md
└── outage_playbook.md
```

### Documentation Coverage

| Category                | Files                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------- |
| FAQ / General Support   | faq, troubleshooting, notifications                                                |
| Authentication & Access | authentication, account_recovery                                                   |
| Billing & Subscription  | billing, subscriptions, refund_policy                                              |
| Security & Compliance   | security, data_retention                                                           |
| API                     | api, api_rate_limits, api_webhooks                                                 |
| Integrations            | integrations, integrations_slack, integrations_jira                                |
| Enterprise              | enterprise, sla                                                                    |
| Support Operations      | escalation_policy, internal_support_playbook, incident_management, outage_playbook |
| Product Usage           | onboarding, user_roles, migration_guide                                            |
| AI Copilot              | ai_assistant_usage                                                                 |
| Release Notes           | release_notes_q1, release_notes_q2                                                 |

### Corpus Size

| Metric                    | Count |
| ------------------------- | ----- |
| Original FAQ              | 1     |
| First Expansion           | 16    |
| Second Expansion          | 11    |
| Total Documentation Files | 28    |

The retrieval system automatically indexes all supported documents and makes them available for semantic search and grounded response generation.

---

## Local Development Setup

### Backend

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it:

Linux/macOS

```bash
source .venv/bin/activate
```

Windows

```powershell
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create environment file:

Linux/macOS

```bash
cp .env.example .env
```

Windows PowerShell

```powershell
Copy-Item .env.example .env
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key
```

### Build Vector Index

Before running the backend:

```bash
python -m app.ingest
```

### Start Backend

```bash
uvicorn app.main:app --reload
```

Backend URL:

```text
http://localhost:8000
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## Docker Deployment

Create Docker environment file:

Linux/macOS

```bash
cp .env.docker.example .env.docker
```

Windows PowerShell

```powershell
Copy-Item .env.docker.example .env.docker
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key
```

Build and start:

```bash
docker compose up --build
```

On first startup, the backend automatically:

* Initializes the analytics database
* Builds the vector index if no persisted Chroma database exists
* Reuses persisted vector indexes on subsequent restarts
* Starts the FastAPI backend and React frontend

Run in detached mode:

```bash
docker compose up -d
```

Stop containers:

```bash
docker compose down
```

---

## Persistent Storage

Docker deployments persist runtime data in:

```text
storage/
├── chroma/
└── analytics/
```

### Chroma Storage

Stores:

* Embedded document vectors
* Chroma collections
* Retrieval indexes

### Analytics Storage

Stores:

* SQLite analytics database
* Chat interaction history
* Analytics metrics

Data survives container restarts and rebuilds.

---

## Document Ingestion

### Local Development

Add documentation files to:

```text
data/docs/
```

Supported formats:

* `.md`
* `.txt`

Rebuild the index:

```bash
python -m app.ingest
```

or

```http
POST /reindex
```

### Docker

On first startup, the backend automatically:

* Initializes the analytics database
* Builds the vector index if no persisted Chroma database exists
* Reuses persisted vector indexes on subsequent restarts

Manual rebuilds remain available through:

```http
POST /reindex
```

---

## API Endpoints

### Health Check

```http
GET /health
```

Returns service status.

---

### Chat

```http
POST /chat
```

Submit a support question and receive a RAG-generated response.

---

### Reindex

```http
POST /reindex
```

Rebuilds the Chroma vector index.

---

### Clear Memory

```http
DELETE /memory/{session_id}
```

Removes stored conversation memory for a session.

---

### Analytics

```http
GET /analytics
```

Returns analytics metrics and dashboard data.

---

## Environment Variables

### Core Configuration

| Variable          | Description             |
| ----------------- | ----------------------- |
| GEMINI_API_KEY    | Gemini API key          |
| GEMINI_MODEL      | Gemini chat model       |
| VECTOR_DB_DIR     | Chroma storage location |
| DOCS_DIR          | Documentation directory |
| ANALYTICS_DB_PATH | SQLite database path    |

### Retrieval

| Variable            | Description                    |
| ------------------- | ------------------------------ |
| TOP_K               | Number of retrieved chunks     |
| MIN_RELEVANCE_SCORE | Retrieval confidence threshold |

### Memory

| Variable     | Description                         |
| ------------ | ----------------------------------- |
| MEMORY_TURNS | Number of conversation turns stored |

### Debugging

| Variable               | Description                |
| ---------------------- | -------------------------- |
| ENABLE_DEBUG_INSPECTOR | Enable retrieval debugging |

### Support

| Variable      | Description              |
| ------------- | ------------------------ |
| SUPPORT_EMAIL | Escalation contact email |

---

## Analytics

Every chat interaction is recorded in SQLite.

Tracked fields include:

* Session ID
* Timestamp
* Question
* Intent
* Retrieval score
* Handoff status
* Escalation target

Analytics endpoints expose:

* Total chats
* Handoff rate
* Average retrieval score
* Top intents
* Failed query analysis

---

## Debug Inspector

The Debug Inspector provides transparency into retrieval behavior.

When enabled:

```env
ENABLE_DEBUG_INSPECTOR=true
```

Responses may include:

* Retrieved chunks
* Similarity scores
* Prompt context previews
* Handoff reasoning

---

## Development Workflow

### Add New Documentation

1. Place files in:

```text
data/docs/
```

2. Rebuild index:

```bash
python -m app.ingest
```

or

```http
POST /reindex
```

---

### Reset Analytics

Delete:

```text
storage/analytics/analytics.db
```

Then restart the backend.

---

## Roadmap

Planned improvements:

* Authentication and user management
* Streaming responses
* Background indexing jobs
* PostgreSQL analytics backend
* Multi-tenant support
* CI/CD pipeline
* Kubernetes deployment
* Monitoring and observability stack
* Advanced support workflow automation

---

## Production Notes

For production deployments:

* Set `ENABLE_DEBUG_INSPECTOR=false`
* Restrict access to analytics endpoints
* Store secrets using a secret manager
* Use HTTPS behind a reverse proxy
* Regularly back up persistent volumes
* Monitor retrieval quality and handoff rates
* Disable Chroma telemetry if required by organizational policy
* Rotate Gemini API keys regularly
* Restrict access to debug-capable interfaces