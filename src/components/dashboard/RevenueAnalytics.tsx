"use client";

import React from "react";
import { RevenueAnalyticsData } from "@/types/dashboard";
import { MapPin } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueAnalyticsProps {
  data: RevenueAnalyticsData;
  period: "weekly" | "monthly" | "yearly";
  onPeriodChange: (period: "weekly" | "monthly" | "yearly") => void;
  selectedLocation?: string;
}

export const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({
  data,
  period,
  onPeriodChange,
  selectedLocation = "All Locations",
}) => {
  const periods: Array<"weekly" | "monthly" | "yearly"> = ["weekly", "monthly", "yearly"];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      return (
        <div className="bg-slate-900 text-white p-2 rounded-md shadow-md border border-slate-800 text-[11px]">
          <p className="font-bold text-slate-300">{label}</p>
          <p className="text-xs font-bold text-orange-400 mt-0.5">
            ${val.toLocaleString("en-US")}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-md p-2.5 shadow-2xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
        <div>
          <h3 className="text-xs font-bold text-slate-900">
            Sales Analytics
          </h3>
          {selectedLocation && selectedLocation !== "All Locations" && (
            <span className="text-[10px] font-semibold text-orange-600 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {selectedLocation}
            </span>
          )}
        </div>

        {/* Year/Period Selector */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-slate-100 p-0.5 rounded text-[10px] font-semibold">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={`px-2 py-0.5 rounded capitalize transition-all ${
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
      </div>

      {/* Chart */}
      <div className="pt-2 flex-1 min-h-[160px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="orangeChartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f6" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
              tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#f97316"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#orangeChartGradient)"
              dot={{ r: 2.5, fill: "#f97316", stroke: "#ffffff", strokeWidth: 1 }}
              activeDot={{ r: 4, fill: "#ea580c", stroke: "#ffffff", strokeWidth: 1.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
