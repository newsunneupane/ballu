'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Cormorant_Garamond } from 'next/font/google';
import { collectionSlugMap, collectionFromSlug } from '@/data/collections';
import { productService } from '@/services/product-service';
import { cloudinaryUrl } from '@/lib/cloudinary';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-serif-editorial',
});

interface SubNavItem {
  label: string;
  href: string;
  leftover?: boolean;
}

interface PanelLink {
  label: string;
  href: string;
}

function buildNavItems(): SubNavItem[] {
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

interface PanelCollection {
  name: string;
  slug: string;
  image?: string;
  nepali?: string;
}

interface PanelData {
  categoryMode: 'collections' | 'items' | 'mixed';
  collections: PanelCollection[];
  items: any[];
  priceRanges: PanelLink[];
  occasions: { name: string; nepali?: string; image?: string; href: string }[];
}

function collectionSlugOf(name: string): string {
  const n = name.trim().toUpperCase();
  return (
    collectionSlugMap[n] ||
    name.trim().toLowerCase().replace(/\s+/g, '-')
  );
}

function getTopCollectionSlugs(limit: number): string[] {
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

function getTopCollectionNames(limit: number): string[] {
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

function getTopMaterialNames(limit: number): string[] {
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

function collectionsForMaterial(matUpper: string): Set<string> {
  const set = new Set<string>();
  for (const p of productService.getAll()) {
    if (p.material.toUpperCase() !== matUpper) continue;
    for (const c of p.collections) set.add(c.trim().toUpperCase());
  }
  return set;
}

const PRICE_BUCKETS: { label: string; min?: number; max?: number }[] = [
  { label: 'Under ₹50,000', max: 50000 },
  { label: '₹50,000 – ₹100,000', min: 50000, max: 100000 },
  { label: '₹100,000 – ₹250,000', min: 100000, max: 250000 },
  { label: '₹250,000 – ₹500,000', min: 250000, max: 500000 },
  { label: 'Above ₹500,000', min: 500000 },
];

function getPanelData(item: SubNavItem): PanelData {
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

  return { categoryMode, collections, items, priceRanges, occasions };
}

export default function SubNavbar() {
  const [navItems, setNavItems] = useState<SubNavItem[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    productService.ensureLoaded().then(() => {
      if (!cancelled) setNavItems(buildNavItems());
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const openPanel = (index: number) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveIndex(index);
    setOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setActiveIndex(null);
    }, 150);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const closePanel = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(false);
    setActiveIndex(null);
  };

  const activeItem = activeIndex !== null ? navItems[activeIndex] : null;

  return (
    <div className={`${cormorant.variable} relative hidden w-full md:block`}>
      <nav className="subnav flex w-full items-stretch justify-center bg-bj-bg-secondary/90 backdrop-blur-sm px-10 py-0">
        {navItems.map((item, i) => (
          <button
            key={item.label}
            type="button"
            onMouseEnter={() => openPanel(i)}
            onMouseLeave={scheduleClose}
            onClick={() => openPanel(i)}
            className={`subnav-link flex cursor-pointer items-center border-0 bg-transparent px-6 text-[13px] tracking-[0.18em] uppercase font-sans whitespace-nowrap transition-colors duration-300 ${
              activeIndex === i
                ? 'text-bj-gold-rich'
                : 'text-bj-text-muted hover:text-bj-text-nav'
            }`}
          >
            <span className="subnav-link-text">{item.label}</span>
            {item.leftover && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`ml-1.5 h-3 w-3 transition-transform duration-300 ${
                  activeIndex === i ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          </button>
        ))}
      </nav>

      {open && activeItem && (
        <MegaPanel key={activeItem.label} item={activeItem} onEnter={cancelClose} onLeave={scheduleClose} onClose={closePanel} />
      )}
    </div>
  );
}

function MegaPanel({
  item,
  onEnter,
  onLeave,
  onClose,
}: {
  item: SubNavItem;
  onEnter: () => void;
  onLeave: () => void;
  onClose: () => void;
}) {
  const [activeOption, setActiveOption] = useState<'category' | 'price' | 'occasion'>('category');
  const data = getPanelData(item);

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="absolute left-[8%] right-[8%] top-full z-[60] flex h-[calc(80vh-15px)] flex-col overflow-hidden border border-bj-border border-t-0 bg-bj-bg-secondary shadow-2xl backdrop-blur-md"
    >
      <div className="flex items-end justify-between border-b border-bj-border px-6 py-6 md:px-10">
        <div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-bj-text-muted">Explore</p>
          <h2 className="mt-2 font-serif-editorial text-3xl font-light text-bj-text-heading md:text-4xl">
            {item.label}
          </h2>
        </div>
        <Link
          href={item.href}
          onClick={onClose}
          className="group/view inline-flex items-center gap-2 whitespace-nowrap text-[12px] tracking-[0.2em] uppercase text-bj-gold-richer transition-colors hover:text-bj-gold-rich"
        >
          View all
          <span className="transition-transform duration-300 group-hover/view:translate-x-1.5">→</span>
        </Link>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="flex w-44 shrink-0 flex-col gap-1 border-r border-bj-border py-4">
          <OptionButton
            label="Category"
            active={activeOption === 'category'}
            onHover={() => setActiveOption('category')}
          />
          <OptionButton
            label="Occasion"
            active={activeOption === 'occasion'}
            onHover={() => setActiveOption('occasion')}
          />
          {!item.leftover && (
            <OptionButton
              label="Price"
              active={activeOption === 'price'}
              onHover={() => setActiveOption('price')}
            />
          )}
        </div>

        <div className="min-w-0 flex-1 overflow-y-auto px-6 py-8 md:px-10">
          {activeOption === 'category' ? (
            data.categoryMode === 'collections' ? (
              <CollectionCards cards={data.collections} onClose={onClose} />
            ) : data.categoryMode === 'mixed' ? (
              <>
                <CollectionCards cards={data.collections} onClose={onClose} />
                {data.items.length > 0 && (
                  <>
                    <h3 className="mb-4 mt-10 text-[11px] tracking-[0.3em] uppercase text-bj-text-muted">
                      More pieces
                    </h3>
                    <ItemCards items={data.items} onClose={onClose} />
                  </>
                )}
              </>
            ) : (
              <ItemCards items={data.items} onClose={onClose} />
            )
          ) : activeOption === 'occasion' ? (
            <OccasionCards cards={data.occasions} onClose={onClose} />
          ) : (
            <PriceFilters ranges={data.priceRanges} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}

function OptionButton({
  label,
  active,
  onHover,
}: {
  label: string;
  active: boolean;
  onHover: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onHover}
      className={`flex items-center border-l-4 px-5 py-3 text-[13px] tracking-[0.2em] uppercase transition-colors duration-300 ${
        active
          ? 'border-bj-gold-rich bg-bj-bg-elevated text-bj-gold-rich'
          : 'border-transparent text-bj-text-muted hover:border-bj-gold-rich/50 hover:bg-bj-bg-elevated/50 hover:text-bj-text-nav'
      }`}
    >
      {label}
    </button>
  );
}

function CollectionCards({ cards, onClose }: { cards: PanelCollection[]; onClose: () => void }) {
  if (cards.length === 0) {
    return <p className="text-[12px] tracking-wide text-bj-text-muted">No collections available.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {cards.map((card) => (
        <Link
          key={card.slug}
          href={`/${card.slug}`}
          onClick={onClose}
          className="group/col block"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-bj-border bg-bj-bg-elevated">
            {card.image ? (
              <img
                src={cloudinaryUrl(card.image, { width: 600 })}
                alt={card.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover/col:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#423722] to-[#1a140f]" />
            )}
          </div>
          <p className="mt-3 text-center text-[12px] tracking-[0.15em] uppercase text-bj-text-nav transition-colors group-hover/col:text-bj-gold-rich">
            {card.name}
          </p>
        </Link>
      ))}
    </div>
  );
}

function ItemCards({ items, onClose }: { items: any[]; onClose: () => void }) {
  if (items.length === 0) {
    return <p className="text-[12px] tracking-wide text-bj-text-muted">No pieces available.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((product) => (
        <Link
          key={product.id}
          href={`/catalogue/${product.id}`}
          onClick={onClose}
          className="group/item block"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-bj-border bg-bj-bg-elevated">
            {product.images?.[0] ? (
              <img
                src={cloudinaryUrl(product.images[0], { width: 600 })}
                alt={product.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover/item:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#423722] to-[#1a140f]" />
            )}
          </div>
          <p className="mt-3 text-center text-[12px] tracking-[0.15em] uppercase text-bj-text-nav transition-colors group-hover/item:text-bj-gold-rich">
            {product.title}
          </p>
        </Link>
      ))}
    </div>
  );
}

function OccasionCards({ cards, onClose }: { cards: PanelData['occasions']; onClose: () => void }) {
  if (cards.length === 0) {
    return <p className="text-[12px] tracking-wide text-bj-text-muted">No occasions available.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          onClick={onClose}
          className="group/occ block"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-bj-border bg-bj-bg-elevated">
            {card.image ? (
              <img
                src={cloudinaryUrl(card.image, { width: 600 })}
                alt={card.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover/occ:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#423722] to-[#1a140f]" />
            )}
          </div>
          <p className="mt-3 text-center text-[12px] tracking-[0.15em] uppercase text-bj-text-nav transition-colors group-hover/occ:text-bj-gold-rich">
            {card.name}
          </p>
        </Link>
      ))}
    </div>
  );
}

function PriceFilters({ ranges, onClose }: { ranges: PanelLink[]; onClose: () => void }) {
  if (ranges.length === 0) {
    return <p className="text-[12px] tracking-wide text-bj-text-muted">No price ranges available.</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      {ranges.map((range) => (
        <Link
          key={range.href + range.label}
          href={range.href}
          onClick={onClose}
          className="group/price flex items-center justify-between rounded-lg border border-bj-border bg-bj-bg-elevated px-6 py-4 transition-all duration-300 hover:border-bj-border-hover"
        >
          <span className="text-[14px] tracking-[0.1em] text-bj-text-nav transition-colors group-hover/price:text-bj-gold-rich">
            {range.label}
          </span>
          <span className="text-bj-gold-richer transition-transform duration-300 group-hover/price:translate-x-1.5">
            →
          </span>
        </Link>
      ))}
    </div>
  );
}
