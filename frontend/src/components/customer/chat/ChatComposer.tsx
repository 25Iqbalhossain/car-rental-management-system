"use client";

import React from "react";
import { Send } from "lucide-react";

interface ChatComposerProps {
  input: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  input,
  onChange,
  onSubmit,
  loading,
}) => {
  return (
    <div className="flex-[0_0_auto] bg-white border-t border-slate-100 p-3.5 sm:p-4 w-full min-w-0 max-w-full z-10">
      <form onSubmit={onSubmit} className="flex items-center gap-2 w-full min-w-0 max-w-full">
        <div className="relative flex-1 flex items-center min-w-0">
          <input
            type="text"
            value={input}
            onChange={onChange}
            placeholder="Ask about cars, pricing, locations..."
            aria-label="Ask about cars, pricing, locations..."
            className="w-full pl-4 pr-12 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200/80 rounded-2xl text-[13px] sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all h-[48px] min-h-[48px]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className={`absolute right-1.5 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
              input.trim() && !loading
                ? "bg-slate-950 hover:bg-slate-900 text-amber-400 active:scale-95 cursor-pointer shadow-3xs"
                : "text-slate-300 cursor-not-allowed opacity-50 bg-transparent"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
