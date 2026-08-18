import { NextRequest, NextResponse } from 'next/server';
import { getItemByIdData, CATALOG_REVALIDATE_SECONDS } from '@/lib/server/catalog-data';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await getItemByIdData(id);
    if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json(item, {
      headers: { 'Cache-Control': `public, s-maxage=${CATALOG_REVALIDATE_SECONDS}, stale-while-revalidate=600` },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { connectDB } = await import('@/lib/db');
    const Item = (await import('@/lib/models/Item')).default;
    await connectDB();
    await Item.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Failed to record view' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}