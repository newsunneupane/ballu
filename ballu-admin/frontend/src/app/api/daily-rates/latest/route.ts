import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import DailyRate from '@/lib/models/DailyRate';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const material = searchParams.get('material');
  const filter: Record<string, unknown> = {};
  if (material) filter.material = material;

  const rates = await DailyRate.find(filter)
    .populate('material', 'name')
    .sort({ date: -1 })
    .limit(material ? 1 : 10)
    .lean();

  return NextResponse.json(material ? (rates[0] || null) : rates);
}
