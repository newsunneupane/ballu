import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Item from '@/lib/models/Item';
import { calculateFinalPrice } from '@/lib/utils/priceCalculator';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const item = await Item.findById(id).populate('category', 'name').populate('material', 'name').lean();
  if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

  try {
    const pricing = await calculateFinalPrice({
      materialId: (item.material as { _id: string })._id.toString(),
      weightGrams: item.weightGrams,
      wastageGrams: item.wastageGrams,
      makingCharges: item.makingCharges,
      boutiqueDeduction: item.boutiqueDeduction,
      diamondValue: item.diamondValue,
    });
    return NextResponse.json({ ...item, pricing });
  } catch {
    return NextResponse.json({ ...item, pricing: null });
  }
}
