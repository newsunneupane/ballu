import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ItemInquiry from '@/lib/models/ItemInquiry';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = requireAuth(req);
    if (authError) return authError;
    const { id } = await params;
    await connectDB();
    const inquiry = await ItemInquiry.findById(id).populate('item', 'name images');
    if (!inquiry) return NextResponse.json({ error: 'ItemInquiry not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json(inquiry, {
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
    const inquiry = await ItemInquiry.findByIdAndUpdate(id, body, { new: true, runValidators: true }).populate('item', 'name images');
    if (!inquiry) return NextResponse.json({ error: 'ItemInquiry not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json(inquiry, {
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
    const inquiry = await ItemInquiry.findByIdAndDelete(id);
    if (!inquiry) return NextResponse.json({ error: 'ItemInquiry not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json({ message: 'ItemInquiry deleted' }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
