import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Item from '@/lib/models/Item';
import { calculateFinalPrice } from '@/lib/utils/priceCalculator';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = requireAuth(req);
    if (authResult) return authResult;
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

    const itemsWithPrice = await Promise.all(
      items.map(async (item) => {
        try {
          const finalPrice = await calculateFinalPrice({
            materialId: item.material._id.toString(),
            weightGrams: item.weightGrams,
            wastageGrams: item.wastageGrams,
            makingCharges: item.makingCharges,
            boutiqueDeduction: item.boutiqueDeduction,
            diamondValue: item.diamondValue,
          });
          return { ...item, finalPrice };
        } catch {
          return { ...item, finalPrice: null };
        }
      })
    );

    return NextResponse.json(itemsWithPrice, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const authError = requireAuth(req);
    if (authError) return authError;
    await connectDB();
    const body = await req.json();
    const item = await Item.create(body);
    const populated = await item.populate(['category', 'material']);
    return NextResponse.json(populated, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return errorResponse(err);
  }
}
