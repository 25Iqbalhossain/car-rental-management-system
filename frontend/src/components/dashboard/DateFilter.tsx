"use client";

import React, { useState } from "react";
import { DateRangeOption } from "@/types/dashboard";
import { Calendar, ChevronDown } from "lucide-react";

interface DateFilterProps {
  selected: DateRangeOption;
  onChange: (value: DateRangeOption) => void;
}

export const DATE_RANGE_LABELS: Record<DateRangeOption, string> = {
  this_week: "01 Jan 2024 - 07 Jan 2024",
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
        className="h-7 flex items-center gap-1.5 px-2 bg-white border border-slate-200 hover:border-slate-300 rounded text-[10px] font-semibold text-slate-700 shadow-2xs transition-colors"
      >
        <Calendar className="w-3 h-3 text-slate-500" />
        <span>{DATE_RANGE_LABELS[selected] || "01 Jan 2024 - 07 Jan 2024"}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-md shadow-md p-1 z-40 text-xs">
          {(Object.keys(DATE_RANGE_LABELS) as DateRangeOption[]).map((key) => (
            <button
              key={key}
              onClick={() => {
                onChange(key);
                setIsOpen(false);
              }}
              className={`w-full text-left px-2.5 py-1 rounded hover:bg-slate-50 transition-colors ${
                selected === key ? "bg-orange-50 font-bold text-orange-600" : "text-slate-700"
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
