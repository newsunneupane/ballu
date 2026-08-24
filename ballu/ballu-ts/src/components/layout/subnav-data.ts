import { collectionSlugMap, collectionFromSlug } from '@/data/collections';
import { productService } from '@/services/product-service';

export interface SubNavItem {
  label: string;
  href: string;
  leftover?: boolean;
}

export interface PanelLink {
  label: string;
  href: string;
}

export interface PanelCollection {
  name: string;
  slug: string;
  image?: string;
  nepali?: string;
}

export interface PanelData {
  categoryMode: 'collections' | 'items' | 'mixed';
  collections: PanelCollection[];
  items: any[];
  priceRanges: PanelLink[];
  occasions: { name: string; nepali?: string; image?: string; href: string }[];
  baseQuery: string;
}

export function buildNavItems(): SubNavItem[] {
  const products = productService.getAll();
  const materials = productService.getMaterialsList();
  const collections = productService.getCollectionsList();

  const matCount = new Map<string, number>();
  for (const p of products) matCount.set(p.material, (matCount.get(p.material) || 0) + 1);

  const colCount = new Map<string, number>();
  for (const p of products) {
    for (const c of p.collections) colCount.set(c, (colCount.get(c) || 0) + 1);
  }

  const topMaterials = materials
    .map((m: any) => {
      const label = (m?.name?.en || '').trim();
      return { label, count: matCount.get(label.toUpperCase()) || 0 };
    })
    .filter((m) => m.label)
    .sort((a, b) => b.count - a.count)
    .slice(0, 2)
    .map((m) => ({ label: m.label, href: `/catalogue?material=${encodeURIComponent(m.label)}` }));

  const topCollections = collections
    .map((c: any) => {
      const label = (c?.name?.en || '').trim();
      return { label, upper: label.toUpperCase(), count: colCount.get(label.toUpperCase()) || 0 };
    })
    .filter((c) => c.label)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)
    .map((c) => ({
      label: c.label,
      href: `/${collectionSlugMap[c.upper] || collectionSlugMap[c.label] || c.label.toLowerCase().replace(/\s+/g, '-')}`,
    }));

  return [
    { label: 'All Collections', href: '/catalogue' },
    ...topMaterials,
    ...topCollections,
    { label: 'More', href: '/catalogue', leftover: true },
  ];
}

export function collectionSlugOf(name: string): string {
  const n = name.trim().toUpperCase();
  return (
    collectionSlugMap[n] ||
    name.trim().toLowerCase().replace(/\s+/g, '-')
  );
}

export function getTopCollectionSlugs(limit: number): string[] {
  const products = productService.getAll();
  const colCount = new Map<string, number>();
  for (const p of products) {
    for (const c of p.collections) colCount.set(c, (colCount.get(c) || 0) + 1);
  }
  return Array.from(colCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([c]) => collectionSlugOf(c));
}

export function getTopCollectionNames(limit: number): string[] {
  const products = productService.getAll();
  const colCount = new Map<string, number>();
  for (const p of products) {
    for (const c of p.collections) colCount.set(c, (colCount.get(c) || 0) + 1);
  }
  return Array.from(colCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([c]) => c.trim().toUpperCase());
}

export function getTopMaterialNames(limit: number): string[] {
  const products = productService.getAll();
  const materials = productService.getMaterialsList();
  const matCount = new Map<string, number>();
  for (const p of products) matCount.set(p.material, (matCount.get(p.material) || 0) + 1);
  return materials
    .map((m: any) => (m?.name?.en || '').trim())
    .filter((label) => label)
    .sort((a, b) => (matCount.get(b.toUpperCase()) || 0) - (matCount.get(a.toUpperCase()) || 0))
    .slice(0, limit)
    .map((label) => label.toUpperCase());
}

export function collectionsForMaterial(matUpper: string): Set<string> {
  const set = new Set<string>();
  for (const p of productService.getAll()) {
    if (p.material.toUpperCase() !== matUpper) continue;
    for (const c of p.collections) set.add(c.trim().toUpperCase());
  }
  return set;
}

export const PRICE_BUCKETS: { label: string; min?: number; max?: number }[] = [
  { label: 'Under ₹50,000', max: 50000 },
  { label: '₹50,000 – ₹100,000', min: 50000, max: 100000 },
  { label: '₹100,000 – ₹250,000', min: 100000, max: 250000 },
  { label: '₹250,000 – ₹500,000', min: 250000, max: 500000 },
  { label: 'Above ₹500,000', min: 500000 },
];

