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
        return NextResponse.json({
          success: true,
          reply: pyData.reply,
          source: "python",
          citations: pyData.citations || [],
          suggestions: pyData.suggestions || [],
        });
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
