'use client';

import { useEffect, useState } from 'react';
import { productService } from '@/services/product-service';

export function useProductData() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    productService.ensureLoaded().then(() => setReady(true));
  }, []);

  return ready;
}
