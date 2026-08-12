import { Product } from '@/types/product';
import { WHATSAPP_URL } from '@/lib/constants';

export function buildWhatsappLink(product: Product, priceLabel: string | null): string {
  const url = typeof window !== 'undefined' ? `${window.location.origin}/catalogue/${product.id}` : `/catalogue/${product.id}`;
  const parts = [
    `Hi, I'm interested in ${product.title} (ID: ${product.id})`,
    priceLabel ? `— ${priceLabel}` : '',
    url,
  ].filter(Boolean);
  return `${WHATSAPP_URL}?text=${encodeURIComponent(parts.join(' '))}`;
}
