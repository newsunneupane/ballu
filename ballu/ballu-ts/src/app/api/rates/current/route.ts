import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Material from '@/lib/models/Material';
import DailyRate from '@/lib/models/DailyRate';

export async function GET() {
  await connectDB();

  const materials = await Material.find({}).lean();
  const rates: { name: string; ratePerGramNrs: number; ratePerGramInr: number }[] = [];

  for (const mat of materials) {
    const rate = await DailyRate.findOne({ material: mat._id }).sort({ date: -1 }).lean();
    if (rate) {
      rates.push({
        name: (mat.name as any)?.en || mat._id.toString(),
        ratePerGramNrs: rate.ratePerGramNrs,
        ratePerGramInr: rate.ratePerGramInr,
      });
    }
  }

  return NextResponse.json({ rates }, {
    headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
  });
}
