import { Transaction } from "@/types/dashboard";

export interface BookingRecord {
  id: string;
  bookingCode: string;
  vehicleId: string;
  vehicleName: string;
  vehicleCategory: string;
  vehicleImage: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffLocation: string;
  dropoffDate: string;
  dropoffTime: string;
  totalDays: number;
  totalAmount: number;
  paymentMethod: string;
  status: "Success" | "Pending" | "Cancelled";
  createdAt: string;
}

export const BOOKINGS_STORE: BookingRecord[] = [
  {
    id: "bk-1001",
    bookingCode: "BK-98421",
    vehicleId: "car-001",
    vehicleName: "TESLA Model S",
    vehicleCategory: "Sedan",
    vehicleImage: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=150",
    customerName: "Eleanor Vance",
    customerEmail: "eleanor@example.com",
    customerPhone: "+44 7700 900077",
    pickupLocation: "London Heathrow Airport",
    pickupDate: "2026-08-28",
    pickupTime: "10:00",
    dropoffLocation: "London Heathrow Airport",
    dropoffDate: "2026-08-31",
    dropoffTime: "10:00",
    totalDays: 3,
    totalAmount: 780.0,
    paymentMethod: "PayPal",
    status: "Success",
    createdAt: "2026-08-27 10:45",
  },
  {
    id: "bk-1002",
    bookingCode: "BK-98420",
    vehicleId: "car-006",
    vehicleName: "TOYOTA Corolla Hybrid",
    vehicleCategory: "Economy",
    vehicleImage: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=150",
    customerName: "Marcus Sterling",
    customerEmail: "marcus@example.com",
    customerPhone: "+44 7700 900123",
    pickupLocation: "Manchester Airport",
    pickupDate: "2026-08-29",
    pickupTime: "12:00",
    dropoffLocation: "Manchester Airport",
    dropoffDate: "2026-09-02",
    dropoffTime: "12:00",
    totalDays: 4,
    totalAmount: 180.0,
    paymentMethod: "Apple Pay",
    status: "Pending",
    createdAt: "2026-08-27 10:32",
  },
];

export function convertBookingsToTransactions(bookings: BookingRecord[]): Transaction[] {
  return bookings.map((b) => ({
    id: `tx-${b.id}`,
    bookingCode: b.bookingCode,
    vehicleName: b.vehicleName,
    vehicleCategory: b.vehicleCategory,
    vehicleImage: b.vehicleImage,
    customerName: b.customerName,
    timeAgo: "Just now",
    paymentMethod: (b.paymentMethod as any) || "Stripe",
    status: b.status,
    amount: b.totalAmount,
    currency: "£",
    date: b.createdAt,
  }));
}
