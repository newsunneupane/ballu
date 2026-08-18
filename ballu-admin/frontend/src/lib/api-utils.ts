import { NextResponse } from 'next/server';

const isProduction = process.env.NODE_ENV === 'production';

export function errorResponse(err: unknown) {
  console.error('[api] error:', err);
  const message = err instanceof Error && !isProduction ? err.message : 'Internal server error';
  return NextResponse.json(
    { error: message },
    { status: 500, headers: { 'Cache-Control': 'no-store' } }
  );
}

export function isObjectId(id: unknown): boolean {
  return typeof id === 'string' && /^[a-f\d]{24}$/i.test(id);
}

export function badRequest(message: string) {
  return NextResponse.json(
    { error: message },
    { status: 400, headers: { 'Cache-Control': 'no-store' } }
  );
}
