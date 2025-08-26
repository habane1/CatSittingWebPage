import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Check if user is authenticated
    const adminAuth = req.headers.get('cookie')?.includes('admin_auth=true');
    
    if (!adminAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extend the session by updating the cookie
    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 6, // 6 hours
      path: "/",
    });
    
    return res;
  } catch (error) {
    console.error('Session refresh error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
