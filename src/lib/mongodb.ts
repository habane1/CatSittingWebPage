import { MongoClient } from "mongodb";

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

const options = {
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