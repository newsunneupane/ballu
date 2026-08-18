import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import StoreSettings from '@/lib/models/StoreSettings';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';
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
    const sanitized = {
      ...body,
      pieceOfTheWeek: sanitizePieceOfTheWeek(body.pieceOfTheWeek),
    };
    const settings = await StoreSettings.findOneAndUpdate({}, sanitized, {
      upsert: true,
      new: true,
      runValidators: true,
    }).populate('pieceOfTheWeek.item', 'name images purity weightGrams');
    revalidateCatalog();
    return NextResponse.json(settings, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
