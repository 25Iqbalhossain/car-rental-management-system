"use client";

import React from "react";

interface StarterQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
  pathname?: string;
}

export const StarterQuestions: React.FC<StarterQuestionsProps> = ({
  onSelect,
  disabled = false,
  pathname = "/",
}) => {
  // Context-aware starter suggestions based on page route
  const getContextualStarters = () => {
    if (pathname.includes("/vehicles")) {
      return [
        "What vehicles are available?",
        "Which cars are cheapest?",
        "Is insurance included?",
        "How do I book a vehicle?",
      ];
    }
    if (pathname.includes("/booking")) {
      return [
        "What driver documents do I need?",
        "Is insurance included?",
        "What is the cancellation policy?",
        "Which locations do you cover?",
      ];
    }
    // Default 4 questions
    return [
      "How do I book a car?",
      "Which cars are cheapest?",
      "What locations do you cover?",
      "Is insurance included?",
    ];
  };

  const questions = getContextualStarters();

  return (
    <div className="flex-[0_0_auto] p-4 sm:p-5 bg-white border-b border-slate-100/90 w-full min-w-0 max-w-full overflow-hidden">
      {/* Concise Welcome Paragraphs */}
      <div className="space-y-1 mb-4 select-none">
        <p className="text-[15px] font-semibold text-slate-900 leading-tight">
          Hi, I&apos;m Pylot.
        </p>
        <p className="text-[13px] text-slate-500 font-normal leading-snug">
          I can help with bookings, vehicles, locations, insurance and pricing.
        </p>
      </div>

      {/* Section Label */}
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 select-none">
        Popular questions
      </p>

      {/* Fixed 2x2 Grid - STRICT NO HORIZONTAL SCROLL */}
      <div
        className="grid grid-cols-2 gap-2 w-full min-w-0"
        style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
      >
        {questions.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(qp)}
            disabled={disabled}
            aria-label={`Ask question: ${qp}`}
            className="w-full min-w-0 h-[44px] px-2.5 sm:px-3 bg-white hover:bg-slate-50 active:bg-slate-100/80 text-slate-700 hover:text-slate-900 border border-slate-200/80 hover:border-slate-300 rounded-xl shadow-2xs transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 flex items-center justify-center text-center text-[12px] sm:text-[13px] font-medium leading-tight select-none"
          >
            <span className="truncate w-full text-center">{qp}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
