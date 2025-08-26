import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json();
    
    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    console.log(`🧪 Testing webhook logic for booking: ${bookingId}`);

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "catsitting");

    // Find the booking
    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(bookingId) });
    
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    console.log(`📋 Found booking: ${booking.name} (${booking.email})`);
    console.log(`💰 Current deposit status: ${booking.deposit?.status || 'none'}`);

    // Simulate webhook logic - update deposit status to paid
    const result = await db.collection("bookings").updateOne(
      { _id: new ObjectId(bookingId) },
      { 
        $set: { 
          "deposit.status": "paid",
          "deposit.paidAt": new Date(),
          "deposit.stripePaymentIntentId": "test_webhook_manual_update"
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
    }

    // Fetch updated booking
    const updatedBooking = await db.collection("bookings").findOne({ _id: new ObjectId(bookingId) });

    console.log(`✅ Booking updated successfully`);
    console.log(`💰 New deposit status: ${updatedBooking?.deposit?.status}`);

    return NextResponse.json({ 
      success: true, 
      message: "Webhook logic tested successfully",
      booking: {
        id: updatedBooking?._id,
        name: updatedBooking?.name,
        email: updatedBooking?.email,
        depositStatus: updatedBooking?.deposit?.status,
        paidAt: updatedBooking?.deposit?.paidAt
      }
    });

  } catch (error) {
    console.error("❌ Test webhook failed:", error);
    
    return NextResponse.json({ 
      error: "Failed to test webhook logic",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: "Test webhook endpoint - use POST with bookingId to test webhook logic" 
  });
}
