import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import CustomRequest from '@/lib/models/CustomRequest';

const ALLOWED_FIELDS = ['username', 'phoneNumber', 'category', 'material', 'pieceType', 'budgetNrs', 'description', 'images'];

function sanitizeBody(body: Record<string, unknown>) {
  const allowed: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in body) allowed[key] = body[key];
  }
  return allowed;
}

function validateBody(body: Record<string, unknown>): string | null {
  if (!body.username || typeof body.username !== 'string' || body.username.trim().length < 2) {
    return 'Name is required (min 2 characters)';
  }
  if (!body.phoneNumber || typeof body.phoneNumber !== 'string' || !/^\+?[\d\s\-()]{7,20}$/.test(body.phoneNumber)) {
    return 'Valid phone number is required';
  }
  if (body.budgetNrs != null && typeof body.budgetNrs !== 'number') {
    return 'Budget must be a number';
  }
  if (body.description && typeof body.description !== 'string') {
    return 'Description must be a string';
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    if (typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Body must be a JSON object' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    const sanitized = sanitizeBody(body);

    const validationError = validateBody(sanitized);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    if (req.body) {
      const rawText = await req.clone().text();
      if (new Blob([rawText]).size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'Request body too large (max 5MB)' }, { status: 413, headers: { 'Cache-Control': 'no-store' } });
      }
    }

    await connectDB();
    const request = await CustomRequest.create(sanitized);
    const toPopulate: string[] = ['category'];
    if (sanitized.material) toPopulate.push('material');
    const populated = await request.populate(toPopulate);
    return NextResponse.json(populated, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (err: any) {
    const message = err?.message || 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
