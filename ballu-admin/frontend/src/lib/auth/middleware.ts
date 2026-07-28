import { NextResponse } from 'next/server';
import { verifyToken } from './token';

export function requireAuth(request: Request): NextResponse | null {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const payload = verifyToken(auth.slice(7));
  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
  return null;
}
