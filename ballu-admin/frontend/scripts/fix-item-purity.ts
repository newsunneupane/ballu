import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

// One-time migration to repair the stale `purity` field on items.
//
// The item schema derives purity from its group, but many items carry a
// legacy `purity` string that doesn't match their actual group/material
// (e.g. a 24K-gold item labelled "925" or "950"). This made the admin
// "Piece of the Week" dropdown (and the homepage hero) show misleading
// purity values. This script sets `purity = group.name` for every item
// whose purity differs from its group.
//
// Dry run (no writes):
//   npx tsx scripts/fix-item-purity.ts --dry-run
// Apply:
//   npx tsx scripts/fix-item-purity.ts

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ballu';
const DRY_RUN = process.argv.includes('--dry-run');

async function migrate() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log(`Connected. (${DRY_RUN ? 'DRY RUN — no writes' : 'APPLYING changes'})\n`);

  const db = mongoose.connection.db;
  if (!db) throw new Error('No database connection');

  const items = db.collection('items');
  const groups = db.collection('groups');

  const allGroups = await groups.find({}).toArray();
  const groupNameById = new Map(allGroups.map((g) => [String(g._id), String(g.name).trim()]));

  const cursor = items.find({});
  let fixed = 0;
  let alreadyCorrect = 0;
  let missingGroup = 0;

  for await (const item of cursor) {
    const groupName = item.group ? groupNameById.get(String(item.group)) : undefined;
    if (!groupName) {
      missingGroup++;
      continue;
    }

    const current = item.purity != null ? String(item.purity).trim() : '';
    if (current.toUpperCase() === groupName.toUpperCase()) {
      alreadyCorrect++;
      continue;
    }

    console.log(
      `  ${DRY_RUN ? '[would fix]' : '[fixed]'} ${item.name?.en || item._id}: purity "${current || '(empty)'}" -> "${groupName}"`
    );

    if (!DRY_RUN) {
      await items.updateOne(
        { _id: item._id },
        { $set: { purity: groupName } }
      );
    }
    fixed++;
  }

  console.log(
    `\n${DRY_RUN ? 'Would fix' : 'Fixed'} ${fixed} item(s), ${alreadyCorrect} already correct, ${missingGroup} with no resolvable group.`
  );

  await mongoose.disconnect();
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});