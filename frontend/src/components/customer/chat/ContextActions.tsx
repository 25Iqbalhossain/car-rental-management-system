"use client";

import React from "react";
import { ChatCitation } from "@/types/chat";

export interface ContextActionItem {
  id: string;
  label: string;
  query: string;
}

interface ContextActionsProps {
  citations?: ChatCitation[];
  customActions?: ContextActionItem[];
  onSelectAction: (query: string) => void;
  disabled?: boolean;
}

export const ContextActions: React.FC<ContextActionsProps> = ({
  citations = [],
  customActions = [],
  onSelectAction,
  disabled = false,
}) => {
  // Combine citations and custom contextual actions, keeping max 3
  const actions: ContextActionItem[] = [];

  if (customActions && customActions.length > 0) {
    actions.push(...customActions.slice(0, 3));
  } else if (citations && citations.length > 0) {
    citations.slice(0, 3).forEach((c) => {
      let label = c.title;
      // Make label sound like an action chip: e.g. "View pickup locations" or "Check insurance"
      if (!label.toLowerCase().startsWith("view") && !label.toLowerCase().startsWith("check") && !label.toLowerCase().startsWith("see")) {
        label = `View ${label}`;
      }
      actions.push({
        id: c.id,
        label: label,
        query: `Tell me more about ${c.title}`,
      });
    });
  }

  if (actions.length === 0) return null;

  return (
    <div className="mt-2.5 flex flex-wrap items-center gap-1.5 w-full max-w-full min-w-0">
      {actions.slice(0, 3).map((act) => (
        <button
          key={act.id}
          type="button"
          onClick={() => onSelectAction(act.query)}
          disabled={disabled}
          aria-label={`Action: ${act.label}`}
          className="inline-flex items-center justify-center gap-1.5 text-[12px] font-medium bg-amber-50/60 hover:bg-amber-100/70 active:bg-amber-200/50 text-slate-800 border border-amber-200/60 hover:border-amber-300/80 px-3 py-1 rounded-xl shadow-2xs transition-all duration-150 cursor-pointer h-[36px] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 min-w-0 max-w-full"
        >
          <span className="text-amber-500 font-normal select-none text-[13px] flex-shrink-0">✦</span>
          <span className="truncate">{act.label}</span>
        </button>
      ))}
    </div>
  );
};
