import { Product } from '@/types/product';
import { PHONE, SITE } from '@/lib/constants';

export function whatsappBaseUrl(phoneNumber?: string | null): string {
  const digits = (phoneNumber || PHONE).replace(/[^0-9]/g, '');
  return `https://wa.me/${digits}`;
}

function groupName(product: Product): string {
  return (
    product._apiItem?.group?.name?.en ||
    product.karat ||
    product.purity ||
    ''
  );
}

export function buildWhatsappLink(
  product: Product,
  priceLabel: string | null,
  phoneNumber?: string | null
): string {
  const group = groupName(product);
  const parts = [
    `Hi, I'm interested in ${product.title}${group ? ` (${group})` : ''}`,
    `(ID: ${product.id})`,
    priceLabel ? `— ${priceLabel}` : '',
    `— ${SITE.fullName}`,
  ].filter(Boolean);
  return `${whatsappBaseUrl(phoneNumber)}?text=${encodeURIComponent(parts.join(' '))}`;
}
