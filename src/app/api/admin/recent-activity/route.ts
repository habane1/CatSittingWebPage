import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "catsitting");

    // Get recent bookings (last 10)
    const recentBookings = await db
      .collection("bookings")
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    // Get recent messages (last 10)
    const recentMessages = await db
      .collection("messages")
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    // Combine and sort by timestamp
    const activities = [
      ...recentBookings.map((booking: any) => ({
        type: 'booking' as const,
        id: booking._id.toString(),
        title: getBookingActivityTitle(booking),
        description: getBookingActivityDescription(booking),
        timestamp: booking.createdAt,
        status: booking.status,
        name: booking.name,
        email: booking.email
      })),
      ...recentMessages.map((message: any) => ({
        type: 'message' as const,
        id: message._id.toString(),
        title: `New message from ${message.name}`,
        description: message.message.substring(0, 100) + (message.message.length > 100 ? '...' : ''),
        timestamp: message.createdAt,
        status: message.status,
        name: message.name,
        email: message.email
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 15); // Show only the 15 most recent activities

    return NextResponse.json({ activities });
  } catch (err) {
    console.error("Error fetching recent activity:", err);
    return NextResponse.json(
      { error: "Failed to fetch recent activity" },
      { status: 500 }
    );
  }
}

function getBookingActivityTitle(booking: any) {
  const service = booking.service || 'Cat sitting';
  const dates = Array.isArray(booking.dates) && booking.dates.length > 0
    ? booking.dates.map((d: string) => new Date(d).toLocaleDateString()).join(", ")
    : booking.date
    ? new Date(booking.date).toLocaleDateString()
    : "Date TBD";
  
  return `${booking.name} - ${service} for ${dates}`;
}

function getBookingActivityDescription(booking: any) {
  const catCount = booking.catCount || 1;
  const totalPrice = booking.totalPrice || 0;
  
  return `${catCount} cat${catCount > 1 ? 's' : ''} • $${totalPrice} • ${booking.status}`;
}
