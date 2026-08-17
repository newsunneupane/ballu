import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Item from '@/lib/models/Item';
import Group from '@/lib/models/Group';
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
      .populate('group', 'name')
      .sort({ createdAt: -1 })
      .lean();

    const itemsWithPrice = await Promise.all(
      items.map(async (item) => {
        if (!item.material) return { ...item, finalPrice: null };
        if (item.manualPriceNpr != null) {
          return { ...item, finalPrice: Number(item.manualPriceNpr) };
        }
        try {
          const finalPrice = await calculateFinalPrice({
            materialId: item.material._id.toString(),
            groupId: item.group ? (item.group as { _id: string })._id.toString() : undefined,
            weightGrams: item.weightGrams,
            wastagePercent: item.wastagePercent,
            makingCharges: item.makingCharges,
            accessoriesCharge: item.accessoriesCharge,
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

    if (!body.category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    if (!body.name?.en || !body.name?.np) {
      return NextResponse.json({ error: 'Name (English & Nepali) is required' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    if (!body.weightGrams || body.weightGrams <= 0) {
      return NextResponse.json({ error: 'Valid weight is required' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    if (!body.group) {
      return NextResponse.json({ error: 'Group is required' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    if (!/^[a-f\d]{24}$/i.test(body.group)) {
      return NextResponse.json({ error: 'Invalid group' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    const group = await Group.findById(body.group).lean();
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    const purity = (group as { name: string }).name;
    const material = (group as { material: { toString(): string } }).material.toString();

    const existing = await Item.findOne({
      category: body.category,
      material: body.material,
      $or: [
        { 'name.en': { $regex: new RegExp(`^${body.name?.en?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') || ''}$`, 'i') } },
        { 'name.np': body.name?.np },
      ],
    });
    if (existing) {
      return NextResponse.json({ error: 'An item with this name already exists in this category & material' }, { status: 409, headers: { 'Cache-Control': 'no-store' } });
    }

    const item = await Item.create({ ...body, material, purity, manualPriceNpr: body.manualPriceNpr != null ? Number(body.manualPriceNpr) : undefined });
    const populated = await item.populate(['category', 'material', 'group']);
    return NextResponse.json(populated, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authError = requireAuth(req);
    if (authError) return authError;
    await connectDB();
    const body = await req.json();
    const ids = Array.isArray(body) ? body : body.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Provide an array of item ids' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    const result = await Item.deleteMany({ _id: { $in: ids } });
    return NextResponse.json({ deleted: result.deletedCount }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
