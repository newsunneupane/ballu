'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Cormorant_Garamond, Cormorant_SC, Tenor_Sans } from 'next/font/google';
import { FiSliders, FiX } from 'react-icons/fi';
import { productService } from '@/services/product-service';
import { CATEGORIES as HARDCODED_CATEGORIES } from '@/data/products';
import { SortOption } from '@/types/product';
import { useProductData } from '@/hooks/useProductData';
import ProductCard from '@/components/shared/ProductCard';
import CatalogueFilterBar from '@/components/sections/CatalogueFilterBar';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'most-viewed', label: 'Most Viewed' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

function getPageItems(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: (number | '...')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push('...');
  for (let i = start; i <= end; i++) items.push(i);
  if (end < total - 1) items.push('...');
  items.push(total);
  return items;
}

const cormorantSC = Cormorant_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

const tenorSans = Tenor_Sans({
  subsets: ['latin'],
  weight: ['400'],
});

interface CatalogueContentProps {
  defaultCollection?: string;
  title?: string;
  subtitle?: string;
  breadcrumb?: string;
  hideCategories?: boolean;
}

export default function CatalogueContent({
  defaultCollection,
  title,
  subtitle,
  breadcrumb,
  hideCategories,
}: CatalogueContentProps) {
  const searchParams = useSearchParams();
  const urlCollection = searchParams.get('collection')?.toUpperCase();
  const urlMaterial = searchParams.get('material')?.toUpperCase();
  const urlGroup = searchParams.get('group')?.toUpperCase();
  const urlOccasion = searchParams.get('occasion')?.toUpperCase();
  const urlMinPrice = searchParams.get('minPrice');
  const urlMaxPrice = searchParams.get('maxPrice');

  const [activeCollections, setActiveCollections] = useState<string[]>(
    urlCollection ? [urlCollection] : defaultCollection ? [defaultCollection] : ['ALL']
  );
  const [activeMaterial, setActiveMaterial] = useState(urlMaterial || 'ALL');
  const [activeGroup, setActiveGroup] = useState(urlGroup || 'ALL');
  const [activeOccasions, setActiveOccasions] = useState<string[]>(
    urlOccasion ? [urlOccasion] : []
  );
  const [activeTag, setActiveTag] = useState('ALL');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [minPrice, setMinPrice] = useState(urlMinPrice ?? '');
  const [maxPrice, setMaxPrice] = useState(urlMaxPrice ?? '');
  const [sort, setSort] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 16;
  const dataReady = useProductData();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const filterAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (filtersOpen) return;
      const mainEl = mainRef.current;
      const vh = window.innerHeight;
      const reachedGrid = mainEl ? mainEl.getBoundingClientRect().top <= vh * 0.5 : false;
      setShowFab(reachedGrid);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [filtersOpen]);

  const handleCollectionClick = (cat: string) => {
    if (cat === 'ALL') {
      setActiveCollections(['ALL']);
      return;
    }
    let updated = [...activeCollections];
    if (updated.includes('ALL')) {
      updated = updated.filter((c) => c !== 'ALL');
    }
    if (updated.includes(cat)) {
      updated = updated.filter((c) => c !== cat);
      if (updated.length === 0) updated = ['ALL'];
    } else {
      updated.push(cat);
    }
    setActiveCollections(updated);
  };

  const handleOccasionClick = (occ: string) => {
    if (activeOccasions.includes(occ)) {
      setActiveOccasions(activeOccasions.filter((o) => o !== occ));
    } else {
      setActiveOccasions([...activeOccasions, occ]);
    }
  };

  const collectionButtons = useMemo(() => {
    const dbCollections = productService.getCollectionsList();
    if (dbCollections.length > 0) {
      return ['ALL', ...dbCollections.map((c: any) => c.name?.en?.toUpperCase() || '')];
    }
    return [...HARDCODED_CATEGORIES];
  }, [dataReady]);

  const occasionButtons = useMemo(() => {
    const dbOccasions = productService.getOccasionsList();
    if (dbOccasions.length > 0) {
      return dbOccasions.map((o: any) => (o?.name?.en || '').trim().toUpperCase()).filter(Boolean);
    }
    return [];
  }, [dataReady]);

  const materialButtons = useMemo(() => {
    const dbMaterials = productService.getMaterialsList();
    if (dbMaterials.length > 0) {
      return ['ALL', ...dbMaterials.map((m: any) => m.name?.en?.toUpperCase() || '')];
    }
    return ['ALL', 'GOLD', 'SILVER'];
  }, [dataReady]);

  const groupButtons = useMemo(() => {
    if (activeMaterial === 'ALL') return ['ALL'];
    const groups = productService.getGroupsForMaterial(activeMaterial);
    if (groups.length === 0) return ['ALL'];
    return ['ALL', ...groups.map((g: any) => g.name?.toUpperCase() || '')];
  }, [dataReady, activeMaterial]);

  const tagButtons = useMemo(() => {
    const tags = new Set<string>();
    productService.getAll().forEach((p) => { if (p.tag) tags.add(p.tag); });
    return ['ALL', ...Array.from(tags)];
  }, [dataReady]);

  const filteredProducts = productService.getFiltered({
    collections: activeCollections,
    occasions: activeOccasions,
    material: activeMaterial,
    purity: activeGroup,
    tag: activeTag,
    availableOnly,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort,
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const pageItems = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [
    activeCollections,
    activeMaterial,
    activeGroup,
    activeOccasions,
    activeTag,
    availableOnly,
    minPrice,
    maxPrice,
    sort,
  ]);

  const goToPage = (p: number) => {
    const target = Math.min(Math.max(1, p), totalPages);
    setPage(target);
    requestAnimationFrame(() => {
      let y = 0;
      const anchor = filterAnchorRef.current;
      if (anchor && anchor.offsetParent !== null) {
        y = anchor.getBoundingClientRect().top + window.scrollY - 25;
      } else if (mainRef.current) {
        y = mainRef.current.getBoundingClientRect().top + window.scrollY - 25;
      }
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  };

  return (
    <div className={`${cormorant.className} min-h-screen bg-bj-bg-elevated text-bj-text-alt antialiased`}>
      <header className="w-full pt-6 relative">
        <div className="px-4 sm:px-6 md:px-16 lg:px-15 pb-4">
          <div className={`${tenorSans.className} text-[10px] tracking-[0.35em] text-breadcrumb uppercase mt-2 mb-2`}>
            <Link href="/" className="hover:text-bj-gold-richer transition-colors">Home</Link>
            {breadcrumb ? ` · ${breadcrumb.split(' · ').slice(1).join(' · ')}` : ' · Catalogue'}
          </div>
          <div className="flex flex-col space-y-1 max-w-4xl">
            <h1 className="antialiased catalogue-title text-[42px] sm:text-[75px] md:text-[90px] font-light leading-[1.1] text-bj-text-heading tracking-tight">
              <span className="block">{title || 'The Drawer.'}</span>
            </h1>
          </div>
          <p className="italic pb-5 font-nepali-serif tracking-wide text-bj-text-body opacity-85">
            {subtitle || 'दराज — सबै गहना'}
          </p>
        </div>
      </header>

      {/* Desktop: inline filter bar */}
      <div ref={filterAnchorRef}>
        <CatalogueFilterBar
          className="hidden md:block"
          collectionButtons={collectionButtons}
        occasionButtons={occasionButtons}
        materialButtons={materialButtons}
        groupButtons={groupButtons}
        tagButtons={tagButtons}
        activeCollections={activeCollections}
        activeMaterial={activeMaterial}
        activeGroup={activeGroup}
        activeOccasions={activeOccasions}
        activeTag={activeTag}
        availableOnly={availableOnly}
        minPrice={minPrice}
        maxPrice={maxPrice}
        sort={sort}
        viewMode={viewMode}
        hideCategories={hideCategories}
        productCount={filteredProducts.length}
        handleCollectionClick={handleCollectionClick}
        handleOccasionClick={handleOccasionClick}
        setActiveMaterial={setActiveMaterial}
        setActiveGroup={setActiveGroup}
        setActiveTag={setActiveTag}
        setAvailableOnly={setAvailableOnly}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        setSort={setSort}
        setViewMode={setViewMode}
        />
      </div>

      {/* Mobile: floating filters button (auto show/hide on scroll) */}
      {showFab && !filtersOpen && (
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          aria-label="Open filters"
          className="bj-filter-fab fixed right-3 top-[84px] z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-bj-gold-rich/60 bg-bj-gold-rich text-bj-bg shadow-lg md:hidden transition-transform duration-300 hover:scale-105"
        >
          <FiSliders size={20} />
        </button>
      )}

      {/* Mobile: full filters bottom sheet */}
      <div
        className={`fixed inset-0 z-[70] md:hidden transition-opacity duration-300 ${
          filtersOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/60" onClick={() => setFiltersOpen(false)} />
        <div
          className={`absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-bj-bg border-t border-bj-border transition-transform duration-300 ease-in-out ${
            filtersOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="sticky top-0 flex items-center justify-between px-5 h-14 bg-bj-bg border-b border-bj-border">
            <span className="text-[13px] tracking-[0.2em] uppercase text-bj-text-nav">Filters</span>
            <button
              onClick={() => setFiltersOpen(false)}
              aria-label="Close filters"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-bj-border text-bj-text-nav transition-colors hover:border-bj-gold-rich hover:text-bj-gold-rich"
            >
              <FiX size={18} />
            </button>
          </div>

          <div className="px-4 py-4">
            <CatalogueFilterBar
              collectionButtons={collectionButtons}
              occasionButtons={occasionButtons}
              materialButtons={materialButtons}
              groupButtons={groupButtons}
              tagButtons={tagButtons}
              activeCollections={activeCollections}
              activeMaterial={activeMaterial}
              activeGroup={activeGroup}
              activeOccasions={activeOccasions}
              activeTag={activeTag}
              availableOnly={availableOnly}
              minPrice={minPrice}
              maxPrice={maxPrice}
              sort={sort}
              viewMode={viewMode}
              hideCategories={hideCategories}
              productCount={filteredProducts.length}
              handleCollectionClick={handleCollectionClick}
              handleOccasionClick={handleOccasionClick}
              setActiveMaterial={setActiveMaterial}
              setActiveGroup={setActiveGroup}
              setActiveTag={setActiveTag}
              setAvailableOnly={setAvailableOnly}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              setSort={setSort}
              setViewMode={setViewMode}
            />
          </div>

          <div className="sticky bottom-0 px-5 py-3 bg-bj-bg border-t border-bj-border">
            <button
              onClick={() => setFiltersOpen(false)}
              className="w-full h-12 rounded-full bg-bj-gold-rich text-bj-bg text-[12px] tracking-[0.2em] uppercase transition-colors hover:bg-bj-gold-richer"
            >
              Show {filteredProducts.length} Pieces
            </button>
          </div>
        </div>
      </div>

      <main ref={mainRef} className="px-4 sm:px-6 md:px-16 lg:px-15 pb-32 mt-6">
        {!dataReady ? (
          <div className={`${tenorSans.className} col-span-full text-center py-20 text-xs tracking-[4px] uppercase text-bj-text-muted`}>
            Loading ...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className={`${tenorSans.className} col-span-full text-center py-20 text-xs tracking-[4px] uppercase text-bj-text-muted`}>
            No personalised designs found matching these selections.
          </div>
        ) : viewMode === 'GRID' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pageItems.map((product) => (
              <ProductCard key={product.id} product={product} viewMode="GRID" />
            ))}
          </div>
        ) : (
          <div className="w-full">
            <div className={`${tenorSans.className} border-b border-bj-border text-[10px] tracking-[0.25em] text-bj-text-dim uppercase grid grid-cols-[50px_2fr_1fr_100px] sm:grid-cols-[64px_2fr_1fr_1fr_1fr_1fr_1fr_120px] pb-4 items-center font-medium`}>
              <div />
              <div className="pl-4">Piece</div>
              <div className="hidden sm:block">Collection</div>
              <div className="hidden sm:block">Material</div>
              <div className="hidden sm:block">Purity</div>
              <div className="hidden sm:block">Weight</div>
              <div>Price</div>
              <div />
            </div>
            <div className="divide-y divide-bj-border">
              {pageItems.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="LIST" />
              ))}
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-[11px] tracking-[0.2em] uppercase border border-bj-border text-bj-text-muted transition-colors hover:border-bj-gold-rich hover:text-bj-gold-rich disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            {getPageItems(currentPage, totalPages).map((it, i) =>
              it === '...' ? (
                <span key={`e${i}`} className="px-2 text-bj-text-muted">
                  …
                </span>
              ) : (
                <button
                  type="button"
                  key={it}
                  onClick={() => goToPage(it)}
                  className={`px-3 py-1.5 text-[11px] tracking-[0.2em] uppercase border transition-colors ${
                    it === currentPage
                      ? 'border-bj-gold-alt text-bj-gold-alt bg-bj-bg-elevated'
                      : 'border-bj-border text-bj-text-muted hover:border-bj-gold-rich hover:text-bj-gold-rich'
                  }`}
                >
                  {it}
                </button>
              )
            )}
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-[11px] tracking-[0.2em] uppercase border border-bj-border text-bj-text-muted transition-colors hover:border-bj-gold-rich hover:text-bj-gold-rich disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
