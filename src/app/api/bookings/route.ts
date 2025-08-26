import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { bookingSchema, validateDateRange, createValidationError, createRateLimitError } from "@/lib/validation";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { rateLimitConfigs } from "@/lib/validation";

// ✅ helper to normalize MM/DD/YYYY → Date
function normalizeDate(dateStr: string) {
  if (!dateStr) return null;
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [month, day, year] = parts;
    return new Date(
      `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    );
  }
  return new Date(dateStr); // fallback for already ISO dates
}

// Utility to expand booking dates into calendar events
function expandBookings(bookings: any[]) {
  return bookings.flatMap((booking) => {
    if (!Array.isArray(booking.dates) || booking.dates.length === 0) return [];

    // ✅ always use approved → green
    let color = "green";

    // Normalize all booking dates and sort them
    const sortedDates = booking.dates
      .map((d: string) => normalizeDate(d))
      .sort((a: Date | null, b: Date | null) => {
        if (!a || !b) return 0;
        return a.getTime() - b.getTime();
      });

    const events: any[] = [];
    let rangeStart = sortedDates[0];
    let prevDate = sortedDates[0];

    for (let i = 1; i <= sortedDates.length; i++) {
      const currDate = sortedDates[i];

      // If not consecutive (or at the end), close the current range
      if (!currDate || currDate.getTime() - prevDate.getTime() > 86400000) {
        if (rangeStart.getTime() === prevDate.getTime()) {
          // Single-day event → make it span until the next day (FullCalendar expects end to be exclusive)
          events.push({
            _id: booking._id.toString(),
            title: `${booking.name}`,
            start: rangeStart,
            end: new Date(rangeStart.getTime() + 86400000),
            allDay: true,
            client: booking.name,
            notes: booking.notes || "",
            status: booking.status,
            color,
          });
        } else {
          // Multi-day consecutive range
          events.push({
            _id: booking._id.toString(),
            title: `${booking.name}`,
            start: rangeStart,
            // end is exclusive, so add +1 day
            end: new Date(prevDate.getTime() + 86400000),
            allDay: true,
            client: booking.name,
            notes: booking.notes || "",
            status: booking.status,
            color,
          });
        }

        // Start a new range
        rangeStart = currDate;
      }

      prevDate = currDate;
    }

    return events;
  });
}

export async function POST(req: Request) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(req);
    const rateLimit = checkRateLimit(clientId, rateLimitConfigs.booking);
    
    if (!rateLimit.allowed) {
      return createRateLimitError();
    }

    const body = await req.json();
    
    // Input validation
    const validationResult = bookingSchema.safeParse({
      name: body.name,
      email: body.email,
      phone: body.phone,
      startDate: body.dates?.[0],
      endDate: body.dates?.[body.dates?.length - 1],
      service: body.service,
      notes: body.notes,
      address: body.address,
      numberOfCats: body.catCount,
      specialInstructions: body.instructions,
    });

    if (!validationResult.success) {
      return createValidationError(validationResult.error.errors[0].message);
    }

    const { name, email, phone, address, instructions, dates, notes, service, catCount, totalPrice } = body;

    if (!name || !email || !phone || !address || !Array.isArray(dates) || dates.length === 0 || !service || !catCount) {
      return createValidationError("Missing required fields");
    }

    // Date validation
    const dateValidation = validateDateRange(dates[0], dates[dates.length - 1]);
    if (!dateValidation.valid) {
      return createValidationError(dateValidation.error!);
    }

    // ✅ Prevent past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to midnight
    const normalizedDates = dates.map((d: string) => new Date(d));

    const hasPastDate = normalizedDates.some((d) => d < today);
    if (hasPastDate) {
      return createValidationError("Booking cannot include past dates");
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "catsitting");

    const newBooking = {
      name,
      email,
      phone,
      address,
      instructions: instructions || "",
      dates,
      notes: notes || "",
      service,
      catCount,
      totalPrice: totalPrice || 0,
      status: "pending",
      createdAt: new Date(),
    };

    const result = await db.collection("bookings").insertOne(newBooking);

    return NextResponse.json({ ...newBooking, _id: result.insertedId });
  } catch (err) {
    console.error("❌ Error creating booking:", err);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "catsitting");

    // ✅ only fetch approved
    const bookings = await db
      .collection("bookings")
      .find({ status: "approved" })
      .sort({ createdAt: -1 })
      .toArray();

    // Expand into calendar events
    const events = expandBookings(bookings);

    return NextResponse.json(events);
  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
