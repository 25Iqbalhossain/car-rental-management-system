"use client";

import React, { useState } from "react";
import { LocationData } from "@/types/dashboard";
import { ChevronDown, ArrowUp, MapPin } from "lucide-react";
import { WorldMapSvg } from "./WorldMapSvg";

interface LocationAnalyticsProps {
  locations?: LocationData[];
  selectedLocation?: string;
  onLocationSelect?: (city: string) => void;
}

export const LocationAnalytics: React.FC<LocationAnalyticsProps> = ({
  locations = [],
  selectedLocation = "All Locations",
  onLocationSelect,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState("This Week");

  const currentLocData = locations.find((l) => l.city === selectedLocation);

  const regionData = {
    selectedRegion: currentLocData ? currentLocData.city : "Africa & Europe",
    sales: currentLocData ? currentLocData.bookingsCount : 3455,
    change: currentLocData ? currentLocData.growth : 48,
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-xs font-bold text-slate-900">
            Sales by Countries
          </h3>
          {selectedLocation !== "All Locations" && (
            <span className="text-[10px] font-semibold text-orange-600 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {selectedLocation}
            </span>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative flex items-center gap-1.5">
          {locations.length > 0 && onLocationSelect && (
            <select
              value={selectedLocation}
              onChange={(e) => onLocationSelect(e.target.value)}
              className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <option value="All Locations">All Locations</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.city}>
                  {loc.city} ({loc.country})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span>{timeFilter}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-7 w-32 bg-white border border-slate-200 rounded-lg shadow-lg p-1 z-40 text-xs">
              {["This Week", "This Month", "This Year"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setTimeFilter(opt);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1 rounded text-xs font-medium ${
                    timeFilter === opt
                      ? "bg-orange-50 text-orange-600 font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* World Map Container */}
      <div className="relative my-2 flex-1 flex flex-col items-center justify-center min-h-[180px]">
        {/* Real Geographic World Map SVG */}
        <WorldMapSvg
          selectedRegion="africa"
          highlightedRegions={["north-america", "asia"]}
        />

        {/* Pulsing Marker over Africa center */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ top: "50%", left: "54%" }}
        >
          <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500 border border-white shadow-sm"></span>
        </div>

        {/* Dark Navy Marker — North America */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ top: "28%", left: "18%" }}
        >
          <span className="inline-flex rounded-full h-1.5 w-1.5 bg-[#0B2F4F] border border-white shadow-sm"></span>
        </div>

        {/* Dark Navy Marker — Europe */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ top: "20%", left: "52%" }}
        >
          <span className="inline-flex rounded-full h-1.5 w-1.5 bg-slate-700 border border-white shadow-sm"></span>
        </div>

        {/* Dark Navy Marker — East Asia */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ top: "25%", left: "82%" }}
        >
          <span className="inline-flex rounded-full h-1.5 w-1.5 bg-[#0B2F4F] border border-white shadow-sm"></span>
        </div>

        {/* Compact Tooltip over Africa */}
        <div
          className="absolute -translate-x-1/2 flex flex-col items-center pointer-events-none z-10 shadow-sm rounded-md overflow-hidden border border-slate-200/60"
          style={{ top: "38%", left: "54%" }}
        >
          <div className="bg-[#FFA64A] text-white text-[10px] font-bold px-3 py-0.5 w-full text-center">
            {regionData.selectedRegion}
          </div>
          <div className="bg-white text-[#0B2F4F] text-[11px] font-extrabold px-3 py-0.5 w-full text-center">
            {regionData.sales.toLocaleString("en-GB")} Sales
          </div>
        </div>
      </div>

      {/* Footer Stat */}
      <div className="pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500 flex items-center gap-1">
        <span className={`font-bold flex items-center gap-0.5 ${regionData.change >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
          <ArrowUp className={`w-3 h-3 stroke-[3] ${regionData.change < 0 ? "rotate-180" : ""}`} />
          {Math.abs(regionData.change)}%
        </span>
        <span>{regionData.change >= 0 ? "increase" : "decrease"} compared to last week</span>
      </div>
    </div>
  );
};
