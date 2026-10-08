'use client';

import React from 'react';
import Link from 'next/link';
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
    <div className="text-bj-text-heading min-h-0 md:min-h-[30vh] flex flex-col justify-start md:justify-end bg-bj-bg-secondary">
      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 lg:px-16 pt-3 md:pt-6 pb-0 md:pb-2 text-center md:text-left">
        <div className="flex flex-col items-center md:flex-row md:items-end md:justify-between gap-0">
          <div className="flex flex-col items-center md:items-start space-y-0 max-w-4xl">
            <h1 className={`${cormorantSC.variable} ${cormorant.variable} antialiased collections-row-heading text-[clamp(1.4rem,3.5vw,2.4rem)] font-light leading-[1.15] text-bj-text-heading max-md:text-bj-gold-rich tracking-tight font-serif-editorial`}>
              <span className="block fade-in-up" style={{ animationDelay: '0ms' }}>
                The Collections
              </span>
            </h1>
            <span aria-hidden="true" className="md:hidden mx-auto mt-1 mb-2 block h-px w-12 bg-bj-gold/60" />
          </div>
        </div>
      </div>

      <div className="w-full pb-6 md:pb-8 overflow-hidden select-none">
        <div className="max-w-7xl w-full mx-auto px-6 md:px-12 lg:px-16">
          <CollectionsBento collections={topCollections} />
          <div className="mt-4 flex justify-end">
            <Link
              href="/collections"
              className="group inline-flex items-center gap-2 text-[12px] tracking-[0.25em] uppercase text-bj-gold transition-colors hover:text-bj-gold-rich"
            >
              <span>All Collections</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                &rarr;
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
