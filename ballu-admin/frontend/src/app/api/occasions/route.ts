import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Occasion from '@/lib/models/Occasion';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse, badRequest } from '@/lib/api-utils';
import { revalidateCatalog } from '@/lib/revalidateCatalog';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = requireAuth(req);
    if (authResult) return authResult;
    await connectDB();
    const occasions = await Occasion.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(occasions, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const authError = requireAuth(req);
    if (authError) return authError;
    await connectDB();
    const body = await req.json();

    if (!body.name?.en) {
      return badRequest('Name (English) is required');
    }

    const existing = await Occasion.findOne({
      $or: [{ 'name.en': body.name.en }, { 'name.np': body.name.np }],
    });
    if (existing) {
      return NextResponse.json({ error: 'An occasion with this name already exists' }, { status: 409, headers: { 'Cache-Control': 'no-store' } });
    }

    const occasion = await Occasion.create({ name: body.name, description: body.description, image: body.image });
    revalidateCatalog();
    return NextResponse.json(occasion, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return errorResponse(err);
  }
}
