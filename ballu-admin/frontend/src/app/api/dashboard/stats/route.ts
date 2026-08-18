import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth/middleware';
import { errorResponse } from '@/lib/api-utils';
import Item from '@/lib/models/Item';
import Material from '@/lib/models/Material';
import Collection from '@/lib/models/Collection';
import CustomRequest from '@/lib/models/CustomRequest';
import ItemInquiry from '@/lib/models/ItemInquiry';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authError = requireAuth(req);
    if (authError) return authError;

    await connectDB();

    const [items, materials, collections, customRequests, pendingRequests, itemInquiries, pendingInquiries] =
      await Promise.all([
        Item.countDocuments(),
        Material.countDocuments(),
        Collection.countDocuments(),
        CustomRequest.countDocuments(),
        CustomRequest.countDocuments({ status: 'Pending' }),
        ItemInquiry.countDocuments(),
        ItemInquiry.countDocuments({ status: 'Pending' }),
      ]);

    return NextResponse.json(
      { items, materials, collections, customRequests, pendingRequests, itemInquiries, pendingInquiries },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    return errorResponse(err);
  }
}
