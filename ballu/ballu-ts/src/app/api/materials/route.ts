import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Material from '@/lib/models/Material';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const materials = await Material.find().sort({ createdAt: -1 });
    return NextResponse.json(materials, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}