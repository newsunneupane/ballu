import { Product, ProductFilters } from '@/types/product';
import { Collection } from '@/types/collection';
import { products } from '@/data/products';
import { categoryConfigMap, categorySlugMap, categoryFromSlug, categoryPageConfig } from '@/data/collections';
import { api } from './api';

let productStore: Product[] = [...products];
let loaded = false;
let loadingPromise: Promise<void> | null = null;

let categoryStore: any[] = [];
let categoriesLoaded = false;
let categoriesLoadingPromise: Promise<void> | null = null;

let materialStore: any[] = [];
let materialsLoaded = false;
let materialsLoadingPromise: Promise<void> | null = null;

function formatCurrency(amount: number): string {
  return `Rs ${amount.toLocaleString('en-IN')}`;
}

function transformApiItem(item: any): Product {
  const catEn = item.category?.name?.en?.toUpperCase() || 'BRIDAL';
  const matEn = item.material?.name?.en?.toUpperCase() || 'GOLD';
  const weightStr = `${item.weightGrams}g`;

  const pricing = item.pricing;
  const priceStr = pricing?.finalPrice != null ? formatCurrency(pricing.finalPrice) : '—';

  return {
    id: item._id,
    tag: item.tag || null,
    category: catEn,
    type: catEn,
    material: matEn,
    title: item.name?.en || '',
    subTitle: item.name?.np || '',
    karat: item.purity || '',
    weight: weightStr,
    price: priceStr,
    description: item.description,
    purity: item.purity,
    stones: item.stonesDetails,
    karigar: item.karigarName,
    images: item.images,
    pricing: pricing
      ? {
          goldValue: formatCurrency(pricing.goldValue),
          wastage: formatCurrency(pricing.wastage),
          making: formatCurrency(pricing.making),
          discount: `− ${formatCurrency(pricing.deduction)}`,
        }
      : undefined,
    _apiItem: item,
  };
}

async function loadFromApi(): Promise<void> {
  if (loaded) return;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      const res = await fetch('/api/items');
      if (res.ok) {
        const items = await res.json();
        productStore = items.map(transformApiItem);
      }
    } catch {
      productStore = [...products];
    }
    loaded = true;
  })();

  return loadingPromise;
}

async function loadCategoriesFromApi(): Promise<void> {
  if (categoriesLoaded) return;
  if (categoriesLoadingPromise) return categoriesLoadingPromise;

  categoriesLoadingPromise = (async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        categoryStore = await res.json();
      }
    } catch {
      categoryStore = [];
    }
    categoriesLoaded = true;
  })();

  return categoriesLoadingPromise;
}

async function loadMaterialsFromApi(): Promise<void> {
  if (materialsLoaded) return;
  if (materialsLoadingPromise) return materialsLoadingPromise;

  materialsLoadingPromise = (async () => {
    try {
      const res = await fetch('/api/materials');
      if (res.ok) {
        materialStore = await res.json();
      }
    } catch {
      materialStore = [];
    }
    materialsLoaded = true;
  })();

  return materialsLoadingPromise;
}

