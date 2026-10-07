import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Collection from '@/lib/models/Collection';
import Item from '@/lib/models/Item';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';
import { revalidateCatalog } from '@/lib/revalidateCatalog';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = requireAuth(_req);
    if (authResult) return authResult;
    const { id } = await params;
    await connectDB();
    const collection = await Collection.findById(id);
    if (!collection) return NextResponse.json({ error: 'Collection not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json(collection, {
      headers: { 'Cache-Control': 'no-store' },
    });
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

    if (body.name?.en || body.name?.np) {
      const existing = await Collection.findOne({
        _id: { $ne: id },
        $or: [
          ...(body.name?.en ? [{ 'name.en': { $regex: new RegExp(`^${body.name.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }] : []),
          ...(body.name?.np ? [{ 'name.np': body.name.np }] : []),
        ],
      });
      if (existing) {
        return NextResponse.json({ error: 'A collection with this name already exists' }, { status: 409, headers: { 'Cache-Control': 'no-store' } });
      }
    }

    const collection = await Collection.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!collection) return NextResponse.json({ error: 'Collection not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    revalidateCatalog();
    return NextResponse.json(collection, {
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
    const target = await Collection.findById(id);
    if (!target) return NextResponse.json({ error: 'Collection not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });

    if (/^others$/i.test((target as { name?: { en?: string } }).name?.en || '')) {
      return NextResponse.json({ error: 'The Others collection is the fallback for items and cannot be deleted.' }, { status: 409, headers: { 'Cache-Control': 'no-store' } });
    }

    // Unlink the deleted collection from every item first, so no item is
    // ever left orphaned. Items that end up with no collections at all are
    // moved to a fallback Others collection (created only if actually
    // needed — the schema requires every item to have at least one).
    const usingCount = await Item.countDocuments({ collections: id });
    let movedToFallback = 0;
    if (usingCount > 0) {
      await Item.updateMany({ collections: id }, { $pull: { collections: id } });
      const emptiedCount = await Item.countDocuments({ collections: { $size: 0 } });
      if (emptiedCount > 0) {
        let fallback = await Collection.findOne({ 'name.en': { $regex: /^others$/i } });
        if (!fallback) {
          fallback = await Collection.create({ name: { en: 'Others', np: 'अन्य' }, description: 'Other jewellery designs' });
        }
        const moved = await Item.updateMany({ collections: { $size: 0 } }, { $addToSet: { collections: fallback._id } });
        movedToFallback = moved.modifiedCount;
      }
    }

    await Collection.findByIdAndDelete(id);
    revalidateCatalog();
    return NextResponse.json({
      message: usingCount > 0 ? `Collection deleted. ${usingCount} item(s) unlinked${movedToFallback > 0 ? `, ${movedToFallback} moved to Others` : ''}.` : 'Collection deleted.',
      moved: usingCount,
      movedToFallback,
    }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
