import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Material from '@/lib/models/Material';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    await connectDB();
    const materials = await Material.find().sort({ createdAt: -1 });
    return NextResponse.json(materials);
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
    const material = await Material.create(body);
    return NextResponse.json(material, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
