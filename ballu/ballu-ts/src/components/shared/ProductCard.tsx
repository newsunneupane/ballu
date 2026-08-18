'use client';

import React from 'react';
import Link from 'next/link';
import { Cormorant_Garamond, Tenor_Sans } from 'next/font/google';
import { FaWhatsapp } from 'react-icons/fa';
import { Product } from '@/types/product';
import { cloudinaryUrl } from '@/lib/cloudinary';
import Badge from '@/components/ui/Badge';
import { useCurrency } from '@/hooks/useCurrency';
import { buildWhatsappLink } from '@/lib/utils/whatsapp';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

const tenorSans = Tenor_Sans({
  subsets: ['latin'],
  weight: ['400'],
});

interface ProductCardProps {
  product: Product;
  viewMode?: 'GRID' | 'LIST';
}

export default function ProductCard({ product, viewMode = 'GRID' }: ProductCardProps) {
  const { format } = useCurrency();
  const priceDisplay = !product.showPrice
    ? 'Price on Request'
    : product.priceNpr != null
    ? format(product.priceNpr)
    : '—';

  const openWhatsapp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(
      buildWhatsappLink(product, product.showPrice && product.priceNpr != null ? format(product.priceNpr) : null),
      '_blank',
      'noopener,noreferrer'
    );
  };

  if (viewMode === 'LIST') {
    return (
      <Link
        href={`/catalogue/${product.id}`}
        className="group grid grid-cols-[50px_2fr_1fr_100px] sm:grid-cols-[64px_2fr_1fr_1fr_1fr_1fr_1fr_120px] items-center py-4 hover:bg-bj-hover-bg transition-colors cursor-pointer border-b border-bj-border-light last:border-b-0"
      >
        <div>
          {product.images?.[0] ? (
            <img
              src={cloudinaryUrl(product.images[0], { width: 96, aspect: '1:1' })}
              alt={product.title}
              className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-sm relative border border-bj-border"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#423722] to-[#1a140f] rounded-sm relative border border-bj-border">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(235,211,180,0.15)_0%,transparent_70%)]" />
            </div>
          )}
        </div>
        <div className="pl-4 min-w-0">
          <div className="text-base sm:text-[18px] text-bj-text-gold font-normal leading-tight tracking-wide truncate flex items-center gap-2">
            {product.title}
            {!product.isAvailable && (
              <span className="text-[8px] tracking-widest uppercase text-red-400 border border-red-400/30 rounded px-1.5 py-0.5 shrink-0">Unavailable - Need to Order</span>
            )}
          </div>
          <div className="text-[10px] sm:text-xs font-light text-bj-text-muted mt-1 opacity-80 truncate">{product.subTitle}</div>
          <div className="sm:hidden text-[10px] text-bj-text-dim tracking-wide mt-1">{product.material} • {product.karat} • {product.weight.toLowerCase()}{product.caratWeight ? ` • ${product.caratWeight}ct` : ''}</div>
        </div>
        <div className="text-sm font-thin text-bj-text-gold opacity-80 hidden sm:block">{product.type || product.category}</div>
        <div className="text-sm font-thin text-bj-text-gold opacity-80 hidden sm:block">{product.material}</div>
        <div className="text-sm font-thin text-bj-text-gold opacity-80 hidden sm:block">{product.karat}</div>
        <div className="text-sm font-light text-bj-text-gold opacity-80 hidden sm:block">{product.weight.toLowerCase()}</div>
        <div className="text-base sm:text-[20px] text-bj-gold-alt font-medium tracking-wide">{priceDisplay}</div>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={openWhatsapp}
            aria-label="Ask about this piece on WhatsApp"
            className="text-[#25D366] hover:scale-110 transition-transform shrink-0"
          >
            <FaWhatsapp size={16} />
          </button>
          <span className="text-[10px] group-hover:translate-x-2 transition-transform duration-200 tracking-[0.2em] uppercase text-bj-gold-alt hidden sm:flex items-center gap-1.5">
            <span className="hidden sm:inline">View</span> →
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/catalogue/${product.id}`}
      className="group relative flex flex-col bg-bj-bg-card border border-bj-border overflow-hidden transition-all duration-500 ease-out hover:border-[#4a3d24] hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.7)] cursor-pointer"
    >
      <div className="relative aspect-[3/4] w-full">
        {product.images?.[0] ? (
          <div className="absolute inset-0 overflow-hidden border-b border-bj-border transition-transform duration-500 ease-out origin-top group-hover:scale-[1.04]">
            <img
              src={cloudinaryUrl(product.images[0], { width: 600, aspect: '3:4' })}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 origin-center"
            />
          </div>
        ) : (
          <div className="absolute inset-0 z-10 overflow-hidden border-b border-bj-border transition-transform duration-500 ease-out origin-top group-hover:scale-[1.04]">
            <div className="absolute inset-0 bg-bj-bg-card transition-transform duration-700 ease-out group-hover:scale-110 origin-center" />
          </div>
        )}
        <div className="absolute inset-0 z-20 p-4 flex items-start justify-between pointer-events-none">
          <div className="flex flex-col gap-1.5">
            {product.tag && <Badge>{product.tag}</Badge>}
            {product.estimatedMakingDays?.min != null && (
              <Badge>
                Ready {product.estimatedMakingDays.min}
                {product.estimatedMakingDays.max != null && product.estimatedMakingDays.max !== product.estimatedMakingDays.min ? `–${product.estimatedMakingDays.max}` : ''}d
              </Badge>
            )}
          </div>
          <button
            onClick={openWhatsapp}
            aria-label="Ask about this piece on WhatsApp"
            className="pointer-events-auto w-8 h-8 rounded-full bg-bj-bg-ticker/60 backdrop-blur-md border border-white/10 text-[#25D366] flex items-center justify-center hover:scale-110 transition-transform"
          >
            <FaWhatsapp size={15} />
          </button>
        </div>
        {!product.isAvailable && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none whitespace-nowrap">
            <Badge className="!bg-red-950/80 !text-red-300 !border-red-400/30">Unavailable - Need to Order</Badge>
          </div>
        )}
      </div>
      <div className="relative z-0 px-5 pb-[10px] pt-[23px] bg-bj-bg-card-body">
        <h3 className="text-base font-normal text-bj-text-gold mb-1">{product.title}</h3>
        <p className="text-xs text-bj-text-muted mb-4 opacity-80">{product.subTitle}</p>
        <div className="flex justify-between items-baseline pt-3 border-t border-bj-border">
          <span className="text-[10px] text-bj-text-dim tracking-wide">{product.material} • {product.karat} • {product.weight}{product.caratWeight ? ` • ${product.caratWeight}ct` : ''}</span>
          <span className="text-sm text-bj-text-gold [font-variant-numeric:lining-nums]">{priceDisplay}</span>
        </div>
      </div>
    </Link>
  );
}