export function getPanelData(item: SubNavItem): PanelData {
  let parsed: URL;
  try {
    parsed = new URL(item.href, 'http://localhost');
  } catch {
    parsed = new URL('/catalogue', 'http://localhost');
  }

  const materialParam = parsed.searchParams.get('material');
  const slug = parsed.pathname === '/' ? '' : parsed.pathname.replace(/^\//, '');

  const collectionList = productService.getCollectionsList();
  const slugToName = new Map<string, string>();
  for (const c of collectionList) {
    const raw = (c?.name?.en || '').trim();
    if (raw) slugToName.set(collectionSlugOf(raw), raw.toUpperCase());
  }
  const collectionName = slug ? slugToName.get(slug) || collectionFromSlug[slug] : undefined;

  const all = productService.getAll();

  const baseParams = new URLSearchParams();
  if (materialParam) baseParams.set('material', materialParam);
  else if (collectionName) baseParams.set('collection', collectionName);
  const baseQuery = baseParams.toString();

  let ctxProducts = all;
  if (materialParam) {
    const matUpper = materialParam.toUpperCase();
    ctxProducts = all.filter((p) => p.material.toUpperCase() === matUpper);
  } else if (collectionName) {
    ctxProducts = all.filter((p) => p.collections.includes(collectionName));
  }

  let categoryMode: 'collections' | 'items' | 'mixed' = 'collections';
  let collections: PanelCollection[] = [];
  let items: any[] = [];

  const allMetas = productService.getCollectionsList().map((c: any) => {
    const raw = (c?.name?.en || '').trim();
    return { name: raw, slug: collectionSlugOf(raw), image: c?.image, nepali: c?.name?.np };
  });

  if (materialParam) {
    const matUpper = materialParam.toUpperCase();
    const colNamesWithMat = new Set<string>();
    for (const p of all) {
      if (p.material.toUpperCase() !== matUpper) continue;
      for (const c of p.collections) colNamesWithMat.add(c.trim().toUpperCase());
    }
    collections = allMetas
      .filter((c) => colNamesWithMat.has(c.name.trim().toUpperCase()))
      .slice(0, 10);
  } else if (collectionName) {
    categoryMode = 'items';
    items = productService
      .getFiltered({ collections: [collectionName] })
      .slice(0, 15);
  } else if (item.leftover) {
    const excluded = new Set<string>([
      ...getTopCollectionNames(4),
      ...getTopMaterialNames(2).flatMap((m) => Array.from(collectionsForMaterial(m))),
    ]);
    collections = allMetas.filter((c) => !excluded.has(c.name.trim().toUpperCase()));

    const shownIds = new Set<string | number>();
    for (const name of getTopCollectionNames(4)) {
      for (const p of productService.getFiltered({ collections: [name] }).slice(0, 15)) {
        shownIds.add(p.id);
      }
    }
    const MORE_MAX_CARDS = 20;
    const leftoverItems = productService
      .getAll()
      .filter((p) => !shownIds.has(p.id));
    items = leftoverItems.slice(0, Math.max(0, MORE_MAX_CARDS - collections.length));
    categoryMode = 'mixed';
  } else {
    const excluded = new Set(getTopCollectionSlugs(4));
    collections = allMetas.filter((c) => !excluded.has(c.slug)).slice(0, 15);
  }

  const priceRanges: PanelLink[] = PRICE_BUCKETS.map((bucket) => {
    const q = new URLSearchParams();
    if (materialParam) q.set('material', materialParam);
    if (collectionName) q.set('collection', collectionName);
    if (bucket.min != null) q.set('minPrice', String(bucket.min));
    if (bucket.max != null) q.set('maxPrice', String(bucket.max));
    return {
      label: bucket.label,
      href: `/catalogue?${q.toString()}`,
    };
  }).filter((range) => {
    const [, qs] = range.href.split('?');
    const params = new URLSearchParams(qs);
    const min = params.get('minPrice') ? Number(params.get('minPrice')) : -Infinity;
    const max = params.get('maxPrice') ? Number(params.get('maxPrice')) : Infinity;
    return ctxProducts.some(
      (p) => typeof p.priceNpr === 'number' && p.priceNpr >= min && p.priceNpr <= max
    );
  });

  const occasions: PanelData['occasions'] = [];
  if (!item.leftover) {
    const base = materialParam
      ? `material=${encodeURIComponent(materialParam)}`
      : collectionName
        ? `collection=${encodeURIComponent(collectionName)}`
        : '';

    let occasionList: any[] = productService.getOccasionsList();
    if (materialParam || collectionName) {
      const present = new Set<string>(
        ctxProducts.flatMap((p: any) => (p.occasions || []) as string[])
      );
      occasionList = occasionList.filter((o: any) =>
        present.has((o?.name?.en || '').trim().toUpperCase())
      );
    }

    occasions.push(
      ...occasionList.map((o: any) => ({
        name: o?.name?.en || '',
        nepali: o?.name?.np,
        image: o?.image,
        href: `/catalogue?occasion=${encodeURIComponent((o?.name?.en || '').trim().toUpperCase())}${base ? `&${base}` : ''}`,
      }))
    );
  }

  return { categoryMode, collections, items, priceRanges, occasions, baseQuery };
}
