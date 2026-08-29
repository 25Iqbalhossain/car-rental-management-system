"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, RefreshCw } from "lucide-react";
import { ChatMessage, ChatCitation } from "@/types/chat";

/**
 * Formats message paragraphs and bullet points for high readability
 * without modifying the underlying message string content.
 */
const FormattedMessage: React.FC<{ content: string }> = ({ content }) => {
  const paragraphs = content.split(/\n\s*\n/).filter(Boolean);

  if (paragraphs.length <= 1) {
    const lines = content.split("\n").filter(Boolean);
    if (lines.length > 1) {
      return (
        <div className="space-y-2 min-w-0 max-w-full">
          {lines.map((line, idx) => {
            const trimmed = line.trim();
            const isBullet =
              trimmed.startsWith("-") ||
              trimmed.startsWith("•") ||
              trimmed.startsWith("*") ||
              /^\d+[\.\)]/.test(trimmed);
            return (
              <p
                key={idx}
                className={`leading-relaxed break-words min-w-0 max-w-full ${
                  isBullet
                    ? "pl-2.5 border-l-2 border-amber-400 text-slate-800 font-medium py-0.5"
                    : ""
                }`}
              >
                {line}
              </p>
            );
          })}
        </div>
      );
    }
    return <p className="leading-relaxed break-words whitespace-pre-line min-w-0 max-w-full">{content}</p>;
  }

  return (
    <div className="space-y-3 min-w-0 max-w-full">
      {paragraphs.map((pText, pIdx) => {
        const lines = pText.split("\n").filter(Boolean);
        return (
          <div key={pIdx} className="space-y-1.5 min-w-0 max-w-full">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              const isBullet =
                trimmed.startsWith("-") ||
                trimmed.startsWith("•") ||
                trimmed.startsWith("*") ||
                /^\d+[\.\)]/.test(trimmed);
              return (
                <p
                  key={lIdx}
                  className={`leading-relaxed break-words min-w-0 max-w-full ${
                    isBullet
                      ? "pl-2.5 border-l-2 border-amber-400 text-slate-800 font-medium py-0.5 bg-amber-50/40 rounded-r-md"
                      : ""
                  }`}
                >
                  {line}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<ChatMessage & { citations?: ChatCitation[] }>>([
    {
      role: "assistant",
      content:
        "Hello! I am Pylot, your Digital Pylot rental assistant. Ask me about booking steps, vehicle fleet, locations, insurance, or pricing!",
    },
  ]);

  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const previousMessageCountRef = useRef(messages.length);
  const isNearBottomRef = useRef(true);

  const handleScroll = () => {
    const history = chatHistoryRef.current;
    if (history) {
      const { scrollTop, scrollHeight, clientHeight } = history;
      // If the user is within 80px of the bottom, we consider them "at the bottom"
      isNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 80;
    }
  };

  const scrollToBottom = useCallback((force = false) => {
    if (chatHistoryRef.current) {
      const { scrollHeight, clientHeight } = chatHistoryRef.current;
      if (scrollHeight > clientHeight) {
        if (force || isNearBottomRef.current) {
          chatHistoryRef.current.scrollTo({
            top: scrollHeight - clientHeight,
            behavior: "smooth",
          });
        }
      } else {
        chatHistoryRef.current.scrollTop = 0;
      }
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const timer = window.setTimeout(() => {
      const history = chatHistoryRef.current;
      if (!history) return;

      // Only auto-scroll when a new message has actually been added.
      if (previousMessageCountRef.current !== messages.length) {
        const lastMessage = messages[messages.length - 1];
        // Force scroll to bottom if the user sent a message.
        // Otherwise (bot response), scroll only if they were already near the bottom.
        const shouldForce = lastMessage?.role === "user";
        scrollToBottom(shouldForce);
        previousMessageCountRef.current = messages.length;
      } else {
        // Show the beginning of the conversation when first opened.
        history.scrollTop = 0;
      }
    }, 50);

    return () => window.clearTimeout(timer);
  }, [messages, isOpen, scrollToBottom]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSend = async (customMessage?: string) => {
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
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply,
            citations: data.citations,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I ran into an issue retrieving an answer. Please try asking again.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting right now. Please check your network and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "How do I book a car?",
    "Which cars are cheapest?",
    "What locations do you cover?",
    "Is insurance included?",
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 group border border-slate-700/50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-label="Open Digital Pylot Chat Assistant"
        >
          <div className="relative flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          </div>
          <span className="font-extrabold text-xs tracking-wide">Pylot AI Chat</span>
        </button>
      )}

      {/* Chatbot Modal & Overlay */}
      {isOpen && (
        <>
          {/* Mobile Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 sm:hidden animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Pylot AI Assistant"
            className="fixed bottom-3 left-3 right-3 sm:bottom-6 sm:right-6 sm:left-auto z-50 flex flex-col w-auto sm:w-[410px] max-w-[calc(100vw-24px)] sm:max-w-[410px] h-[82vh] max-h-[620px] sm:h-[580px] sm:max-h-[calc(100vh-100px)] min-h-0 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 font-sans min-w-0 box-border"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white px-4 sm:px-5 py-3.5 flex items-center justify-between shadow-md flex-none select-none w-full min-w-0 max-w-full">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-amber-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-100 flex items-center gap-1.5 truncate leading-tight min-w-0">
                    <span className="truncate">Pylot Assistant</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-medium truncate leading-tight mt-0.5 min-w-0">
                    Digital Pylot Knowledge Base
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-all active:scale-95 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ml-2"
                aria-label="Close Chat Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Suggestions 2x2 Grid */}
            <div className="bg-slate-50 border-b border-slate-200/80 w-full min-w-0 max-w-full overflow-hidden flex-none p-3">
              <div className="grid grid-cols-2 gap-2 w-full min-w-0">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(qp)}
                    disabled={loading}
                    aria-label={`Ask quick question: ${qp}`}
                    title={qp}
                    className="w-full min-w-0 h-10 sm:h-11 px-3 py-1 bg-white text-slate-700 hover:bg-amber-500 hover:text-white border border-slate-200/90 hover:border-amber-500 rounded-lg shadow-2xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 flex items-center justify-center text-[10px] sm:text-xs font-semibold"
                  >
                    <span className="truncate w-full text-center leading-snug">{qp}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message History Container */}
            <div
              ref={chatHistoryRef}
              onScroll={handleScroll}
              className="flex-auto min-h-0 w-full max-w-full p-4 overflow-y-auto overflow-x-hidden space-y-4 bg-slate-50/50 chat-scrollbar overscroll-contain flex flex-col"
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col min-w-0 w-full ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed transition-all min-w-0 break-words ${
                      msg.role === "user"
                        ? "max-w-[88%] sm:max-w-[80%] bg-slate-900 text-white rounded-tr-xs shadow-sm font-medium"
                        : "max-w-[92%] sm:max-w-[85%] bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-2xs font-normal"
                    }`}
                  >
                    <FormattedMessage content={msg.content} />
                  </div>

                  {/* Citations / References / Action Buttons */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-2 w-full max-w-full min-w-0">
                      {msg.citations.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleSend(`Tell me more about ${c.title}`)}
                          disabled={loading}
                          className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold bg-amber-50/90 hover:bg-amber-100/90 text-amber-900 border border-amber-200/80 px-3 py-2 rounded-lg shadow-2xs transition-all cursor-pointer flex-auto min-w-[130px] max-w-full leading-snug disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 min-h-[36px] h-auto shrink"
                        >
                          <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                          <span className="text-center break-words font-semibold">{c.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-slate-500 text-xs py-2 px-1 min-w-0">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-500 shrink-0" />
                  <span className="font-semibold text-xs text-slate-600 truncate">Pylot is thinking...</span>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 sm:p-3.5 bg-white border-t border-slate-200/90 flex items-center gap-2 flex-none w-full min-w-0 max-w-full"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about cars, pricing, locations..."
                aria-label="Chat query input"
                className="flex-auto min-w-0 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all min-h-[42px]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className={`w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  input.trim() && !loading
                    ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md active:scale-95 cursor-pointer border border-orange-600"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/40 opacity-60"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
};
