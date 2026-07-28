import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ItemInquiry from '@/lib/models/ItemInquiry';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  try {
    const authError = requireAuth(req);
    if (authError) return authError;
    await connectDB();
    const { searchParams } = new URL(req.url);
    const filter: Record<string, unknown> = {};
    const status = searchParams.get('status');
    if (status) filter.status = status;

    const inquiries = await ItemInquiry.find(filter).populate('item', 'name images').sort({ createdAt: -1 });
    return NextResponse.json(inquiries);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const inquiry = await ItemInquiry.create(body);
    const populated = await inquiry.populate('item', 'name images');
    return NextResponse.json(populated, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
