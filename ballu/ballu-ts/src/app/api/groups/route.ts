import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Group from '@/lib/models/Group';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const material = searchParams.get('material');
    const filter: Record<string, unknown> = {};
    if (material) filter.material = material;
    const groups = await Group.find(filter).populate('material', 'name').sort({ createdAt: -1 });
    return NextResponse.json(groups, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}