import os
from pathlib import Path

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parents[2]
BACKEND_DIR = Path(__file__).resolve().parents[1]

load_dotenv(BACKEND_DIR / ".env")
load_dotenv(ROOT_DIR / "frontend" / ".env.local")

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

frontend_knowledge = ROOT_DIR / "frontend" / "src" / "data" / "knowledgeBase.json"
legacy_knowledge = ROOT_DIR / "src" / "data" / "knowledgeBase.json"
KNOWLEDGE_PATH = frontend_knowledge if frontend_knowledge.exists() else legacy_knowledge

HOST = os.getenv("CHATBOT_HOST", "0.0.0.0")
PORT = int(os.getenv("CHATBOT_PORT", "8001"))
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CHATBOT_CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
    if origin.strip()
]

