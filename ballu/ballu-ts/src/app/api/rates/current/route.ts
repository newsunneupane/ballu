import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Material from '@/lib/models/Material';

const INR_PER_NPR_DIVISOR = 1.6;

export async function GET() {
  try {
    await connectDB();

    const materials = await Material.find({ rateNpr: { $gt: 0 } }).sort({ createdAt: 1 }).lean();

    const rates = materials.map((mat) => {
      const matName = (mat.name as any)?.en || mat._id.toString();
      const ratePerGramNrs = Number(mat.rateNpr) || 0;
      return {
        name: matName,
        ratePerGramNrs,
        ratePerGramInr: Math.round((ratePerGramNrs / INR_PER_NPR_DIVISOR) * 100) / 100,
      };
    });

    return NextResponse.json({ rates }, {
      headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
    });
  } catch {
    return NextResponse.json({ rates: [] }, {
      headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
    });
  }
}