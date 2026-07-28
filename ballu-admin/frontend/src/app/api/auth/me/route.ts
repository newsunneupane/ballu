import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/token';
import { errorResponse } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
    }

    const payload = verifyToken(auth.slice(7));
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
    }

    return NextResponse.json({ user: payload }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
