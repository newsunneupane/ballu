'use client';

import React from 'react';
import Link from 'next/link';
import { Cormorant_Garamond, Tenor_Sans } from 'next/font/google';
import { Product } from '@/types/product';
import Badge from '@/components/ui/Badge';

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
  if (viewMode === 'LIST') {
    return (
      <Link
        href={`/catalogue/${product.id}`}
        className="group grid grid-cols-[50px_2fr_1fr_100px] sm:grid-cols-[64px_2fr_1fr_1fr_1fr_1fr_1fr_120px] items-center py-4 hover:bg-[#120e0a]/40 transition-colors cursor-pointer border-b border-[#1f1a10] last:border-b-0"
      >
        <div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#423722] to-[#1a140f] rounded-sm relative border border-[#2b2415]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(235,211,180,0.15)_0%,transparent_70%)]" />
          </div>
        </div>
        <div className="pl-4 min-w-0">
          <div className="text-base sm:text-[18px] text-[#ebd3b4] font-normal leading-tight tracking-wide truncate">{product.title}</div>
          <div className="text-[10px] sm:text-xs font-light text-[#8e897e] mt-1 opacity-80 truncate">{product.subTitle}</div>
          <div className="sm:hidden text-[10px] text-[#6e695f] tracking-wide mt-1">{product.material} • {product.karat} • {product.weight.toLowerCase()}</div>
        </div>
        <div className="text-sm font-thin text-[#ebd3b4] opacity-80 hidden sm:block">{product.type || product.category}</div>
        <div className="text-sm font-thin text-[#ebd3b4] opacity-80 hidden sm:block">{product.material}</div>
        <div className="text-sm font-thin text-[#ebd3b4] opacity-80 hidden sm:block">{product.karat}</div>
        <div className="text-sm font-light text-[#ebd3b4] opacity-80 hidden sm:block">{product.weight.toLowerCase()}</div>
        <div className="text-base sm:text-[20px] text-[#cda274] font-medium tracking-wide">{product.price}</div>
        <div className="text-right">
          <span className="text-[10px] group-hover:translate-x-2 transition-transform duration-200 tracking-[0.2em] uppercase text-[#cda274] flex items-center justify-end gap-1.5 mr-2 sm:mr-4 ml-auto">
            <span className="hidden sm:inline">View</span> →
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/catalogue/${product.id}`}
      className="group relative flex flex-col bg-[#080605] border border-[#2b2415] overflow-hidden transition-all duration-500 ease-out hover:border-[#4a3d24] hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.7)] cursor-pointer"
    >
      <div className="relative aspect-[3/4] w-full">
        <div className="absolute inset-0 z-10 overflow-hidden border-b border-[#2b2415] transition-transform duration-500 ease-out origin-top group-hover:scale-[1.04]">
          <div className="absolute inset-0 bg-[#14100c] transition-transform duration-700 ease-out group-hover:scale-110 origin-center" />
        </div>
        <div className="absolute inset-0 z-20 p-4 pointer-events-none">
          {product.tag && <Badge>{product.tag}</Badge>}
        </div>
      </div>
      <div className="relative z-0 px-5 pb-[10px] pt-[23px] bg-[#0b0806]">
        <h3 className="text-base font-normal text-[#ebd3b4] mb-1">{product.title}</h3>
        <p className="text-xs text-[#8e897e] mb-4 opacity-80">{product.subTitle}</p>
        <div className="flex justify-between items-baseline pt-3 border-t border-[#2b2415]">
          <span className="text-[10px] text-[#6e695f] tracking-wide">{product.material} • {product.karat} • {product.weight}</span>
          <span className="text-sm text-[#ebd3b4] [font-variant-numeric:lining-nums]">{product.price}</span>
        </div>
      </div>
    </Link>
  );
}
