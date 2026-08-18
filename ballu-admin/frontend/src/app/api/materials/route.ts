import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Material from '@/lib/models/Material';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';
import { nprToInr } from '@/lib/utils/units';
import { revalidateCatalog } from '@/lib/revalidateCatalog';

export const dynamic = 'force-dynamic';

function withRate(materials: Array<Record<string, unknown>>) {
  return materials.map((m) => ({
    ...m,
    rateInr: nprToInr(Number(m.rateNpr) || 0),
  }));
}

export async function GET(req: NextRequest) {
  try {
    const authResult = requireAuth(req);
    if (authResult) return authResult;
    await connectDB();
    const materials = await Material.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(withRate(materials), {
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

    if (body.rateNpr == null || Number(body.rateNpr) <= 0) {
      return NextResponse.json({ error: 'Material rate (NPR/g) is required and must be greater than 0' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    const existing = await Material.findOne({
      $or: [
        { 'name.en': { $regex: new RegExp(`^${body.name?.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
        { 'name.np': body.name?.np },
      ],
    });
    if (existing) {
      return NextResponse.json({ error: 'A material with this name already exists' }, { status: 409, headers: { 'Cache-Control': 'no-store' } });
    }

    const material = await Material.create({ ...body, rateNpr: Number(body.rateNpr) });
    const lean = material.toObject();
    revalidateCatalog();
    return NextResponse.json({ ...lean, rateInr: nprToInr(lean.rateNpr) }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return errorResponse(err);
  }
}
