"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CustomerVehicle } from "@/data/vehicles";
import { toCustomerVehicles } from "@/lib/vehicleMapper";
import { BookingUI } from "@/components/customer/BookingUI";

export const dynamic = "force-dynamic";

function BookingPageContent() {
  const searchParams = useSearchParams();
  const vId = searchParams.get("vehicleId") || "";
  const [car, setCar] = useState<CustomerVehicle | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pDate, setPDate] = useState("2026-08-28");
  const [dDate, setDDate] = useState("2026-08-31");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState<any>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/vehicles", { cache: "no-store" });
        const data = await res.json();
        const fleet = toCustomerVehicles(data.vehicles || []);
        if (cancelled) return;
        setCar(fleet.find((v) => v.id === vId) || fleet[0] || null);
      } catch {
        if (!cancelled) setErr("Failed to load vehicle from API.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [vId]);

  const days = Math.max(1, Math.ceil((new Date(dDate).getTime() - new Date(pDate).getTime()) / 86400000));
  const total = (car?.pricePerDay || 100) * days;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) { setErr("Name & Email required."); return; }
    setLoading(true); setErr("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId: car?.id, vehicleName: car?.name, vehicleCategory: car?.category, vehicleImage: car?.image, customerName: name, customerEmail: email, customerPhone: phone, pickupLocation: "London Heathrow", pickupDate: pDate, dropoffLocation: "London Heathrow", dropoffDate: dDate, totalDays: days, totalAmount: total, paymentMethod: "Stripe" }),
      });
      const data = await res.json();
      if (res.ok && data.success) setConfirmed(data.booking); else setErr(data.error || "Booking failed.");
    } catch { setErr("Network error."); } finally { setLoading(false); }
  };

  if (!car) return <div className="p-12 text-center text-xs font-semibold">Loading vehicle from API...</div>;
  return <BookingUI car={car} name={name} setName={setName} email={email} setEmail={setEmail} phone={phone} setPhone={setPhone} pDate={pDate} setPDate={setPDate} dDate={dDate} setDDate={setDDate} loading={loading} confirmed={confirmed} err={err} days={days} total={total} handleSubmit={handleSubmit} />;
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-semibold">Loading booking checkout...</div>}>
      <BookingPageContent />
    </Suspense>
  );
}
