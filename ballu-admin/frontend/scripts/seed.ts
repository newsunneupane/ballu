import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Full reset + reseed for the new data format (Material -> Group -> Item):
//   - Deletes older-format data: items, groups, materials, categories, dailyrates.
//   - Seeds admin user, materials (with rates), groups, categories and sample
//     items (each linked to a group; material is derived from the group).
//
// Run once against the target DB with: npx tsx scripts/seed.ts

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ballu';

const ITEM_NAMES = [
  { en: 'Chandra Haar', np: 'चन्द्र हार' },
  { en: 'Surya Kantha', np: 'सूर्य कण्ठ' },
  { en: 'Malla Ring', np: 'मल्ल औंठी' },
  { en: 'Kumudini Earrings', np: 'कुमुदिनी झुम्का' },
  { en: 'Pashupati Pendant', np: 'पशुपति लकेट' },
  { en: 'Gurkha Bracelet', np: 'गोरखा ब्रेसलेट' },
  { en: 'Himali Chain', np: 'हिमाली चेन' },
  { en: 'Annapurna Earrings', np: 'अन्नपूर्णा झुम्का' },
  { en: 'Lumbini Pendant', np: 'लुम्बिनी लकेट' },
  { en: 'Bhairav Necklace', np: 'भैरव हार' },
  { en: 'Indreni Bracelet', np: 'इन्द्रेणी ब्रेसलेट' },
  { en: 'Siddhartha Ring', np: 'सिद्धार्थ औंठी' },
  { en: 'Ganesh Pendant', np: 'गणेश लकेट' },
  { en: 'Naga Ring', np: 'नाग औंठी' },
  { en: 'Potala Earrings', np: 'पोटाला झुम्का' },
  { en: 'Mandala Necklace', np: 'मण्डला हार' },
  { en: 'Yakshi Bracelet', np: 'यक्षिणी ब्रेसलेट' },
  { en: 'Kirat Ring', np: 'किरात औंठी' },
  { en: 'Shivali Pendant', np: 'शिवाली लकेट' },
  { en: 'Sagarmatha Chain', np: 'सगरमाथा चेन' },
  { en: 'Gurkha Dagger Pendant', np: 'गोरखा खुकुरी लकेट' },
  { en: 'Lakshmi Necklace', np: 'लक्ष्मी हार' },
  { en: 'Shree Earrings', np: 'श्री झुम्का' },
  { en: 'Bindabasini Ring', np: 'बिन्दबासिनी औंठी' },
  { en: 'Patan Bracelet', np: 'पाटन ब्रेसलेट' },
  { en: 'Khumaltar Chain', np: 'खुमलटार चेन' },
  { en: 'Dharahara Pendant', np: 'धरहरा लकेट' },
  { en: 'Basantapur Ring', np: 'बसन्तपुर औंठी' },
  { en: 'Hanuman Earrings', np: 'हनुमान झुम्का' },
  { en: 'Taleju Necklace', np: 'तलेजु हार' },
  { en: 'Nyatapola Pendant', np: 'न्यातपोला लकेट' },
  { en: 'Phewa Bracelet', np: 'फेवा ब्रेसलेट' },
  { en: 'Fewa Ring', np: 'फेवा औंठी' },
  { en: 'Muktinath Chain', np: 'मुक्तिनाथ चेन' },
  { en: 'Gosainkunda Earrings', np: 'गोसाइँकुण्ड झुम्का' },
  { en: 'Rara Necklace', np: 'रारा हार' },
  { en: 'Tilicho Pendant', np: 'तिलिचो लकेट' },
  { en: 'Api Ring', np: 'अपी औंठी' },
  { en: 'Khaptad Bracelet', np: 'खप्तड ब्रेसलेट' },
  { en: 'Shey Chain', np: 'शे चेन' },
];

const PURITIES = ['18K', '22K', '24K', '925', '950', '999'];
const TAGS = ['new-arrival', 'best-seller', 'limited-edition', 'sale', 'bestseller', 'trending'];
const KARIGARS = ['Rajesh Shakya', 'Prakash Maharjan', 'Suman Tamrakar', 'Bikram Shrestha', 'Anil Nakarmi', 'Deepak Prajapati', 'Mohan Singh', 'Kumar Thapa'];

