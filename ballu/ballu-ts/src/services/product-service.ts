import { Product, ProductFilters } from '@/types/product';
import { Collection } from '@/types/collection';
import { categoryConfigMap, categorySlugMap, categoryFromSlug, categoryPageConfig } from '@/data/collections';

let productStore: Product[] = [];
let categoryStore: any[] = [];
let materialStore: any[] = [];
let groupStore: any[] = [];

function transformApiItem(item: any): Product {
  const catEn = item.category?.name?.en?.toUpperCase() || 'BRIDAL';
  const matEn = item.material?.name?.en?.toUpperCase() || 'GOLD';
  const weightStr = `${item.weightGrams}g`;
  const purity = item.group?.name?.en || item.purity || '';

  const pricing = item.pricing;

  return {
    id: item._id,
    tag: item.tag || null,
    category: catEn,
    type: catEn,
    material: matEn,
    title: item.name?.en || '',
    subTitle: item.name?.np || '',
    karat: purity,
    weight: weightStr,
    priceNpr: pricing?.finalPrice ?? null,
    description: item.description,
    purity,
    stones: item.stonesDetails,
    karigar: item.karigarName,
    caratWeight: item.caratWeight,
    isAvailable: item.isAvailable ?? true,
    showPrice: item.showPrice ?? true,
    estimatedMakingDays: item.estimatedMakingDays,
    viewCount: item.viewCount,
    images: item.images,
    pricing: pricing
      ? {
          goldValueNpr: pricing.goldValue,
          wastageNpr: pricing.wastage,
          wastagePercent: pricing.wastagePercent,
          makingNpr: pricing.making,
          accessoriesNpr: pricing.accessories,
          discountNpr: pricing.deduction,
          ratePerGramNpr: pricing.ratePerGramNrs,
        }
      : undefined,
    _apiItem: item,
  };
}

async function loadFromApi(): Promise<void> {
  try {
    const res = await fetch('/api/items');
    if (res.ok) {
      const items = await res.json();
      productStore = items.map(transformApiItem);
      return;
    }
  } catch {
    /* ignore */
  }
  productStore = [];
}

async function loadCategoriesFromApi(): Promise<void> {
  try {
    const res = await fetch('/api/categories');
    if (res.ok) {
      categoryStore = await res.json();
      return;
    }
  } catch {
    /* ignore */
  }
  categoryStore = [];
}

async function loadMaterialsFromApi(): Promise<void> {
  try {
    const res = await fetch('/api/materials');
    if (res.ok) {
      materialStore = await res.json();
      return;
    }
  } catch {
    /* ignore */
  }
  materialStore = [];
}

async function loadGroupsFromApi(): Promise<void> {
  try {
    const res = await fetch('/api/groups');
    if (res.ok) {
      groupStore = await res.json();
      return;
    }
  } catch {
    /* ignore */
  }
  groupStore = [];
}

export const productService = {
  async ensureLoaded(): Promise<void> {
    await Promise.all([loadFromApi(), loadCategoriesFromApi(), loadMaterialsFromApi(), loadGroupsFromApi()]);
  },

  isLoaded(): boolean {
    return true;
  },

  getCategoriesList(): any[] {
    return [...categoryStore];
  },

  getMaterialsList(): any[] {
    return [...materialStore];
  },

  getGroupsList(): any[] {
    return [...groupStore];
  },

  getGroupsForMaterial(material: string): any[] {
    const key = material?.toUpperCase();
    if (!key) return [];
    return groupStore.filter(
      (g) => (g.material?.name?.en || '').toUpperCase() === key
    );
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
    const filtered = productStore.filter((product) => {
      const matchesCategory =
        !filters.categories ||
        filters.categories.includes('ALL') ||
        filters.categories.includes(product.category);
      const matchesMaterial =
        !filters.material ||
        filters.material === 'ALL' ||
        product.material === filters.material;
      const matchesPurity =
        !filters.purity ||
        filters.purity === 'ALL' ||
        (product.purity || '').toUpperCase() === filters.purity;
      const matchesTag = !filters.tag || filters.tag === 'ALL' || product.tag === filters.tag;
      const matchesAvailability = !filters.availableOnly || product.isAvailable;
      const matchesMinPrice = filters.minPrice == null || (product.priceNpr != null && product.priceNpr >= filters.minPrice);
      const matchesMaxPrice = filters.maxPrice == null || (product.priceNpr != null && product.priceNpr <= filters.maxPrice);
      return matchesCategory && matchesMaterial && matchesPurity && matchesTag && matchesAvailability && matchesMinPrice && matchesMaxPrice;
    });

    switch (filters.sort) {
      case 'price-asc':
        return [...filtered].sort((a, b) => (a.priceNpr ?? Infinity) - (b.priceNpr ?? Infinity));
      case 'price-desc':
        return [...filtered].sort((a, b) => (b.priceNpr ?? -Infinity) - (a.priceNpr ?? -Infinity));
      case 'most-viewed':
        return [...filtered].sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0));
      default:
        // 'newest' (default): productStore is already createdAt-desc from the API
        return filtered;
    }
  },

  getRecommended(opts: { excludeId?: string | number; category?: string; material?: string; limit?: number }): Product[] {
    const { excludeId, category, material, limit = 8 } = opts;
    const candidates = productStore.filter((p) => String(p.id) !== String(excludeId));
    const bothMatch = candidates.filter((p) => p.category === category && p.material === material);
    const eitherMatch = candidates.filter(
      (p) => (p.category === category || p.material === material) && !bothMatch.includes(p)
    );
    const ranked = [...bothMatch, ...eitherMatch].sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0));
    if (ranked.length >= limit) return ranked.slice(0, limit);
    const rest = candidates
      .filter((p) => !ranked.includes(p))
      .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0));
    return [...ranked, ...rest].slice(0, limit);
  },

  getTopViewed(limit = 8): Product[] {
    return [...productStore].sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0)).slice(0, limit);
  },

  search(query: string): Product[] {
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
    const materialCounts: Record<string, Record<string, number>> = {};
    for (const p of productStore) {
      totals[p.category] = (totals[p.category] || 0) + 1;
      if (!materialCounts[p.category]) materialCounts[p.category] = {};
      materialCounts[p.category][p.material] = (materialCounts[p.category][p.material] || 0) + 1;
    }

    const catLookup: Record<string, any> = {};
    for (const c of categoryStore) {
      const key = c.name?.en?.toUpperCase() || '';
      catLookup[key] = c;
    }

    if (!('OTHERS' in totals)) {
      totals.OTHERS = 0;
    }

    let idx = 0;
    return Object.entries(totals).map(([category, count]) => {
      idx++;
      const config = categoryConfigMap[category];
      const catData = catLookup[category];
      const matCounts = Object.entries(materialCounts[category] || {})
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4)
        .map(([material, cnt]) => ({ material, count: cnt }));

      if (config) {
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
      }

      return {
        id: String(idx).padStart(2, '0'),
        nepaliTitle: catData?.name?.np || category,
        englishTitle: catData?.name?.en || category,
        pieces: `${count} ${count === 1 ? 'PIECE' : 'PIECES'}`,
        materialCounts: matCounts,
        glowStyle: 'radial-gradient(circle at 40% 40%, rgba(213,165,96,0.18) 0%, rgba(14,11,8,0) 70%)',
        borderColor: 'border-amber-900/20',
        slug: category.toLowerCase().replace(/\s+/g, '-'),
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
    productStore = [];
    categoryStore = [];
    materialStore = [];
    groupStore = [];
  },
};
