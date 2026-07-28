import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import CustomRequest from '@/lib/models/CustomRequest';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    await connectDB();
    const request = await CustomRequest.create(body);
    const toPopulate: string[] = ['category'];
    if (body.material) toPopulate.push('material');
    const populated = await request.populate(toPopulate);
    return NextResponse.json(populated, { status: 201 });
  } catch (err: any) {
    const message = err?.errors
      ? Object.values(err.errors).map((e: any) => e.message).join(', ')
      : err?.message || 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
