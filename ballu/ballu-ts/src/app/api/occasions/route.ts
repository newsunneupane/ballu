import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Occasion from '@/lib/models/Occasion';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const occasions = await Occasion.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(occasions, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch occasions' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
