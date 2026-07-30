import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Material from '@/lib/models/Material';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = requireAuth(req);
    if (authResult) return authResult;
    await connectDB();
    const materials = await Material.find().sort({ createdAt: -1 });
    return NextResponse.json(materials, {
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

    const existing = await Material.findOne({
      $or: [
        { 'name.en': { $regex: new RegExp(`^${body.name?.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
        { 'name.np': body.name?.np },
      ],
    });
    if (existing) {
      return NextResponse.json({ error: 'A material with this name already exists' }, { status: 409, headers: { 'Cache-Control': 'no-store' } });
    }

    const material = await Material.create(body);
    return NextResponse.json(material, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return errorResponse(err);
  }
}
