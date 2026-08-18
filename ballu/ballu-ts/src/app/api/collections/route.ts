import { NextResponse } from 'next/server';
import { getCollectionsData, CATALOG_REVALIDATE_SECONDS } from '@/lib/server/catalog-data';

export async function GET() {
  try {
    const collections = await getCollectionsData();
    return NextResponse.json(collections, {
      headers: { 'Cache-Control': `public, s-maxage=${CATALOG_REVALIDATE_SECONDS}, stale-while-revalidate=600` },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
