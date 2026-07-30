import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Material from '@/lib/models/Material';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = requireAuth(_req);
    if (authResult) return authResult;
    const { id } = await params;
    await connectDB();
    const material = await Material.findById(id);
    if (!material) return NextResponse.json({ error: 'Material not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json(material, {
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

    if (body.name?.en || body.name?.np) {
      const existing = await Material.findOne({
        _id: { $ne: id },
        $or: [
          ...(body.name?.en ? [{ 'name.en': { $regex: new RegExp(`^${body.name.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }] : []),
          ...(body.name?.np ? [{ 'name.np': body.name.np }] : []),
        ],
      });
      if (existing) {
        return NextResponse.json({ error: 'A material with this name already exists' }, { status: 409, headers: { 'Cache-Control': 'no-store' } });
      }
    }

    const material = await Material.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!material) return NextResponse.json({ error: 'Material not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json(material, {
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
    const material = await Material.findByIdAndDelete(id);
    if (!material) return NextResponse.json({ error: 'Material not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json({ message: 'Material deleted' }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
