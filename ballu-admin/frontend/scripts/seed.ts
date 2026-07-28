import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ballu';

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.\n');

  const created: string[] = [];

  // --- User ---
  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model('User', userSchema);

  const email = 'admin@ballu.com';
  const existing = await User.findOne({ email });
  if (!existing) {
    const hashed = await bcrypt.hash('admin123', 12);
    await User.create({ email, password: hashed, name: 'Admin' });
    created.push('Admin user: admin@ballu.com / admin123');
  } else {
    created.push('Admin user already exists: admin@ballu.com');
  }

  // --- Materials ---
  const materialSchema = new mongoose.Schema({
    name: { en: String, np: String },
  }, { timestamps: true });
  const Material = mongoose.models.Material || mongoose.model('Material', materialSchema);

  const materialData = [
    { en: 'Gold', np: 'सुन' },
    { en: 'Silver', np: 'चाँदी' },
    { en: 'Platinum', np: 'प्लेटिनम' },
    { en: 'Diamond', np: 'हीरा' },
  ];
  for (const m of materialData) {
    const exists = await Material.findOne({ 'name.en': m.en });
    if (!exists) {
      await Material.create({ name: { en: m.en, np: m.np } });
      created.push(`Material: ${m.en}`);
    } else {
      created.push(`Material already exists: ${m.en}`);
    }
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
  ];
  for (const c of categoryData) {
    const exists = await Category.findOne({ 'name.en': c.en });
    if (!exists) {
      await Category.create({ name: { en: c.en, np: c.np }, description: c.desc });
      created.push(`Category: ${c.en}`);
    } else {
      created.push(`Category already exists: ${c.en}`);
    }
  }

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
