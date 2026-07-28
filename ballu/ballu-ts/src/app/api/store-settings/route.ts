import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import StoreSettings from '@/lib/models/StoreSettings';

export async function GET() {
  await connectDB();
  const settings = await StoreSettings.findOne().lean();
  if (!settings) {
    return NextResponse.json({
      contactEmail: '',
      phoneNumbers: [],
      timings: [
        { dayFrom: 'Mon', dayTo: 'Sat', timeFrom: '10', timeTo: '19' },
        { dayFrom: 'Sun', dayTo: 'Sun', timeFrom: '11', timeTo: '17' },
      ],
    });
  }
  return NextResponse.json(settings);
}
