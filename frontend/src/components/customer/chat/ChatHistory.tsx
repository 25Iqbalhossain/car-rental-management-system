"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { ChatMessage as ChatMessageType, ChatCitation } from "@/types/chat";
import { ChatMessageItem } from "./ChatMessage";
import { ContextActionItem } from "./ContextActions";

interface ChatHistoryProps {
  messages: Array<ChatMessageType & { citations?: ChatCitation[]; customActions?: ContextActionItem[] }>;
  loading: boolean;
  isOpen: boolean;
  onSelectAction: (query: string) => void;
  onRetry?: () => void;
  disabled?: boolean;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  messages,
  loading,
  isOpen,
  onSelectAction,
  onRetry,
  disabled = false,
}) => {
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const previousMessageCountRef = useRef(messages.length);
  const isNearBottomRef = useRef(true);

  // Monitor user scroll position
  const handleScroll = () => {
    const history = chatHistoryRef.current;
    if (history) {
      const { scrollTop, scrollHeight, clientHeight } = history;
      // If user is within 80px of the bottom, consider them "at bottom"
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
        const shouldForce = lastMessage?.role === "user";
        scrollToBottom(shouldForce);
        previousMessageCountRef.current = messages.length;
      }
    }, 50);

    return () => window.clearTimeout(timer);
  }, [messages, isOpen, scrollToBottom]);

  return (
    <div
      ref={chatHistoryRef}
      onScroll={handleScroll}
      role="region"
      aria-label="Conversation history"
      aria-live="polite"
      className="flex-[1_1_auto] min-h-0 w-full max-w-full p-4 overflow-y-auto overflow-x-hidden bg-slate-50/40 chat-scrollbar overscroll-contain flex flex-col"
    >
      {messages.map((msg, index) => {
        const prevMsg = index > 0 ? messages[index - 1] : null;
        const isConsecutive = prevMsg !== null && prevMsg.role === msg.role;

        return (
          <ChatMessageItem
            key={index}
            message={msg}
            isConsecutive={isConsecutive}
            onSelectAction={onSelectAction}
            onRetry={index === messages.length - 1 ? onRetry : undefined}
            disabled={disabled}
          />
        );
      })}

      {/* Small Assistant Typing Indicator (Requirement 22) */}
      {loading && (
        <div className="flex flex-col items-start mt-3 min-w-0 w-full">
          <div className="px-3.5 py-2.5 bg-white border border-slate-200/80 rounded-[16px] rounded-tl-xs shadow-2xs max-w-[88%] flex items-center gap-2">
            <span className="text-[12px] font-semibold text-slate-500 select-none">Pylot</span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce motion-reduce:animate-none" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce motion-reduce:animate-none" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce motion-reduce:animate-none" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
