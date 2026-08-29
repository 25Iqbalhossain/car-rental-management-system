export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatCitation {
  id: string;
  title: string;
}

export interface ChatRequestBody {
  message: string;
  history?: ChatMessage[];
}

export interface ChatResponseBody {
  success: boolean;
  reply: string;
  source: "python" | "next" | "fallback";
  citations: ChatCitation[];
  suggestions: string[];
}
