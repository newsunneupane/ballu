import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

// One-time backfill: give every item without `variants` a single default
// variant derived from its `weightGrams`, so the whole codebase can rely on
// `variants[0]` as the default weight/price.
//
// Run once with: npx tsx scripts/backfill-item-variants.ts

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ballu';

async function migrate() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.\n');

  const db = mongoose.connection.db;
  if (!db) throw new Error('No database connection');
  const items = db.collection('items');

  const cursor = items.find({
    $or: [{ variants: { $exists: false } }, { variants: { $size: 0 } }],
  });
  let migrated = 0;
  let skipped = 0;

  for await (const doc of cursor) {
    const weight = Number((doc as { weightGrams?: unknown }).weightGrams);
    if (!Number.isFinite(weight) || weight <= 0) {
      skipped++;
      continue;
    }
    const rounded = Math.round(weight * 1000) / 1000;
    await items.updateOne(
      { _id: (doc as { _id: unknown })._id },
      {
        $set: {
          variants: [
            { label: `${rounded}g`, weightGrams: weight, isAvailable: true },
          ],
        },
      }
    );
    migrated++;
  }

  console.log(`Backfilled ${migrated} item(s), skipped ${skipped}.`);

  await mongoose.disconnect();
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
