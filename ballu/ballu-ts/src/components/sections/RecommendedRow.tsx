'use client';

import React, { useEffect, useState } from 'react';
import { Cormorant_Garamond } from 'next/font/google';
import { productService } from '@/services/product-service';
import { useProductData } from '@/hooks/useProductData';
import { getAffinity } from '@/lib/visitTracking';
import { Product } from '@/types/product';
import ProductCard from '@/components/shared/ProductCard';

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

export default function RecommendedRow() {
  const dataReady = useProductData();
  const [products, setProducts] = useState<Product[]>([]);
  const [heading, setHeading] = useState('Most Loved');

  useEffect(() => {
    if (!dataReady) return;
    const { collection, material } = getAffinity();
    if (collection || material) {
      const filtered = productService.getFiltered({
        collections: collection ? [collection] : ['ALL'],
        material: material || 'ALL',
        sort: 'most-viewed',
      });
      if (filtered.length > 0) {
        setHeading('Recommended For You');
        setProducts(filtered.slice(0, 8));
        return;
      }
    }
    setHeading('Most Loved');
    setProducts(productService.getTopViewed(8));
  }, [dataReady]);

  if (!dataReady || products.length === 0) return null;

  return (
    <div className="bg-bj-bg-elevated px-4 sm:px-6 md:px-16 lg:px-15 py-16 md:py-24">
      <h2 className={`${cormorant.className} recommended-row-heading text-3xl md:text-4xl font-light text-bj-text-heading mb-10`}>
        {heading}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} viewMode="GRID" />
        ))}
      </div>
    </div>
  );
}
