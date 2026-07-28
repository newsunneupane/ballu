import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Material from '@/lib/models/Material';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const material = await Material.findById(id);
    if (!material) return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    return NextResponse.json(material);
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
    const material = await Material.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!material) return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    return NextResponse.json(material);
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
    if (!material) return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    return NextResponse.json({ message: 'Material deleted' });
  } catch (err) {
    return errorResponse(err);
  }
}
