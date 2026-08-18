import { NextResponse } from 'next/server';
import { getRatesData } from '@/lib/server/catalog-data';

export async function GET() {
  try {
    const rates = await getRatesData();
    return NextResponse.json({ rates }, {
      headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
    });
  } catch {
    return NextResponse.json({ rates: [] }, {
      headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
    });
  }
}
