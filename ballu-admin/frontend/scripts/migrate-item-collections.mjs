import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

function loadUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
  for (const p of ['../.env.local', './.env.local', '../../.env', '../.env', '.env']) {
    try {
      const text = fs.readFileSync(path.resolve(p), 'utf8');
      const m = text.match(/MONGODB_URI\s*=\s*(.+)/);
      if (m) return m[1].trim();
    } catch {
      /* ignore */
    }
  }
  throw new Error('MONGODB_URI not found');
}

async function main() {
  const uri = loadUri();
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;

  const res = await db.collection('items').updateMany(
    { collection: { $exists: true, $ne: null }, $or: [{ collections: { $exists: false } }, { collections: { $size: 0 } }] },
    [{ $set: { collections: ['$collection'] } }]
  );
  console.log(`Copied legacy "collection" into "collections" for items (matched ${res.matchedCount}, modified ${res.modifiedCount})`);

  const missing = await db.collection('items').countDocuments({
    $and: [{ $or: [{ collections: { $exists: false } }, { collections: { $size: 0 } }] }, { $or: [{ collection: { $exists: false } }, { collection: null }] }],
  });
  if (missing > 0) {
    console.log(`WARN: ${missing} item(s) have no collection at all — assign one from the admin panel.`);
  }

  await mongoose.disconnect();
  console.log('DONE');
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
