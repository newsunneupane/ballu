import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import StoreSettings from '@/lib/models/StoreSettings';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    await connectDB();
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create({
        contactEmail: '',
        phoneNumbers: [],
        timings: [
          { dayFrom: 'Mon', dayTo: 'Sat', timeFrom: '10', timeTo: '19' },
          { dayFrom: 'Sun', dayTo: 'Sun', timeFrom: '11', timeTo: '17' },
        ],
      });
    }
    return NextResponse.json(settings);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authError = requireAuth(req);
    if (authError) return authError;
    await connectDB();
    const body = await req.json();
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create(body);
    } else {
      Object.assign(settings, body);
      await settings.save();
    }
    return NextResponse.json(settings);
  } catch (err) {
    return errorResponse(err);
  }
}
