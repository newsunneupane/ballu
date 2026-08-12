import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

// One-time migration for the item schema rework:
//   wastageGrams (absolute grams) -> wastagePercent (% of gold value)
// plus backfilling the new fields added alongside it (accessoriesCharge,
// viewCount, isAvailable, showPrice) so existing items keep pricing/behaving
// the same after the schema change deploys.
//
// Run once against the target DB with: npx tsx scripts/migrate-item-fields.ts

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ballu';

async function migrate() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.\n');

  const db = mongoose.connection.db;
  if (!db) throw new Error('No database connection');
  const items = db.collection('items');

  const cursor = items.find({});
  let migrated = 0;
  let skipped = 0;

  for await (const doc of cursor) {
    const update: Record<string, unknown> = {};
    const unset: Record<string, unknown> = {};

    if (doc.wastagePercent === undefined) {
      const wastageGrams = typeof doc.wastageGrams === 'number' ? doc.wastageGrams : 0;
      const weightGrams = typeof doc.weightGrams === 'number' && doc.weightGrams > 0 ? doc.weightGrams : 1;
      update.wastagePercent = Math.round((wastageGrams / weightGrams) * 100 * 100) / 100;
      unset.wastageGrams = '';
    }
    if (doc.accessoriesCharge === undefined) update.accessoriesCharge = 0;
    if (doc.viewCount === undefined) update.viewCount = 0;
    if (doc.isAvailable === undefined) update.isAvailable = true;
    if (doc.showPrice === undefined) update.showPrice = true;

    if (Object.keys(update).length === 0 && Object.keys(unset).length === 0) {
      skipped++;
      continue;
    }

    const ops: Record<string, unknown> = {};
    if (Object.keys(update).length) ops.$set = update;
    if (Object.keys(unset).length) ops.$unset = unset;

    await items.updateOne({ _id: doc._id }, ops);
    migrated++;
  }

  console.log(`Migrated ${migrated} item(s), skipped ${skipped} already-migrated item(s).`);

  await mongoose.disconnect();
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
