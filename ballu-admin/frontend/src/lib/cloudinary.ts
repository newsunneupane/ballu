export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  aspect?: string;
  crop?: 'fill' | 'fit' | 'scale' | 'crop';
  gravity?: string;
}

const CLOUDINARY_DOMAINS = ['cloudinary.com', 'res.cloudinary.com'];

function isCloudinaryUrl(src: string): boolean {
  try {
    const url = new URL(src);
    return CLOUDINARY_DOMAINS.some((d) => url.hostname.endsWith(d));
  } catch {
    return false;
  }
}

export function cloudinaryUrl(src: string, options: CloudinaryTransformOptions = {}): string {
  if (!src) return src;
  if (!isCloudinaryUrl(src)) return src;

  const parts = src.split('/image/upload/');
  if (parts.length !== 2) return src;

  const { width, height, aspect, crop = 'fill', gravity = 'center' } = options;

  const transforms: string[] = [];
  if (aspect) transforms.push(`ar_${aspect}`);
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  transforms.push(`c_${crop}`);
  if (gravity) transforms.push(`g_${gravity}`);
  transforms.push('e_sharpen', 'q_auto:good', 'f_auto', 'dpr_auto');

  return `${parts[0]}/image/upload/${transforms.join(',')}/${parts[1]}`;
}
