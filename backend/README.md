# Digital Pylot — FastAPI AI Backend Microservice

This directory contains the Python FastAPI microservice powering the **Digital Pylot Car Rental Knowledge Base Chatbot**.

---

## 🚀 Key Features

- **FastAPI Microservice**: Backend endpoint serving `/api/chat`.
- **Groq LLM Integration**: Powered by `llama-3.1-8b-instant` via Groq.
- **RAG Knowledge Base**: Fleet details, pricing, UK hubs, insurance, and booking rules. Loads dynamically from `frontend/src/data/knowledgeBase.json`.
- **Scope Restriction**: Intercepts medical/unrelated queries and redirects to Digital Pylot rental topics.

---

## 🔑 Environment Variables (`.env`)

```env
GROQ_API_KEY="your_groq_api_key_here"
GROQ_MODEL="llama-3.1-8b-instant"
CHATBOT_HOST="0.0.0.0"
CHATBOT_PORT=8001
CHATBOT_CORS_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"
```

---

## 💻 Local Setup & Execution

### 1. Set Up Virtual Environment

```bash
cd backend
python -m venv venv
```

**Activate Virtual Environment:**
- **Windows:** `venv\Scripts\activate`
- **macOS/Linux:** `source venv/bin/activate`

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run Backend Microservice

```bash
python main.py
```

The service will run at `http://127.0.0.1:8001`.

---

## 🔌 Microservice API Endpoints

- `POST /api/chat`: Expects `{ message: string, history?: Array<{ role: string, content: string }> }`.
- `GET /health`: Microservice health check returning service status.


