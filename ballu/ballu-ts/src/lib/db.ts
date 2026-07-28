import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis._mongooseCache || (globalThis._mongooseCache = { conn: null, promise: null });

export async function connectDB() {
  if (!MONGODB_URI) throw new Error('MONGODB_URI environment variable is not set');
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
