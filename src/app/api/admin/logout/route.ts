import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  
  // Clear the admin authentication cookies
  res.cookies.set("admin_auth", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // Expire immediately
    path: "/",
  });
  
  res.cookies.set("admin_auth_client", "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // Expire immediately
    path: "/",
  });
  
  return res;
}
