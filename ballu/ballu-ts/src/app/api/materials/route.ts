import { NextResponse } from 'next/server';
import { getMaterialsData, CATALOG_REVALIDATE_SECONDS } from '@/lib/server/catalog-data';

export async function GET() {
  try {
    const materials = await getMaterialsData();
    return NextResponse.json(materials, {
      headers: { 'Cache-Control': `public, s-maxage=${CATALOG_REVALIDATE_SECONDS}, stale-while-revalidate=600` },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
