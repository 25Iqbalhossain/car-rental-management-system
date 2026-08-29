"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { CustomerVehicle } from "@/data/vehicles";

interface VehicleCardProps {
  vehicle: CustomerVehicle;
  onRentNow?: (vehicle: CustomerVehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onRentNow }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-slate-900 text-base line-clamp-1 mr-2">
            {vehicle.name}
          </h3>
          <button 
            onClick={(e) => { e.preventDefault(); setIsFavorite(!isFavorite); }}
            className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </button>
        </div>
        
        <p className="text-xs text-slate-500 mb-4">
          {vehicle.transmission} • {vehicle.seats} Seats • {vehicle.doors} Doors
        </p>

        {/* Spacer to push footer to bottom */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
          <div>
            <span className="font-semibold text-slate-900">£{vehicle.pricePerDay.toFixed(2)}</span>
            <span className="text-xs text-slate-500"> / day</span>
          </div>

          {onRentNow ? (
            <button
              onClick={() => onRentNow(vehicle)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Rent Now
            </button>
          ) : (
            <Link
              href={`/booking?vehicleId=${vehicle.id}`}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors inline-block"
            >
              Rent Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
