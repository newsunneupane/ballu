import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Item from '@/lib/models/Item';
import Group from '@/lib/models/Group';
import { calculateFinalPrice } from '@/lib/utils/priceCalculator';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse, badRequest, isObjectId } from '@/lib/api-utils';
import { revalidateCatalog } from '@/lib/revalidateCatalog';
import { stripCountFromName, escapeRegExp, countSuffixPattern } from '@/lib/utils/itemName';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = requireAuth(req);
    if (authResult) return authResult;
    await connectDB();
    const { searchParams } = new URL(req.url);
    const filter: Record<string, unknown> = {};
    const collection = searchParams.get('collection');
    const material = searchParams.get('material');
    const tag = searchParams.get('tag');
    if (collection) filter.collection = collection;
    if (material) filter.material = material;
    if (tag) filter.tag = tag;

    const items = await Item.find(filter)
      .populate('collection', 'name')
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

    if (!body.collection) {
      return badRequest('Collection is required');
    }
    if (!isObjectId(body.collection)) {
      return badRequest('Invalid collection');
    }
    if (!body.name?.en || !body.name?.np) {
      return badRequest('Name (English & Nepali) is required');
    }
    if (!body.group) {
      return badRequest('Group is required');
    }
    if (!isObjectId(body.group)) {
      return badRequest('Invalid group');
    }
    if (body.weightGrams == null || !Number.isFinite(Number(body.weightGrams)) || Number(body.weightGrams) <= 0) {
      return badRequest('Valid weight is required');
    }

    const numericFields: { name: string; value: unknown }[] = [
      { name: 'wastagePercent', value: body.wastagePercent },
      { name: 'makingCharges', value: body.makingCharges },
      { name: 'accessoriesCharge', value: body.accessoriesCharge },
      { name: 'boutiqueDeduction', value: body.boutiqueDeduction },
      { name: 'diamondValue', value: body.diamondValue },
    ];
    for (const f of numericFields) {
      if (f.value != null && !Number.isFinite(Number(f.value))) {
        return badRequest(`Invalid number for ${f.name}`);
      }
    }
    if (body.caratWeight != null && !Number.isFinite(Number(body.caratWeight))) {
      return badRequest('Invalid number for caratWeight');
    }
    if (body.manualPriceNpr != null && !Number.isFinite(Number(body.manualPriceNpr))) {
      return badRequest('Invalid number for manualPriceNpr');
    }

    const group = await Group.findById(body.group).lean();
    if (!group) {
      return badRequest('Group not found');
    }
    if (!(group as { material?: unknown }).material) {
      return badRequest('This group has no material assigned — create or reassign its material first');
    }
    const purity = (group as { name: string }).name;
    const material = (group as { material: { toString(): string } }).material.toString();

    const baseNameEn = stripCountFromName(body.name?.en);
    const baseNameNp = stripCountFromName(body.name?.np);

    const existing = await Item.find({
      $or: [
        { 'name.en': { $regex: new RegExp(`^${escapeRegExp(baseNameEn)}${countSuffixPattern()}$`, 'i') } },
        { 'name.np': { $regex: new RegExp(`^${escapeRegExp(baseNameNp)}${countSuffixPattern()}$`) } },
      ],
    });
    if (existing.length > 0) {
      let incomingPrice: number | null = null;
      try {
        incomingPrice =
          body.manualPriceNpr != null
            ? Number(body.manualPriceNpr)
            : await calculateFinalPrice({
                materialId: material,
                groupId: body.group,
                weightGrams: Number(body.weightGrams),
                wastagePercent: Number(body.wastagePercent) || 0,
                makingCharges: Number(body.makingCharges) || 0,
                accessoriesCharge: Number(body.accessoriesCharge) || 0,
                boutiqueDeduction: Number(body.boutiqueDeduction) || 0,
                diamondValue: Number(body.diamondValue) || 0,
              });
      } catch {
        incomingPrice = null;
      }

      if (incomingPrice != null) {
        let priceDuplicate = false;
        for (const ex of existing) {
          let exPrice: number | null = null;
          if (ex.manualPriceNpr != null) {
            exPrice = Number(ex.manualPriceNpr);
          } else {
            try {
              exPrice = await calculateFinalPrice({
                materialId: ex.material.toString(),
                groupId: ex.group ? ex.group.toString() : undefined,
                weightGrams: ex.weightGrams,
                wastagePercent: ex.wastagePercent || 0,
                makingCharges: ex.makingCharges || 0,
                accessoriesCharge: ex.accessoriesCharge || 0,
                boutiqueDeduction: ex.boutiqueDeduction || 0,
                diamondValue: ex.diamondValue || 0,
              });
            } catch {
              continue;
            }
          }
          if (exPrice != null && Math.round(exPrice) === Math.round(incomingPrice)) {
            priceDuplicate = true;
            break;
          }
        }
        if (priceDuplicate && !body.allowDuplicate) {
          return NextResponse.json({ error: 'An item with this name and price already exists in this collection & material', duplicate: true }, { status: 409, headers: { 'Cache-Control': 'no-store' } });
        }
        if (priceDuplicate && body.allowDuplicate) {
          const number = existing.length + 1;
          body.name.en = `${baseNameEn} (${number})`;
          body.name.np = `${baseNameNp} (${number})`;
        }
      }
    }

    const item = await Item.create({ ...body, material, purity, manualPriceNpr: body.manualPriceNpr != null ? Number(body.manualPriceNpr) : undefined });
    const populated = await item.populate(['collection', 'material', 'group']);
    revalidateCatalog();
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
    revalidateCatalog();
    return NextResponse.json({ deleted: result.deletedCount }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
