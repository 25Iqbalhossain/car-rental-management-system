# Digital Pylot — Architecture, API & Environment Reference Guide

Digital Pylot is a UK car rental web platform powered by a Next.js 15 frontend and a Python FastAPI AI microservice with Groq LLM integration.

---

## 📁 Repository Structure

```text
Digital Pylot/
├── 🌐 frontend/                  # Next.js 15 Web Application
│   ├── src/
│   │   ├── app/                  # App Router, Web Pages & Next.js API Routes
│   │   │   └── api/              # API endpoints (/api/chat, /api/vehicles, etc.)
│   │   ├── components/           # UI components (Floating ChatWidget, Modals, etc.)
│   │   ├── data/                 # Knowledge Base (knowledgeBase.json), fleet & locations
│   │   ├── lib/                  # Utilities & RAG offline retrieval engine
│   │   └── types/                # TypeScript type declarations
│   ├── .env.local                # Frontend Environment Variables
│   └── package.json              # Node.js dependencies
│
└── 🐍 backend/                   # Python FastAPI AI Microservice
    ├── app/                      # FastAPI Application
    │   ├── config.py             # Config & Knowledge Base path loader
    │   ├── schemas.py            # Pydantic request/response models
    │   ├── service.py            # RAG retrieval & Groq LLM logic
    │   └── main.py               # FastAPI router instance & health check
    ├── main.py                   # Server entrypoint (Uvicorn on port 8001)
    ├── .env                      # Backend Environment Variables (GROQ_API_KEY)
    ├── requirements.txt          # Python dependencies
    └── Dockerfile                # Container deployment configuration
```

---

## 🔑 Environment Variables Reference

### 🌐 Frontend Environment (`frontend/.env.local`)

| Variable Name | Required | Default Value | Description |
| :--- | :---: | :--- | :--- |
| `PYTHON_CHATBOT_URL` | No | `http://127.0.0.1:8001/api/chat` | URL of the Python FastAPI backend microservice. |
| `NEXT_PUBLIC_NHTSA_API_BASE_URL` | No | `https://vpic.nhtsa.dot.gov/api/vehicles` | External NHTSA vehicle decoder API base URL. |

### 🐍 Backend Environment (`backend/.env`)

| Variable Name | Required | Default Value | Description |
| :--- | :---: | :--- | :--- |
| `GROQ_API_KEY` | **Yes** | `""` | Your Groq API key for LLM response generation. |
| `GROQ_MODEL` | No | `llama-3.1-8b-instant` | Groq LLM model name. |
| `CHATBOT_HOST` | No | `0.0.0.0` | Server binding host address. |
| `CHATBOT_PORT` | No | `8001` | Server port number. |
| `CHATBOT_CORS_ORIGINS` | No | `http://localhost:3000,http://127.0.0.1:3000` | Allowed CORS origins for API access. |

---

## 🔌 API Routes & Data Mapping

### 🌐 Frontend Next.js API Routes (`frontend/src/app/api/`)

| Endpoint | Method | Source Data File | Description |
| :--- | :---: | :--- | :--- |
| `/api/chat` | `POST` | `backend` / `knowledgeBase.json` | Proxies user query to FastAPI Groq LLM; falls back to local RAG retrieval if backend is offline. |
| `/api/recommendations` | `POST` | `vehicles.ts` | AI Vehicle Matcher: scores vehicles based on seats, budget, terrain, and trip preferences. |
| `/api/vehicles` | `GET`, `POST` | `vehicles.ts` / NHTSA API | Returns filtered vehicle list by brand/category or details of a single car. |
| `/api/bookings` | `GET`, `POST` | `mockData.ts` | Fetches active reservations or creates a new booking with a unique reference code (`BK-XXXXX`). |
| `/api/dashboard` | `GET` | `mockData.ts` | Aggregated payload for Staff Admin Dashboard (revenue, fleet utilization, recent transactions). |
| `/api/locations` | `GET` | `locations.ts` | Returns all UK pickup and drop-off hubs (London Heathrow, Manchester, Birmingham, etc.). |
| `/api/revenue` | `GET` | `mockData.ts` | Returns revenue chart metrics grouped by `weekly`, `monthly`, or `yearly`. |
| `/api/transactions` | `GET` | `mockData.ts` | Returns transaction feeds with status filtering (`Success`, `Pending`, `Cancelled`). |
| `/api/testimonials` | `GET` | `testimonials.ts` | Customer reviews and feedback ratings. |
| `/api/webhooks/booking` | `GET`, `POST` | In-memory logger | Webhook handler for external booking updates. |

### 🌐 External Data API Integration (NHTSA vPIC Service)

Frontend vehicle catalog data and dynamic search parameters are fetched from the external **NHTSA vPIC API** service (`frontend/src/services/nhtsaApi.ts`):

| API Endpoint | Function | Purpose |
| :--- | :--- | :--- |
| `GET /GetMakesForVehicleType/car?format=json` | `getVehicleMakes()` | Fetches live passenger car brand names (Tesla, Porsche, BMW, Honda, Audi, etc.). |
| `GET /GetModelsForMakeYear/make/{make}/modelyear/{year}?format=json` | `getVehicleModels(make, year)` | Fetches specific car models for any manufacturer brand and model year. |
| `GET /DecodeVinValues/{vin}?format=json` | `decodeVin(vin)` | Decodes 17-digit Vehicle Identification Numbers (VIN) to extract technical specs, engine, fuel type, and body class. |

> **Note:** If external NHTSA requests experience latency or network failure, the frontend automatically falls back to local static catalog data (`frontend/src/data/vehicles.ts` & `mockData.ts`).

### 🐍 Backend Python FastAPI API Routes (`backend/app/`)

| Endpoint | Method | Data Source | Description |
| :--- | :---: | :--- | :--- |
| `/api/chat` | `POST` | `knowledgeBase.json` + Groq API | Receives `{ message, history }`, performs document RAG retrieval, enforces off-topic guardrails, and returns Groq LLM completion with citations. |
| `/health` | `GET` | System | Health check endpoint returning `{"status": "ok", "service": "Digital Pylot Chatbot"}`. |

---

## 🚀 Quick Execution Commands

### 1. Launch Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```

### 2. Launch FastAPI Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```


