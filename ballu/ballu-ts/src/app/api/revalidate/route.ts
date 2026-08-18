import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { CATALOG_TAG, STORE_SETTINGS_TAG } from '@/lib/server/catalog-data';

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const provided = req.headers.get('x-revalidate-secret');
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    revalidateTag(CATALOG_TAG, 'seconds');
    revalidateTag(STORE_SETTINGS_TAG, 'seconds');
    revalidatePath('/', 'layout');
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
