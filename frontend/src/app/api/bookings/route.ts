import { NextRequest, NextResponse } from "next/server";
import { BOOKINGS_STORE, BookingRecord } from "@/data/bookings";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    total: BOOKINGS_STORE.length,
    bookings: BOOKINGS_STORE,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      vehicleId,
      vehicleName,
      vehicleCategory,
      vehicleImage,
      customerName,
      customerEmail,
      customerPhone,
      pickupLocation,
      pickupDate,
      pickupTime,
      dropoffLocation,
      dropoffDate,
      dropoffTime,
      totalDays,
      totalAmount,
      paymentMethod,
    } = body;

    if (!vehicleName || !customerName || !pickupDate || !dropoffDate) {
      return NextResponse.json(
        { error: "Missing required booking details (vehicle, customer name, dates)" },
        { status: 400 }
      );
    }

    const newBooking: BookingRecord = {
      id: `bk-${Date.now()}`,
      bookingCode: `BK-${Math.floor(10000 + Math.random() * 90000)}`,
      vehicleId: vehicleId || "car-001",
      vehicleName,
      vehicleCategory: vehicleCategory || "Sedan",
      vehicleImage: vehicleImage || "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=150",
      customerName,
      customerEmail: customerEmail || "guest@example.com",
      customerPhone: customerPhone || "+44 7700 900000",
      pickupLocation: pickupLocation || "London Heathrow",
      pickupDate,
      pickupTime: pickupTime || "10:00",
      dropoffLocation: dropoffLocation || "London Heathrow",
      dropoffDate,
      dropoffTime: dropoffTime || "10:00",
      totalDays: totalDays || 1,
      totalAmount: totalAmount || 100,
      paymentMethod: paymentMethod || "Stripe",
      status: "Success",
      createdAt: new Date().toISOString(),
    };

    BOOKINGS_STORE.unshift(newBooking);

    // Call automation webhook internally
    try {
      const baseUrl = request.nextUrl.origin;
      await fetch(`${baseUrl}/api/webhooks/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "booking.created",
          data: newBooking,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (whErr) {
      console.warn("Automation webhook notification warning:", whErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Booking confirmed successfully",
        booking: newBooking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking API Error:", error);
    return NextResponse.json({ error: "Failed to process booking" }, { status: 500 });
  }
}
