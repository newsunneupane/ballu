import { Product, ProductFilters } from '@/types/product';
import { Collection } from '@/types/collection';
import { collectionConfigMap, collectionSlugMap, collectionFromSlug, collectionPageConfig } from '@/data/collections';

let productStore: Product[] = [];
let collectionStore: any[] = [];
let materialStore: any[] = [];
let groupStore: any[] = [];
let occasionStore: any[] = [];
let seeded = false;

export function isProductStoreSeeded(): boolean {
  return seeded;
}

function transformApiItem(item: any): Product {
  const rawCols: any[] = Array.isArray(item.collections) && item.collections.length > 0
    ? item.collections
    : item.collection ? [item.collection] : [];
  const colNames = [...new Set(
    rawCols.map((c) => (c?.name?.en || '').trim().toUpperCase()).filter(Boolean)
  )];
  const catEn = colNames[0] || 'OTHERS';
  const matEn = (item.material?.name?.en || '').trim().toUpperCase() || 'GOLD';
  const weightStr = `${item.weightGrams}g`;
  // Group.name is a plain string (not { en, np }), so read it directly first.
  const groupName = typeof item.group?.name === 'string' ? item.group.name : item.group?.name?.en;
  const purity = (groupName || item.purity || '').trim();

  const pricing = item.pricing;
  const rawVariants: any[] = Array.isArray(item.variants) && item.variants.length > 0
    ? item.variants
    : [{ label: `${item.weightGrams}g`, weightGrams: item.weightGrams }];

  const toPricing = (p: any) => {
    if (!p) return undefined;
    if (typeof p.finalPrice === 'number') {
      return {
        goldValueNpr: p.goldValue ?? p.finalPrice,
        wastageNpr: p.wastage ?? 0,
        wastagePercent: p.wastagePercent ?? pricing?.wastagePercent ?? 0,
        makingNpr: p.making ?? pricing?.making ?? 0,
        accessoriesNpr: p.accessories ?? pricing?.accessories ?? 0,
        discountNpr: p.deduction ?? pricing?.deduction ?? 0,
        ratePerGramNpr: p.ratePerGramNrs ?? pricing?.ratePerGramNrs ?? 0,
      };
    }
    return {
      goldValueNpr: p.goldValue,
      wastageNpr: p.wastage,
      wastagePercent: p.wastagePercent,
      makingNpr: p.making,
      accessoriesNpr: p.accessories,
      discountNpr: p.deduction,
      ratePerGramNpr: p.ratePerGramNrs,
    };
  };

  const variants = rawVariants.map((v: any) => {
    const vp = v.pricing && typeof v.pricing.finalPrice === 'number'
      ? v.pricing.finalPrice
      : v.manualPriceNpr != null
        ? Math.round(Number(v.manualPriceNpr))
        : (pricing?.finalPrice ?? null);
    return {
      label: v.label || `${v.weightGrams}g`,
      weightGrams: Number(v.weightGrams),
      weight: `${v.weightGrams}g`,
      priceNpr: vp,
      isAvailable: v.isAvailable !== false,
      pricing: toPricing(v.pricing),
    };
  });
  const defaultPrice = variants[0]?.priceNpr ?? pricing?.finalPrice ?? null;

  return {
    id: item._id,
    tag: item.tag || null,
    collection: catEn,
    collections: colNames.length > 0 ? colNames : ['OTHERS'],
    type: catEn,
    material: matEn,
    title: item.name?.en || '',
    subTitle: item.name?.np || '',
    karat: purity,
    weight: weightStr,
    priceNpr: defaultPrice,
    variants,
    description: item.description,
    purity,
    stones: item.stonesDetails,
    caratWeight: item.caratWeight,
    isAvailable: item.isAvailable ?? true,
    showPrice: item.showPrice ?? true,
    estimatedMakingDays: item.estimatedMakingDays,
    viewCount: item.viewCount,
    occasions: (item.occasion || []).map((o: any) => (o?.name?.en || '').trim().toUpperCase()).filter(Boolean),
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

async function loadCollectionsFromApi(): Promise<void> {
  try {
    const res = await fetch('/api/collections');
    if (res.ok) {
      collectionStore = await res.json();
      return;
    }
  } catch {
    /* ignore */
  }
  collectionStore = [];
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

async function loadOccasionsFromApi(): Promise<void> {
  try {
    const res = await fetch('/api/occasions');
    if (res.ok) {
      occasionStore = await res.json();
      return;
    }
  } catch {
    /* ignore */
  }
  occasionStore = [];
}

export const productService = {
  seed(data: { items: any[]; collections: any[]; materials: any[]; groups: any[]; occasions?: any[] }): void {
    if (data.items) productStore = data.items.map(transformApiItem);
    if (data.collections) collectionStore = data.collections;
    if (data.materials) materialStore = data.materials;
    if (data.groups) groupStore = data.groups;
    if (data.occasions) occasionStore = data.occasions;
    seeded = true;
  },

  isSeeded(): boolean {
    return seeded;
  },

  async ensureLoaded(): Promise<void> {
    if (seeded) return;
    await Promise.all([loadFromApi(), loadCollectionsFromApi(), loadMaterialsFromApi(), loadGroupsFromApi(), loadOccasionsFromApi()]);
    seeded = true;
  },

  isLoaded(): boolean {
    return true;
  },

  getCollectionsList(): any[] {
    return [...collectionStore];
  },

  getOccasionsList(): any[] {
    return [...occasionStore];
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
    const norm = (v: unknown) => String(v ?? '').trim().toUpperCase();
    const normList = (list?: string[]) => (list || []).map(norm).filter(Boolean);
    const effPrice = (p: Product): number | null => {
      if (p.variants && p.variants.length > 0) {
        const ps = p.variants.map((v) => v.priceNpr).filter((n): n is number => n != null);
        if (ps.length > 0) return Math.min(...ps);
      }
      return p.priceNpr;
    };
    // Sanitize bounds: non-finite values are treated as unset.
    const min = typeof filters.minPrice === 'number' && Number.isFinite(filters.minPrice) ? filters.minPrice : undefined;
    const max = typeof filters.maxPrice === 'number' && Number.isFinite(filters.maxPrice) ? filters.maxPrice : undefined;
    const collections = normList(filters.collections);
    const occasions = normList(filters.occasions);
    const material = norm(filters.material);
    const purity = norm(filters.purity);
    const tag = String(filters.tag ?? '').trim();
    const filtered = productStore.filter((product) => {
      const matchesCollection =
        collections.length === 0 ||
        collections.includes('ALL') ||
        collections.some((c) => product.collections.includes(c));
      const matchesMaterial =
        !material ||
        material === 'ALL' ||
        product.material === material;
      const matchesPurity =
        !purity ||
        purity === 'ALL' ||
        (product.purity || '').trim().toUpperCase() === purity;
      const matchesTag = !tag || tag === 'ALL' || product.tag === tag;
      const matchesAvailability = !filters.availableOnly || product.isAvailable;
      const matchesOccasion = occasions.length === 0 || occasions.includes('ALL') || (product.occasions || []).some((occ: string) => occasions.includes(norm(occ)));
      // Pieces with unknown price stay visible under a range instead of vanishing.
      const price = effPrice(product);
      const matchesMinPrice = min == null || price == null || price >= min;
      const matchesMaxPrice = max == null || price == null || price <= max;
      return matchesCollection && matchesMaterial && matchesPurity && matchesTag && matchesAvailability && matchesOccasion && matchesMinPrice && matchesMaxPrice;
    });

    switch (filters.sort) {
      case 'price-asc':
        return [...filtered].sort((a, b) => (effPrice(a) ?? Infinity) - (effPrice(b) ?? Infinity));
      case 'price-desc':
        return [...filtered].sort((a, b) => (effPrice(b) ?? -Infinity) - (effPrice(a) ?? -Infinity));
      case 'most-viewed':
        return [...filtered].sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0));
      default:
        // 'newest' (default): productStore is already createdAt-desc from the API
        return filtered;
    }
  },

  getRecommended(opts: { excludeId?: string | number; collection?: string; material?: string; limit?: number }): Product[] {
    const { excludeId, collection, material, limit = 8 } = opts;
    const candidates = productStore.filter((p) => String(p.id) !== String(excludeId));
    const bothMatch = collection
      ? candidates.filter((p) => p.collections.includes(collection) && p.material === material)
      : [];
    const eitherMatch = candidates.filter(
      (p) => ((collection && p.collections.includes(collection)) || p.material === material) && !bothMatch.includes(p)
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
        p.collections.some((c) => c.toLowerCase().includes(keyword)) ||
        p.material.toLowerCase().includes(keyword) ||
        (p.purity && p.purity.toLowerCase().includes(keyword)) ||
        (p.stones && p.stones.toLowerCase().includes(keyword)) ||
        (p.tag && p.tag.toLowerCase().includes(keyword))
      )
    );
  },

  getCollections(): string[] {
    return [...new Set(productStore.flatMap((p) => p.collections))];
  },

  getCollectionBySlug(slug: string): { collection: string; config: typeof collectionPageConfig[keyof typeof collectionPageConfig] } | null {
    const collection = collectionFromSlug[slug];
    if (!collection) return null;
    const config = collectionPageConfig[collection];
    if (!config) return null;
    return { collection, config };
  },

  getCollectionsCards(): Collection[] {
    const totals: Record<string, number> = {};
    const materialCounts: Record<string, Record<string, number>> = {};
    for (const p of productStore) {
      for (const col of p.collections.length > 0 ? p.collections : ['OTHERS']) {
        totals[col] = (totals[col] || 0) + 1;
        if (!materialCounts[col]) materialCounts[col] = {};
        materialCounts[col][p.material] = (materialCounts[col][p.material] || 0) + 1;
      }
    }

    const catLookup: Record<string, any> = {};
    for (const c of collectionStore) {
      const key = c.name?.en?.trim().toUpperCase() || '';
      catLookup[key] = c;
    }

    const entries = Object.entries(totals).sort(([a], [b]) => {
      if (a === 'OTHERS') return 1;
      if (b === 'OTHERS') return -1;
      return 0;
    });

    let idx = 0;
    return entries.map(([collection, count]) => {
      idx++;
      const config = collectionConfigMap[collection];
      const catData = catLookup[collection];
      const matCounts = Object.entries(materialCounts[collection] || {})
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
          slug: collectionSlugMap[collection] || collection.toLowerCase().replace(/\s+/g, '-'),
          image: catData?.image || undefined,
        };
      }

      return {
        id: String(idx).padStart(2, '0'),
        nepaliTitle: catData?.name?.np || collection,
        englishTitle: catData?.name?.en || collection,
        pieces: `${count} ${count === 1 ? 'PIECE' : 'PIECES'}`,
        materialCounts: matCounts,
        glowStyle: 'radial-gradient(circle at 40% 40%, rgba(213,165,96,0.18) 0%, rgba(14,11,8,0) 70%)',
        borderColor: 'border-amber-900/20',
        slug: collection.toLowerCase().replace(/\s+/g, '-'),
        image: catData?.image || undefined,
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
        const normalized = {
          ...item,
          collections: Array.isArray(item.collections) && item.collections.length > 0
            ? item.collections
            : item.collection ? [item.collection] : ['OTHERS'],
        };
        const existing = productStore.findIndex((p) => String(p.id) === String(item.id));
        if (existing >= 0) {
          productStore[existing] = { ...productStore[existing], ...normalized };
        } else {
          productStore.push(normalized as Product);
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
    collectionStore = [];
    materialStore = [];
    groupStore = [];
    occasionStore = [];
    seeded = false;
  },
};
