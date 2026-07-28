import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { signToken } from '@/lib/auth/token';
import { checkRateLimit, recordFailedAttempt, resetAttempts } from '@/lib/auth/rate-limiter';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    const limiter = checkRateLimit(email);
    if (!limiter.allowed) {
      return NextResponse.json({ error: limiter.message }, { status: 429, headers: { 'Cache-Control': 'no-store' } });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      recordFailedAttempt(email);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      recordFailedAttempt(email);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
    }

    resetAttempts(email);

    const token = signToken({ userId: user._id.toString(), email: user.email, name: user.name });

    return NextResponse.json({ token, user: { id: user._id, email: user.email, name: user.name } }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
