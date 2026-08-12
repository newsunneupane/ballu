import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Item from '@/lib/models/Item';
import { calculateFinalPrice } from '@/lib/utils/priceCalculator';

export const dynamic = 'force-dynamic';

function isValidObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const filter: Record<string, unknown> = {};
    const category = searchParams.get('category');
    const material = searchParams.get('material');
    const tag = searchParams.get('tag');
    if (category) {
      if (!isValidObjectId(category)) {
        return NextResponse.json({ error: 'Invalid category parameter' }, { status: 400 });
      }
      filter.category = category;
    }
    if (material) {
      if (!isValidObjectId(material)) {
        return NextResponse.json({ error: 'Invalid material parameter' }, { status: 400 });
      }
      filter.material = material;
    }
    if (tag) {
      if (typeof tag !== 'string' || tag.length > 100 || /[<>$]/.test(tag)) {
        return NextResponse.json({ error: 'Invalid tag parameter' }, { status: 400 });
      }
      filter.tag = tag;
    }

    const items = await Item.find(filter)
      .populate('category', 'name')
      .populate('material', 'name')
      .sort({ createdAt: -1 })
      .lean();

    const itemsWithPricing = await Promise.all(
      items.map(async (item) => {
        if (!item.material) return { ...item, pricing: null };
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
          return { ...item, pricing };
        } catch {
          return { ...item, pricing: null };
        }
      })
    );

    return NextResponse.json(itemsWithPricing, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}