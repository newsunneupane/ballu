import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Group from '@/lib/models/Group';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = requireAuth(req);
    if (authResult) return authResult;
    await connectDB();
    const { searchParams } = new URL(req.url);
    const material = searchParams.get('material');
    const filter: Record<string, unknown> = {};
    if (material) filter.material = material;

    const groups = await Group.find(filter).populate('material', 'name').sort({ createdAt: -1 });
    return NextResponse.json(groups, {
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

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: 'Group name is required' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    if (!body.material) {
      return NextResponse.json({ error: 'Material is required' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    const existing = await Group.findOne({
      material: body.material,
      name: { $regex: new RegExp(`^${body.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
    });
    if (existing) {
      return NextResponse.json({ error: 'A group with this name already exists for this material' }, { status: 409, headers: { 'Cache-Control': 'no-store' } });
    }

    const group = await Group.create({ name: body.name.trim(), material: body.material });
    const populated = await group.populate('material', 'name');
    return NextResponse.json(populated, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return errorResponse(err);
  }
}