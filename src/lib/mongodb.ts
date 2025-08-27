import { MongoClient } from "mongodb";

// Use the original URI without modifications
const uri = process.env.MONGODB_URI!;

const options = {
  // MongoDB Atlas options optimized for Vercel
  retryWrites: true,
  w: "majority" as const,
  // Longer timeouts for better reliability
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 30000,
  // Connection pool settings
  maxPoolSize: 1,
  minPoolSize: 0,
  maxIdleTimeMS: 30000,
  // Retry settings
  retryReads: true,
  // SSL settings for MongoDB Atlas
  tls: true,
  tlsAllowInvalidCertificates: false,
  // Authentication settings
  authSource: 'admin',
  authMechanism: 'SCRAM-SHA-1' as const,
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