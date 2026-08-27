"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VehicleCard } from "./VehicleCard";
import { CustomerVehicle } from "@/data/vehicles";
import { SlidersHorizontal, ArrowRight } from "lucide-react";

interface PopularVehiclesProps {
  vehicles?: CustomerVehicle[];
  onRentNow?: (vehicle: CustomerVehicle) => void;
}

export const PopularVehicles: React.FC<PopularVehiclesProps> = ({
  vehicles = [],
  onRentNow,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Economy", "Sedan", "SUV", "Luxury"];

  const filteredVehicles = vehicles.filter((v) => {
    if (selectedCategory === "All") return true;
    if (selectedCategory === "Economy") return v.category.toLowerCase().includes("economy") || v.pricePerDay <= 90;
    if (selectedCategory === "Sedan") return v.category.toLowerCase().includes("sedan");
    if (selectedCategory === "SUV") return v.category.toLowerCase().includes("suv");
    if (selectedCategory === "Luxury") return v.category.toLowerCase().includes("luxury") || v.category.toLowerCase().includes("sports");
    return true;
  });

  return (
    <section id="popular-deals" className="py-12 lg:py-16 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-orange-500 bg-orange-100/80 px-3 py-1 rounded-full border border-orange-200">
              POPULAR DEALS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Most Popular <span className="text-orange-500">Rental Deals</span>
            </h2>
          </div>

          {/* Category Filter Chips & View All Link */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1 hidden sm:inline" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-orange-500 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <Link
              href="/vehicles"
              className="inline-flex items-center gap-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl shadow-xs transition-colors shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Vehicles Grid: 4 cards on desktop when available */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} onRentNow={onRentNow} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 max-w-md mx-auto my-6">
            <p className="text-slate-600 font-bold mb-3 text-xs">
              No vehicles available under the "{selectedCategory}" category.
            </p>
            <button
              onClick={() => setSelectedCategory("All")}
              className="px-5 py-2 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-orange-600 transition-colors"
            >
              Reset Search Filter
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

