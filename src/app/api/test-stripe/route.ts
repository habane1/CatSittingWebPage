import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function GET() {
  try {
    // Create a simple test checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Test Payment",
            },
            unit_amount: 1000, // $10.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?test=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cancel?test=true`,
      metadata: {
        type: "test"
      },
    });

    return NextResponse.json({ 
      success: true, 
      url: session.url,
      sessionId: session.id 
    });

  } catch (error) {
    console.error("❌ Stripe test failed:", error);
    
    return NextResponse.json({ 
      error: "Failed to create test Stripe session",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
