"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { ChatMessage, ChatCitation } from "@/types/chat";
import { ChatHeader } from "./chat/ChatHeader";
import { StarterQuestions } from "./chat/StarterQuestions";
import { ChatHistory } from "./chat/ChatHistory";
import { ChatComposer } from "./chat/ChatComposer";
import { ContextActionItem } from "./chat/ContextActions";
import { generateContextActions } from "@/lib/chatbot/contextActions";

type ChatWidgetMessage = ChatMessage & { citations?: ChatCitation[]; customActions?: ContextActionItem[] };


export const ChatWidget: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatWidgetMessage[]>([
    {
      role: "assistant",
      content: "Hi, I'm Pylot.\nI can help with bookings, vehicles, locations, insurance and pricing.",
    },
  ]);

  const hasUserMessages = messages.some((m) => m.role === "user");
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSend = useCallback(
    async (customMessage?: string) => {
      const text = customMessage || input;
      if (!text.trim() || loading) return;

      const userMsg: ChatMessage = { role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      if (!customMessage) setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history: messages.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        const data = await res.json();

        if (data.success) {
          const customActions = generateContextActions(text, data.reply || "");
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.reply,
              citations: data.citations || [],
              customActions: customActions.length > 0 ? customActions : undefined,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Sorry, I couldn't retrieve that right now.",
              customActions: [{ id: "retry-action", label: "Try again", query: text }],
            },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I couldn't retrieve that right now.",
            customActions: [{ id: "retry-action", label: "Try again", query: text }],
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages]
  );

  const handleRetry = useCallback(() => {
    if (lastUserMessage) handleSend(lastUserMessage.content);
  }, [handleSend, lastUserMessage]);

  return (

    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-expanded={false}
          aria-label="Open Pylot Assistant"
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 px-4 h-[52px] bg-slate-900 hover:bg-slate-950 text-white rounded-2xl shadow-xl hover:shadow-2xl border border-slate-800 transition-all duration-200 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
            <span className="tracking-tighter">P</span>
          </div>
          <span className="text-[14px] font-semibold text-white tracking-tight flex items-center gap-1.5">
            Pylot Assistant
            <Sparkles className="w-3.5 h-3.5 text-amber-400 opacity-90 group-hover:rotate-12 transition-transform" />
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
        </button>
      )}

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-950/30 backdrop-blur-2xs z-40 sm:hidden transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Pylot Assistant Chat"
            className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex flex-col w-full sm:w-[420px] h-full sm:h-[640px] sm:max-h-[85vh] bg-white sm:rounded-[20px] shadow-2xl border border-slate-200/80 overflow-hidden min-h-0 transition-all duration-200"
          >
            <ChatHeader onClose={() => setIsOpen(false)} />
            {!hasUserMessages && (
              <StarterQuestions
                onSelect={(q) => handleSend(q)}
                disabled={loading}
                pathname={pathname || "/"}
              />
            )}
            <ChatHistory
              messages={messages}
              loading={loading}
              isOpen={isOpen}
              onSelectAction={(q) => handleSend(q)}
              onRetry={handleRetry}
              disabled={loading}
            />
            <ChatComposer
              input={input}
              onChange={(e) => setInput(e.target.value)}
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              loading={loading}
            />
          </div>
        </>
      )}
    </>
  );
};

