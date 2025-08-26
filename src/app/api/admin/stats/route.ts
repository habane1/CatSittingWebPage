import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "catsitting");

    const messagesCount = await db.collection("messages").countDocuments();
    const totalBookings = await db.collection("bookings").countDocuments();
    const pendingBookings = await db
      .collection("bookings")
      .countDocuments({ status: "pending" });

    return NextResponse.json({
      messages: messagesCount,
      bookings: totalBookings,
      newBookings: pendingBookings,
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
