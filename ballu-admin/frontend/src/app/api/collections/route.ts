import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Collection from '@/lib/models/Collection';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';
import { revalidateCatalog } from '@/lib/revalidateCatalog';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = requireAuth(req);
    if (authResult) return authResult;
    await connectDB();
    const collections = await Collection.find().sort({ createdAt: -1 });
    return NextResponse.json(collections, {
      headers: { 'Cache-Control': 'no-store' },
    });
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

    const existing = await Collection.findOne({
      $or: [
        { 'name.en': { $regex: new RegExp(`^${body.name?.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
        { 'name.np': body.name?.np },
      ],
    });
    if (existing) {
      return NextResponse.json({ error: 'A collection with this name already exists' }, { status: 409, headers: { 'Cache-Control': 'no-store' } });
    }

    const collection = await Collection.create(body);
    revalidateCatalog();
    return NextResponse.json(collection, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return errorResponse(err);
  }
}
