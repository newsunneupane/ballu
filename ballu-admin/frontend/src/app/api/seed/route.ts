import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Material from '@/lib/models/Material';
import Category from '@/lib/models/Category';
import { errorResponse } from '@/lib/api-utils';

const SEED_SECRET = process.env.ADMIN_SECRET || 'ballu-admin-2026';

export async function POST(req: NextRequest) {
  try {
    const { secret, adminEmail, adminPassword, adminName } = await req.json();

    if (secret !== SEED_SECRET) {
      return NextResponse.json({ error: 'Invalid seed secret' }, { status: 403 });
    }

    await connectDB();

    const created: string[] = [];

    const email = adminEmail || 'admin@ballu.com';
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (!existingUser) {
      const password = adminPassword || 'admin123';
      const hashed = await bcrypt.hash(password, 12);
      await User.create({ email: email.toLowerCase(), password: hashed, name: adminName || 'Admin' });
      created.push(`Admin user: ${email} / ${password}`);
    } else {
      created.push(`Admin user already exists: ${email}`);
    }

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
      }
    }

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
      }
    }

    return NextResponse.json({ message: 'Seed complete', created });
  } catch (err) {
    return errorResponse(err);
  }
}
