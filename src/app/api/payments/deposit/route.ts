import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import Stripe from "stripe";
import { ObjectId } from "mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "catsitting");

    // ✅ Fetch booking details
    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(bookingId) });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // ✅ Calculate total cost = $25 × number of days
    const numDays = Array.isArray(booking.dates) ? booking.dates.length : 1;
    const totalAmount = numDays * 25;
    const depositAmount = totalAmount * 0.5; // 50% deposit

    console.log(`🔗 Creating Stripe checkout session for ${numDays} day(s), amount: $${depositAmount}`);
    
    // ✅ Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Cat Sitting Service (${numDays} day${numDays > 1 ? "s" : ""})`,
            },
            unit_amount: Math.round(depositAmount * 100), // cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?bookingId=${bookingId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel?bookingId=${bookingId}`,
      metadata: {
        bookingId: bookingId,
        type: "deposit"
      },
      expires_at: Math.floor(Date.now() / 1000) + (23 * 60 * 60), // 23 hours from now (Stripe max is 24 hours)
    });
    
    console.log(`✅ Stripe session created: ${session.id}`);
    console.log(`🔗 Checkout URL: ${session.url}`);

    // ✅ Save deposit info in booking
    const depositDeadline = new Date(Date.now() + (23 * 60 * 60 * 1000)); // 23 hours from now (matching Stripe)
    
    await db.collection("bookings").updateOne(
      { _id: booking._id },
      {
        $set: {
          deposit: {
            amount: depositAmount,
            total: totalAmount,
            currency: "USD",
            stripeSessionId: session.id,
            url: session.url,
            status: "pending",
            deadline: depositDeadline,
            createdAt: new Date(),
          },
        },
      }
    );

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("❌ Error creating deposit session:", err);
    return NextResponse.json({ error: "Failed to create deposit session" }, { status: 500 });
  }
}
