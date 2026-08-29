import { NextRequest, NextResponse } from "next/server";
import { DateRangeOption, DashboardApiResponse, TransactionStatus, Vehicle, Transaction, PaymentMethod } from "@/types/dashboard";
import { MOCK_USER, MOCK_REVENUE_DATA, MOCK_LOCATIONS, MOCK_VEHICLES, MOCK_TRANSACTIONS, getDashboardData, getRevenueAnalyticsForLocation } from "@/data/mockData";
import { getVehicleModels } from "@/services/nhtsaApi";

export const dynamic = "force-dynamic";

const VEHICLE_IMAGES = [
  "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=400",
];

const POPULAR_MAKES = ["TESLA", "PORSCHE", "HONDA", "BMW", "JAGUAR", "AUDI"];
const CUSTOMERS = ["Eleanor Vance", "Marcus Sterling", "Sophia Chen", "David Miller", "Charlotte Dubois"];
const PAYMENT_METHODS: PaymentMethod[] = ["PayPal", "Apple Pay", "Stripe", "PayU", "Visa"];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const dateRange = (searchParams.get("dateRange") as DateRangeOption) || "this_week";
  const searchQuery = (searchParams.get("search") || "").toLowerCase().trim();
  const transactionStatus = (searchParams.get("status") as "All" | TransactionStatus) || "All";
  const revenuePeriod = (searchParams.get("revenuePeriod") as "weekly" | "monthly" | "yearly") || "monthly";
  const locationFilter = searchParams.get("location") || "All Locations";

  try {
    const dynamicVehicles: Vehicle[] = [];
    const dynamicTransactions: Transaction[] = [];
    let txCounter = 1001;

    for (let idx = 0; idx < POPULAR_MAKES.length; idx++) {
      const brand = POPULAR_MAKES[idx];
      try {
        const models = await getVehicleModels(brand, "2024");
        const topModels = models.slice(0, 2);

        topModels.forEach((m, mIdx) => {
          const modelName = m.Model_Name;
          const fullName = `${brand} ${modelName}`;
          const isSuv = modelName.toLowerCase().includes("suv") || modelName.toLowerCase().includes("x");
          const category = isSuv ? "Luxury SUV" : "Sedan";
          const dailyRate = Math.floor(180 + ((mIdx + idx) * 35) % 250);
          const bookingsCount = Math.floor(50 + ((mIdx + idx) * 123) % 400);
          const img = VEHICLE_IMAGES[(idx * 2 + mIdx) % VEHICLE_IMAGES.length];

          dynamicVehicles.push({
            id: `nhtsa-${m.Model_ID || `${brand}-${mIdx}`}`,
            name: fullName,
            brand: brand,
            category,
            dailyRate,
            bookingsCount,
            revenue: bookingsCount * dailyRate,
            image: img,
            status: (mIdx + idx) % 2 === 0 ? "Available" : "Rented",
            rating: Number((4.6 + ((idx + mIdx) % 4) * 0.1).toFixed(1)),
            modelYear: "2024",
            nhtsaSpecs: { manufacturer: brand, modelYear: "2024", bodyClass: category },
          });

          const txStatus: TransactionStatus = (txCounter % 5 === 0) ? "Cancelled" : (txCounter % 3 === 0) ? "Pending" : "Success";
          dynamicTransactions.push({
            id: `tx-${txCounter}`,
            bookingCode: `BK-${98400 + txCounter}`,
            vehicleName: fullName,
            vehicleCategory: category,
            vehicleImage: img,
            customerName: CUSTOMERS[txCounter % CUSTOMERS.length],
            timeAgo: `${(txCounter % 4) * 15 + 10} mins ago`,
            paymentMethod: PAYMENT_METHODS[txCounter % PAYMENT_METHODS.length],
            status: txStatus,
            amount: dailyRate,
            currency: "$",
            date: `2026-08-27 10:${(txCounter % 50).toString().padStart(2, '0')}`,
          });
          txCounter++;
        });
      } catch (err) {
        console.error(`Error fetching NHTSA models for ${brand}:`, err);
      }
    }

    // Fallback to static mock data if dynamic vehicles empty
    const vehiclesList = dynamicVehicles.length > 0 ? dynamicVehicles : MOCK_VEHICLES;
    const transactionsList = dynamicTransactions.length > 0 ? dynamicTransactions : MOCK_TRANSACTIONS;

    let filteredTx = transactionsList;
    if (transactionStatus !== "All") filteredTx = filteredTx.filter((t) => t.status === transactionStatus);
    if (searchQuery) {
      filteredTx = filteredTx.filter(
        (t) =>
          t.vehicleName.toLowerCase().includes(searchQuery) ||
          t.customerName.toLowerCase().includes(searchQuery) ||
          t.bookingCode.toLowerCase().includes(searchQuery)
      );
    }

    let filteredVehicles = vehiclesList;
    if (searchQuery) {
      filteredVehicles = filteredVehicles.filter(
        (v) =>
          v.name.toLowerCase().includes(searchQuery) ||
          v.brand.toLowerCase().includes(searchQuery) ||
          v.category.toLowerCase().includes(searchQuery)
      );
    }

    const responseData: DashboardApiResponse = {
      user: MOCK_USER,
      stats: {
        weeklyEarning: { amount: 95000.45, currency: "$", percentageChange: 48, isIncrease: true, comparisonText: "increase compared to last week" },
        totalSales: { count: 10000, label: "Total Rental Bookings", formattedCount: "10,000+", percentageChange: 24.5, isIncrease: true },
        activeRentals: { count: 800, label: "Active Rentals", formattedCount: "800+", availableVehicles: 340, utilizationRate: 70.2 },
      },
      revenueAnalytics: getRevenueAnalyticsForLocation(revenuePeriod, locationFilter),
      mostRentedVehicles: filteredVehicles,
      recentTransactions: filteredTx,
      locationsData: locationFilter && locationFilter !== "All Locations" ? MOCK_LOCATIONS.filter((l) => l.city === locationFilter) : MOCK_LOCATIONS,
      meta: {
        totalTransactions: filteredTx.length,
        filteredTransactionsCount: filteredTx.length,
        lastUpdated: new Date().toISOString(),
      },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Dashboard API Route Error, returning mock fallback:", error);
    return NextResponse.json(getDashboardData({
      dateRange,
      searchQuery,
      transactionStatus,
      revenuePeriod,
      locationFilter,
    }));
  }
}
