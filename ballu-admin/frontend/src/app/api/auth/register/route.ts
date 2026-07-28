import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { errorResponse } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password, name, secret } = await req.json();

    const ADMIN_SECRET = process.env.ADMIN_SECRET || 'ballu-admin-2026';
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Invalid registration secret' }, { status: 403 });
    }

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ email: email.toLowerCase(), password: hashed, name });

    return NextResponse.json({ message: 'User created', user: { id: user._id, email: user.email, name: user.name } }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
