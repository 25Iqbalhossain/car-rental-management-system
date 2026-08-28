"use client";

import React, { useState } from "react";
import { DateFilter } from "./DateFilter";
import { DateRangeOption } from "@/types/dashboard";
import { RotateCw, ChevronUp, ChevronDown, Hand } from "lucide-react";

interface GreetingBarProps {
  userName: string;
  selectedDateRange: DateRangeOption;
  onDateRangeChange: (range: DateRangeOption) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const GreetingBar: React.FC<GreetingBarProps> = ({
  userName,
  selectedDateRange,
  onDateRangeChange,
  onRefresh,
  isRefreshing = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <div className="bg-white border border-slate-200 rounded-md px-3 py-1.5 shadow-2xs flex items-center justify-between min-h-[44px] w-full box-border">
        <span className="text-xs font-bold text-slate-800">
          Hi {userName}, here&apos;s what&apos;s happening with your store today.
        </span>
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-1 hover:bg-slate-100 rounded text-slate-500"
          title="Expand Banner"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-md px-3 py-1.5 shadow-2xs transition-all min-h-[46px] w-full box-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {/* Left Greeting */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <Hand className="w-3 h-3 text-orange-500" />
          </div>
          <h1 className="text-xs font-bold text-slate-900">
            Hi {userName}, here&apos;s what&apos;s happening with your store today.
          </h1>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
          <DateFilter selected={selectedDateRange} onChange={onDateRangeChange} />

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-7 flex items-center gap-1 px-2 bg-white border border-slate-200 hover:bg-slate-50 rounded text-[11px] font-semibold text-slate-700 shadow-2xs transition-all disabled:opacity-50"
            title="Refresh Data"
          >
            <RotateCw className={`w-3 h-3 text-slate-500 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden md:inline">Refresh</span>
          </button>

          <button
            onClick={() => setIsCollapsed(true)}
            className="h-7 w-7 flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 rounded text-slate-500 shadow-2xs transition-colors"
            title="Collapse Banner"
          >
            <ChevronUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
