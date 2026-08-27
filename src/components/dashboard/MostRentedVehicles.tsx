"use client";

import React, { useState, useEffect, useRef } from "react";
import { Vehicle } from "@/types/dashboard";
import Image from "next/image";
import { ChevronRight, Car, Star, X, Filter, Fuel, Wrench, ShieldCheck, Loader2, AlertTriangle } from "lucide-react";
import { getVehicleMakes, NhtsaMake } from "@/services/nhtsaApi";

interface MostRentedVehiclesProps {
  vehicles: Vehicle[];
}

// Requirement 8: Debounce for brand search input
const BRAND_SEARCH_DEBOUNCE_MS = 250;

export const MostRentedVehicles: React.FC<MostRentedVehiclesProps> = ({ vehicles }) => {
  const [showAllModal, setShowAllModal] = useState(false);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState("All");

  // Requirement 1: Dynamic brand filter from NHTSA API
  const [nhtsaBrands, setNhtsaBrands] = useState<NhtsaMake[]>([]);
  const [isBrandsLoading, setIsBrandsLoading] = useState(false);
  const [brandsError, setBrandsError] = useState<string | null>(null);

  // Brand search filter for the dropdown (handles large list)
  const [brandSearchQuery, setBrandSearchQuery] = useState("");
  const [showBrandSearch, setShowBrandSearch] = useState(false);
  const brandSearchRef = useRef<HTMLInputElement>(null);
  const brandSearchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [filteredBrands, setFilteredBrands] = useState<NhtsaMake[]>([]);

  useEffect(() => {
    setIsBrandsLoading(true);
    setBrandsError(null);

    getVehicleMakes()
      .then((data) => {
        setNhtsaBrands(data);
        setFilteredBrands(data);
        setIsBrandsLoading(false);
      })
      .catch((err) => {
        setBrandsError(err.message || "Failed to load brands");
        setIsBrandsLoading(false);
      });
  }, []);

  // Debounced brand search (Requirement 8)
  useEffect(() => {
    if (brandSearchTimerRef.current) {
      clearTimeout(brandSearchTimerRef.current);
    }

    brandSearchTimerRef.current = setTimeout(() => {
      if (!brandSearchQuery.trim()) {
        setFilteredBrands(nhtsaBrands);
      } else {
        const q = brandSearchQuery.toLowerCase();
        setFilteredBrands(
          nhtsaBrands.filter((b) => b.MakeName.toLowerCase().includes(q))
        );
      }
    }, BRAND_SEARCH_DEBOUNCE_MS);

    return () => {
      if (brandSearchTimerRef.current) {
        clearTimeout(brandSearchTimerRef.current);
      }
    };
  }, [brandSearchQuery, nhtsaBrands]);

  // Close brand search dropdown when clicking outside
  useEffect(() => {
    if (!showBrandSearch) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (brandSearchRef.current && !brandSearchRef.current.closest('.brand-search-container')?.contains(e.target as Node)) {
        setShowBrandSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showBrandSearch]);

  const filteredVehicles = selectedBrandFilter === "All"
    ? vehicles
    : vehicles.filter((v) =>
        v.brand.toLowerCase().includes(selectedBrandFilter.toLowerCase()) ||
        v.name.toLowerCase().includes(selectedBrandFilter.toLowerCase())
      );

  // Compact list top 4
  const displayVehicles = filteredVehicles.slice(0, 4);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Best Seller
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">Top performing vehicles</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Dynamic Brand Filter (Requirement 1) with loading/error states */}
            <div className="relative flex items-center">
              {isBrandsLoading ? (
                <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-400">
                  <Loader2 className="w-3 h-3 animate-spin text-orange-500" />
                  <span>Loading...</span>
                </div>
              ) : brandsError ? (
                <div className="flex items-center gap-1 px-2 py-1 bg-rose-50 border border-rose-200 rounded-lg text-[10px] text-rose-600" title={brandsError}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>Error</span>
                </div>
              ) : (
                <>
                  <Filter className="w-3 h-3 text-slate-400 absolute left-2 pointer-events-none" />
                  <select
                    value={selectedBrandFilter}
                    onChange={(e) => setSelectedBrandFilter(e.target.value)}
                    className="pl-6 pr-2 py-1 text-[10px] font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500 max-w-[110px] truncate"
                  >
                    <option value="All">All Brands</option>
                    {nhtsaBrands.map((b) => (
                      <option key={b.MakeId || b.MakeName} value={b.MakeName}>
                        {b.MakeName}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>

            <button
              onClick={() => setShowAllModal(true)}
              className="text-[11px] font-bold text-orange-500 hover:text-orange-600 flex items-center gap-0.5 transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Compact List */}
        <div className="divide-y divide-slate-100">
          {displayVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="py-2 flex items-center justify-between gap-2.5 group hover:bg-slate-50/80 px-1 rounded-lg transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative w-9 h-9 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0 group-hover:scale-105 transition-transform">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-slate-800 truncate group-hover:text-orange-600 transition-colors">
                    {vehicle.name}
                  </h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[10px] font-semibold text-slate-500">
                      £{vehicle.dailyRate}/day
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-black text-slate-900 block">
                  {vehicle.bookingsCount}
                </span>
                <span className="text-[9px] text-slate-400 font-semibold uppercase">Sales</span>
              </div>
            </div>
          ))}

          {displayVehicles.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-400">
              No vehicles found.
            </div>
          )}
        </div>
      </div>

      {/* View All Modal */}
      {showAllModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[80vh] flex flex-col shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-orange-500" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Fleet Inventory & NHTSA Specs</h3>
                  <p className="text-[10px] text-slate-500">{filteredVehicles.length} vehicles matching</p>
                </div>
              </div>
              <button
                onClick={() => setShowAllModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto divide-y divide-slate-100">
              {filteredVehicles.map((v) => (
                <div key={v.id} className="py-3 space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                        <Image src={v.image} alt={v.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                          <span>{v.name}</span>
                          {v.nhtsaSpecs && (
                            <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[9px] font-bold rounded-md flex items-center gap-1">
                              <ShieldCheck className="w-2.5 h-2.5" /> NHTSA Verified
                            </span>
                          )}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">{v.brand} • {v.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-xs text-orange-600">£{v.dailyRate}/day</span>
                      <p className="text-[10px] text-slate-400 font-semibold">Bookings: {v.bookingsCount}</p>
                    </div>
                  </div>

                  {/* Render NHTSA specifications when present (Requirement 3: all fields) */}
                  {v.nhtsaSpecs && (
                    <div className="mt-1 p-2 bg-slate-50 border border-slate-200/80 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-600 font-medium">
                      {v.nhtsaSpecs.vin && <p><strong className="text-slate-800">VIN:</strong> {v.nhtsaSpecs.vin}</p>}
                      {v.nhtsaSpecs.bodyClass && <p><strong className="text-slate-800">Body:</strong> {v.nhtsaSpecs.bodyClass}</p>}
                      {v.nhtsaSpecs.fuelType && <p><strong className="text-slate-800">Fuel:</strong> {v.nhtsaSpecs.fuelType}</p>}
                      {v.nhtsaSpecs.engineCylinders && <p><strong className="text-slate-800">Engine:</strong> {v.nhtsaSpecs.engineCylinders} Cyl ({v.nhtsaSpecs.displacementL}L)</p>}
                      {v.nhtsaSpecs.driveType && <p><strong className="text-slate-800">Drive:</strong> {v.nhtsaSpecs.driveType}</p>}
                      {v.nhtsaSpecs.transmissionStyle && <p><strong className="text-slate-800">Trans:</strong> {v.nhtsaSpecs.transmissionStyle}</p>}
                      {v.nhtsaSpecs.manufacturer && <p className="col-span-2 truncate"><strong className="text-slate-800">Manufacturer:</strong> {v.nhtsaSpecs.manufacturer}</p>}
                    </div>
                  )}
                </div>
              ))}

              {filteredVehicles.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400 font-medium">
                  No vehicles found for brand &quot;{selectedBrandFilter}&quot;.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
