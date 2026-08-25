'use client';

import React from 'react';
import { Cormorant_Garamond, Cormorant_SC } from 'next/font/google';
import { productService } from '@/services/product-service';
import { useProductData } from '@/hooks/useProductData';
import CollectionsGrid from '@/components/sections/CollectionsGrid';

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

export default function AllCollectionsPage() {
  const ready = useProductData();
  const collections = productService.getCollectionsCards();

  return (
    <div
      className={`${cormorant.variable} ${cormorantSC.variable} min-h-screen bg-bj-bg-secondary text-bj-text-heading px-6 md:px-12 lg:px-16 py-16 md:py-24`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-14">
          <p className="text-[11px] tracking-[0.4em] uppercase text-bj-gold/80">
            Everything
          </p>
          <h1 className="mt-3 font-serif-title text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.1] text-bj-text-heading">
            All Collections
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-bj-text-muted">
            Browse the complete range — every collection in one place.
          </p>
        </div>

        {!ready ? (
          <p className="text-[12px] tracking-[0.3em] uppercase text-bj-text-muted">
            Loading ...
          </p>
        ) : (
          <CollectionsGrid collections={collections} />
        )}
      </div>
    </div>
  );
}
