import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Item from '@/lib/models/Item';
import { calculateFinalPrice } from '@/lib/utils/priceCalculator';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = requireAuth(_req);
    if (authResult) return authResult;
    const { id } = await params;
    await connectDB();
    const item = await Item.findById(id).populate('category', 'name').populate('material', 'name').lean();
    if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });

    try {
      const finalPrice = await calculateFinalPrice({
        materialId: item.material._id.toString(),
        weightGrams: item.weightGrams,
        wastageGrams: item.wastageGrams,
        makingCharges: item.makingCharges,
        boutiqueDeduction: item.boutiqueDeduction,
        diamondValue: item.diamondValue,
      });
      return NextResponse.json({ ...item, finalPrice }, {
        headers: { 'Cache-Control': 'no-store' },
      });
    } catch {
      return NextResponse.json({ ...item, finalPrice: null }, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }
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
    const item = await Item.findByIdAndUpdate(id, body, { new: true, runValidators: true }).populate(['category', 'material']);
    if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json(item, {
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
    const item = await Item.findByIdAndDelete(id);
    if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json({ message: 'Item deleted' }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
