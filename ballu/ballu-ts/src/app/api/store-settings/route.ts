import { NextResponse } from 'next/server';
import { getStoreSettingsData } from '@/lib/server/catalog-data';

export async function GET() {
  try {
    const settings = await getStoreSettingsData();
    return NextResponse.json(settings, {
      headers: { 'Cache-Control': 'public, max-age=0, must-revalidate' },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch store settings' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
