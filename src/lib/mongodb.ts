import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {
  // MongoDB Atlas specific options
  tls: true,
  tlsAllowInvalidCertificates: false,
  retryWrites: true,
  w: "majority" as const,
  // Connection timeouts
  connectTimeoutMS: 60000,
  socketTimeoutMS: 60000,
  // Pool settings
  maxPoolSize: 5,
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
  // Retry settings
  retryReads: true,
  serverSelectionTimeoutMS: 30000,
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