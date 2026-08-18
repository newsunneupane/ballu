import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Collection from '@/lib/models/Collection';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const collections = await Collection.find().sort({ createdAt: -1 });
    return NextResponse.json(collections, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}