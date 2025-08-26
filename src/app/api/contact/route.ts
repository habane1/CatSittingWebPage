import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import clientPromise from "@/lib/mongodb";
import { messageSchema, createValidationError, createRateLimitError } from "@/lib/validation";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { rateLimitConfigs } from "@/lib/validation"; 

export async function POST(req: Request) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(req);
    const rateLimit = checkRateLimit(clientId, rateLimitConfigs.contact);
    
    if (!rateLimit.allowed) {
      return createRateLimitError();
    }

    const body = await req.json();
    
    // Input validation
    const validationResult = messageSchema.safeParse({
      name: body.name,
      email: body.email,
      subject: "Contact Form Message",
      message: body.message,
    });

    if (!validationResult.success) {
      return createValidationError(validationResult.error.errors[0].message);
    }

    const { name, email, message } = body;

    // --- Setup email transporter ---
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // --- Send email ---
    await transporter.sendMail({
        from: `"${name} via Cat Nanny Ottawa Website" <${process.env.EMAIL_USER}>`,
        replyTo: email,  // ensures replies go to the user
        to: process.env.EMAIL_USER,
        subject: `New message from ${name}`,
        text: `You received a new message from the contact form:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `
          <p>You received a new message from the contact form:</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong> ${message}</p>
        `,
      });      

    // --- Optionally save to MongoDB ---
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "catsitting");
    await db.collection("messages").insertOne({ name, email, message, date: new Date() });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 });
  }
}
