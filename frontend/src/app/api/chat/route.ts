import { NextRequest, NextResponse } from "next/server";
import { buildFallbackReply, retrieveKnowledge } from "@/lib/chatbot/retrieve";
import { ChatRequestBody } from "@/types/chat";

export const dynamic = "force-dynamic";

const PYTHON_CHATBOT_URL = process.env.PYTHON_CHATBOT_URL || "http://127.0.0.1:8001/api/chat";

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    const userMessage = (body.message || "").trim();

    if (!userMessage) {
      return NextResponse.json({ error: "Message content cannot be empty." }, { status: 400 });
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const pyRes = await fetch(PYTHON_CHATBOT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: body.history || [],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (pyRes.ok) {
        const pyData = await pyRes.json();
        const pyReply = typeof pyData.reply === "string" && pyData.reply.trim() ? pyData.reply : "";
        if (pyReply) {
          return NextResponse.json({
            success: true,
            reply: pyReply,
            source: "python",
            citations: Array.isArray(pyData.citations) ? pyData.citations : [],
            suggestions: Array.isArray(pyData.suggestions) ? pyData.suggestions : [],
          });
        }
        // Empty / malformed backend reply -> fall through to local retrieval
      }
    } catch {
      // Fallback to Next.js retrieval service if Python microservice is offline or times out
    }

    const retrieval = retrieveKnowledge(userMessage);
    const reply = buildFallbackReply(userMessage, retrieval);

    return NextResponse.json({
      success: true,
      reply,
      source: "next",
      citations: retrieval.citations,
      suggestions: [
        "How do I book a car?",
        "What vehicles are available?",
        "Which locations do you cover?",
      ],
    });
  } catch (err) {
    console.error("Chat API Route Error:", err);
    return NextResponse.json({ error: "Failed to generate response." }, { status: 500 });
  }
}
