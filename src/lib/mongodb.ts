import { MongoClient } from "mongodb";

// Use the original URI without modifications
const uri = process.env.MONGODB_URI!;

const options = {
  // MongoDB Atlas options with Vercel-compatible SSL settings
  retryWrites: true,
  w: "majority" as const,
  // Timeouts for serverless
  connectTimeoutMS: 20000,
  socketTimeoutMS: 20000,
  serverSelectionTimeoutMS: 20000,
  // Connection pool for serverless
  maxPoolSize: 1,
  minPoolSize: 0,
  maxIdleTimeMS: 15000,
  // SSL settings that work with Vercel
  tls: true,
  tlsAllowInvalidCertificates: true, // Allow invalid certificates
  tlsAllowInvalidHostnames: true, // Allow invalid hostnames
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