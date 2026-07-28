import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Category from '@/lib/models/Category';

export async function GET() {
  await connectDB();
  const categories = await Category.find().sort({ createdAt: -1 });
  return NextResponse.json(categories, {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  });
}
