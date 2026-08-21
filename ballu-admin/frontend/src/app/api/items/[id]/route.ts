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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = requireAuth(_req);
    if (authResult) return authResult;
    const { id } = await params;
    await connectDB();
    const item = await Item.findById(id).populate('collection', 'name').populate('material', 'name').populate('group', 'name').lean();
    if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });

    try {
      if (item.manualPriceNpr != null) {
        return NextResponse.json({ ...item, finalPrice: Number(item.manualPriceNpr) }, {
          headers: { 'Cache-Control': 'no-store' },
        });
      }
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

    if (body.name?.en || body.name?.np) {
      const baseNameEn = stripCountFromName(body.name?.en || '');
      const baseNameNp = stripCountFromName(body.name?.np || '');
      const existing = await Item.find({
        _id: { $ne: id },
        $or: [
          ...(body.name?.en ? [{ 'name.en': { $regex: new RegExp(`^${escapeRegExp(baseNameEn)}${countSuffixPattern()}$`, 'i') } }] : []),
          ...(body.name?.np ? [{ 'name.np': { $regex: new RegExp(`^${escapeRegExp(baseNameNp)}${countSuffixPattern()}$`) } }] : []),
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
        }
      }
    }

    const item = await Item.findByIdAndUpdate(id, { ...body, material, purity, manualPriceNpr: body.manualPriceNpr != null ? Number(body.manualPriceNpr) : undefined }, { new: true, runValidators: true }).populate(['collection', 'material', 'group']);
    if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    revalidateCatalog();
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
    revalidateCatalog();
    return NextResponse.json({ message: 'Item deleted' }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
