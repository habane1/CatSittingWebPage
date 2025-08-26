import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // In dev mode, use a global variable so it's not recreated on hot reloads
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, {
      serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
      },
    });
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri, {
    serverApi: {
      version: "1",
      strict: true,
      deprecationErrors: true,
    },
  });
  clientPromise = client.connect();
}

export default clientPromise;