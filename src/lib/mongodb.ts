import { MongoClient } from "mongodb";

// Modify the URI for Vercel compatibility
let uri = process.env.MONGODB_URI!;
if (process.env.NODE_ENV === "production") {
  // Add SSL parameters to the connection string for Vercel
  if (!uri.includes('ssl=')) {
    uri += '&ssl=false&tls=false';
  }
}

const options = {
  // Simplified options for Vercel serverless compatibility
  retryWrites: true,
  w: "majority" as const,
  // Minimal timeouts for serverless
  connectTimeoutMS: 10000,
  socketTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
  // Minimal pool for serverless
  maxPoolSize: 1,
  minPoolSize: 0,
  maxIdleTimeMS: 5000,
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