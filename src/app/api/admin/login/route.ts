import { NextResponse } from "next/server";
import { adminLoginSchema, createValidationError, createRateLimitError } from "@/lib/validation";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { rateLimitConfigs } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(req);
    const rateLimit = checkRateLimit(clientId, rateLimitConfigs.admin);
    
    if (!rateLimit.allowed) {
      return createRateLimitError();
    }

    const body = await req.json();
    
    // Input validation
    const validationResult = adminLoginSchema.safeParse(body);
    if (!validationResult.success) {
      return createValidationError(validationResult.error.errors[0].message);
    }

    const { password } = body;

  if (password === process.env.ADMIN_PASSWORD) {
    const res = NextResponse.json({ success: true });
    
    // Set httpOnly cookie for server-side security
    res.cookies.set("admin_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 6, // 6 hours
      path: "/",
    });
    
    // Set non-httpOnly cookie for client-side checking
    res.cookies.set("admin_auth_client", "true", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 6, // 6 hours
      path: "/",
    });
    
    return res;
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
