"use client";

import React from "react";
import { ChatMessage as ChatMessageType, ChatCitation } from "@/types/chat";
import { ContextActions, ContextActionItem } from "./ContextActions";
import { SourceChips } from "./SourceChips";

/**
 * Formats message markdown, bold tags, paragraphs, headings, bullet points,
 * and numbered lists cleanly for structured AI responses.
 */
export const FormattedMessage: React.FC<{ content: string; isUser?: boolean }> = ({
  content,
  isUser = false,
}) => {
  if (isUser) {
    return <p className="leading-snug break-words text-[13px] sm:text-[14px] font-medium">{content}</p>;
  }

  const paragraphs = content.split(/\n\s*\n/).filter(Boolean);

  const formatInlineText = (text: string) => {
    // Split bold text formatted as **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={idx} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const formatLine = (line: string, idx: number) => {
    const trimmed = line.trim();

    // Headings (e.g. ### Heading or Heading:)
    const headingMatch = trimmed.match(/^#{1,3}\s+(.*)$/);
    if (headingMatch) {
      return (
        <h4 key={idx} className="font-bold text-slate-900 text-[14px] sm:text-[15px] pt-1 pb-0.5">
          {formatInlineText(headingMatch[1])}
        </h4>
      );
    }

    // Numbered list: "1. Item" or "1) Item"
    const numberMatch = trimmed.match(/^(\d+)[\.\)]\s+(.*)$/);
    if (numberMatch) {
      const num = numberMatch[1];
      const rest = numberMatch[2];
      return (
        <div key={idx} className="flex gap-2 items-start py-0.5 min-w-0">
          <span className="font-semibold text-amber-600 select-none text-[13px] sm:text-[14px] flex-shrink-0">
            {num}.
          </span>
          <div className="flex-1 min-w-0 text-[13px] sm:text-[14px] leading-relaxed text-slate-700">
            {formatInlineText(rest)}
          </div>
        </div>
      );
    }

    // Bullet points: "- Item", "• Item", "* Item"
    const bulletMatch = trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ");
    if (bulletMatch) {
      const rest = trimmed.substring(2);
      return (
        <div key={idx} className="flex gap-2 items-start py-0.5 pl-0.5 min-w-0">
          <span className="text-amber-500 select-none text-[13px] sm:text-[14px] flex-shrink-0 mt-0.5">•</span>
          <div className="flex-1 min-w-0 text-[13px] sm:text-[14px] leading-relaxed text-slate-700">
            {formatInlineText(rest)}
          </div>
        </div>
      );
    }

    return (
      <p key={idx} className="leading-[1.6] break-words text-[13px] sm:text-[14px] text-slate-700">
        {formatInlineText(line)}
      </p>
    );
  };

  return (
    <div className="space-y-2.5 min-w-0 max-w-full">
      {paragraphs.map((pText, pIdx) => {
        const lines = pText.split("\n").filter(Boolean);
        return (
          <div key={pIdx} className="space-y-1 min-w-0 max-w-full">
            {lines.map((line, lIdx) => formatLine(line, lIdx))}
          </div>
        );
      })}
    </div>
  );
};

interface ChatMessageProps {
  message: ChatMessageType & { citations?: ChatCitation[]; customActions?: ContextActionItem[] };
  isConsecutive?: boolean;
  onSelectAction: (query: string) => void;
  onRetry?: () => void;
  disabled?: boolean;
}

export const ChatMessageItem: React.FC<ChatMessageProps> = ({
  message,
  isConsecutive = false,
  onSelectAction,
  onRetry,
  disabled = false,
}) => {
  const isUser = message.role === "user";
  const isError = message.content.includes("couldn't retrieve") || message.content.includes("trouble connecting");

  // Spacing: assistant -> assistant: 8–12px (mt-2.5), user -> assistant: 16–20px (mt-4.5)
  const marginTopClass = isConsecutive ? "mt-2.5" : "mt-4 sm:mt-4.5";

  return (
    <div className={`flex flex-col min-w-0 w-full ${isUser ? "items-end" : "items-start"} ${marginTopClass}`}>
      {/* Message Bubble */}
      <div
        className={`p-3.5 sm:p-4 rounded-[16px] transition-all min-w-0 break-words ${
          isUser
            ? "max-w-[78%] sm:max-w-[80%] bg-slate-900 text-white rounded-tr-xs shadow-2xs font-medium"
            : "max-w-[88%] sm:max-w-[90%] bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-2xs font-normal"
        }`}
      >
        <FormattedMessage content={message.content} isUser={isUser} />

        {/* Error Retry Option */}
        {isError && onRetry && (
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2">
            <button
              type="button"
              onClick={onRetry}
              disabled={disabled}
              className="text-[12px] font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      {/* Sources Disclosure (visually secondary) */}
      {!isUser && message.citations && message.citations.length > 0 && (
        <SourceChips citations={message.citations} />
      )}

      {/* Contextual Action Chips (1–3 relevant actions only) */}
      {!isUser && !isError && (
        <ContextActions
          citations={message.citations}
          customActions={message.customActions}
          onSelectAction={onSelectAction}
          disabled={disabled}
        />
      )}
    </div>
  );
};
