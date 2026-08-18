import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Category from '@/lib/models/Category';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = requireAuth(_req);
    if (authResult) return authResult;
    const { id } = await params;
    await connectDB();
    const category = await Category.findById(id);
    if (!category) return NextResponse.json({ error: 'Collection not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json(category, {
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
      const existing = await Category.findOne({
        _id: { $ne: id },
        $or: [
          ...(body.name?.en ? [{ 'name.en': { $regex: new RegExp(`^${body.name.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }] : []),
          ...(body.name?.np ? [{ 'name.np': body.name.np }] : []),
        ],
      });
      if (existing) {
        return NextResponse.json({ error: 'A collection with this name already exists' }, { status: 409, headers: { 'Cache-Control': 'no-store' } });
      }
    }

    const category = await Category.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json(category, {
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
    const category = await Category.findByIdAndDelete(id);
    if (!category) return NextResponse.json({ error: 'Collection not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json({ message: 'Collection deleted' }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
