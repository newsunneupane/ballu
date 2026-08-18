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

  const collections = (await db.listCollections().toArray()).map((c) => c.name);
  console.log('Existing collections:', collections.join(', ') || '(none)');

  if (collections.includes('categories')) {
    if (collections.includes('collections')) {
      console.log('WARN: "collections" already exists; skipping collection rename.');
    } else {
      await db.collection('categories').rename('collections');
      console.log('Renamed collection: categories -> collections');
    }
  } else {
    console.log('SKIP: collection "categories" not found (already renamed?).');
  }

  const targets = ['items', 'customrequests', 'storesettings'];
  for (const name of targets) {
    if (!collections.includes(name)) {
      console.log(`SKIP: collection "${name}" not found.`);
      continue;
    }
    const col = db.collection(name);
    const res = await col.updateMany({}, { $rename: { category: 'collection' } });
    console.log(`Renamed field category -> collection in "${name}" (matched ${res.matchedCount}, modified ${res.modifiedCount})`);

    if (name === 'storesettings') {
      const res2 = await col.updateMany(
        { 'pieceOfTheWeek.category': { $exists: true } },
        { $rename: { 'pieceOfTheWeek.category': 'pieceOfTheWeek.collection' } }
      );
      console.log(`Renamed pieceOfTheWeek.category -> pieceOfTheWeek.collection in "storesettings" (matched ${res2.matchedCount}, modified ${res2.modifiedCount})`);
    }
  }

  const after = (await db.listCollections().toArray()).map((c) => c.name);
  console.log('After:', after.join(', ') || '(none)');

  await mongoose.disconnect();
  console.log('DONE');
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});