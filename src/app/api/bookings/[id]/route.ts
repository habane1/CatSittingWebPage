import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { sendEmail } from "@/lib/mailer";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "catsitting");

    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(id) });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("❌ Error fetching booking:", error);
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status, dates, notes } = await req.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "catsitting");

    // Get the current booking
    const currentBooking = await db.collection("bookings").findOne({ _id: new ObjectId(id) });
    const isStatusChangeToApproved =
      status && status === "approved" && currentBooking?.status !== "approved";

    const update: any = {};
    if (status) update.status = status;
    if (Array.isArray(dates)) update.dates = dates;
    if (typeof notes === "string") update.notes = notes;

    const result = await db
      .collection("bookings")
      .updateOne({ _id: new ObjectId(id) }, { $set: update });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Send approval email if status is changed to approved
    if (isStatusChangeToApproved && currentBooking) {
      // Email content - defined outside try block so catch can access it
      const emailSubject = "🎉 Your Cat Sitting Booking Has Been Approved!";
      
      try {
        // ✅ Call deposit API to get Stripe Checkout link
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        console.log(`🔗 Using base URL: ${baseUrl}`);
        
        console.log(`🔗 Calling deposit API at: ${baseUrl}/api/payments/deposit`);
        const depositRes = await fetch(
          `${baseUrl}/api/payments/deposit`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId: id }),
          }
        );
        
        if (!depositRes.ok) {
          throw new Error(`Deposit API failed: ${depositRes.status} ${depositRes.statusText}`);
        }
        
        const depositData = await depositRes.json();
        const depositUrl = depositData?.url;
        
        if (!depositUrl) {
          throw new Error('No deposit URL received from API');
        }
        
        console.log(`✅ Deposit URL received: ${depositUrl}`);

        const emailText = `Hi ${currentBooking.name},

Great news! Your cat sitting booking has been approved.

Booking Details:
- Service: Cat Sitting
- Dates: ${
          Array.isArray(currentBooking.dates) && currentBooking.dates.length > 0
            ? currentBooking.dates
                .map((d: string) => new Date(d).toLocaleDateString())
                .join(", ")
            : currentBooking.date
            ? new Date(currentBooking.date).toLocaleDateString()
            : "To be confirmed"
        }
- Notes: ${currentBooking.notes || "None"}

👉 Please complete your 50% deposit here to confirm your booking:
${depositUrl || "Link unavailable"}

Thank you for choosing our cat sitting service!

Best regards,
The Cat Sitting Team`;

        const emailHtml = `
          <div style="font-family: 'Inter', 'Nunito', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FDFBF7; padding: 20px; border-radius: 12px;">
            <!-- Header with Logo -->
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #E1D4C8;">
              <div style="background-color: #8A9A6B; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 24px; font-weight: bold;">🐱</div>
              <h1 style="color: #6B4C3B; font-family: 'Playfair Display', serif; font-size: 28px; margin: 0; font-weight: bold;">Cat Nanny Ottawa</h1>
            </div>
            
            <h2 style="color: #8A9A6B; font-family: 'Playfair Display', serif; font-size: 24px; margin-bottom: 20px; text-align: center;">🎉 Your Cat Sitting Booking Has Been Approved!</h2>
            
            <p style="color: #515151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hi ${currentBooking.name},</p>
            <p style="color: #515151; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Great news! Your cat sitting booking has been approved and we're excited to take care of your furry friend!</p>
            
            <div style="background-color: #F0EBE6; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #8A9A6B;">
              <h3 style="color: #6B4C3B; margin-top: 0; font-family: 'Playfair Display', serif; font-size: 20px; margin-bottom: 15px;">📋 Booking Details:</h3>
              <div style="color: #515151; font-size: 15px; line-height: 1.8;">
                <p style="margin: 8px 0;"><strong style="color: #6B4C3B;">Service:</strong> Cat Sitting</p>
                <p style="margin: 8px 0;"><strong style="color: #6B4C3B;">Dates:</strong> ${
                  Array.isArray(currentBooking.dates) && currentBooking.dates.length > 0
                    ? currentBooking.dates
                        .map((d: string) => new Date(d).toLocaleDateString())
                        .join(", ")
                    : currentBooking.date
                    ? new Date(currentBooking.date).toLocaleDateString()
                    : "To be confirmed"
                }</p>
                <p style="margin: 8px 0;"><strong style="color: #6B4C3B;">Notes:</strong> ${currentBooking.notes || "None"}</p>
              </div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #515151; font-size: 16px; margin-bottom: 20px;">👉 <strong>Please complete your 50% deposit to confirm your booking:</strong></p>
              <a href="${depositUrl}" style="background-color: #8A9A6B; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(138, 154, 107, 0.3);">Pay 50% Deposit</a>
            </div>
            
            <div style="background-color: #F7F8F4; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #DDE3D1;">
              <p style="color: #6F7D55; font-size: 14px; margin: 0; text-align: center;"><strong>⏰ Important:</strong> Please complete your deposit within 23 hours to secure your booking.</p>
            </div>
            
            <p style="color: #515151; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">Thank you for choosing Cat Nanny Ottawa for your cat sitting needs!</p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #E1D4C8;">
              <p style="color: #6B4C3B; font-family: 'Playfair Display', serif; font-size: 16px; margin: 0;"><strong>Best regards,<br>The Cat Nanny Ottawa Team</strong></p>
              <p style="color: #818181; font-size: 12px; margin-top: 10px;">🐱 Professional Cat Sitting Services in Ottawa</p>
            </div>
          </div>
        `;

        console.log(`📧 Sending approval email to: ${currentBooking.email}`);
        const emailResult = await sendEmail(currentBooking.email, emailSubject, emailText, emailHtml);
        console.log(`✅ Approval email sent successfully to ${currentBooking.email}`);
        
        // Also log the deposit URL for debugging
        console.log(`🔗 Deposit URL generated: ${depositUrl}`);
        
      } catch (emailError) {
        console.error("❌ Error sending approval email:", emailError);
        console.error("❌ Email error details:", {
          to: currentBooking.email,
          subject: emailSubject,
          error: emailError instanceof Error ? emailError.message : String(emailError)
        });
        
        // Don't fail the entire request, but log the error
        // You might want to send this to an error tracking service
      }
    }

    // Send cancellation email if status is changed to declined
    const isStatusChangeToDeclined = status && status === "declined" && currentBooking?.status !== "declined";
    if (isStatusChangeToDeclined && currentBooking) {
      const emailSubject = "❌ Your Cat Sitting Booking Has Been Declined";
      
      try {
        const emailText = `Hi ${currentBooking.name},

We regret to inform you that your cat sitting booking has been declined.

Booking Details:
- Service: Cat Sitting
- Dates: ${
          Array.isArray(currentBooking.dates) && currentBooking.dates.length > 0
            ? currentBooking.dates
                .map((d: string) => new Date(d).toLocaleDateString())
                .join(", ")
            : currentBooking.date
            ? new Date(currentBooking.date).toLocaleDateString()
            : "To be confirmed"
        }
- Notes: ${currentBooking.notes || "None"}

We apologize for any inconvenience this may cause. If you have any questions, please don't hesitate to contact us.

Best regards,
The Cat Sitting Team`;

        const emailHtml = `
          <div style="font-family: 'Inter', 'Nunito', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FDFBF7; padding: 20px; border-radius: 12px;">
            <!-- Header with Logo -->
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #E1D4C8;">
              <div style="background-color: #8A9A6B; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 24px; font-weight: bold;">🐱</div>
              <h1 style="color: #6B4C3B; font-family: 'Playfair Display', serif; font-size: 28px; margin: 0; font-weight: bold;">Cat Nanny Ottawa</h1>
            </div>
            
            <h2 style="color: #B0967A; font-family: 'Playfair Display', serif; font-size: 24px; margin-bottom: 20px; text-align: center;">❌ Your Cat Sitting Booking Has Been Declined</h2>
            
            <p style="color: #515151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hi ${currentBooking.name},</p>
            <p style="color: #515151; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">We regret to inform you that your cat sitting booking has been declined.</p>
            
            <div style="background-color: #F0EBE6; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #B0967A;">
              <h3 style="color: #6B4C3B; margin-top: 0; font-family: 'Playfair Display', serif; font-size: 20px; margin-bottom: 15px;">📋 Declined Booking Details:</h3>
              <div style="color: #515151; font-size: 15px; line-height: 1.8;">
                <p style="margin: 8px 0;"><strong style="color: #6B4C3B;">Service:</strong> Cat Sitting</p>
                <p style="margin: 8px 0;"><strong style="color: #6B4C3B;">Dates:</strong> ${
                  Array.isArray(currentBooking.dates) && currentBooking.dates.length > 0
                    ? currentBooking.dates
                        .map((d: string) => new Date(d).toLocaleDateString())
                        .join(", ")
                    : currentBooking.date
                    ? new Date(currentBooking.date).toLocaleDateString()
                    : "To be confirmed"
                }</p>
                <p style="margin: 8px 0;"><strong style="color: #6B4C3B;">Notes:</strong> ${currentBooking.notes || "None"}</p>
              </div>
            </div>

            <div style="background-color: #F7F8F4; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #DDE3D1;">
              <p style="color: #6F7D55; font-size: 16px; margin: 0; text-align: center;"><strong>❓ Have questions?</strong></p>
              <p style="color: #515151; font-size: 14px; margin: 10px 0 0 0; text-align: center;">Please don't hesitate to contact us if you have any questions about this decision.</p>
            </div>
            
            <p style="color: #515151; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">We apologize for any inconvenience this may cause and hope to serve you in the future.</p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #E1D4C8;">
              <p style="color: #6B4C3B; font-family: 'Playfair Display', serif; font-size: 16px; margin: 0;"><strong>Best regards,<br>The Cat Nanny Ottawa Team</strong></p>
              <p style="color: #818181; font-size: 12px; margin-top: 10px;">🐱 Professional Cat Sitting Services in Ottawa</p>
            </div>
          </div>
        `;

        console.log(`📧 Sending decline email to: ${currentBooking.email}`);
        const emailResult = await sendEmail(currentBooking.email, emailSubject, emailText, emailHtml);
        console.log(`✅ Decline email sent successfully to ${currentBooking.email}`);
        
      } catch (emailError) {
        console.error("❌ Error sending decline email:", emailError);
        console.error("❌ Email error details:", {
          to: currentBooking.email,
          subject: emailSubject,
          error: emailError instanceof Error ? emailError.message : String(emailError)
        });
        
        // Don't fail the entire request, but log the error
        // You might want to send this to an error tracking service
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error updating booking:", err);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "catsitting");

    const result = await db.collection("bookings").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error deleting booking:", err);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
