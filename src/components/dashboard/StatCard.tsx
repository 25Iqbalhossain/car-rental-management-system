"use client";

import React from "react";
import { DashboardStats } from "@/types/dashboard";
import { TrendingUp, ShoppingBag, Car, ArrowUpRight } from "lucide-react";

interface StatCardsProps {
  stats: DashboardStats;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  const { weeklyEarning, totalSales, activeRentals } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-4">
      {/* Card 1 — Weekly Earning (Wider White Card) */}
      <div className="md:col-span-6 bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-shadow relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Weekly Earning
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="my-2">
          <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">
            {weeklyEarning.currency}
            {weeklyEarning.amount.toLocaleString("en-GB", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="inline-flex items-center gap-0.5 font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
            <ArrowUpRight className="w-3 h-3" />
            +{weeklyEarning.percentageChange}%
          </span>
          <span className="text-slate-400 font-medium text-[11px]">{weeklyEarning.comparisonText}</span>
        </div>
      </div>

      {/* Card 2 — Total Sales (Orange Card) */}
      <div className="md:col-span-3 bg-orange-500 text-white rounded-xl p-4 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-orange-100 uppercase tracking-wider">
            Total Sales
          </span>
          <div className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center backdrop-blur-xs">
            <ShoppingBag className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="my-2">
          <h2 className="text-xl lg:text-2xl font-black text-white tracking-tight">
            {totalSales.formattedCount}
          </h2>
          <p className="text-[11px] font-medium text-orange-100 mt-0.5">{totalSales.label}</p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-orange-100">
          <span className="bg-white/20 font-extrabold px-1.5 py-0.5 rounded text-white">
            +{totalSales.percentageChange}%
          </span>
          <span>growth this month</span>
        </div>
      </div>

      {/* Card 3 — Purchased Goods / Active Rentals (Dark Navy Card) */}
      <div className="md:col-span-3 bg-slate-900 text-white rounded-xl p-4 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Fleet Utilization
          </span>
          <div className="w-7 h-7 rounded-lg bg-slate-800 text-orange-400 flex items-center justify-center">
            <Car className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="my-2">
          <h2 className="text-xl lg:text-2xl font-black text-white tracking-tight">
            {activeRentals.formattedCount}
          </h2>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">{activeRentals.label}</p>
        </div>

        <div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
            <span>Utilization Rate</span>
            <span className="font-bold text-orange-400">{activeRentals.utilizationRate}%</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full"
              style={{ width: `${activeRentals.utilizationRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
