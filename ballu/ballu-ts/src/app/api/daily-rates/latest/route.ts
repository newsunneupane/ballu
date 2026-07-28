import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import DailyRate from '@/lib/models/DailyRate';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const material = searchParams.get('material');
  const filter: Record<string, unknown> = {};
  if (material) filter.material = material;

  const rate = await DailyRate.findOne(filter).sort({ date: -1 }).populate('material', 'name').lean();
  if (!rate) return NextResponse.json({ error: 'No rate found' }, { status: 404 });
  return NextResponse.json(rate);
}
