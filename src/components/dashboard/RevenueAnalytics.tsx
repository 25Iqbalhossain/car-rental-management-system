"use client";

import React from "react";
import { RevenueAnalyticsData } from "@/types/dashboard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface RevenueAnalyticsProps {
  data: RevenueAnalyticsData;
  period: "weekly" | "monthly" | "yearly";
  onPeriodChange: (period: "weekly" | "monthly" | "yearly") => void;
}

export const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({
  data,
  period,
  onPeriodChange,
}) => {
  const periods: Array<"weekly" | "monthly" | "yearly"> = ["weekly", "monthly", "yearly"];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-xl border border-slate-800 text-xs">
          <p className="font-bold text-slate-300">{label}</p>
          <p className="text-sm font-black text-orange-400 mt-0.5">
            £{val.toLocaleString("en-GB")}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Bookings: {payload[0].payload.bookings}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Sales Analytics
            </h3>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              +{data.growth}%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Earnings trajectory & revenue overview</p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold self-start sm:self-auto">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                period === p
                  ? "bg-white text-orange-600 shadow-2xs font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="pt-3 flex-1 min-h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="orangeChartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
              tickFormatter={(value) => `£${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#f97316"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#orangeChartGradient)"
              dot={{ r: 3.5, fill: "#f97316", stroke: "#ffffff", strokeWidth: 1.5 }}
              activeDot={{ r: 6, fill: "#ea580c", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
