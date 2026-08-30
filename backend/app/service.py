import json
import re
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

GENERIC_OFF_TOPIC_KEYWORDS = [
    "weather",
    "cooking",
    "recipe",
    "food",
    "music",
    "movie",
    "film",
    "football",
    "cricket",
    "sport",
    "politics",
    "election",
    "prime minister",
    "history",
    "math",
    "maths",
    "homework",
    "school",
    "university",
    "exam",
    "poem",
    "story",
    "game",
    "video",
    "tiktok",
    "instagram",
    "facebook",
]

NO_MATCH_REPLY = (
    "I'm sorry, I don't have an answer for that yet. I can only help with Digital Pylot "
    "car rentals — bookings, fleet, locations, pricing, insurance, requirements, and pickup/return. "
    'Try asking me something like "How do I book a car?" or "What locations do you cover?" '
    "and I'll be happy to help."
)

STOP_WORDS = {
    "you", "your", "yours", "what", "which", "where", "when", "why", "who", "whom",
    "how", "the", "and", "are", "for", "with", "from", "that", "this", "these",
    "those", "have", "has", "will", "would", "can", "could", "should", "tell",
    "about", "does", "do", "is", "am", "was", "were", "been", "it", "its", "my",
    "me", "mine", "i", "of", "to", "in", "on", "at", "please", "thank", "thanks",
    "hi", "hello", "hey", "want", "need", "like", "love", "name",
}


def load_knowledge() -> dict[str, Any]:
    if KNOWLEDGE_PATH.exists():
        with open(KNOWLEDGE_PATH, "r", encoding="utf-8-sig") as f:
            return json.load(f)
    return {"documents": []}


def is_off_topic(message: str) -> bool:
    lower = message.lower()
    has_medical = any(term in lower for term in MEDICAL_KEYWORDS)
    has_generic = any(term in lower for term in GENERIC_OFF_TOPIC_KEYWORDS)
    has_rental = any(term in lower for term in RENTAL_KEYWORDS)
    return (has_medical or has_generic) and not has_rental


def retrieve_docs(message: str, docs: list[dict[str, Any]], limit: int = 4) -> list[dict[str, Any]]:
    # Regex tokenization mirrors the frontend: punctuation is dropped before
    # length/stopword filtering so short words like "hi," cannot sneak in.
    tokens = [
        t
        for t in re.findall(r"[a-z0-9$]+", message.lower())
        if len(t) > 2 and t not in STOP_WORDS
    ]
    scored = []
    for doc in docs:
        title = str(doc.get("title", "")).lower()
        tags_raw = doc.get("tags", [])
        content = str(doc.get("content", "")).lower()

        score = 0
        confident = False
        for token in tokens:
            tag_hit = any(token in str(tag).lower() or str(tag).lower() in token for tag in tags_raw)
            title_hit = token in title
            content_hit = token in content
            if tag_hit or title_hit:
                # Curated tag/title overlap = confident match, prevents
                # incidental words from dumping unrelated knowledge.
                confident = True
                score += 3
            if content_hit:
                score += 1
        if confident:
            scored.append((score, doc))
    scored.sort(key=lambda x: x[0], reverse=True)
    results = [item[1] for item in scored[:limit]]
    # IMPORTANT: never return random documents when nothing matches. Empty
    # results let callers produce a controlled reply instead of dumping data.
    return results


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
        if matched_docs:
            fallback = matched_docs[0]["content"]
        else:
            return ChatResponse(
                success=True,
                reply=NO_MATCH_REPLY,
                source="fallback",
                citations=[],
                suggestions=["How do I book a car?", "What vehicles are available?", "What is included in insurance?"],
            )
        return ChatResponse(
            success=True,
            reply=fallback,
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
        # Technical details stay server-side; the user always gets a clean reply.
        print(f"[Digital Pylot Chatbot] Groq request failed: {err}")
        if matched_docs:
            fallback = matched_docs[0]["content"]
        else:
            return ChatResponse(
                success=True,
                reply=NO_MATCH_REPLY,
                source="fallback",
                citations=[],
                suggestions=["How do I book a car?", "What vehicles are available?", "What is included in insurance?"],
            )
        return ChatResponse(
            success=True,
            reply=fallback,
            source="fallback",
            citations=citations,
            suggestions=["How do I book a car?", "What vehicles are available?", "What is included in insurance?"],
        )
