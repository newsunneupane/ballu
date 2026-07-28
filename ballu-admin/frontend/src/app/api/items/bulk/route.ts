import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Item from '@/lib/models/Item';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const authError = requireAuth(req);
    if (authError) return authError;
    await connectDB();

    const body = await req.json();
    const items = Array.isArray(body) ? body : body.items;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Provide an array of items' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    const created = await Item.insertMany(items, { ordered: false });
    return NextResponse.json({ count: created.length, items: created }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return errorResponse(err);
  }
}