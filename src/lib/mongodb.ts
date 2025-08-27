import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {
  // MongoDB Atlas specific options for Vercel serverless
  tls: true,
  tlsAllowInvalidCertificates: true, // Allow invalid certificates for Vercel
  retryWrites: true,
  w: "majority" as const,
  // Connection timeouts (shorter for serverless)
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  // Pool settings (optimized for serverless)
  maxPoolSize: 1, // Reduced for serverless
  minPoolSize: 0, // Start with 0 for serverless
  maxIdleTimeMS: 10000, // Shorter idle time
  // Retry settings
  retryReads: true,
  serverSelectionTimeoutMS: 15000, // Shorter timeout
  // Additional SSL options for Vercel
  ssl: true,
};

let client;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // In dev mode, use a global variable so it's not recreated on hot reloads
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;