"use client";

import React, { useEffect, useState } from "react";
import { CustomerHeader } from "@/components/customer/Header";
import { CustomerFooter } from "@/components/customer/Footer";
import { PopularVehicles } from "@/components/customer/PopularVehicles";
import { AiRecommendationModal } from "@/components/customer/AiRecommendationModal";
import { CustomerVehicle } from "@/data/vehicles";
import { toCustomerVehicles } from "@/lib/vehicleMapper";
import { useRouter } from "next/navigation";

export default function VehiclesPage() {
  const router = useRouter();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [vehicleList, setVehicleList] = useState<CustomerVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/vehicles", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) setVehicleList(toCustomerVehicles(data.vehicles || []));
      } catch (err) {
        console.error("Failed to load vehicles from API:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRentNow = (vehicle: CustomerVehicle) => {
    router.push(`/booking?vehicleId=${vehicle.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <CustomerHeader onOpenAiModal={() => setAiModalOpen(true)} />

      <main className="flex-1 pt-8 pb-16">
        {loading ? (
          <section className="py-16 text-center text-xs font-semibold text-slate-500">Loading live fleet from API...</section>
        ) : (
          <PopularVehicles vehicles={vehicleList} onRentNow={handleRentNow} />
        )}
      </main>

      <CustomerFooter />

      <AiRecommendationModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onSelectVehicle={handleRentNow}
      />
    </div>
  );
}