function rand(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.\n');

  const db = mongoose.connection.db;
  if (!db) throw new Error('No database connection');

  // --- Clear older-format data ---
  const cleared: string[] = [];
  for (const name of ['items', 'groups', 'materials', 'categories', 'dailyrates']) {
    const res = await db.collection(name).deleteMany({});
    cleared.push(`${name}: ${res.deletedCount}`);
  }
  console.log('Cleared older-format data:');
  cleared.forEach((c) => console.log(`  ✗ ${c}`));

  // Drop stale unique indexes left behind by older schemas (e.g. group name
  // used to be an {en, np} subdocument -> material_1_name.en_1).
  for (const colName of ['groups', 'items']) {
    const col = db.collection(colName);
    const indexes = await col.indexes();
    for (const idx of indexes) {
      if (idx.name === '_id_') continue;
      const keys = Object.keys(idx.key);
      if (keys.some((k) => k.includes('.en') || k.includes('.np'))) {
        await col.dropIndex(idx.name);
        console.log(`  ✗ Dropped stale index ${idx.name} on ${colName}`);
      }
    }
  }
  console.log('');

  const created: string[] = [];

  // --- User ---
  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model('User', userSchema);

  const email = 'admin@ballu.com';
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    const hashed = await bcrypt.hash('admin123', 12);
    await User.create({ email, password: hashed, name: 'Admin' });
    created.push('Admin user: admin@ballu.com / admin123');
  } else {
    created.push('Admin user already exists: admin@ballu.com');
  }

  // --- Materials (with rates) ---
  const materialSchema = new mongoose.Schema({
    name: { en: String, np: String },
    rateNpr: { type: Number, default: 0 },
  }, { timestamps: true });
  const Material = mongoose.models.Material || mongoose.model('Material', materialSchema);

  const materialData = [
    { en: 'Gold', np: 'सुन', rateNpr: 14500 },
    { en: 'Silver', np: 'चाँदी', rateNpr: 220 },
    { en: 'Platinum', np: 'प्लेटिनम', rateNpr: 38000 },
    { en: 'Diamond', np: 'हीरा', rateNpr: 2000 },
  ];
  const materialIds: Record<string, string> = {};
  for (const m of materialData) {
    const mat = await Material.create({ name: { en: m.en, np: m.np }, rateNpr: m.rateNpr });
    materialIds[m.en] = mat._id.toString();
    created.push(`Material: ${m.en} (${m.rateNpr} NPR/g)`);
  }

  // --- Groups ---
  const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
  }, { timestamps: true });
  const Group = mongoose.models.Group || mongoose.model('Group', groupSchema);

  const groupNames: Record<string, string[]> = {
    Gold: ['22K', '24K'],
    Silver: ['925', '950'],
    Platinum: ['950'],
    Diamond: ['VS', 'VVS'],
  };
  const materialGroups: Record<string, string[]> = {};
  for (const m of materialData) {
    const ids: string[] = [];
    for (const gname of groupNames[m.en] || ['Standard']) {
      const g = await Group.create({ material: materialIds[m.en], name: gname });
      ids.push(g._id.toString());
      created.push(`Group: ${m.en} ${gname}`);
    }
    materialGroups[m.en] = ids;
  }

  // --- Categories ---
  const categorySchema = new mongoose.Schema({
    name: { en: String, np: String },
    description: String,
  }, { timestamps: true });
  const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

  const categoryData = [
    { en: 'Bridal', np: 'वैवाहिक', desc: 'Bridal jewellery collection' },
    { en: 'Festive', np: 'पर्व', desc: 'Festive season collection' },
    { en: 'Daily Wear', np: 'दैनिक', desc: 'Everyday essentials' },
    { en: 'Engagement', np: 'सगाई', desc: 'Engagement rings and sets' },
    { en: 'Office', np: 'कार्यालय', desc: 'Office-appropriate designs' },
    { en: 'Gift', np: 'उपहार', desc: 'Gifting collection' },
    { en: 'Others', np: 'अन्य', desc: 'Other jewellery designs' },
  ];
  const categoryIds: Record<string, string> = {};
  for (const c of categoryData) {
    const cat = await Category.create({ name: { en: c.en, np: c.np }, description: c.desc });
    categoryIds[c.en] = cat._id.toString();
    created.push(`Category: ${c.en}`);
  }

  // --- Items (linked to groups) ---
  const itemSchema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    name: { en: String, np: String },
    description: String,
    tag: String,
    purity: String,
    weightGrams: Number,
    wastagePercent: { type: Number, default: 0 },
    makingCharges: { type: Number, default: 0 },
    accessoriesCharge: { type: Number, default: 0 },
    boutiqueDeduction: { type: Number, default: 0 },
    diamondValue: { type: Number, default: 0 },
    caratWeight: Number,
    stonesDetails: String,
    karigarName: String,
    images: { type: [String], default: [] },
    isAvailable: { type: Boolean, default: true },
    showPrice: { type: Boolean, default: true },
    estimatedMakingDays: { type: { min: Number, max: Number }, default: undefined },
    manualPriceNpr: Number,
    viewCount: { type: Number, default: 0 },
  }, { timestamps: true });
  const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);

  const catKeys = Object.keys(categoryIds);
  const matKeys = Object.keys(materialIds);

  const items = ITEM_NAMES.map((name) => {
    const catKey = pick(catKeys);
    const matKey = pick(matKeys);
    const weightGrams = rand(2, 60);
    const wastagePercent = rand(0, 12);
    const makingCharges = rand(5000, 50000);
    const accessoriesCharge = rand(0, 3000);
    const boutiqueDeduction = rand(0, 5000);
    const diamondValue = matKey === 'Diamond' ? rand(10000, 200000) : 0;
    const caratWeight = diamondValue > 0 ? Math.round(rand(0.3, 3) * 100) / 100 : undefined;
    const group = pick(materialGroups[matKey]);

    return {
      category: categoryIds[catKey],
      material: materialIds[matKey],
      group,
      name,
      description: `Handcrafted ${name.en.toLowerCase()} — ${catKey.toLowerCase()} piece in ${matKey.toLowerCase()}.`,
      tag: pick(TAGS),
      purity: pick(PURITIES),
      weightGrams,
      wastagePercent,
      makingCharges,
      accessoriesCharge,
      boutiqueDeduction,
      diamondValue,
      caratWeight,
      stonesDetails: diamondValue > 0 ? `${caratWeight}ct ${pick(['Round', 'Princess', 'Cushion', 'Emerald', 'Oval'])} cut diamond` : undefined,
      karigarName: pick(KARIGARS),
      images: [],
      isAvailable: Math.random() > 0.1,
      showPrice: Math.random() > 0.05,
      estimatedMakingDays: Math.random() > 0.4 ? { min: Math.round(rand(3, 7)), max: Math.round(rand(8, 20)) } : undefined,
    };
  });

  const inserted = await Item.insertMany(items, { ordered: false });
  created.push(`${inserted.length} items seeded`);

  console.log('Seed complete:\n');
  created.forEach((item) => console.log(`  ✓ ${item}`));
  console.log('\nLogin: admin@ballu.com / admin123');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});