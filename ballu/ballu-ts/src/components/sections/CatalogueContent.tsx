'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Cormorant_Garamond, Cormorant_SC, Tenor_Sans } from 'next/font/google';
import { productService } from '@/services/product-service';
import { CATEGORIES as HARDCODED_CATEGORIES } from '@/data/products';
import { SortOption } from '@/types/product';
import { useFilterSticky } from '@/hooks/useFilterSticky';
import { useProductData } from '@/hooks/useProductData';
import ProductCard from '@/components/shared/ProductCard';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'most-viewed', label: 'Most Viewed' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

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
  defaultCategory?: string;
  title?: string;
  subtitle?: string;
  breadcrumb?: string;
  hideCategories?: boolean;
}

export default function CatalogueContent({
  defaultCategory,
  title,
  subtitle,
  breadcrumb,
  hideCategories,
}: CatalogueContentProps) {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category')?.toUpperCase();
  const urlMaterial = searchParams.get('material')?.toUpperCase();

  const [activeCategories, setActiveCategories] = useState<string[]>(
    urlCategory ? [urlCategory] : defaultCategory ? [defaultCategory] : ['ALL']
  );
  const [activeMaterial, setActiveMaterial] = useState(urlMaterial || 'ALL');
  const [activeGroup, setActiveGroup] = useState('ALL');
  const [activeTag, setActiveTag] = useState('ALL');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
  const { containerRef, isFixed } = useFilterSticky(50);
  const dataReady = useProductData();

  const handleCategoryClick = (cat: string) => {
    if (cat === 'ALL') {
      setActiveCategories(['ALL']);
      return;
    }
    let updated = [...activeCategories];
    if (updated.includes('ALL')) {
      updated = updated.filter((c) => c !== 'ALL');
    }
    if (updated.includes(cat)) {
      updated = updated.filter((c) => c !== cat);
      if (updated.length === 0) updated = ['ALL'];
    } else {
      updated.push(cat);
    }
    setActiveCategories(updated);
  };

  const categoryButtons = useMemo(() => {
    const dbCategories = productService.getCategoriesList();
    if (dbCategories.length > 0) {
      return ['ALL', ...dbCategories.map((c: any) => c.name?.en?.toUpperCase() || '')];
    }
    return [...HARDCODED_CATEGORIES];
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
    categories: activeCategories,
    material: activeMaterial,
    purity: activeGroup,
    tag: activeTag,
    availableOnly,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort,
  });

  return (
    <div className={`${cormorant.className} min-h-screen bg-bj-bg-elevated text-bj-text-alt antialiased`}>
      <header className="w-full pt-6 relative">
        <div className="px-4 sm:px-6 md:px-16 lg:px-15 pb-4">
          <div className={`${tenorSans.className} text-[10px] tracking-[0.35em] text-breadcrumb uppercase mt-2 mb-2`}>
            <Link href="/" className="hover:text-bj-gold-richer transition-colors">Home</Link>
            {breadcrumb ? ` · ${breadcrumb.split(' · ').slice(1).join(' · ')}` : ' · Catalogue'}
          </div>
          <div className="flex flex-col space-y-1 max-w-4xl">
            <h1 className="antialiased text-[42px] sm:text-[75px] md:text-[90px] font-light leading-[1.1] text-bj-text-heading tracking-tight">
              <span className="block">{title || 'The Drawer.'}</span>
            </h1>
          </div>
          <p className="italic pb-5 font-nepali-serif tracking-wide text-bj-text-body opacity-85">
            {subtitle || 'दराज — सबै गहना'}
          </p>
        </div>
      </header>

      <div
        ref={containerRef}
        className={`w-full bg-bj-bg-elevated/95 backdrop-blur-md pb-4 pt-4 border-b border-bj-border px-4 sm:px-6 md:px-16 lg:px-15 sticky top-[50px] z-[49] ${
          isFixed ? 'shadow-2xl' : ''
        }`}
      >
          <div className="flex flex-col gap-3 max-w-[100vw]">
            {!hideCategories && (
              <div className="flex overflow-x-auto whitespace-nowrap gap-2 items-center no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 py-1">
                {categoryButtons.map((cat) => {
                  const isSelected = activeCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`${tenorSans.className} inline-block px-3 py-1 text-[8px] hover:-translate-y-[2px] font-small tracking-widest transition-all border rounded-4xl uppercase shrink-0 ${
                        isSelected
                           ? 'border-bj-gold-alt text-bj-gold-alt  bg-bj-bg-elevated'
                          : 'border-bj-border text-bj-text-muted'
                      }`}
                    >
                      {cat === 'ALL' ? 'ALL' : cat}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
              <div className="flex overflow-x-auto whitespace-nowrap gap-4 items-center shrink-0 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 text-[11px] font-semibold tracking-widest uppercase w-full sm:w-auto">
                {materialButtons.map((mat) => (
                  <button
                    key={mat}
                    onClick={() => { setActiveMaterial(mat); setActiveGroup('ALL'); }}
                    className={`${tenorSans.className} pb-0.5 border-b-2 transition-all ${
                      activeMaterial === mat
                        ? 'border-[#cda274] text-bj-gold-alt'
                        : 'border-transparent text-bj-text-muted'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>

              {activeMaterial !== 'ALL' && groupButtons.length > 1 && (
                <div className="flex overflow-x-auto whitespace-nowrap gap-2 items-center no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 text-[11px] font-semibold tracking-widest uppercase">
                  {groupButtons.map((grp) => (
                    <button
                      key={grp}
                      onClick={() => setActiveGroup(grp)}
                      className={`${tenorSans.className} inline-block px-3 py-1 text-[8px] hover:-translate-y-[2px] font-small tracking-widest transition-all border rounded-4xl uppercase shrink-0 ${
                        activeGroup === grp
                          ? 'border-bj-gold-alt text-bj-gold-alt bg-bj-bg-elevated'
                          : 'border-bj-border text-bj-text-muted'
                      }`}
                    >
                      {grp}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-bj-text-muted">
                <span className={`${tenorSans.className} pieces-count opacity-60 hidden sm:block`}>
                  {filteredProducts.length} Pieces
                </span>

                <div className="flex border border-bj-border">
                  <button
                    onClick={() => setViewMode('GRID')}
                    className={`${tenorSans.className} px-3 py-1.5 text-[10px] tracking-[0.15em] transition-all duration-300 uppercase ${
                      viewMode === 'GRID'
                        ? 'bg-[#cda274] text-black font-semibold'
                        : 'bg-transparent text-[#cda274] hover:bg-[#cda274]/10'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('LIST')}
                    className={`${tenorSans.className} px-3 py-1.5 text-[10px] tracking-[0.15em] transition-all duration-300 uppercase ${
                      viewMode === 'LIST'
                        ? 'bg-[#cda274] text-black font-semibold'
                        : 'bg-transparent text-[#cda274] hover:bg-[#cda274]/10'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      <div className="px-4 sm:px-6 md:px-16 lg:px-15 py-4 border-b border-bj-border/60">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {tagButtons.length > 1 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`${tenorSans.className} text-[9px] tracking-[0.2em] uppercase text-bj-text-dim`}>Tag</span>
              {tagButtons.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTag(t)}
                  className={`${tenorSans.className} px-2.5 py-1 text-[9px] tracking-widest uppercase border rounded-full transition-all ${
                    activeTag === t ? 'border-bj-gold-alt text-bj-gold-alt' : 'border-bj-border text-bj-text-muted'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          <label className={`${tenorSans.className} flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-bj-text-muted cursor-pointer`}>
            <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} className="accent-[#cda274]" />
            In Stock Only
          </label>

          <div className="flex items-center gap-2">
            <span className={`${tenorSans.className} text-[9px] tracking-[0.2em] uppercase text-bj-text-dim`}>Price</span>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min"
              className={`${tenorSans.className} w-20 bg-transparent border border-bj-border rounded px-2 py-1 text-[10px] text-bj-text-alt focus:outline-none focus:border-[#cda274]`}
            />
            <span className="text-bj-text-dim text-[10px]">–</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max"
              className={`${tenorSans.className} w-20 bg-transparent border border-bj-border rounded px-2 py-1 text-[10px] text-bj-text-alt focus:outline-none focus:border-[#cda274]`}
            />
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            <span className={`${tenorSans.className} text-[9px] tracking-[0.2em] uppercase text-bj-text-dim`}>Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className={`${tenorSans.className} bg-transparent border border-bj-border rounded px-2 py-1 text-[10px] text-bj-text-alt focus:outline-none focus:border-[#cda274] uppercase`}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-bj-bg-elevated normal-case">{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <main className="px-4 sm:px-6 md:px-16 lg:px-15 pb-32 mt-6">
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
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} viewMode="GRID" />
            ))}
          </div>
        ) : (
          <div className="w-full">
            <div className={`${tenorSans.className} border-b border-bj-border text-[10px] tracking-[0.25em] text-bj-text-dim uppercase grid grid-cols-[50px_2fr_1fr_100px] sm:grid-cols-[64px_2fr_1fr_1fr_1fr_1fr_1fr_120px] pb-4 items-center font-medium`}>
              <div />
              <div className="pl-4">Piece</div>
              <div className="hidden sm:block">Category</div>
              <div className="hidden sm:block">Material</div>
              <div className="hidden sm:block">Purity</div>
              <div className="hidden sm:block">Weight</div>
              <div>Price</div>
              <div />
            </div>
            <div className="divide-y divide-bj-border">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="LIST" />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
