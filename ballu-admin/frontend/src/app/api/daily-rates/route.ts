import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import DailyRate from '@/lib/models/DailyRate';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const filter: Record<string, unknown> = {};
    const material = searchParams.get('material');
    if (material) filter.material = material;

    const rates = await DailyRate.find(filter).populate('material', 'name').sort({ date: -1 }).lean();
    return NextResponse.json(rates);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const authError = requireAuth(req);
    if (authError) return authError;
    await connectDB();
    const body = await req.json();
    const rate = await DailyRate.create(body);
    const populated = await rate.populate('material', 'name');
    return NextResponse.json(populated, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
