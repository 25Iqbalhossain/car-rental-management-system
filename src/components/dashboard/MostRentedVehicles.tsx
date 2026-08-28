"use client";

import React, { useState, useEffect } from "react";
import { Vehicle } from "@/types/dashboard";
import Image from "next/image";
import { Car, X, ShieldCheck } from "lucide-react";
import { getVehicleMakes, NhtsaMake } from "@/services/nhtsaApi";

interface MostRentedVehiclesProps {
  vehicles: Vehicle[];
}

export const MostRentedVehicles: React.FC<MostRentedVehiclesProps> = ({ vehicles }) => {
  const [showAllModal, setShowAllModal] = useState(false);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState("All");

  // Requirement 1: Dynamic brand filter from NHTSA API
  const [nhtsaBrands, setNhtsaBrands] = useState<NhtsaMake[]>([]);
  const [isBrandsLoading, setIsBrandsLoading] = useState(false);
  const [brandsError, setBrandsError] = useState<string | null>(null);

  useEffect(() => {
    setIsBrandsLoading(true);
    setBrandsError(null);

    getVehicleMakes()
      .then((data) => {
        setNhtsaBrands(data);
        setIsBrandsLoading(false);
      })
      .catch((err) => {
        setBrandsError(err.message || "Failed to load brands");
        setIsBrandsLoading(false);
      });
  }, []);

  const filteredVehicles = selectedBrandFilter === "All"
    ? vehicles
    : vehicles.filter((v) =>
        v.brand.toLowerCase().includes(selectedBrandFilter.toLowerCase()) ||
        v.name.toLowerCase().includes(selectedBrandFilter.toLowerCase())
      );

  // Compact list top 5
  const displayVehicles = filteredVehicles.slice(0, 5);

  return (
    <div className="bg-white border border-slate-200 rounded-md p-2.5 shadow-2xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-900">
            Best Seller
          </h3>

          <div className="flex items-center gap-2">
            {/* Dynamic Brand Filter */}
            <div className="relative flex items-center">
              {!isBrandsLoading && !brandsError && (
                <select
                  value={selectedBrandFilter}
                  onChange={(e) => setSelectedBrandFilter(e.target.value)}
                  className="px-2 py-0.5 text-[10px] font-semibold bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500 max-w-[100px] truncate"
                >
                  <option value="All">All</option>
                  {nhtsaBrands.slice(0, 30).map((b) => (
                    <option key={b.MakeId || b.MakeName} value={b.MakeName}>
                      {b.MakeName}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <button
              onClick={() => setShowAllModal(true)}
              className="text-[11px] font-semibold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer"
            >
              View All
            </button>
          </div>
        </div>

        {/* Compact List */}
        <div className="divide-y divide-slate-100">
          {displayVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="py-0.5 flex items-center justify-between gap-2 group hover:bg-slate-50 px-1 rounded transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative w-6 h-6 rounded bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-cover"
                    sizes="24px"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-xs text-slate-800 truncate">
                    {vehicle.name}
                  </h4>
                  <p className="text-[10px] text-slate-500">${vehicle.dailyRate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-right shrink-0">
                <span className="text-[11px] text-slate-500 font-medium">Sales</span>
                <span className="text-xs font-bold text-slate-900 w-10 text-right">
                  {vehicle.bookingsCount}
                </span>
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
        <div className="fixed inset-0 bg-slate-900/45 z-50 flex items-center justify-center p-3 lg:p-4">
          <div className="bg-white rounded-lg max-w-xl w-full max-h-[80vh] flex flex-col shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
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
                      <div className="relative w-10 h-10 rounded-md bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
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
                      <span className="font-black text-xs text-orange-600">${v.dailyRate}</span>
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
