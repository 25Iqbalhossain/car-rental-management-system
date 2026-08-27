"use client";

import React, { useState } from "react";
import { DateRangeOption } from "@/types/dashboard";
import { Calendar, ChevronDown } from "lucide-react";

interface DateFilterProps {
  selected: DateRangeOption;
  onChange: (value: DateRangeOption) => void;
}

export const DATE_RANGE_LABELS: Record<DateRangeOption, string> = {
  this_week: "This Week",
  last_7_days: "Last 7 Days",
  this_month: "This Month",
  last_30_days: "Last 30 Days",
  year_to_date: "Year to Date",
  custom: "Custom Range",
};

export const DateFilter: React.FC<DateFilterProps> = ({ selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 shadow-xs transition-colors"
      >
        <Calendar className="w-3.5 h-3.5 text-slate-500" />
        <span>{DATE_RANGE_LABELS[selected]}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-40 text-xs">
          {(Object.keys(DATE_RANGE_LABELS) as DateRangeOption[]).map((key) => (
            <button
              key={key}
              onClick={() => {
                onChange(key);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors ${
                selected === key ? "bg-blue-50 font-bold text-blue-600" : "text-slate-700"
              }`}
            >
              {DATE_RANGE_LABELS[key]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
