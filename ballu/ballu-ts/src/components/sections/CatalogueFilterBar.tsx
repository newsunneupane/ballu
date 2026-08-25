'use client';

import React from 'react';
import { Tenor_Sans } from 'next/font/google';
import { SortOption } from '@/types/product';

const tenorSans = Tenor_Sans({
  subsets: ['latin'],
  weight: ['400'],
});

export interface CatalogueFilterBarProps {
  collectionButtons: string[];
  occasionButtons: string[];
  materialButtons: string[];
  groupButtons: string[];
  tagButtons: string[];
  activeCollections: string[];
  activeMaterial: string;
  activeGroup: string;
  activeOccasions: string[];
  activeTag: string;
  availableOnly: boolean;
  minPrice: string;
  maxPrice: string;
  sort: SortOption;
  viewMode: 'GRID' | 'LIST';
  hideCategories?: boolean;
  productCount?: number;
  className?: string;
  handleCollectionClick: (cat: string) => void;
  handleOccasionClick: (occ: string) => void;
  setActiveMaterial: (m: string) => void;
  setActiveGroup: (g: string) => void;
  setActiveTag: (t: string) => void;
  setAvailableOnly: (v: boolean) => void;
  setMinPrice: (v: string) => void;
  setMaxPrice: (v: string) => void;
  setSort: (s: SortOption) => void;
  setViewMode: (v: 'GRID' | 'LIST') => void;
}

export default function CatalogueFilterBar({
  collectionButtons,
  occasionButtons,
  materialButtons,
  groupButtons,
  tagButtons,
  activeCollections,
  activeMaterial,
  activeGroup,
  activeOccasions,
  activeTag,
  availableOnly,
  minPrice,
  maxPrice,
  sort,
  viewMode,
  hideCategories,
  productCount = 0,
  className,
  handleCollectionClick,
  handleOccasionClick,
  setActiveMaterial,
  setActiveGroup,
  setActiveTag,
  setAvailableOnly,
  setMinPrice,
  setMaxPrice,
  setSort,
  setViewMode,
}: CatalogueFilterBarProps) {
  return (
    <>
      <div
        className={`w-full bg-bj-bg-elevated/95 backdrop-blur-md pb-4 pt-4 border-b border-bj-border px-4 sm:px-6 md:px-16 lg:px-15 relative ${className ?? ''}`}
      >
        <div className="flex flex-col gap-3 max-w-[100vw]">
          {!hideCategories && (
            <div className="flex overflow-x-auto whitespace-nowrap gap-2 items-center no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 py-1">
              {collectionButtons.map((cat) => {
                const isSelected = activeCollections.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => handleCollectionClick(cat)}
                    className={`${tenorSans.className} collection-filter inline-block px-3 py-1 text-[8px] hover:-translate-y-[2px] font-small tracking-widest transition-all border rounded-4xl uppercase shrink-0 ${
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

          {!hideCategories && occasionButtons.length > 0 && (
            <div className="flex overflow-x-auto whitespace-nowrap gap-2 items-center no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 py-1">
              {occasionButtons.map((occ) => {
                const isSelected = activeOccasions.includes(occ);
                return (
                  <button
                    key={occ}
                    onClick={() => handleOccasionClick(occ)}
                    className={`${tenorSans.className} collection-filter inline-block px-3 py-1 text-[8px] hover:-translate-y-[2px] font-small tracking-widest transition-all border rounded-4xl uppercase shrink-0 ${
                      isSelected
                        ? 'border-bj-gold-alt text-bj-gold-alt bg-bj-bg-elevated'
                        : 'border-bj-border text-bj-text-muted'
                    }`}
                  >
                    {occ}
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
                  onClick={() => {
                    setActiveMaterial(mat);
                    setActiveGroup('ALL');
                  }}
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
                {productCount} Pieces
              </span>

              <div className="flex border border-bj-border">
                <button
                  onClick={() => setViewMode('GRID')}
                  className={`${tenorSans.className} catalogue-toggle px-3 py-1.5 text-[10px] tracking-[0.15em] transition-all duration-300 uppercase ${
                    viewMode === 'GRID'
                      ? 'bg-[#cda274] text-black font-semibold'
                      : 'bg-transparent text-[#cda274] hover:bg-[#cda274]/10'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('LIST')}
                  className={`${tenorSans.className} catalogue-toggle px-3 py-1.5 text-[10px] tracking-[0.15em] transition-all duration-300 uppercase ${
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

      <div className={`px-4 sm:px-6 md:px-16 lg:px-15 py-4 border-b border-bj-border/60 ${className ?? ''}`}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {tagButtons.length > 1 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`${tenorSans.className} text-[9px] tracking-[0.2em] uppercase text-bj-text-dim`}>Tag</span>
              {tagButtons.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTag(t)}
                  className={`${tenorSans.className} tag-filter px-2.5 py-1 text-[9px] tracking-widest uppercase border rounded-full transition-all ${
                    activeTag === t ? 'border-bj-gold-alt text-bj-gold-alt' : 'border-bj-border text-bj-text-muted'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          <label className={`${tenorSans.className} stock-only-label flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-bj-text-muted cursor-pointer`}>
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
              {[
                { value: 'newest', label: 'Newest' },
                { value: 'most-viewed', label: 'Most Viewed' },
                { value: 'price-asc', label: 'Price: Low to High' },
                { value: 'price-desc', label: 'Price: High to Low' },
              ].map((o) => (
                <option key={o.value} value={o.value} className="bg-bj-bg-elevated normal-case">
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
