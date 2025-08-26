import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { to, subject, message } = await req.json();
    
    if (!to || !subject || !message) {
      return NextResponse.json({ 
        error: "Missing required fields: to, subject, message" 
      }, { status: 400 });
    }

    console.log("🧪 Testing email configuration...");
    console.log("📧 To:", to);
    console.log("📧 Subject:", subject);
    console.log("📧 Message:", message);

    // Test email configuration
    const testEmail = await sendEmail(
      to,
      subject,
      message,
      `<div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>🧪 Test Email</h2>
        <p>This is a test email to verify your email configuration.</p>
        <p><strong>Message:</strong> ${message}</p>
        <p>If you received this, your email setup is working! 🎉</p>
      </div>`
    );

    return NextResponse.json({ 
      success: true, 
      message: "Test email sent successfully",
      messageId: testEmail.messageId 
    });

  } catch (error) {
    console.error("❌ Test email failed:", error);
    
    return NextResponse.json({ 
      error: "Failed to send test email",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function GET() {
  // Return email configuration status (without exposing sensitive data)
  const hasEmailUser = !!process.env.EMAIL_USER;
  const hasEmailPass = !!process.env.EMAIL_PASS;
  const hasMongoUri = !!process.env.MONGODB_URI;
  
  return NextResponse.json({
    emailConfigured: hasEmailUser && hasEmailPass,
    mongodbConfigured: hasMongoUri,
    emailUserSet: hasEmailUser,
    emailPassSet: hasEmailPass,
    message: hasEmailUser && hasEmailPass 
      ? "Email configuration appears complete" 
      : "Email configuration incomplete - check EMAIL_USER and EMAIL_PASS"
  });
}
