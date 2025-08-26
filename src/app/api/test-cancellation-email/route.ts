import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();
    
    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 });
    }

    const emailSubject = "❌ Your Cat Sitting Booking Has Been Cancelled";
    const emailText = `Hi ${name},

Unfortunately, your cat sitting booking has been automatically cancelled because the 50% deposit payment was not completed within the required 23-hour window.

Booking Details:
- Service: Cat Sitting
- Dates: To be confirmed
- Notes: None

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
        
        <p style="color: #515151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hi ${name},</p>
        <p style="color: #515151; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Unfortunately, your cat sitting booking has been automatically cancelled because the 50% deposit payment was not completed within the required 23-hour window.</p>
        
        <div style="background-color: #F0EBE6; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #B0967A;">
          <h3 style="color: #6B4C3B; margin-top: 0; font-family: 'Playfair Display', serif; font-size: 20px; margin-bottom: 15px;">📋 Cancelled Booking Details:</h3>
          <div style="color: #515151; font-size: 15px; line-height: 1.8;">
            <p style="margin: 8px 0;"><strong style="color: #6B4C3B;">Service:</strong> Cat Sitting</p>
            <p style="margin: 8px 0;"><strong style="color: #6B4C3B;">Dates:</strong> To be confirmed</p>
            <p style="margin: 8px 0;"><strong style="color: #6B4C3B;">Notes:</strong> None</p>
          </div>
        </div>

        <div style="background-color: #F7F8F4; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #DDE3D1;">
          <p style="color: #6F7D55; font-size: 16px; margin: 0; text-align: center;"><strong>🔄 Would you like to rebook?</strong></p>
          <p style="color: #515151; font-size: 14px; margin: 10px 0 0 0; text-align: center;">Please visit our website and submit a new booking request when you're ready.</p>
        </div>
        
        <p style="color: #515151; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">We apologize for any inconvenience this may cause and hope to serve you in the future.</p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #E1D4C8;">
          <p style="color: #6B4C3B; font-family: 'Playfair Display', serif; font-size: 16px; margin: 0;"><strong>Best regards,<br>The Cat Nanny Ottawa Team</strong></p>
          <p style="color: #818181; font-size: 12px; margin-top: 10px;">🐱 Professional Cat Sitting Services in Ottawa</p>
        </div>
      </div>
    `;

    console.log(`📧 Sending test cancellation email to: ${email}`);
    const result = await sendEmail(email, emailSubject, emailText, emailHtml);
    console.log(`✅ Test cancellation email sent successfully to ${email}`);

    return NextResponse.json({ 
      success: true, 
      message: `Test cancellation email sent to ${email}`,
      messageId: result.messageId 
    });

  } catch (error) {
    console.error("❌ Error sending test cancellation email:", error);
    return NextResponse.json({ 
      error: "Failed to send test email",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
