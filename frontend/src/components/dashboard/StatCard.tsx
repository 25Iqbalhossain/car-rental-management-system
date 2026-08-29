"use client";

import React from "react";
import { DashboardStats } from "@/types/dashboard";
import { ShoppingBag, ShoppingCart, ArrowUp, RotateCw, MoreVertical } from "lucide-react";

interface StatCardsProps {
  stats: DashboardStats;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  const { weeklyEarning } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
      {/* Card 1 — Weekly Earning */}
      <div className="md:col-span-6 bg-white border border-slate-200 rounded-md p-2.5 shadow-2xs relative overflow-hidden min-h-[78px] flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">
              Weekly Earning
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              {weeklyEarning.currency || "$"}{weeklyEarning.amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
          </div>
          {/* Small illustration / mini area chart graphic on the right */}
          <div className="w-[56px] h-8 flex items-end gap-1 opacity-80">
            <div className="w-2 bg-orange-100 rounded-sm h-[40%]" />
            <div className="w-2 bg-orange-200 rounded-sm h-[60%]" />
            <div className="w-2 bg-orange-300 rounded-sm h-[35%]" />
            <div className="w-2 bg-orange-400 rounded-sm h-[80%]" />
            <div className="w-2 bg-orange-500 rounded-sm h-full" />
          </div>
        </div>

        <div className="flex items-center gap-1 text-[10px] mt-1">
          <span className="font-bold text-emerald-600 flex items-center">
            <ArrowUp className="w-3 h-3 stroke-[3]" />
            {weeklyEarning.percentageChange}%
          </span>
          <span className="text-slate-400">increase compared to last week</span>
        </div>
      </div>

      {/* Card 2 — Orange Stat Card */}
      <div className="md:col-span-3 bg-orange-500 text-white rounded-md p-2.5 shadow-2xs relative overflow-hidden min-h-[78px] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-6 h-6 rounded bg-white/20 text-white flex items-center justify-center">
            <ShoppingBag className="w-3.5 h-3.5" />
          </div>
          <button className="text-orange-100 hover:text-white transition-colors">
            <RotateCw className="w-3 h-3" />
          </button>
        </div>

        <div className="mt-1">
          <h2 className="text-lg font-bold text-white">
            10,000+
          </h2>
          <p className="text-[11px] font-medium text-orange-100 mt-0.5">No of Total Sales</p>
        </div>
      </div>

      {/* Card 3 — Dark Navy Stat Card */}
      <div className="md:col-span-3 bg-[#0B2F4F] text-white rounded-md p-2.5 shadow-2xs relative overflow-hidden min-h-[78px] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-6 h-6 rounded bg-white/10 text-white flex items-center justify-center">
            <ShoppingCart className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <button className="text-slate-400 hover:text-white transition-colors">
            <MoreVertical className="w-3 h-3" />
          </button>
        </div>

        <div className="mt-1">
          <h2 className="text-lg font-bold text-white">
            800+
          </h2>
          <p className="text-[11px] font-medium text-slate-300 mt-0.5">No of Purchased Goods</p>
        </div>
      </div>
    </div>
  );
};
