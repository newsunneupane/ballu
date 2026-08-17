import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

// One-time migration for the material rate rework:
//   Material.rateNpr (per gram, NPR) backfilled from the latest
//   DailyRate.ratePerGramNrs for each material. Daily rates are being
//   retired — the material page now holds the single source of truth.
//
// Run once against the target DB with: npx tsx scripts/migrate-material-rates.ts

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ballu';

async function migrate() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.\n');

  const db = mongoose.connection.db;
  if (!db) throw new Error('No database connection');

  const materials = db.collection('materials');
  const dailyRates = db.collection('dailyrates');

  const cursor = materials.find({});
  let updated = 0;
  let alreadySet = 0;
  let noRate = 0;

  for await (const mat of cursor) {
    const id = mat._id;
    const rate = Number(mat.rateNpr) || 0;

    if (rate > 0) {
      alreadySet++;
      continue;
    }

    const latest = await dailyRates
      .find({ material: id })
      .sort({ date: -1 })
      .limit(1)
      .toArray();

    if (latest.length > 0 && Number(latest[0].ratePerGramNrs) > 0) {
      await materials.updateOne(
        { _id: id },
        { $set: { rateNpr: Number(latest[0].ratePerGramNrs) } }
      );
      updated++;
      console.log(`  Set rate for ${mat.name?.en || id}: ${latest[0].ratePerGramNrs}`);
    } else {
      noRate++;
      console.log(`  WARN: no daily rate found for ${mat.name?.en || id}`);
    }
  }

  console.log(`\nMigrated ${updated} material(s), ${alreadySet} already set, ${noRate} without a source rate.`);

  await mongoose.disconnect();
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});