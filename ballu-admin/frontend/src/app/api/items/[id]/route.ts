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
        wastagePercent: item.wastagePercent,
        makingCharges: item.makingCharges,
        accessoriesCharge: item.accessoriesCharge,
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

    if (!body.category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    if (!body.name?.en || !body.name?.np) {
      return NextResponse.json({ error: 'Name (English & Nepali) is required' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    if (!body.weightGrams || body.weightGrams <= 0) {
      return NextResponse.json({ error: 'Valid weight is required' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    if (body.name?.en || body.name?.np) {
      const existing = await Item.findOne({
        _id: { $ne: id },
        category: body.category,
        material: body.material,
        $or: [
          ...(body.name?.en ? [{ 'name.en': { $regex: new RegExp(`^${body.name.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }] : []),
          ...(body.name?.np ? [{ 'name.np': body.name.np }] : []),
        ],
      });
      if (existing) {
        return NextResponse.json({ error: 'An item with this name already exists in this category & material' }, { status: 409, headers: { 'Cache-Control': 'no-store' } });
      }
    }

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
