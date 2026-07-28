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

const REFRESH_INTERVAL = 5 * 60 * 1000;
let lastRefreshed = 0;

function isStale(): boolean {
  return Date.now() - lastRefreshed > REFRESH_INTERVAL;
}

async function refresh(): Promise<void> {
  loaded = false;
  categoriesLoaded = false;
  materialsLoaded = false;
  loadingPromise = null;
  categoriesLoadingPromise = null;
  materialsLoadingPromise = null;
  await Promise.all([loadFromApi(), loadCategoriesFromApi(), loadMaterialsFromApi()]);
}

function refreshIfStale(): void {
  if (isStale()) {
    refresh().catch(() => {});
  }
}

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
        lastRefreshed = Date.now();
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
        lastRefreshed = Date.now();
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
        lastRefreshed = Date.now();
      }
    } catch {
      materialStore = [];
    }
    materialsLoaded = true;
  })();

  return materialsLoadingPromise;
}

setInterval(refresh, REFRESH_INTERVAL);

export const productService = {
  async ensureLoaded(): Promise<void> {
    refreshIfStale();
    await Promise.all([loadFromApi(), loadCategoriesFromApi(), loadMaterialsFromApi()]);
  },

  isLoaded(): boolean {
    return loaded;
  },

  getCategoriesList(): any[] {
    refreshIfStale();
    return [...categoryStore];
  },

  getMaterialsList(): any[] {
    refreshIfStale();
    return [...materialStore];
  },

  getAll(): Product[] {
    refreshIfStale();
    return [...productStore];
  },

  getById(id: string | number): Product | undefined {
    refreshIfStale();
    return productStore.find((p) => String(p.id) === String(id));
  },

  getBySlug(slug: string): Product | undefined {
    refreshIfStale();
    return productStore.find(
      (p) => p.title.toLowerCase().replace(/\s+/g, '-') === slug
    );
  },

  getFiltered(filters: Partial<ProductFilters>): Product[] {
    refreshIfStale();
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

  search(query: string): Product[] {
    refreshIfStale();
    const keywords = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (keywords.length === 0) return [];
    return productStore.filter((p) =>
      keywords.every((keyword) =>
        p.title.toLowerCase().includes(keyword) ||
        p.subTitle.toLowerCase().includes(keyword) ||
        (p.description && p.description.toLowerCase().includes(keyword)) ||
        p.category.toLowerCase().includes(keyword) ||
        p.material.toLowerCase().includes(keyword) ||
        (p.purity && p.purity.toLowerCase().includes(keyword)) ||
        (p.karigar && p.karigar.toLowerCase().includes(keyword)) ||
        (p.stones && p.stones.toLowerCase().includes(keyword)) ||
        (p.tag && p.tag.toLowerCase().includes(keyword))
      )
    );
  },

  getCategories(): string[] {
    refreshIfStale();
    return [...new Set(productStore.map((p) => p.category))];
  },

  getCategoryBySlug(slug: string): { category: string; config: typeof categoryPageConfig[keyof typeof categoryPageConfig] } | null {
    refreshIfStale();
    const category = categoryFromSlug[slug];
    if (!category) return null;
    const config = categoryPageConfig[category];
    if (!config) return null;
    return { category, config };
  },

  getCategoryCollections(): Collection[] {
    refreshIfStale();
    const totals: Record<string, number> = {};
    const materialCounts: Record<string, Record<string, number>> = {};
    for (const p of productStore) {
      totals[p.category] = (totals[p.category] || 0) + 1;
      if (!materialCounts[p.category]) materialCounts[p.category] = {};
      materialCounts[p.category][p.material] = (materialCounts[p.category][p.material] || 0) + 1;
    }

    let idx = 0;
    return Object.entries(totals)
      .filter(([category]) => categoryConfigMap[category])
      .map(([category, count]) => {
        idx++;
        const config = categoryConfigMap[category];
        const matCounts = Object.entries(materialCounts[category] || {})
          .sort(([, a], [, b]) => b - a)
          .slice(0, 4)
          .map(([material, cnt]) => ({ material, count: cnt }));
        return {
          id: String(idx).padStart(2, '0'),
          nepaliTitle: config.nepaliTitle,
          englishTitle: config.englishTitle,
          pieces: `${count} ${count === 1 ? 'PIECE' : 'PIECES'}`,
          materialCounts: matCounts,
          glowStyle: config.glowStyle,
          borderColor: config.borderColor,
          slug: categorySlugMap[category] || category.toLowerCase().replace(/\s+/g, '-'),
        };
      });
  },

  getMaterials(): string[] {
    refreshIfStale();
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
