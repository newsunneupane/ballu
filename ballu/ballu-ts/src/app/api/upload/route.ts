import { NextRequest, NextResponse } from 'next/server';
import cloudinary from 'cloudinary';

export const dynamic = 'force-dynamic';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.v2.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

interface UploadBody {
  file?: string;
}

export async function POST(req: NextRequest) {
  try {
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Image uploads are not configured' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
    }

    let body: UploadBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    if (!body.file || typeof body.file !== 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    if (body.file.length > MAX_FILE_SIZE * 1.5) {
      return NextResponse.json({ error: 'Image exceeds the 2MB limit' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    const matches = body.file.match(/^data:([a-zA-Z0-9-]+\/[a-zA-Z0-9-+.]+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: 'Invalid file format' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    const mimeType = matches[1];
    if (!ALLOWED_TYPES.includes(mimeType)) {
      return NextResponse.json({ error: 'Unsupported image type' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    const result = await cloudinary.v2.uploader.upload(body.file, {
      folder: 'ballu/custom-requests',
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    });

    return NextResponse.json({ url: result.secure_url, public_id: result.public_id }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
