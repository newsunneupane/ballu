import { NextRequest, NextResponse } from 'next/server';
import { getCollectionsData, getItemsData, CATALOG_REVALIDATE_SECONDS } from '@/lib/server/catalog-data';

function isValidObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const material = searchParams.get('material');

    if (material && !isValidObjectId(material)) {
      return NextResponse.json({ error: 'Invalid material parameter' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    let collections = await getCollectionsData();

    if (material) {
      const items = await getItemsData();
      const linked = new Set<string>(
        items
          .filter((item: any) => String((item.material as any)?._id || '') === material)
          .flatMap((item: any) => (item.collections || []).map((c: any) => String(c?.name?.en || '').trim().toUpperCase()))
          .filter(Boolean)
      );
      collections = collections.filter((c: any) => linked.has(String(c.name?.en || '').trim().toUpperCase()));
    }

    return NextResponse.json(collections, {
      headers: { 'Cache-Control': `public, s-maxage=${CATALOG_REVALIDATE_SECONDS}, stale-while-revalidate=600` },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
