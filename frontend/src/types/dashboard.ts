export type TransactionStatus = "Success" | "Pending" | "Cancelled";
export type PaymentMethod = "PayPal" | "Apple Pay" | "Stripe" | "PayU" | "Visa" | "MasterCard";

export interface DashboardStats {
  weeklyEarning: {
    amount: number;
    currency: string;
    percentageChange: number;
    isIncrease: boolean;
    comparisonText: string;
  };
  totalSales: {
    count: number;
    label: string;
    formattedCount: string;
    percentageChange: number;
    isIncrease: boolean;
  };
  activeRentals: {
    count: number;
    label: string;
    formattedCount: string;
    availableVehicles: number;
    utilizationRate: number;
  };
}

export interface VehicleNhtsaSpecs {
  vin?: string;
  modelYear?: string;
  vehicleType?: string;
  bodyClass?: string;
  fuelType?: string;
  engineCylinders?: string;
  displacementL?: string;
  transmissionStyle?: string;
  driveType?: string;
  manufacturer?: string;
  plantCity?: string;
  plantCountry?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  category: string;
  dailyRate: number;
  bookingsCount: number;
  revenue: number;
  image: string;
  status: "Available" | "Rented" | "Maintenance";
  rating: number;
  modelYear?: string;
  nhtsaSpecs?: VehicleNhtsaSpecs;
}

export interface Transaction {
  id: string;
  bookingCode: string;
  vehicleName: string;
  vehicleCategory: string;
  vehicleImage: string;
  customerName: string;
  timeAgo: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  amount: number;
  currency: string;
  date: string;
}

export interface RevenuePoint {
  label: string;
  revenue: number;
  bookings: number;
  previousRevenue?: number;
}

export interface RevenueAnalyticsData {
  period: "weekly" | "monthly" | "yearly";
  data: RevenuePoint[];
  totalRevenue: number;
  growth: number;
}

export interface LocationData {
  id: string;
  city: string;
  country: string;
  bookingsCount: number;
  percentage: number;
  growth: number;
  activeFleet: number;
  popularVehicle: string;
}

export type DateRangeOption = "this_week" | "last_7_days" | "this_month" | "last_30_days" | "year_to_date" | "custom";

export interface DashboardFilter {
  dateRange: DateRangeOption;
  searchQuery: string;
  transactionStatus: "All" | TransactionStatus;
  revenuePeriod: "weekly" | "monthly" | "yearly";
  locationFilter: string;
}

export interface DashboardApiResponse {
  stats: DashboardStats;
  mostRentedVehicles: Vehicle[];
  recentTransactions: Transaction[];
  revenueAnalytics: RevenueAnalyticsData;
  locationsData: LocationData[];
  user: {
    name: string;
    role: string;
    avatar: string;
  };
  meta: {
    totalTransactions: number;
    filteredTransactionsCount: number;
    lastUpdated: string;
  };
}
