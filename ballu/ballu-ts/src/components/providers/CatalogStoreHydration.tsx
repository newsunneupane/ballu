'use client';

import { ReactNode, useMemo } from 'react';
import { productService } from '@/services/product-service';

interface CatalogStoreHydrationProps {
  items: unknown[];
  collections: unknown[];
  materials: unknown[];
  groups: unknown[];
  children: ReactNode;
}

export default function CatalogStoreHydration({
  items,
  collections,
  materials,
  groups,
  children,
}: CatalogStoreHydrationProps) {
  useMemo(() => {
    productService.seed({
      items: (items || []) as any[],
      collections: (collections || []) as any[],
      materials: (materials || []) as any[],
      groups: (groups || []) as any[],
    });
  }, [items, collections, materials, groups]);

  return <>{children}</>;
}
