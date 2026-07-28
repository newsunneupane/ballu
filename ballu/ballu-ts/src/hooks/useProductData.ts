'use client';

import { useEffect, useState } from 'react';
import { productService } from '@/services/product-service';

export function useProductData() {
  const [ready, setReady] = useState(productService.isLoaded());

  useEffect(() => {
    if (productService.isLoaded()) {
      setReady(true);
      return;
    }
    productService.ensureLoaded().then(() => setReady(true));
  }, []);

  return ready;
}
