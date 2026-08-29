import knowledgeBase from "@/data/knowledgeBase.json";
import type { ChatCitation } from "@/types/chat";

export interface KnowledgeDocument {
  id: string;
  title: string;
  tags: string[];
  content: string;
}

export interface RetrievalResult {
  documents: KnowledgeDocument[];
  citations: ChatCitation[];
  context: string;
  isOffTopic: boolean;
}

const OFF_TOPIC_TERMS = [
  "medical",
  "medicine",
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
];

const RENTAL_TERMS = [
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
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9$\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

export function isOffTopicQuery(message: string): boolean {
  const lower = message.toLowerCase();
  const hasMedical = OFF_TOPIC_TERMS.some((term) => lower.includes(term));
  const hasRental = RENTAL_TERMS.some((term) => lower.includes(term));
  return hasMedical && !hasRental;
}

export function retrieveKnowledge(message: string, limit = 4): RetrievalResult {
  const documents = knowledgeBase.documents as KnowledgeDocument[];
  const queryTokens = tokenize(message);

  const ranked = documents
    .map((doc) => {
      const haystack = `${doc.title} ${doc.tags.join(" ")} ${doc.content}`.toLowerCase();
      let score = 0;
      for (const token of queryTokens) {
        if (doc.tags.some((tag) => tag.includes(token) || token.includes(tag))) score += 4;
        if (doc.title.toLowerCase().includes(token)) score += 3;
        if (haystack.includes(token)) score += 1;
      }
      return { doc, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.doc);

  const selected = ranked.length > 0 ? ranked : documents.slice(0, 3);

  return {
    documents: selected,
    citations: selected.map((doc) => ({ id: doc.id, title: doc.title })),
    context: selected.map((doc) => `### ${doc.title}\n${doc.content}`).join("\n\n"),
    isOffTopic: isOffTopicQuery(message),
  };
}

export function buildFallbackReply(message: string, retrieval: RetrievalResult): string {
  if (retrieval.isOffTopic) {
    return "I can only help with Digital Pylot car rental — bookings, fleet, locations, pricing, insurance, and pickup. I cannot answer medical or unrelated questions. Ask me about a vehicle, city, or reservation and I will help.";
  }

  const top = retrieval.documents[0];
  const extra = retrieval.documents[1];
  let reply = top.content;
  if (extra && !reply.includes(extra.title)) {
    reply += ` ${extra.content.split(".")[0]}.`;
  }

  const lower = message.toLowerCase();
  if (lower.includes("book") || lower.includes("reserve")) {
    reply += " You can start a booking at /booking or browse live cars at /vehicles.";
  }

  return reply;
}

export const CHAT_SUGGESTIONS = [
  "How do I book a car?",
  "Which cars are cheapest?",
  "What locations do you cover?",
  "Is insurance included?",
];
