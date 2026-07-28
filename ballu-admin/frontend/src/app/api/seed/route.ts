import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Material from '@/lib/models/Material';
import Category from '@/lib/models/Category';
import Item from '@/lib/models/Item';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

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

export async function POST(req: NextRequest) {
  try {
    const authError = requireAuth(req);
    if (authError) return authError;

    const { seedItems } = await req.json();
    await connectDB();

    const created: string[] = [];

    const email = 'admin@ballu.com';
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const hashed = await bcrypt.hash('admin123', 12);
      await User.create({ email, password: hashed, name: 'Admin' });
      created.push('Admin user: admin@ballu.com / admin123');
    } else {
      created.push('Admin user already exists');
    }

    const materialData = [
      { en: 'Gold', np: 'सुन' },
      { en: 'Silver', np: 'चाँदी' },
      { en: 'Platinum', np: 'प्लेटिनम' },
      { en: 'Diamond', np: 'हीरा' },
    ];
    const materialIds: Record<string, string> = {};
    for (const m of materialData) {
      let mat = await Material.findOne({ 'name.en': m.en });
      if (!mat) {
        mat = await Material.create({ name: { en: m.en, np: m.np } });
        created.push(`Material: ${m.en}`);
      }
      materialIds[m.en] = mat._id.toString();
    }

    const categoryData = [
      { en: 'Bridal', np: 'वैवाहिक', desc: 'Bridal jewellery collection' },
      { en: 'Festive', np: 'पर्व', desc: 'Festive season collection' },
      { en: 'Daily Wear', np: 'दैनिक', desc: 'Everyday essentials' },
      { en: 'Engagement', np: 'सगाई', desc: 'Engagement rings and sets' },
      { en: 'Office', np: 'कार्यालय', desc: 'Office-appropriate designs' },
      { en: 'Gift', np: 'उपहार', desc: 'Gifting collection' },
    ];
    const categoryIds: Record<string, string> = {};
    for (const c of categoryData) {
      let cat = await Category.findOne({ 'name.en': c.en });
      if (!cat) {
        cat = await Category.create({ name: { en: c.en, np: c.np }, description: c.desc });
        created.push(`Category: ${c.en}`);
      }
      categoryIds[c.en] = cat._id.toString();
    }

    if (!seedItems) {
      return NextResponse.json({ message: 'Seed complete (items skipped — set seedItems: true to seed items)', created }, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    const catKeys = Object.keys(categoryIds);
    const matKeys = Object.keys(materialIds);
    const items = ITEM_NAMES.map((name) => {
      const catKey = pick(catKeys);
      const matKey = pick(matKeys);
      const weightGrams = rand(2, 60);
      const wastageGrams = rand(0, 2);
      const makingCharges = rand(5000, 50000);
      const boutiqueDeduction = rand(0, 5000);
      const diamondValue = matKey === 'Diamond' ? rand(10000, 200000) : 0;

      return {
        category: categoryIds[catKey],
        material: materialIds[matKey],
        name,
        description: `Handcrafted ${name.en.toLowerCase()} — ${catKey.toLowerCase()} piece in ${matKey.toLowerCase()}.`,
        tag: pick(TAGS),
        purity: pick(PURITIES),
        weightGrams,
        wastageGrams,
        makingCharges,
        boutiqueDeduction,
        diamondValue,
        stonesDetails: diamondValue > 0 ? `${Math.round(rand(0.5, 5) * 10) / 10}ct ${pick(['Round', 'Princess', 'Cushion', 'Emerald', 'Oval'])} cut diamond` : undefined,
        karigarName: pick(KARIGARS),
        images: [],
      };
    });

    const inserted = await Item.insertMany(items, { ordered: false });
    created.push(`${inserted.length} items seeded`);

    return NextResponse.json({ message: 'Seed complete', created, itemCount: inserted.length }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}