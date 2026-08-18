import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import CustomRequest from '@/lib/models/CustomRequest';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authError = requireAuth(req);
    if (authError) return authError;
    await connectDB();
    const { searchParams } = new URL(req.url);
    const filter: Record<string, unknown> = {};
    const status = searchParams.get('status');
    if (status) filter.status = status;

    const requests = await CustomRequest.find(filter).populate('collection', 'name').populate('material', 'name').sort({ createdAt: -1 });
    return NextResponse.json(requests, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const request = await CustomRequest.create(body);
    const toPopulate: string[] = ['collection'];
    if (body.material) toPopulate.push('material');
    const populated = await request.populate(toPopulate);
    return NextResponse.json(populated, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return errorResponse(err);
  }
}
