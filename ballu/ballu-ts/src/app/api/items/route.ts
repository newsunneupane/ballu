import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Item from '@/lib/models/Item';
import { calculateFinalPrice } from '@/lib/utils/priceCalculator';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const filter: Record<string, unknown> = {};
  const category = searchParams.get('category');
  const material = searchParams.get('material');
  const tag = searchParams.get('tag');
  if (category) filter.category = category;
  if (material) filter.material = material;
  if (tag) filter.tag = tag;

  const items = await Item.find(filter)
    .populate('category', 'name')
    .populate('material', 'name')
    .sort({ createdAt: -1 })
    .lean();

  const itemsWithPricing = await Promise.all(
    items.map(async (item) => {
      try {
        const pricing = await calculateFinalPrice({
          materialId: (item.material as { _id: string })._id.toString(),
          weightGrams: item.weightGrams,
          wastageGrams: item.wastageGrams,
          makingCharges: item.makingCharges,
          boutiqueDeduction: item.boutiqueDeduction,
          diamondValue: item.diamondValue,
        });
        return { ...item, pricing };
      } catch {
        return { ...item, pricing: null };
      }
    })
  );

  return NextResponse.json(itemsWithPricing);
}
