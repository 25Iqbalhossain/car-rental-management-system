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

  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-2xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Greeting */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <Hand className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
              Hi {userName}, here&apos;s what&apos;s happening with your rental business today.
            </h1>
            {!isCollapsed && (
              <p className="text-[11px] text-slate-400 font-medium">
                Detailed breakdown of earnings, active fleet, recent bookings & revenue analytics.
              </p>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
          <DateFilter selected={selectedDateRange} onChange={onDateRangeChange} />

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs transition-all disabled:opacity-50"
            title="Refresh Data"
          >
            <RotateCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden md:inline">Refresh</span>
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1 px-2 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
            title={isCollapsed ? "Expand Banner" : "Collapse Banner"}
          >
            {isCollapsed ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
