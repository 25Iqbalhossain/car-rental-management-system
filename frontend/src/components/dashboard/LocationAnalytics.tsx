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

interface RegionConfig {
  id: string;
  name: string;
  sales: number;
  change: number;
  markerPos: { top: string; left: string };
  tooltipPos: { top: string; left: string };
}

const REGION_MAP: Record<string, RegionConfig> = {
  africa: {
    id: "africa",
    name: "Africa & Europe",
    sales: 3455,
    change: 48,
    markerPos: { top: "50%", left: "54%" },
    tooltipPos: { top: "34%", left: "54%" },
  },
  "north-america": {
    id: "north-america",
    name: "United States",
    sales: 5680,
    change: 22.4,
    markerPos: { top: "28%", left: "18%" },
    tooltipPos: { top: "12%", left: "20%" },
  },
  europe: {
    id: "europe",
    name: "United Kingdom",
    sales: 4250,
    change: 18.2,
    markerPos: { top: "20%", left: "52%" },
    tooltipPos: { top: "6%", left: "52%" },
  },
  asia: {
    id: "asia",
    name: "East Asia",
    sales: 1980,
    change: 9.5,
    markerPos: { top: "25%", left: "82%" },
    tooltipPos: { top: "10%", left: "82%" },
  },
  "south-america": {
    id: "south-america",
    name: "South America",
    sales: 2150,
    change: 14.2,
    markerPos: { top: "60%", left: "33%" },
    tooltipPos: { top: "44%", left: "33%" },
  },
  oceania: {
    id: "oceania",
    name: "Australia",
    sales: 1840,
    change: 12.0,
    markerPos: { top: "65%", left: "85%" },
    tooltipPos: { top: "49%", left: "85%" },
  },
};

const TIME_MULTIPLIERS: Record<string, number> = {
  "This Week": 1,
  "This Month": 4.3,
  "This Year": 51.5,
};

export const LocationAnalytics: React.FC<LocationAnalyticsProps> = ({
  locations = [],
  selectedLocation = "All Locations",
  onLocationSelect,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>("africa");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [timeFilter, setTimeFilter] = useState<string>("This Week");

  const currentLocData = locations.find((l) => l.city === selectedLocation);

  const activeConfig = REGION_MAP[selectedRegion] || REGION_MAP.africa;
  const timeMultiplier = TIME_MULTIPLIERS[timeFilter] || 1;

  const displayRegionName = currentLocData
    ? currentLocData.city
    : activeConfig.name;

  const displaySales = currentLocData
    ? Math.round(currentLocData.bookingsCount * timeMultiplier)
    : Math.round(activeConfig.sales * timeMultiplier);

  const displayChange = currentLocData
    ? currentLocData.growth
    : activeConfig.change;

  const handleRegionClick = (regionId: string) => {
    setSelectedRegion(regionId);
    const targetConfig = REGION_MAP[regionId];
    if (targetConfig && onLocationSelect) {
      onLocationSelect(targetConfig.name);
    }
  };

  const handleDropdownSelect = (city: string) => {
    if (onLocationSelect) {
      onLocationSelect(city);
    }
    const cityLower = city.toLowerCase();
    if (cityLower.includes("york") || cityLower.includes("states") || cityLower.includes("us")) {
      setSelectedRegion("north-america");
    } else if (cityLower.includes("london") || cityLower.includes("uk") || cityLower.includes("europe")) {
      setSelectedRegion("europe");
    } else if (cityLower.includes("tokyo") || cityLower.includes("asia") || cityLower.includes("japan")) {
      setSelectedRegion("asia");
    } else {
      setSelectedRegion("africa");
    }
  };

  const otherRegions = Object.keys(REGION_MAP).filter((id) => id !== selectedRegion);

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
              onChange={(e) => handleDropdownSelect(e.target.value)}
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
              {Object.keys(TIME_MULTIPLIERS).map((opt) => (
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
        {/* Geographic World Map SVG with dynamic region selection */}
        <WorldMapSvg
          selectedRegion={selectedRegion}
          highlightedRegions={otherRegions.slice(0, 2)}
          onSelectRegion={handleRegionClick}
        />

        {/* Dynamic Pulsing Marker over selected region */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ease-out"
          style={{ top: activeConfig.markerPos.top, left: activeConfig.markerPos.left }}
        >
          <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500 border border-white shadow-sm"></span>
        </div>

        {/* Navy Markers for non-selected regions */}
        {otherRegions.map((regId) => {
          const cfg = REGION_MAP[regId];
          return (
            <div
              key={regId}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ease-out"
              style={{ top: cfg.markerPos.top, left: cfg.markerPos.left }}
            >
              <span className="inline-flex rounded-full h-1.5 w-1.5 bg-[#0B2F4F] border border-white shadow-sm"></span>
            </div>
          );
        })}

        {/* Dynamic Floating Tooltip over selected region */}
        <div
          className="absolute -translate-x-1/2 flex flex-col items-center pointer-events-none z-10 shadow-md rounded-md overflow-hidden border border-slate-200/80 transition-all duration-300 ease-out"
          style={{ top: activeConfig.tooltipPos.top, left: activeConfig.tooltipPos.left }}
        >
          <div className="bg-[#FFA64A] text-white text-[10px] font-bold px-3 py-0.5 w-full text-center whitespace-nowrap">
            {displayRegionName}
          </div>
          <div className="bg-white text-[#0B2F4F] text-[11px] font-extrabold px-3 py-0.5 w-full text-center whitespace-nowrap">
            {displaySales.toLocaleString("en-GB")} Sales
          </div>
        </div>
      </div>

      {/* Footer Stat */}
      <div className="pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500 flex items-center gap-1">
        <span className={`font-bold flex items-center gap-0.5 ${displayChange >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
          <ArrowUp className={`w-3 h-3 stroke-[3] ${displayChange < 0 ? "rotate-180" : ""}`} />
          {Math.abs(displayChange)}%
        </span>
        <span>{displayChange >= 0 ? "increase" : "decrease"} compared to last week</span>
      </div>
    </div>
  );
};
