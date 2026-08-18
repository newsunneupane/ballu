import { NextRequest, NextResponse } from 'next/server';
import { getGroupsData, CATALOG_REVALIDATE_SECONDS } from '@/lib/server/catalog-data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const material = searchParams.get('material');
    const groups = await getGroupsData();
    const filtered = material ? groups.filter((g: any) => String(g.material?._id || '') === material) : groups;
    return NextResponse.json(filtered, {
      headers: { 'Cache-Control': `public, s-maxage=${CATALOG_REVALIDATE_SECONDS}, stale-while-revalidate=600` },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
