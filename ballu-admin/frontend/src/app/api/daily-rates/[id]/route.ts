import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import DailyRate from '@/lib/models/DailyRate';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = requireAuth(_req);
    if (authResult) return authResult;
    const { id } = await params;
    await connectDB();
    const rate = await DailyRate.findById(id).populate('material', 'name');
    if (!rate) return NextResponse.json({ error: 'DailyRate not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json(rate, {
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
    const rate = await DailyRate.findByIdAndUpdate(id, body, { new: true, runValidators: true }).populate('material', 'name');
    if (!rate) return NextResponse.json({ error: 'DailyRate not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json(rate, {
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
    const rate = await DailyRate.findByIdAndDelete(id);
    if (!rate) return NextResponse.json({ error: 'DailyRate not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json({ message: 'DailyRate deleted' }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
