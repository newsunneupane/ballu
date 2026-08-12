import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Item from '@/lib/models/Item';
import { calculateFinalPrice } from '@/lib/utils/priceCalculator';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const item = await Item.findById(id).populate('category', 'name').populate('material', 'name').lean();
    if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });

    try {
      const pricing = await calculateFinalPrice({
        materialId: (item.material as { _id: string })._id.toString(),
        weightGrams: item.weightGrams,
        wastagePercent: item.wastagePercent,
        makingCharges: item.makingCharges,
        accessoriesCharge: item.accessoriesCharge,
        boutiqueDeduction: item.boutiqueDeduction,
        diamondValue: item.diamondValue,
      });
      return NextResponse.json({ ...item, pricing }, {
        headers: { 'Cache-Control': 'no-store' },
      });
    } catch {
      return NextResponse.json({ ...item, pricing: null }, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }
  } catch {
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    await Item.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Failed to record view' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}