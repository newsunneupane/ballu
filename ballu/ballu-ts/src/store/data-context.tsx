'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Product } from '@/types/product';
import { productService } from '@/services/product-service';

interface DataContextValue {
  products: Product[];
  refreshProducts: () => void;
  importFromAdmin: (json: string) => { success: boolean; count: number; errors: string[] };
  exportProducts: () => string;
  resetProducts: () => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => productService.getAll());

  const refreshProducts = useCallback(() => {
    setProducts([...productService.getAll()]);
  }, []);

  const importFromAdmin = useCallback((json: string) => {
    const result = productService.importFromAdmin(json);
    if (result.success) {
      setProducts([...productService.getAll()]);
    }
    return result;
  }, []);

  const exportProducts = useCallback(() => {
    return productService.exportAll();
  }, []);

  const resetProducts = useCallback(() => {
    productService.reset();
    setProducts([...productService.getAll()]);
  }, []);

  return (
    <DataContext.Provider value={{ products, refreshProducts, importFromAdmin, exportProducts, resetProducts }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
