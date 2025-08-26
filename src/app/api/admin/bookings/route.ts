import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "catsitting");

    const { searchParams } = new URL(req.url);
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = parseInt(searchParams.get("limit") || "10", 10);

    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 10;
    const skip = (page - 1) * limit;

    const collection = db.collection("bookings");
    
    // Use Promise.all to run count and find operations in parallel for better performance
    const [totalCount, bookings] = await Promise.all([
      collection.countDocuments({}),
      collection
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray()
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    // Add cache headers to improve performance
    const response = NextResponse.json({ bookings, totalPages });
    response.headers.set('Cache-Control', 'private, max-age=30'); // Cache for 30 seconds

    return response;
  } catch (err) {
    console.error("❌ Error fetching admin bookings:", err);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
