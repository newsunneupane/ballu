import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import DailyRate from '@/lib/models/DailyRate';

function isValidObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const material = searchParams.get('material');
  const filter: Record<string, unknown> = {};
  if (material) {
    if (!isValidObjectId(material)) {
      return NextResponse.json({ error: 'Invalid material parameter' }, { status: 400, headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' } });
    }
    filter.material = material;
  }

  const rate = await DailyRate.findOne(filter).sort({ date: -1 }).populate('material', 'name').lean();
  if (!rate) return NextResponse.json({ error: 'No rate found' }, { status: 404, headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' } });
  return NextResponse.json(rate, {
    headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
  });
}
