import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Material from '@/lib/models/Material';

export async function GET() {
  await connectDB();
  const materials = await Material.find().sort({ createdAt: -1 });
  return NextResponse.json(materials);
}
