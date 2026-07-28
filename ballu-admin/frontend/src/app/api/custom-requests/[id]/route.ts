import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import CustomRequest from '@/lib/models/CustomRequest';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = requireAuth(req);
    if (authError) return authError;
    const { id } = await params;
    await connectDB();
    const request = await CustomRequest.findById(id).populate('category', 'name').populate('material', 'name');
    if (!request) return NextResponse.json({ error: 'CustomRequest not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json(request, {
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
    const request = await CustomRequest.findByIdAndUpdate(id, body, { new: true, runValidators: true }).populate('category', 'name').populate('material', 'name');
    if (!request) return NextResponse.json({ error: 'CustomRequest not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json(request, {
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
    const request = await CustomRequest.findByIdAndDelete(id);
    if (!request) return NextResponse.json({ error: 'CustomRequest not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json({ message: 'CustomRequest deleted' }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
