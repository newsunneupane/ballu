import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Group from '@/lib/models/Group';
import Item from '@/lib/models/Item';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';
import { revalidateCatalog } from '@/lib/revalidateCatalog';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = requireAuth(_req);
    if (authResult) return authResult;
    const { id } = await params;
    await connectDB();
    const group = await Group.findById(id).populate('material', 'name');
    if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json(group, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = requireAuth(req);
    if (authError) return authError;
    const { id } = await params;
    await connectDB();
    const body = await req.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: 'Group name is required' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    if (!body.material) {
      return NextResponse.json({ error: 'Material is required' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    if (body.rateNpr != null && !Number.isFinite(Number(body.rateNpr))) {
      return NextResponse.json({ error: 'Invalid rate' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    const existing = await Group.findOne({
      _id: { $ne: id },
      material: body.material,
      name: { $regex: new RegExp(`^${body.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
    });
    if (existing) {
      return NextResponse.json({ error: 'A group with this name already exists for this material' }, { status: 409, headers: { 'Cache-Control': 'no-store' } });
    }

    const group = await Group.findByIdAndUpdate(
      id,
      { name: body.name.trim(), material: body.material, rateNpr: body.rateNpr != null ? Number(body.rateNpr) : undefined },
      { new: true, runValidators: true }
    ).populate('material', 'name');
    if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    revalidateCatalog();
    return NextResponse.json(group, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = requireAuth(req);
    if (authError) return authError;
    const { id } = await params;
    await connectDB();
    const group = await Group.findByIdAndDelete(id);
    if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    await Item.updateMany({ group: id }, { $unset: { group: 1 } });
    revalidateCatalog();
    return NextResponse.json({ message: 'Group deleted' }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}