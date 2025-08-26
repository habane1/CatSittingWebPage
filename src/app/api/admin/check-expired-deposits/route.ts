import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  // Protect route
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "catsitting");

    const now = new Date();
    const fortyEightHoursAgo = new Date(now.getTime() - (48 * 60 * 60 * 1000));

    // Find bookings with pending deposits that have expired
    console.log(`🔍 Checking for expired deposits at: ${now.toISOString()}`);
    
    const expiredBookings = await db.collection("bookings").find({
      status: "approved",
      "deposit.status": "pending",
      "deposit.deadline": { $lt: now }
    }).toArray();

    console.log(`📊 Found ${expiredBookings.length} expired bookings`);

    if (expiredBookings.length === 0) {
      console.log(`✅ No expired deposits found`);
      return NextResponse.json({ 
        message: "No expired deposits found",
        expiredCount: 0 
      });
    }

    const cancelledBookings = [];

    for (const booking of expiredBookings) {
      try {
        // Update booking status to cancelled
        await db.collection("bookings").updateOne(
          { _id: booking._id },
          { 
            $set: { 
              status: "cancelled",
              "deposit.status": "expired",
              cancelledAt: new Date()
            } 
          }
        );

        // Send cancellation email
        const emailSubject = "❌ Your Cat Sitting Booking Has Been Cancelled";
        const emailText = `Hi ${booking.name},

We regret to inform you that your cat sitting booking has been automatically cancelled because the deposit payment was not completed within the required timeframe.

Booking Details:
- Service: Cat Sitting
- Dates: ${
          Array.isArray(booking.dates) && booking.dates.length > 0
            ? booking.dates
                .map((d: string) => new Date(d).toLocaleDateString())
                .join(", ")
            : booking.date
            ? new Date(booking.date).toLocaleDateString()
            : "To be confirmed"
        }
- Notes: ${booking.notes || "None"}

If you would like to rebook, please visit our website and submit a new booking request.

We apologize for any inconvenience this may cause.

Best regards,
The Cat Sitting Team`;

        const emailHtml = `
          <div style="font-family: 'Inter', 'Nunito', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FDFBF7; padding: 20px; border-radius: 12px;">
            <!-- Header with Logo -->
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #E1D4C8;">
              <div style="background-color: #8A9A6B; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 24px; font-weight: bold;">🐱</div>
              <h1 style="color: #6B4C3B; font-family: 'Playfair Display', serif; font-size: 28px; margin: 0; font-weight: bold;">Cat Nanny Ottawa</h1>
            </div>
            
            <h2 style="color: #B0967A; font-family: 'Playfair Display', serif; font-size: 24px; margin-bottom: 20px; text-align: center;">❌ Your Cat Sitting Booking Has Been Cancelled</h2>
            
            <p style="color: #515151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hi ${booking.name},</p>
            <p style="color: #515151; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">We regret to inform you that your cat sitting booking has been automatically cancelled because the deposit payment was not completed within the required timeframe.</p>
            
            <div style="background-color: #F0EBE6; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #B0967A;">
              <h3 style="color: #6B4C3B; margin-top: 0; font-family: 'Playfair Display', serif; font-size: 20px; margin-bottom: 15px;">📋 Cancelled Booking Details:</h3>
              <div style="color: #515151; font-size: 15px; line-height: 1.8;">
                <p style="margin: 8px 0;"><strong style="color: #6B4C3B;">Service:</strong> Cat Sitting</p>
                <p style="margin: 8px 0;"><strong style="color: #6B4C3B;">Dates:</strong> ${
                  Array.isArray(booking.dates) && booking.dates.length > 0
                    ? booking.dates
                        .map((d: string) => new Date(d).toLocaleDateString())
                        .join(", ")
                    : booking.date
                    ? new Date(booking.date).toLocaleDateString()
                    : "To be confirmed"
                }</p>
                <p style="margin: 8px 0;"><strong style="color: #6B4C3B;">Notes:</strong> ${booking.notes || "None"}</p>
              </div>
            </div>

            <div style="background-color: #F7F8F4; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #DDE3D1;">
              <p style="color: #6F7D55; font-size: 16px; margin: 0; text-align: center;"><strong>🔄 Want to rebook?</strong></p>
              <p style="color: #515151; font-size: 14px; margin: 10px 0 0 0; text-align: center;">Please visit our website and submit a new booking request.</p>
            </div>
            
            <p style="color: #515151; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">We apologize for any inconvenience this may cause and hope to serve you in the future.</p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #E1D4C8;">
              <p style="color: #6B4C3B; font-family: 'Playfair Display', serif; font-size: 16px; margin: 0;"><strong>Best regards,<br>The Cat Nanny Ottawa Team</strong></p>
              <p style="color: #818181; font-size: 12px; margin-top: 10px;">🐱 Professional Cat Sitting Services in Ottawa</p>
            </div>
          </div>
        `;

        console.log(`📧 Sending cancellation email to: ${booking.email}`);
        const emailResult = await sendEmail(booking.email, emailSubject, emailText, emailHtml);
        console.log(`✅ Cancellation email sent successfully to ${booking.email}`);
        
        cancelledBookings.push({
          id: booking._id,
          name: booking.name,
          email: booking.email
        });
        
      } catch (error) {
        console.error(`❌ Error processing booking ${booking._id}:`, error);
      }
    }

    console.log(`✅ Successfully cancelled ${cancelledBookings.length} bookings`);

    return NextResponse.json({
      message: `Successfully cancelled ${cancelledBookings.length} expired bookings`,
      cancelledCount: cancelledBookings.length,
      cancelledBookings
    });

  } catch (error) {
    console.error("❌ Error checking expired deposits:", error);
    return NextResponse.json(
      { error: "Failed to check expired deposits" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  // Protect route
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "catsitting");

    const now = new Date();

    // Find bookings with pending deposits that have expired
    const expiredBookings = await db.collection("bookings").find({
      status: "approved",
      "deposit.status": "pending",
      "deposit.deadline": { $lt: now }
    }).toArray();

    return NextResponse.json({
      expiredCount: expiredBookings.length,
      expiredBookings: expiredBookings.map(booking => ({
        id: booking._id,
        name: booking.name,
        email: booking.email,
        deadline: booking.deposit.deadline
      }))
    });

  } catch (error) {
    console.error("❌ Error checking expired deposits:", error);
    return NextResponse.json(
      { error: "Failed to check expired deposits" },
      { status: 500 }
    );
  }
}
