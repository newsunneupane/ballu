import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Item from '@/lib/models/Item';
import Group from '@/lib/models/Group';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';
import { revalidateCatalog } from '@/lib/revalidateCatalog';

export const dynamic = 'force-dynamic';

interface BulkItem {
  collection?: string;
  group?: string;
  name?: { en?: string; np?: string };
  weightGrams?: number;
  manualPriceNpr?: number;
  [key: string]: unknown;
}

export async function POST(req: NextRequest) {
  try {
    const authError = requireAuth(req);
    if (authError) return authError;
    await connectDB();

    const body = await req.json();
    const items: BulkItem[] = Array.isArray(body) ? body : (body.items as BulkItem[]);

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Provide an array of items' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    const groupIds = [...new Set(items.map((i) => i.group).filter((g): g is string => !!g && /^[a-f\d]{24}$/i.test(g)))];
    const groups = await Group.find({ _id: { $in: groupIds } }).lean();
    const groupMap = new Map(groups.map((g) => [g._id.toString(), g]));

    const prepared: (BulkItem & { material: unknown; purity: string })[] = [];
    for (const item of items) {
      const group = item.group ? groupMap.get(item.group) : null;
      if (!group) {
        return NextResponse.json({ error: 'Each item requires a valid group' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
      }
      prepared.push({
        ...item,
        material: (group as { material: unknown }).material,
        purity: (group as { name: string }).name,
        manualPriceNpr: item.manualPriceNpr != null ? Number(item.manualPriceNpr) : undefined,
      });
    }

    const conditions = prepared
      .filter((i) => i.name?.en && i.name?.np)
      .map((i) => ({
        collection: i.collection,
        material: i.material,
        'name.en': { $regex: new RegExp(`^${i.name!.en!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
        'name.np': i.name!.np,
      }));
    const existing = await Item.find({ $or: conditions });
    if (existing.length > 0) {
      const dupes = existing.map((i) => (i as { name?: { en?: string } }).name?.en).filter(Boolean).join(', ');
      return NextResponse.json({ error: `Duplicate items already exist: ${dupes}` }, { status: 409, headers: { 'Cache-Control': 'no-store' } });
    }

    const created = await Item.insertMany(prepared, { ordered: false });
    revalidateCatalog();
    return NextResponse.json({ count: created.length, items: created }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return errorResponse(err);
  }
}