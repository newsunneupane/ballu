'use client';

import { ReactNode, useMemo } from 'react';
import { productService } from '@/services/product-service';

interface CatalogStoreHydrationProps {
  items: unknown[];
  collections: unknown[];
  materials: unknown[];
  groups: unknown[];
  occasions: unknown[];
  children: ReactNode;
}

export default function CatalogStoreHydration({
  items,
  collections,
  materials,
  groups,
  occasions,
  children,
}: CatalogStoreHydrationProps) {
  useMemo(() => {
    productService.seed({
      items: (items || []) as any[],
      collections: (collections || []) as any[],
      materials: (materials || []) as any[],
      groups: (groups || []) as any[],
      occasions: (occasions || []) as any[],
    });
  }, [items, collections, materials, groups, occasions]);

  return <>{children}</>;
}
