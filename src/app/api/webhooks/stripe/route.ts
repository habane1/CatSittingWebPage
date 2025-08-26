import { NextResponse } from "next/server";
import Stripe from "stripe";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: Request) {
  try {
    console.log("🔔 Webhook received!");
    
    const sig = req.headers.get("stripe-signature");
    const rawBody = await req.text();

    console.log("📝 Raw webhook body length:", rawBody.length);

    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET! // 👈 set this in your .env
    );

    console.log("🎯 Webhook event type:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log("💳 Checkout session completed!");
      console.log("🔍 Session metadata:", session.metadata);
      console.log("🔍 Session ID:", session.id);

      // Extract bookingId from metadata (more reliable than parsing URL)
      const bookingId = session.metadata?.bookingId;
      
      if (bookingId) {
        console.log("✅ Found bookingId in metadata:", bookingId);
        
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || "catsitting");

        // First, let's check if the booking exists
        const existingBooking = await db.collection("bookings").findOne({ _id: new ObjectId(bookingId) });
        console.log("📋 Existing booking found:", existingBooking ? "YES" : "NO");
        if (existingBooking) {
          console.log("📋 Booking details:", {
            name: existingBooking.name,
            email: existingBooking.email,
            currentDepositStatus: existingBooking.deposit?.status
          });
        }

        const result = await db.collection("bookings").updateOne(
          { _id: new ObjectId(bookingId) },
          { 
            $set: { 
              "deposit.status": "paid",
              "deposit.paidAt": new Date(),
              "deposit.stripePaymentIntentId": session.payment_intent as string
            } 
          }
        );

        console.log("💾 Database update result:", {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount
        });

        // Verify the update worked
        const updatedBooking = await db.collection("bookings").findOne({ _id: new ObjectId(bookingId) });
        console.log("✅ Updated booking deposit status:", updatedBooking?.deposit?.status);
        
      } else {
        console.log("❌ No bookingId found in session metadata!");
        console.log("🔍 Full session object:", JSON.stringify(session, null, 2));
      }
    }

    console.log("✅ Webhook processed successfully");
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Stripe webhook error:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }
}
