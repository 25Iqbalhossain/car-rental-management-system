import {
  DashboardApiResponse,
  DashboardFilter,
  LocationData,
  RevenueAnalyticsData,
  Transaction,
  Vehicle
} from "@/types/dashboard";

export const MOCK_USER = {
  name: "Mike Witzel",
  role: "Super Admin",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
};

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: "nhtsa-1685",
    name: "TESLA Model S",
    brand: "TESLA",
    category: "Sedan",
    dailyRate: 260,
    bookingsCount: 6547,
    revenue: 1702220,
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=400",
    status: "Rented",
    rating: 4.9,
    modelYear: "2024",
    nhtsaSpecs: {
      manufacturer: "TESLA",
      modelYear: "2024",
      bodyClass: "Sedan",
      fuelType: "Electric",
    },
  },
  {
    id: "nhtsa-7832",
    name: "PORSCHE 911",
    brand: "PORSCHE",
    category: "Sports Coupe",
    dailyRate: 340,
    bookingsCount: 3474,
    revenue: 1181160,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=400",
    status: "Available",
    rating: 4.8,
    modelYear: "2024",
    nhtsaSpecs: {
      manufacturer: "PORSCHE",
      modelYear: "2024",
      bodyClass: "Sports Coupe",
      fuelType: "Gasoline",
    },
  },
  {
    id: "nhtsa-1861",
    name: "HONDA Accord",
    brand: "HONDA",
    category: "Sedan",
    dailyRate: 185,
    bookingsCount: 1478,
    revenue: 273430,
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=400",
    status: "Rented",
    rating: 4.95,
    modelYear: "2024",
    nhtsaSpecs: {
      manufacturer: "HONDA",
      modelYear: "2024",
      bodyClass: "Sedan",
      fuelType: "Gasoline",
    },
  },
  {
    id: "nhtsa-1709",
    name: "BMW X5",
    brand: "BMW",
    category: "Luxury SUV",
    dailyRate: 290,
    bookingsCount: 987,
    revenue: 286230,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=400",
    status: "Available",
    rating: 4.6,
    modelYear: "2024",
    nhtsaSpecs: {
      manufacturer: "BMW",
      modelYear: "2024",
      bodyClass: "Luxury SUV",
      fuelType: "Gasoline",
    },
  },
  {
    id: "nhtsa-2144",
    name: "JAGUAR F-PACE",
    brand: "JAGUAR",
    category: "Luxury SUV",
    dailyRate: 275,
    bookingsCount: 784,
    revenue: 215600,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400",
    status: "Available",
    rating: 4.7,
    modelYear: "2024",
    nhtsaSpecs: {
      manufacturer: "JAGUAR",
      modelYear: "2024",
      bodyClass: "Luxury SUV",
      fuelType: "Gasoline",
    },
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1001",
    bookingCode: "BK-98421",
    vehicleName: "Range Rover",
    vehicleCategory: "Luxury SUV",
    vehicleImage: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=150",
    customerName: "Eleanor Vance",
    timeAgo: "15 mins ago",
    paymentMethod: "PayPal",
    status: "Success",
    amount: 260.00,
    currency: "£",
    date: "2026-08-27 10:45",
  },
  {
    id: "tx-1002",
    bookingCode: "BK-98420",
    vehicleName: "Red Toyota",
    vehicleCategory: "Sedan",
    vehicleImage: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=150",
    customerName: "Marcus Sterling",
    timeAgo: "15 mins ago",
    paymentMethod: "Apple Pay",
    status: "Pending",
    amount: 195.00,
    currency: "£",
    date: "2026-08-27 10:32",
  },
  {
    id: "tx-1003",
    bookingCode: "BK-98419",
    vehicleName: "Blue Nissan",
    vehicleCategory: "Sports Coupe",
    vehicleImage: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=150",
    customerName: "Sophia Chen",
    timeAgo: "15 mins ago",
    paymentMethod: "Stripe",
    status: "Success",
    amount: 8784.00,
    currency: "£",
    date: "2026-08-27 10:15",
  },
  {
    id: "tx-1004",
    bookingCode: "BK-98418",
    vehicleName: "Toyota Corolla",
    vehicleCategory: "Economy Sedan",
    vehicleImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=150",
    customerName: "David Miller",
    timeAgo: "15 mins ago",
    paymentMethod: "PayU",
    status: "Cancelled",
    amount: 3240.00,
    currency: "£",
    date: "2026-08-27 09:50",
  },
  {
    id: "tx-1005",
    bookingCode: "BK-98417",
    vehicleName: "Audi Q3",
    vehicleCategory: "Compact SUV",
    vehicleImage: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=150",
    customerName: "Charlotte Dubois",
    timeAgo: "1 hour ago",
    paymentMethod: "Visa",
    status: "Success",
    amount: 1474.00,
    currency: "£",
    date: "2026-08-27 08:40",
  }
];

