import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import StoreSettings from '@/lib/models/StoreSettings';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse, isObjectId } from '@/lib/api-utils';
import { revalidateCatalog } from '@/lib/revalidateCatalog';

export const dynamic = 'force-dynamic';

function sanitizePieceOfTheWeek(pieceOfTheWeek: { item?: string; material?: string; collection?: string } | null | undefined) {
  if (!pieceOfTheWeek || !pieceOfTheWeek.item) return null;
  return {
    item: pieceOfTheWeek.item,
    material: pieceOfTheWeek.material || undefined,
    collection: pieceOfTheWeek.collection || undefined,
  };
}

const BANNER_TYPES = ['collection', 'material', 'group', 'item'];
const MAX_BANNERS = 8;

interface HeroBannerInput {
  type: string;
  refId: string;
  image: string;
  title?: string;
  subtitle?: string;
}

function sanitizeHeroBanners(banners: unknown): HeroBannerInput[] {
  if (!Array.isArray(banners)) return [];
  const seen = new Set<string>();
  return banners
    .filter((b): b is HeroBannerInput => {
      const candidate = b as HeroBannerInput | null;
      if (!candidate) return false;
      const valid =
        BANNER_TYPES.includes(candidate.type) &&
        isObjectId(candidate.refId) &&
        typeof candidate.image === 'string' &&
        candidate.image.trim().length > 0;
      if (!valid) return false;
      const key = `${candidate.type}:${candidate.refId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((b) => ({
      type: b.type,
      refId: b.refId,
      image: b.image.trim(),
      title: typeof b.title === 'string' && b.title.trim() ? b.title.trim() : undefined,
      subtitle: typeof b.subtitle === 'string' && b.subtitle.trim() ? b.subtitle.trim() : undefined,
    }))
    .slice(0, MAX_BANNERS);
}

export async function GET(req: NextRequest) {
  try {
    const authResult = requireAuth(req);
    if (authResult) return authResult;
    await connectDB();
    let settings = await StoreSettings.findOne().populate('pieceOfTheWeek.item', 'name images purity weightGrams');
    if (!settings) {
      settings = await StoreSettings.create({
        contactEmail: '',
        phoneNumbers: [],
        timings: [
          { dayFrom: 'Mon', dayTo: 'Sat', timeFrom: '10', timeTo: '19' },
          { dayFrom: 'Sun', dayTo: 'Sun', timeFrom: '11', timeTo: '17' },
        ],
      });
    }
    return NextResponse.json(settings, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authError = requireAuth(req);
    if (authError) return authError;
    await connectDB();
    const body = await req.json();

    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create({
        contactEmail: '',
        phoneNumbers: [],
        timings: [
          { dayFrom: 'Mon', dayTo: 'Sat', timeFrom: '10', timeTo: '19' },
          { dayFrom: 'Sun', dayTo: 'Sun', timeFrom: '11', timeTo: '17' },
        ],
      });
    }

    const patch: Record<string, unknown> = {};
    if (body.contactEmail !== undefined) patch.contactEmail = body.contactEmail;
    if (body.phoneNumbers !== undefined) patch.phoneNumbers = body.phoneNumbers;
    if (body.timings !== undefined) patch.timings = body.timings;
    if (body.tickerItems !== undefined) patch.tickerItems = body.tickerItems;
    if (body.pieceOfTheWeek !== undefined) patch.pieceOfTheWeek = sanitizePieceOfTheWeek(body.pieceOfTheWeek);
    if (body.heroBanners !== undefined) patch.heroBanners = sanitizeHeroBanners(body.heroBanners);

    Object.assign(settings, patch);
    await settings.save();

    const populated = await settings.populate('pieceOfTheWeek.item', 'name images purity weightGrams');
    revalidateCatalog();
    return NextResponse.json(populated, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
