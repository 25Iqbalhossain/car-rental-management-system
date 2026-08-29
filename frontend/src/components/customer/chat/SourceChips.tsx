"use client";

import React from "react";
import { ChatCitation } from "@/types/chat";

interface SourceChipsProps {
  citations?: ChatCitation[];
}

export const SourceChips: React.FC<SourceChipsProps> = ({ citations = [] }) => {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium select-none min-w-0 max-w-full flex-wrap">
      <span className="text-slate-400/80">Based on:</span>
      {citations.map((c, idx) => (
        <React.Fragment key={c.id || idx}>
          {idx > 0 && <span className="text-slate-300">·</span>}
          <span className="text-slate-500 hover:text-slate-700 transition-colors underline decoration-slate-300 underline-offset-2">
            {c.title}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};