export const productService = {
  async ensureLoaded(): Promise<void> {
    await Promise.all([loadFromApi(), loadCategoriesFromApi(), loadMaterialsFromApi()]);
  },

  isLoaded(): boolean {
    return loaded;
  },

  getCategoriesList(): any[] {
    return [...categoryStore];
  },

  getMaterialsList(): any[] {
    return [...materialStore];
  },

  getAll(): Product[] {
    return [...productStore];
  },

  getById(id: string | number): Product | undefined {
    return productStore.find((p) => String(p.id) === String(id));
  },

  getBySlug(slug: string): Product | undefined {
    return productStore.find(
      (p) => p.title.toLowerCase().replace(/\s+/g, '-') === slug
    );
  },

  getFiltered(filters: Partial<ProductFilters>): Product[] {
    return productStore.filter((product) => {
      const matchesCategory =
        !filters.categories ||
        filters.categories.includes('ALL') ||
        filters.categories.includes(product.category);
      const matchesMaterial =
        !filters.material ||
        filters.material === 'ALL' ||
        product.material === filters.material;
      return matchesCategory && matchesMaterial;
    });
  },

  getCategories(): string[] {
    return [...new Set(productStore.map((p) => p.category))];
  },

  getCategoryBySlug(slug: string): { category: string; config: typeof categoryPageConfig[keyof typeof categoryPageConfig] } | null {
    const category = categoryFromSlug[slug];
    if (!category) return null;
    const config = categoryPageConfig[category];
    if (!config) return null;
    return { category, config };
  },

  getCategoryCollections(): Collection[] {
    const totals: Record<string, number> = {};
    const gold: Record<string, number> = {};
    const silver: Record<string, number> = {};
    for (const p of productStore) {
      totals[p.category] = (totals[p.category] || 0) + 1;
      if (p.material === 'GOLD') gold[p.category] = (gold[p.category] || 0) + 1;
      if (p.material === 'SILVER') silver[p.category] = (silver[p.category] || 0) + 1;
    }

    let idx = 0;
    return Object.entries(totals)
      .filter(([category]) => categoryConfigMap[category])
      .map(([category, count]) => {
        idx++;
        const config = categoryConfigMap[category];
        return {
          id: String(idx).padStart(2, '0'),
          nepaliTitle: config.nepaliTitle,
          englishTitle: config.englishTitle,
          pieces: `${count} ${count === 1 ? 'PIECE' : 'PIECES'}`,
          goldCount: gold[category] || 0,
          silverCount: silver[category] || 0,
          glowStyle: config.glowStyle,
          borderColor: config.borderColor,
          slug: categorySlugMap[category] || category.toLowerCase().replace(/\s+/g, '-'),
        };
      });
  },

  getMaterials(): string[] {
    return [...new Set(productStore.map((p) => p.material))];
  },

  addProduct(product: Product): void {
    productStore.push(product);
  },

  addProducts(newProducts: Product[]): void {
    productStore = [...productStore, ...newProducts];
  },

  updateProduct(id: string | number, updates: Partial<Product>): Product | undefined {
    const index = productStore.findIndex((p) => String(p.id) === String(id));
    if (index === -1) return undefined;
    productStore[index] = { ...productStore[index], ...updates };
    return productStore[index];
  },

  deleteProduct(id: string | number): boolean {
    const index = productStore.findIndex((p) => String(p.id) === String(id));
    if (index === -1) return false;
    productStore.splice(index, 1);
    return true;
  },

  replaceAll(newProducts: Product[]): void {
    productStore = [...newProducts];
  },

  importFromAdmin(jsonData: string): { success: boolean; count: number; errors: string[] } {
    try {
      const data = JSON.parse(jsonData);
      if (!Array.isArray(data)) {
        return { success: false, count: 0, errors: ['Data must be an array of products'] };
      }
      const errors: string[] = [];
      let count = 0;
      for (const item of data) {
        if (!item.id || !item.title) {
          errors.push(`Invalid product: ${JSON.stringify(item)}`);
          continue;
        }
        const existing = productStore.findIndex((p) => String(p.id) === String(item.id));
        if (existing >= 0) {
          productStore[existing] = { ...productStore[existing], ...item };
        } else {
          productStore.push(item as Product);
        }
        count++;
      }
      return { success: true, count, errors };
    } catch (e) {
      return { success: false, count: 0, errors: [`Invalid JSON: ${(e as Error).message}`] };
    }
  },

  exportAll(): string {
    return JSON.stringify(productStore, null, 2);
  },

  reset(): void {
    productStore = [...products];
    loaded = false;
    loadingPromise = null;
    categoryStore = [];
    categoriesLoaded = false;
    categoriesLoadingPromise = null;
    materialStore = [];
    materialsLoaded = false;
    materialsLoadingPromise = null;
  },
};
