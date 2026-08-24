import mongoose from 'mongoose';

// Register all models so Mongoose knows about them for populate()
import './models/User';
import './models/StoreSettings';
import './models/Material';
import './models/ItemInquiry';
import './models/Item';
import './models/Group';
import './models/CustomRequest';
import './models/Collection';
import './models/Occasion';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ballu';

let cached = globalThis._mongooseCache as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;

if (!cached) {
  cached = globalThis._mongooseCache = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached!.conn) return cached!.conn;
  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
  }
  cached!.conn = await cached!.promise;
  return cached!.conn;
}
