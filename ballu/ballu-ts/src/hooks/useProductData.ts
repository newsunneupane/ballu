'use client';

import { useEffect, useState } from 'react';
import { productService, isProductStoreSeeded } from '@/services/product-service';

export function useProductData() {
  const [ready, setReady] = useState<boolean>(() => isProductStoreSeeded());

  useEffect(() => {
    if (ready) return;
    let cancelled = false;
    productService.ensureLoaded().then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [ready]);

  return ready;
}
