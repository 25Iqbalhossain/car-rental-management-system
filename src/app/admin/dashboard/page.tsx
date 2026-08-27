"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { GreetingBar } from "@/components/dashboard/GreetingBar";
import { StatCards } from "@/components/dashboard/StatCard";
import { MostRentedVehicles } from "@/components/dashboard/MostRentedVehicles";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { RevenueAnalytics } from "@/components/dashboard/RevenueAnalytics";
import { LocationAnalytics } from "@/components/dashboard/LocationAnalytics";
import { QuickAddModal } from "@/components/dashboard/QuickAddModal";
import { SkeletonLoader, ErrorState } from "@/components/dashboard/SkeletonLoader";
import { DashboardApiResponse, DateRangeOption, TransactionStatus } from "@/types/dashboard";
import { getDashboardData } from "@/data/mockData";

export default function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeOption>("this_week");
  const [txFilter, setTxFilter] = useState<"All" | TransactionStatus>("All");
  const [revPeriod, setRevPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const [locFilter, setLocFilter] = useState("All Locations");

  const [data, setData] = useState<DashboardApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState(false);
  const [quickAdd, setQuickAdd] = useState(false);

  const fetchData = useCallback(async (isRef = false) => {
    if (isRef) setRefreshing(true); else setLoading(true);
    setErr(false);
    try {
      const p = new URLSearchParams({ dateRange, search: query, status: txFilter, revenuePeriod: revPeriod, location: locFilter });
      const r = await fetch(`/api/dashboard?${p}`);
      if (!r.ok) throw new Error();
      setData(await r.json());
    } catch {
      setData(getDashboardData({ dateRange, searchQuery: query, transactionStatus: txFilter, revenuePeriod: revPeriod, locationFilter: locFilter }));
    } finally {
      setLoading(false); setRefreshing(false);
    }
  }, [dateRange, query, txFilter, revPeriod, locFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = (item: any) => {
    if (!data) return;
    const v = { id: `v-${Date.now()}`, name: item.vehicleName, brand: item.brand || "NHTSA", category: item.category || "Luxury SUV", dailyRate: item.dailyRate, bookingsCount: 1, revenue: item.dailyRate, image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=150", status: item.status || "Available", rating: 5.0, modelYear: item.modelYear };
    const t: any = { id: `tx-${Date.now()}`, bookingCode: `BK-${Math.floor(10000 + Math.random() * 90000)}`, vehicleName: item.vehicleName, vehicleCategory: item.category, vehicleImage: v.image, customerName: item.customerName || "Walk-in Guest", timeAgo: "Just now", paymentMethod: "Stripe", status: "Success", amount: item.dailyRate, currency: "£", date: new Date().toISOString() };
    setData((p) => p ? { ...p, mostRentedVehicles: [v, ...p.mostRentedVehicles], recentTransactions: [t, ...p.recentTransactions] } : p);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeItem={activeItem} onSelectItem={setActiveItem} />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header onToggleMobileMenu={() => setSidebarOpen(true)} searchQuery={query} onSearchChange={setQuery} onAddNew={() => setQuickAdd(true)} />
        <main className="flex-1 p-3 lg:p-4 space-y-3.5 max-w-[1500px] w-full mx-auto">
          {loading && !data ? <SkeletonLoader /> : err || !data ? <ErrorState onRetry={() => fetchData()} /> : (
            <>
              <GreetingBar userName={data.user.name} selectedDateRange={dateRange} onDateRangeChange={setDateRange} onRefresh={() => fetchData(true)} isRefreshing={refreshing} />
              <StatCards stats={data.stats} />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
                <div className="lg:col-span-5 flex flex-col"><MostRentedVehicles vehicles={data.mostRentedVehicles} /></div>
                <div className="lg:col-span-7 flex flex-col"><RecentTransactions transactions={data.recentTransactions} currentFilter={txFilter} onFilterChange={setTxFilter} /></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col"><RevenueAnalytics data={data.revenueAnalytics} period={revPeriod} onPeriodChange={setRevPeriod} /></div>
                <div className="lg:col-span-5 xl:col-span-4 flex flex-col"><LocationAnalytics locations={data.locationsData} selectedLocation={locFilter} onLocationSelect={setLocFilter} /></div>
              </div>
            </>
          )}
        </main>
      </div>
      <QuickAddModal isOpen={quickAdd} onClose={() => setQuickAdd(false)} onAddSuccess={handleAdd} />
    </div>
  );
}
