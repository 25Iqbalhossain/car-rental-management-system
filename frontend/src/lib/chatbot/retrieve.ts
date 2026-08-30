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

// Standalone terms that clearly signal an unrelated topic even when
// there is no medical keyword present (e.g. "what is the weather").
const GENERIC_OFF_TOPIC_TERMS = [
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

const STOP_WORDS = new Set([
  "you",
  "your",
  "yours",
  "what",
  "which",
  "where",
  "when",
  "why",
  "who",
  "whom",
  "how",
  "the",
  "and",
  "are",
  "for",
  "with",
  "from",
  "that",
  "this",
  "these",
  "those",
  "have",
  "has",
  "will",
  "would",
  "can",
  "could",
  "should",
  "tell",
  "about",
  "does",
  "do",
  "is",
  "am",
  "was",
  "were",
  "been",
  "it",
  "its",
  "my",
  "me",
  "mine",
  "i",
  "of",
  "to",
  "in",
  "on",
  "at",
  "please",
  "thank",
  "thanks",
  "hi",
  "hello",
  "hey",
  "want",
  "need",
  "like",
  "love",
  "name",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9$\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

/**
 * Decides whether a document is a *confident* match for the query tokens.
 * A doc qualifies only when it has at least one strong match:
 *   - a tag overlap (curated topic keywords) OR a title hit.
 * Plain incidental content hits alone are NOT enough — this is what blocked
 * unrelated questions from dumping random knowledge documents.
 */
function matchesQuery(doc: KnowledgeDocument, queryTokens: string[]): boolean {
  const title = doc.title.toLowerCase();
  const tags = doc.tags.join(" ").toLowerCase();

  for (const token of queryTokens) {
    const tagHit = doc.tags.some((tag) => {
      const t = tag.toLowerCase();
      return t.includes(token) || token.includes(t);
    });
    const titleHit = title.includes(token);
    if (tagHit || titleHit) return true;
  }

  return false;
}

export function isOffTopicQuery(message: string): boolean {
  const lower = message.toLowerCase();
  const hasMedical = OFF_TOPIC_TERMS.some((term) => lower.includes(term));
  const hasGenericOffTopic = GENERIC_OFF_TOPIC_TERMS.some((term) => lower.includes(term));
  const hasRental = RENTAL_TERMS.some((term) => lower.includes(term));
  // Clear off-topic: explicit medical / clearly-unrelated keywords with no rental intent.
  return (hasMedical || hasGenericOffTopic) && !hasRental;
}

export function retrieveKnowledge(message: string, limit = 4): RetrievalResult {
  const documents = knowledgeBase.documents as KnowledgeDocument[];
  const queryTokens = tokenize(message);

  const ranked = documents
    .map((doc) => {
      const haystack = `${doc.title} ${doc.tags.join(" ")} ${doc.content}`.toLowerCase();
      let score = 0;
      for (const token of queryTokens) {
        // Strong matches only: explicit tag or title overlap carries weight.
        if (doc.tags.some((tag) => tag.includes(token) || token.includes(tag))) score += 4;
        else if (doc.title.toLowerCase().includes(token)) score += 3;
        else if (haystack.includes(token)) score += 1;
      }
      return { doc, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.doc);

  // IMPORTANT: keep only confident matches. Incidental/stopword tokens are
  // filtered out, and a doc must have a title/tag overlap. This is what
  // eliminates "ulta-palta" answers for unrelated questions.
  const selected = queryTokens.length > 0 ? ranked.filter((doc) => matchesQuery(doc, queryTokens)) : [];

  return {
    documents: selected,
    citations: selected.map((doc) => ({ id: doc.id, title: doc.title })),
    context: selected.map((doc) => `### ${doc.title}\n${doc.content}`).join("\n\n"),
    isOffTopic: isOffTopicQuery(message),
  };
}

const GENERIC_NO_MATCH_REPLY =
  "I'm sorry, I don't have an answer for that yet. I can only help with Digital Pylot " +
  "car rentals — bookings, fleet, locations, pricing, insurance, requirements, and pickup/return. " +
  "Try asking me something like \"How do I book a car?\" or \"What locations do you cover?\" " +
  "and I'll be happy to help.";

export function buildFallbackReply(message: string, retrieval: RetrievalResult): string {
  if (retrieval.isOffTopic) {
    return "I can only help with Digital Pylot car rental — bookings, fleet, locations, pricing, insurance, and pickup. I cannot answer medical or unrelated questions. Ask me about a vehicle, city, or reservation and I will help.";
  }

  const top = retrieval.documents[0];

  // No document matched: never dump random knowledge. Give a controlled,
  // honest reply that politely redirects the user back to supported topics.
  if (!top) {
    return GENERIC_NO_MATCH_REPLY;
  }

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
