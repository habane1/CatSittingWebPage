import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log('📝 MONGODB_URI length:', process.env.MONGODB_URI?.length);
    console.log('📝 MONGODB_URI start:', process.env.MONGODB_URI?.substring(0, 30));
    
    const client = await clientPromise;
    console.log('✅ MongoDB client connected successfully');
    
    const db = client.db(process.env.MONGODB_DB || "catsitting");
    console.log('✅ Database accessed successfully');
    
    // Test a simple operation
    const collections = await db.listCollections().toArray();
    console.log('✅ Collections listed successfully:', collections.length, 'collections found');
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      collectionsCount: collections.length,
      databaseName: process.env.MONGODB_DB || "catsitting",
      mongoUriLength: process.env.MONGODB_URI?.length,
      mongoUriStart: process.env.MONGODB_URI?.substring(0, 30)
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      mongoUriLength: process.env.MONGODB_URI?.length,
      mongoUriStart: process.env.MONGODB_URI?.substring(0, 30),
      hasMongoUri: !!process.env.MONGODB_URI
    }, { status: 500 });
  }
}
