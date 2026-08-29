import json
from typing import Any

from groq import Groq

from .config import GROQ_API_KEY, GROQ_MODEL, KNOWLEDGE_PATH
from .schemas import ChatCitation, ChatMessage, ChatResponse

RENTAL_KEYWORDS = [
    "car",
    "rent",
    "rental",
    "vehicle",
    "booking",
    "book",
    "pickup",
    "drop",
    "fleet",
    "price",
    "insurance",
    "location",
    "tesla",
    "suv",
    "digital pylot",
    "pylot",
    "airport",
    "licence",
    "license",
    "cancel",
    "support",
    "dashboard",
    "admin",
]

MEDICAL_KEYWORDS = [
    "medical",
    "doctor",
    "symptom",
    "diagnosis",
    "prescription",
    "acne",
    "rash",
    "hospital",
    "patient",
    "blood",
    "covid",
    "therapy",
]


def load_knowledge() -> dict[str, Any]:
    if KNOWLEDGE_PATH.exists():
        with open(KNOWLEDGE_PATH, "r", encoding="utf-8-sig") as f:
            return json.load(f)
    return {"documents": []}


def is_off_topic(message: str) -> bool:
    lower = message.lower()
    has_medical = any(term in lower for term in MEDICAL_KEYWORDS)
    has_rental = any(term in lower for term in RENTAL_KEYWORDS)
    return has_medical and not has_rental


def retrieve_docs(message: str, docs: list[dict[str, Any]], limit: int = 4) -> list[dict[str, Any]]:
    tokens = [t.lower() for t in message.split() if len(t) > 2]
    scored = []
    for doc in docs:
        haystack = f"{doc.get('title','')} {' '.join(doc.get('tags',[]))} {doc.get('content','')}".lower()
        score = sum(3 if token in doc.get("title", "").lower() else 1 for token in tokens if token in haystack)
        if score > 0:
            scored.append((score, doc))
    scored.sort(key=lambda x: x[0], reverse=True)
    results = [item[1] for item in scored[:limit]]
    return results if results else docs[:3]


def generate_chat_response(message: str, history: list[ChatMessage]) -> ChatResponse:
    kb = load_knowledge()
    docs = kb.get("documents", [])

    if is_off_topic(message):
        return ChatResponse(
            success=True,
            reply="I can only help with Digital Pylot car rentals — bookings, vehicles, pricing, locations, and insurance. I do not answer medical or health questions.",
            source="python",
            citations=[],
            suggestions=["How do I book a car?", "What vehicles are available?", "Which UK cities do you cover?"],
        )

    matched_docs = retrieve_docs(message, docs)
    citations = [ChatCitation(id=d["id"], title=d["title"]) for d in matched_docs]
    context_str = "\n\n".join(f"[{d['title']}]: {d['content']}" for d in matched_docs)

    system_prompt = (
        "You are Pylot, the AI customer assistant for Digital Pylot — a UK car rental platform. "
        "Your task is to help users with car rentals, vehicle selection, locations, pricing, driver requirements, and booking rules. "
        "You MUST NOT answer medical, doctor, symptom, or health questions. If a question is medical or unrelated, politely state that you only handle Digital Pylot car rentals.\n\n"
        "Use the following knowledge base context to answer accurately and concisely in 2-4 sentences:\n"
        f"{context_str}"
    )

    if not GROQ_API_KEY:
        fallback = matched_docs[0]["content"] if matched_docs else "Welcome to Digital Pylot! Browse our fleet at /vehicles or reserve at /booking."
        return ChatResponse(
            success=True,
            reply=f"{fallback} (Set GROQ_API_KEY in backend/.env for live LLM responses)",
            source="fallback",
            citations=citations,
            suggestions=["How do I book a car?", "What vehicles are available?", "What is included in insurance?"],
        )

    try:
        client = Groq(api_key=GROQ_API_KEY)
        messages_payload = [{"role": "system", "content": system_prompt}]
        for item in history[-6:]:
            messages_payload.append({"role": item.role, "content": item.content})
        messages_payload.append({"role": "user", "content": message})

        completion = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=messages_payload,
            temperature=0.3,
            max_tokens=350,
        )

        reply = completion.choices[0].message.content or "How can I help with your Digital Pylot rental?"
        return ChatResponse(
            success=True,
            reply=reply,
            source="python",
            citations=citations,
            suggestions=["How do I book a car?", "What vehicles are available?", "What is included in insurance?"],
        )
    except Exception as err:
        fallback = matched_docs[0]["content"] if matched_docs else "Welcome to Digital Pylot! Browse our fleet at /vehicles."
        return ChatResponse(
            success=True,
            reply=f"{fallback} (Groq request fallback: {err})",
            source="fallback",
            citations=citations,
            suggestions=["How do I book a car?", "What vehicles are available?", "What is included in insurance?"],
        )
