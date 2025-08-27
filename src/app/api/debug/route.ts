import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasMongoUri: !!process.env.MONGODB_URI,
    mongoUriLength: process.env.MONGODB_URI?.length,
    mongoUriStart: process.env.MONGODB_URI?.substring(0, 30),
    mongoUriEnd: process.env.MONGODB_URI?.substring(-20),
    allEnvVars: Object.keys(process.env).filter(key => 
      key.includes('MONGODB') || 
      key.includes('EMAIL') || 
      key.includes('STRIPE') || 
      key.includes('NEXT_PUBLIC')
    )
  };

  try {
    console.log('🔍 Starting MongoDB connection test...');
    console.log('📝 MONGODB_URI:', process.env.MONGODB_URI?.substring(0, 50) + '...');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }

    // Modify URI for Vercel serverless compatibility
    let uri = process.env.MONGODB_URI!;
    if (process.env.NODE_ENV === "production") {
      // For Vercel, we need to disable SSL in the connection string
      if (!uri.includes('ssl=')) {
        uri += '&ssl=false';
      }
      if (!uri.includes('tls=')) {
        uri += '&tls=false';
      }
    }

    const client = new MongoClient(uri, {
      // Minimal options for Vercel serverless
      retryWrites: true,
      w: "majority" as const,
      // Short timeouts for serverless
      connectTimeoutMS: 15000,
      socketTimeoutMS: 15000,
      serverSelectionTimeoutMS: 15000,
      // Minimal pool for serverless
      maxPoolSize: 1,
      minPoolSize: 0,
      maxIdleTimeMS: 10000,
      // Disable SSL/TLS for Vercel
      tls: false,
      ssl: false,
    });

    console.log('🔌 Attempting to connect to MongoDB...');
    await client.connect();
    console.log('✅ MongoDB client connected successfully');
    
    const db = client.db(process.env.MONGODB_DB || "catsitting");
    console.log('✅ Database accessed successfully');
    
    // Test listing collections
    const collections = await db.listCollections().toArray();
    console.log('✅ Collections listed successfully:', collections.length, 'collections found');
    
    // Test a simple query to bookings collection
    const bookingsCollection = db.collection("bookings");
    const bookingsCount = await bookingsCollection.countDocuments();
    console.log('✅ Bookings count:', bookingsCount);
    
    // Get a sample booking
    const sampleBooking = await bookingsCollection.findOne();
    console.log('✅ Sample booking found:', !!sampleBooking);
    
    await client.close();
    console.log('✅ Connection closed successfully');

    return NextResponse.json({
      success: true,
      message: 'MongoDB connection and queries successful',
      debugInfo,
      collectionsCount: collections.length,
      bookingsCount,
      hasSampleBooking: !!sampleBooking,
      databaseName: process.env.MONGODB_DB || "catsitting"
    });
    
  } catch (error) {
    console.error('❌ MongoDB debug test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
      debugInfo
    }, { status: 500 });
  }
}
