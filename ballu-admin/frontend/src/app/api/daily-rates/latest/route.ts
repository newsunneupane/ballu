import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import DailyRate from '@/lib/models/DailyRate';
import { requireAuth } from '@/lib/auth/middleware';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authResult = requireAuth(req);
  if (authResult) return authResult;
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

  return NextResponse.json(material ? (rates[0] || null) : rates, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
