import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Occasion from '@/lib/models/Occasion';
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
    const occasion = await Occasion.findById(id);
    if (!occasion) return NextResponse.json({ error: 'Occasion not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json(occasion, {
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
      const existing = await Occasion.findOne({
        _id: { $ne: id },
        $or: [
          ...(body.name?.en ? [{ 'name.en': body.name.en }] : []),
          ...(body.name?.np ? [{ 'name.np': body.name.np }] : []),
        ],
      });
      if (existing) {
        return NextResponse.json({ error: 'An occasion with this name already exists' }, { status: 409, headers: { 'Cache-Control': 'no-store' } });
      }
    }

    const current = await Occasion.findById(id);
    if (!current) return NextResponse.json({ error: 'Occasion not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });

    if ((current.name?.en || '').trim().toLowerCase() === 'others') {
      body.name = { en: 'Others', np: 'अन्य' };
    }

    const occasion = await Occasion.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    revalidateCatalog();
    return NextResponse.json(occasion, {
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
    const occasion = await Occasion.findById(id);
    if (!occasion) return NextResponse.json({ error: 'Occasion not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    if ((occasion.name?.en || '').trim().toLowerCase() === 'others') {
      return NextResponse.json({ error: "The 'Others' occasion cannot be deleted." }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    await Occasion.findByIdAndDelete(id);
    revalidateCatalog();
    return NextResponse.json({ message: 'Occasion deleted' }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
