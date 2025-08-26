import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Add debugging options
  debug: true,
  logger: true,
  // Add security options
  secure: true,
  tls: {
    rejectUnauthorized: false
  }
});

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  try {
    // Verify email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("❌ Email configuration missing: EMAIL_USER or EMAIL_PASS not set");
      throw new Error("Email configuration missing");
    }

    console.log(`📧 Attempting to send email to: ${to}`);
    console.log(`📧 From: ${process.env.EMAIL_USER}`);
    console.log(`📧 Subject: ${subject}`);

    const mailOptions = {
      from: `"Cat Sitting Service" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log("✅ Email sent successfully");
    console.log("📧 Message ID:", result.messageId);
    console.log("📧 Response:", result.response);
    
    return result;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    console.error("❌ Email details:", { to, subject, hasHtml: !!html });
    
    // Re-throw the error so calling code can handle it
    throw error;
  }
}
