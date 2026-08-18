import { NextResponse } from 'next/server';
import { getStoreSettingsData, CATALOG_REVALIDATE_SECONDS } from '@/lib/server/catalog-data';

export async function GET() {
  try {
    const settings = await getStoreSettingsData();
    return NextResponse.json(settings, {
      headers: { 'Cache-Control': `public, s-maxage=${CATALOG_REVALIDATE_SECONDS}, stale-while-revalidate=600` },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch store settings' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
