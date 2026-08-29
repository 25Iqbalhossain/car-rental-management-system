from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import ALLOWED_ORIGINS, HOST, PORT
from .schemas import ChatRequest, ChatResponse
from .service import generate_chat_response

app = FastAPI(
    title="Digital Pylot Chatbot API",
    description="Knowledge-base AI assistant service for Digital Pylot car rental platform.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Digital Pylot Chatbot"}


@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(payload: ChatRequest):
    return generate_chat_response(payload.message, payload.history)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=True)
