import { NextRequest, NextResponse } from 'next/server';
import { getItemsData, CATALOG_REVALIDATE_SECONDS } from '@/lib/server/catalog-data';

function isValidObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const collection = searchParams.get('collection');
    const material = searchParams.get('material');
    const tag = searchParams.get('tag');

    if ((collection && !isValidObjectId(collection)) || (material && !isValidObjectId(material))) {
      return NextResponse.json({ error: 'Invalid collection/material parameter' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    if (tag && (typeof tag !== 'string' || tag.length > 100 || /[<>$]/.test(tag))) {
      return NextResponse.json({ error: 'Invalid tag parameter' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    const items = await getItemsData();

    const filtered = items.filter((item: any) => {
      if (collection && String((item.collection as any)?._id || '') !== collection) return false;
      if (material && String((item.material as any)?._id || '') !== material) return false;
      if (tag && item.tag !== tag) return false;
      return true;
    });

    return NextResponse.json(filtered, {
      headers: { 'Cache-Control': `public, s-maxage=${CATALOG_REVALIDATE_SECONDS}, stale-while-revalidate=600` },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}