import { NextResponse } from 'next/server';

const isProduction = process.env.NODE_ENV === 'production';

export function errorResponse(err: unknown) {
  const message = err instanceof Error && !isProduction ? err.message : 'Internal server error';
  return NextResponse.json(
    { error: message },
    { status: 500, headers: { 'Cache-Control': 'no-store' } }
  );
}
