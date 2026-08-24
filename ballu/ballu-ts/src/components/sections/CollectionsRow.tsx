'use client';

import React from 'react';
import { Cormorant_Garamond, Cormorant_SC } from 'next/font/google';
import { productService } from '@/services/product-service';
import { useProductData } from '@/hooks/useProductData';
import CollectionsBento from '@/components/sections/CollectionsBento';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-serif-editorial',
});

const cormorantSC = Cormorant_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-serif-title',
});

export default function CollectionsRow() {
  useProductData();
  const collections = productService.getCollectionsCards();
  const topCollections = [...collections]
    .sort((a, b) => parseInt(b.pieces || '0') - parseInt(a.pieces || '0'))
    .slice(0, 8);

  return (
    <div className="text-bj-text-heading min-h-[30vh] flex flex-col justify-end bg-bj-bg-secondary">
      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 lg:px-16 pt-16 pb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="flex flex-col space-y-3 max-w-4xl">
            <h1 className={`${cormorantSC.variable} ${cormorant.variable} antialiased collections-row-heading text-[clamp(1.8rem,5vw,3.5rem)] font-light leading-[1.1] text-bj-text-heading tracking-tight font-serif-editorial`}>
              <span className="block fade-in-up" style={{ animationDelay: '0ms' }}>
                The Collections
              </span>
            </h1>
          </div>
        </div>
      </div>

      <div className="w-full pb-20 overflow-hidden select-none">
        <div className="max-w-7xl w-full mx-auto px-6 md:px-12 lg:px-16">
          <CollectionsBento collections={topCollections} />
        </div>
      </div>
    </div>
  );
}
