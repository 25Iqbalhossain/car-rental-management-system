"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VehicleCard } from "./VehicleCard";
import { CustomerVehicle } from "@/data/vehicles";

interface PopularVehiclesProps {
  vehicles?: CustomerVehicle[];
  onRentNow?: (vehicle: CustomerVehicle) => void;
}

export const PopularVehicles: React.FC<PopularVehiclesProps> = ({
  vehicles = [],
  onRentNow,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Popular");
  const [visibleCount, setVisibleCount] = useState(8);

  const categories = ["Popular", "Large Car", "Small Car", "Exclusive Car"];

  const filteredVehicles = vehicles.filter((v) => {
    if (selectedCategory === "Popular") return true;
    if (selectedCategory === "Large Car") return v.category.toLowerCase().includes("suv") || v.category.toLowerCase().includes("large");
    if (selectedCategory === "Small Car") return v.category.toLowerCase().includes("sedan") || v.category.toLowerCase().includes("economy") || v.category.toLowerCase().includes("small");
    if (selectedCategory === "Exclusive Car") return v.category.toLowerCase().includes("luxury") || v.category.toLowerCase().includes("sports") || v.category.toLowerCase().includes("exclusive");
    return true;
  });

  const visibleVehicles = filteredVehicles.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  return (
    <section id="popular-deals" className="py-8 lg:py-10 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Most popular car rental deals
          </h2>
          <p className="text-slate-500 text-sm">
            Find the perfect vehicle for your next journey from our top-rated selection.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8 border-b border-slate-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setVisibleCount(8);
              }}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                selectedCategory === cat
                  ? "text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {cat}
              {selectedCategory === cat && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900" />
              )}
            </button>
          ))}
        </div>

        {/* Vehicles Grid */}
        {visibleVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} onRentNow={onRentNow} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 max-w-md mx-auto my-6">
            <p className="text-slate-600 font-bold mb-3 text-xs">
              No vehicles available under the "{selectedCategory}" category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("Popular");
                setVisibleCount(8);
              }}
              className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-slate-800 transition-colors"
            >
              Reset Search Filter
            </button>
          </div>
        )}

        {/* Show More */}
        {filteredVehicles.length > 0 && (
          <div className="mt-10 flex flex-col items-center justify-center gap-3">
            <div className="text-slate-500 text-sm font-medium">
              {filteredVehicles.length} Car{filteredVehicles.length !== 1 ? 's' : ''}
            </div>
            {visibleCount < filteredVehicles.length && (
              <button
                onClick={handleShowMore}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                Show more car
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
