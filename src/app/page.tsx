"use client";

import React, { useEffect, useState } from "react";
import { CustomerHeader } from "@/components/customer/Header";
import { CustomerHero } from "@/components/customer/Hero";
import { RentalSearch } from "@/components/customer/RentalSearch";
import { HowItWorks } from "@/components/customer/HowItWorks";
import { PopularVehicles } from "@/components/customer/PopularVehicles";
import { WhyChooseUs } from "@/components/customer/WhyChooseUs";
import { FeatureCards } from "@/components/customer/FeatureCards";
import { Testimonials } from "@/components/customer/Testimonials";
import { CustomerFooter } from "@/components/customer/Footer";
import { AiRecommendationModal } from "@/components/customer/AiRecommendationModal";
import { CustomerVehicle, INITIAL_CUSTOMER_VEHICLES } from "@/data/vehicles";
import { toCustomerVehicles } from "@/lib/vehicleMapper";
import { useRouter } from "next/navigation";

export default function CustomerHomePage() {
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
        if (!cancelled) {
          if (data.vehicles && data.vehicles.length > 0) {
            setVehicleList(toCustomerVehicles(data.vehicles));
          } else {
            setVehicleList(INITIAL_CUSTOMER_VEHICLES);
          }
        }
      } catch (err) {
        console.error("Failed to load vehicles from API:", err);
        if (!cancelled) setVehicleList(INITIAL_CUSTOMER_VEHICLES);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearchFilter = (criteria: any) => {
    console.log("Customer search filter applied:", criteria);
  };

  const handleRentNow = (vehicle: CustomerVehicle) => {
    router.push(`/booking?vehicleId=${vehicle.id}`);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      <CustomerHeader onOpenAiModal={() => setAiModalOpen(true)} />
      <main className="flex-1">
        <CustomerHero />
        <RentalSearch onSearch={handleSearchFilter} />
        <HowItWorks />
        {loading ? (
          <section className="py-16 text-center text-xs font-semibold text-slate-500">Loading live fleet from API...</section>
        ) : (
          <PopularVehicles vehicles={vehicleList} onRentNow={handleRentNow} />
        )}
        <WhyChooseUs />
        <FeatureCards />
        <Testimonials />
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
