"use client";

import React from "react";
import { X, Sparkles } from "lucide-react";

interface ChatHeaderProps {
  onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => {
  return (
    <header className="flex-[0_0_auto] h-[72px] px-5 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between select-none relative z-10">
      {/* Identity & Status */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Brand Icon Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/10 ring-1 ring-white/10">
            <span className="text-lg tracking-tighter">P</span>
          </div>
          {/* Subtle Online Status Dot */}
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"
            title="Online"
            aria-label="Online status indicator"
          />
        </div>

        {/* Title and Subtitle */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="text-[16px] font-bold text-white tracking-tight leading-tight truncate">
              Pylot Assistant
            </h2>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 animate-pulse" aria-hidden="true" />
          </div>
          <p className="text-[11px] sm:text-[12px] text-slate-400 font-medium truncate leading-tight mt-0.5">
            Digital Pylot Knowledge Base
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
        {/* Close Button with 40-44px target */}
        <button
          onClick={onClose}
          aria-label="Close assistant"
          className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 active:bg-slate-800 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
