"use client";

import React from "react";
import Link from "next/link";
import { Users, DoorClosed, Gauge, Star, Check } from "lucide-react";
import { CustomerVehicle } from "@/data/vehicles";

interface VehicleCardProps {
  vehicle: CustomerVehicle;
  onRentNow?: (vehicle: CustomerVehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onRentNow }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Vehicle Image & Badges */}
      <div className="relative h-48 sm:h-52 bg-slate-100 overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
          {vehicle.category}
        </div>
        {vehicle.rating && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-slate-900 text-xs font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{vehicle.rating}</span>
          </div>
        )}
      </div>

      {/* Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-extrabold text-base text-slate-900 group-hover:text-orange-500 transition-colors">
              {vehicle.name}
            </h3>
          </div>
          <span className="text-[11px] font-medium text-slate-500">
            NHTSA Decoded Model • {vehicle.brand}
          </span>

          {/* Specs icons */}
          <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-slate-100 text-xs text-slate-600 font-semibold">
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
              <Gauge className="w-4 h-4 text-orange-500" />
              <span className="truncate">{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
              <Users className="w-4 h-4 text-orange-500" />
              <span>{vehicle.seats} Seats</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
              <DoorClosed className="w-4 h-4 text-orange-500" />
              <span>{vehicle.doors} Doors</span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xl font-extrabold text-slate-900">£{vehicle.pricePerDay}</span>
            <span className="text-xs text-slate-500 font-medium"> / day</span>
          </div>

          {onRentNow ? (
            <button
              onClick={() => onRentNow(vehicle)}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Rent Now</span>
            </button>
          ) : (
            <Link
              href={`/booking?vehicleId=${vehicle.id}`}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Rent Now</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