export const MOCK_REVENUE_DATA: Record<"weekly" | "monthly" | "yearly", RevenueAnalyticsData> = {
  monthly: {
    period: "monthly",
    totalRevenue: 238000,
    growth: 14.8,
    data: [
      { label: "Jan", revenue: 24000, bookings: 420 },
      { label: "Feb", revenue: 30000, bookings: 510 },
      { label: "Mar", revenue: 17000, bookings: 330 },
      { label: "Apr", revenue: 21000, bookings: 390 },
      { label: "May", revenue: 20000, bookings: 380 },
      { label: "Jun", revenue: 29000, bookings: 490 },
      { label: "Jul", revenue: 23000, bookings: 410 },
      { label: "Aug", revenue: 19000, bookings: 350 },
      { label: "Sep", revenue: 25000, bookings: 440 },
    ],
  },
  weekly: {
    period: "weekly",
    totalRevenue: 9500.45,
    growth: 48.0,
    data: [
      { label: "Mon", revenue: 1120, bookings: 18 },
      { label: "Tue", revenue: 1350, bookings: 22 },
      { label: "Wed", revenue: 1080, bookings: 16 },
      { label: "Thu", revenue: 1450, bookings: 25 },
      { label: "Fri", revenue: 1890, bookings: 31 },
      { label: "Sat", revenue: 2100, bookings: 38 },
      { label: "Sun", revenue: 1510.45, bookings: 24 },
    ],
  },
  yearly: {
    period: "yearly",
    totalRevenue: 2840000,
    growth: 22.4,
    data: [
      { label: "2021", revenue: 1450000, bookings: 24000 },
      { label: "2022", revenue: 1890000, bookings: 31000 },
      { label: "2023", revenue: 2150000, bookings: 36000 },
      { label: "2024", revenue: 2480000, bookings: 41000 },
      { label: "2025", revenue: 2710000, bookings: 45000 },
      { label: "2026", revenue: 2840000, bookings: 48000 },
    ],
  },
};

export const MOCK_LOCATIONS: LocationData[] = [
  {
    id: "loc-1",
    city: "London",
    country: "United Kingdom",
    bookingsCount: 4250,
    percentage: 42.5,
    growth: 18.2,
    activeFleet: 340,
    popularVehicle: "Range Rover",
  },
  {
    id: "loc-2",
    city: "Manchester",
    country: "United Kingdom",
    bookingsCount: 2480,
    percentage: 24.8,
    growth: 12.4,
    activeFleet: 210,
    popularVehicle: "Audi Q3",
  },
  {
    id: "loc-3",
    city: "Birmingham",
    country: "United Kingdom",
    bookingsCount: 1650,
    percentage: 16.5,
    growth: 8.9,
    activeFleet: 145,
    popularVehicle: "Toyota Corolla",
  },
  {
    id: "loc-4",
    city: "Liverpool",
    country: "United Kingdom",
    bookingsCount: 920,
    percentage: 9.2,
    growth: -2.1,
    activeFleet: 85,
    popularVehicle: "Blue Nissan",
  },
  {
    id: "loc-5",
    city: "Leeds",
    country: "United Kingdom",
    bookingsCount: 700,
    percentage: 7.0,
    growth: 5.3,
    activeFleet: 60,
    popularVehicle: "Compact Car",
  },
];

export function getDashboardData(filters: DashboardFilter): DashboardApiResponse {
  const { dateRange, searchQuery, transactionStatus, revenuePeriod, locationFilter } = filters;

  let multiplier = 1;
  if (dateRange === "last_7_days") multiplier = 0.95;
  if (dateRange === "this_month") multiplier = 3.8;
  if (dateRange === "last_30_days") multiplier = 3.6;
  if (dateRange === "year_to_date") multiplier = 24.5;
  if (dateRange === "custom") multiplier = 1.25;

  const baseEarning = 9500.45 * (dateRange === "this_week" ? 1 : multiplier);
  const baseBookings = Math.round(10000 * (dateRange === "this_week" ? 1 : Math.sqrt(multiplier)));

  const stats = {
    weeklyEarning: {
      amount: Math.round(baseEarning * 100) / 100,
      currency: "£",
      percentageChange: 48,
      isIncrease: true,
      comparisonText: "increase compared to last week",
    },
    totalSales: {
      count: baseBookings,
      label: "Total Rental Bookings",
      formattedCount: "10,000+",
      percentageChange: 24.5,
      isIncrease: true,
    },
    activeRentals: {
      count: Math.round(800 * (dateRange === "this_week" ? 1 : 1.1)),
      label: "Active Rentals",
      formattedCount: "800+",
      availableVehicles: 340,
      utilizationRate: 70.2,
    },
  };

  let filteredTx = [...MOCK_TRANSACTIONS];

  if (transactionStatus !== "All") {
    filteredTx = filteredTx.filter((t) => t.status === transactionStatus);
  }

  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    filteredTx = filteredTx.filter(
      (t) =>
        t.vehicleName.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.bookingCode.toLowerCase().includes(q) ||
        t.paymentMethod.toLowerCase().includes(q) ||
        t.amount.toString().includes(q)
    );
  }

  let vehicles = [...MOCK_VEHICLES];
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    vehicles = vehicles.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q)
    );
  }

  let locations = [...MOCK_LOCATIONS];
  if (locationFilter && locationFilter !== "All Locations") {
    locations = locations.filter((loc) => loc.city === locationFilter);
  }

  const revenueAnalytics = MOCK_REVENUE_DATA[revenuePeriod] || MOCK_REVENUE_DATA.monthly;

  return {
    stats,
    mostRentedVehicles: vehicles,
    recentTransactions: filteredTx,
    revenueAnalytics,
    locationsData: locations,
    user: MOCK_USER,
    meta: {
      totalTransactions: MOCK_TRANSACTIONS.length,
      filteredTransactionsCount: filteredTx.length,
      lastUpdated: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    },
  };
}
