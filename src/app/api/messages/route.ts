import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "catsitting");

    const totalMessages = await db.collection("messages").countDocuments();

    const messages = await db
      .collection("messages")
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalPages = Math.ceil(totalMessages / limit);

    return NextResponse.json({
      messages,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error("Error fetching messages:", err);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "catsitting");

    const message = {
      name: body.name,
      email: body.email,
      message: body.message,
      createdAt: new Date(),
      status: "unread",
    };

    const result = await db.collection("messages").insertOne(message);

    return NextResponse.json({
      success: true,
      message: { ...message, _id: result.insertedId },
    });
  } catch (err) {
    console.error("Error creating message:", err);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
