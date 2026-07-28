import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import StoreSettings from '@/lib/models/StoreSettings';
import { calculateFinalPrice } from '@/lib/utils/priceCalculator';

export async function GET() {
  await connectDB();
  const settings = await StoreSettings.findOne()
    .populate('pieceOfTheWeek.material', 'name')
    .populate('pieceOfTheWeek.category', 'name')
    .populate('pieceOfTheWeek.item', 'name images purity weightGrams material wastageGrams makingCharges boutiqueDeduction diamondValue')
    .lean();
  if (!settings) {
    return NextResponse.json({
      contactEmail: '',
      phoneNumbers: [],
      timings: [
        { dayFrom: 'Mon', dayTo: 'Sat', timeFrom: '10', timeTo: '19' },
        { dayFrom: 'Sun', dayTo: 'Sun', timeFrom: '11', timeTo: '17' },
      ],
    }, {
      headers: { 'Cache-Control': 'public, max-age=300' },
    });
  }

  if (settings.pieceOfTheWeek?.item) {
    const item = settings.pieceOfTheWeek.item as any;
    try {
      const pricing = await calculateFinalPrice({
        materialId: item.material?.toString() || '',
        weightGrams: item.weightGrams,
        wastageGrams: item.wastageGrams || 0,
        makingCharges: item.makingCharges || 0,
        boutiqueDeduction: item.boutiqueDeduction || 0,
        diamondValue: item.diamondValue || 0,
      });
      item.pricing = pricing;
    } catch {
      item.pricing = null;
    }
  }

  return NextResponse.json(settings, {
    headers: { 'Cache-Control': 'public, max-age=300' },
  });
}
