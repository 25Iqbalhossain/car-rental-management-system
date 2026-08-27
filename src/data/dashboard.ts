import { DashboardApiResponse, DashboardFilter } from "@/types/dashboard";
import { MOCK_USER, MOCK_REVENUE_DATA } from "./mockData";
import { LOCATIONS } from "./locations";
import { INITIAL_CUSTOMER_VEHICLES } from "./vehicles";
import { BOOKINGS_STORE, convertBookingsToTransactions } from "./bookings";

export function getSharedDashboardData(filters: DashboardFilter): DashboardApiResponse {
  const { dateRange, searchQuery, transactionStatus, revenuePeriod, locationFilter } = filters;

  const dynamicTx = convertBookingsToTransactions(BOOKINGS_STORE);

  let filteredTx = dynamicTx;
  if (transactionStatus !== "All") {
    filteredTx = filteredTx.filter((t) => t.status === transactionStatus);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredTx = filteredTx.filter(
      (t) =>
        t.vehicleName.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.bookingCode.toLowerCase().includes(q)
    );
  }

  let filteredVehicles = [...INITIAL_CUSTOMER_VEHICLES];
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredVehicles = filteredVehicles.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q)
    );
  }

  let locations = [...LOCATIONS];
  if (locationFilter && locationFilter !== "All Locations") {
    locations = locations.filter((loc) => loc.city === locationFilter);
  }

  return {
    user: MOCK_USER,
    stats: {
      weeklyEarning: {
        amount: 9500.45,
        currency: "£",
        percentageChange: 48,
        isIncrease: true,
        comparisonText: "increase compared to last week",
      },
      totalSales: {
        count: 10000,
        label: "Total Rental Bookings",
        formattedCount: "10,000+",
        percentageChange: 24.5,
        isIncrease: true,
      },
      activeRentals: {
        count: 800,
        label: "Active Rentals",
        formattedCount: "800+",
        availableVehicles: 340,
        utilizationRate: 70.2,
      },
    },
    revenueAnalytics: MOCK_REVENUE_DATA[revenuePeriod] || MOCK_REVENUE_DATA.monthly,
    mostRentedVehicles: filteredVehicles,
    recentTransactions: filteredTx,
    locationsData: locations,
    meta: {
      totalTransactions: filteredTx.length,
      filteredTransactionsCount: filteredTx.length,
      lastUpdated: new Date().toISOString(),
    },
  };
}
