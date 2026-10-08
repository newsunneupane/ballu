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
  onApply?: () => void;
  onClear?: () => void;
  hasChanges?: boolean;
  showActions?: boolean;
}

function FltrChip({
  selected,
  onClick,
  children,
  extraClass = '',
}: {
  selected?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  extraClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={!!selected}
      className={`${tenorSans.className} ff-chip${selected ? ' ff-chip-on' : ''} ${extraClass}`}
    >
      {selected && <span className="ff-dot" aria-hidden="true" />}
      {children}
    </button>
  );
}

function FltrGroup({
  label,
  count,
  children,
}: {
  label: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className={`${tenorSans.className} ff-cap`}>
        <span>{label}</span>
        {count != null && count > 0 && <span className="ff-count">{count}</span>}
      </div>
      <div className="ff-scroll no-scrollbar flex overflow-x-auto whitespace-nowrap gap-2 items-center -mx-4 px-4 sm:mx-0 sm:px-0 py-1.5">
        {children}
      </div>
    </div>
  );
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
  onApply,
  onClear,
  hasChanges,
  showActions,
}: CatalogueFilterBarProps) {
  const categoryCount = activeCollections.includes('ALL') ? 0 : activeCollections.length;
  const occasionCount = activeOccasions.length;
  const materialCount = activeMaterial !== 'ALL' ? 1 : 0;
  const groupCount = activeGroup !== 'ALL' ? 1 : 0;

  return (
    <div className={`ff-bar ${className ?? ''}`}>
      <style>{`
        .ff-bar .ff-scroll {
          -webkit-mask-image: linear-gradient(90deg, #000 0, #000 94%, transparent 100%);
          mask-image: linear-gradient(90deg, #000 0, #000 94%, transparent 100%);
        }
        .ff-bar .ff-cap {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 9px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-weight: 600;
          color: #c9a96e;
          opacity: 0.9;
          margin-bottom: 0.15rem;
        }
        .ff-bar .ff-cap::after {
          content: '';
          height: 1px;
          flex: 1;
          background: linear-gradient(90deg, rgba(201,169,110,0.4), transparent);
        }
        .ff-bar .ff-count {
          font-size: 9px;
          letter-spacing: 0.1em;
          padding: 0.1rem 0.55rem;
          border-radius: 999px;
          background: rgba(201,169,110,0.16);
          color: #e9cf8f;
        }
        .ff-bar .ff-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          min-height: 26px;
          padding: 0.25rem 0.75rem;
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          white-space: nowrap;
          flex-shrink: 0;
          border-radius: 999px;
          border: 1px solid rgba(201,169,110,0.55);
          background: rgba(201,169,110,0.06);
          color: #e9cf8f;
          cursor: pointer;
          transition: transform 0.25s ease, border-color 0.25s ease, color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
        }
        .ff-bar .ff-chip:hover {
          transform: translateY(-2px);
          border-color: rgba(233,207,143,0.85);
        }
        .ff-bar .ff-chip:focus-visible {
          outline: 2px solid #c9a96e;
          outline-offset: 2px;
        }
        .ff-bar .ff-chip-on {
          background: linear-gradient(135deg, #e9cf8f, #c9a96e 55%, #9a7b38);
          border-color: transparent;
          color: #1a130a;
          font-weight: 700;
          box-shadow: 0 6px 20px -6px rgba(201,169,110,0.55), inset 0 1px 0 rgba(255,255,255,0.5);
        }
        .ff-bar .ff-chip-on:hover {
          color: #1a130a;
          border-color: transparent;
          transform: translateY(-2px);
        }
        .ff-bar .ff-dot {
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: currentColor;
          flex-shrink: 0;
        }
        .ff-bar .ff-input {
          background: transparent;
          border: 1px solid var(--bj-border);
          border-radius: 0.375rem;
          padding: 0.35rem 0.6rem;
          font-size: 10px;
          color: var(--bj-text-alt);
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .ff-bar .ff-input:focus {
          outline: none;
          border-color: #cda274;
          box-shadow: 0 0 0 3px rgba(201,169,110,0.18);
        }
        @keyframes ff-apply-pulse {
          0% { box-shadow: 0 8px 24px -8px rgba(201,169,110,0.6), inset 0 1px 0 rgba(255,255,255,0.5), 0 0 0 0 rgba(154,123,56,0.55); }
          70% { box-shadow: 0 8px 24px -8px rgba(201,169,110,0.6), inset 0 1px 0 rgba(255,255,255,0.5), 0 0 0 9px rgba(154,123,56,0); }
          100% { box-shadow: 0 8px 24px -8px rgba(201,169,110,0.6), inset 0 1px 0 rgba(255,255,255,0.5), 0 0 0 0 rgba(154,123,56,0); }
        }
        .ff-bar .ff-apply {
          min-height: 38px;
          padding: 0.5rem 1.5rem;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          border-radius: 999px;
          font-weight: 700;
          color: #1a130a;
          background: linear-gradient(135deg, #e9cf8f, #c9a96e 55%, #9a7b38);
          border: 1px solid transparent;
          animation: ff-apply-pulse 2s ease-out infinite;
          transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
        }
        .ff-bar .ff-apply:hover:not(:disabled) {
          transform: translateY(-1px);
        }
        .ff-bar .ff-apply:disabled {
          background: transparent;
          color: var(--bj-text-dim);
          border: 1px solid var(--bj-border);
          box-shadow: none;
          cursor: not-allowed;
          opacity: 0.6;
        }
        .ff-bar .ff-clear {
          min-height: 38px;
          padding: 0.5rem 1.5rem;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          border-radius: 999px;
          border: 1px solid var(--bj-border);
          color: var(--bj-text-muted);
          transition: all 0.25s ease;
        }
        .ff-bar .ff-clear:hover {
          border-color: #c9a96e;
          color: #e9cf8f;
          transform: translateY(-1px);
        }
        [data-theme="light"] .ff-bar .ff-cap {
          color: #8a6a30;
          opacity: 1;
        }
        [data-theme="light"] .ff-bar .ff-cap::after {
          background: linear-gradient(90deg, rgba(138,106,48,0.45), transparent);
        }
        [data-theme="light"] .ff-bar .ff-count {
          background: rgba(204,0,0,0.1);
          color: #a80000;
          font-weight: 700;
        }
        [data-theme="light"] .ff-bar .ff-chip {
          background: #ffffff;
          border-color: #8a6a30;
          color: #684209;
          font-weight: 600;
        }
        [data-theme="light"] .ff-bar .ff-chip:hover {
          border-color: #684209;
          transform: translateY(-2px);
        }
        [data-theme="light"] .ff-bar .ff-chip-on {
          background: linear-gradient(135deg, #d42a2a, #a80000);
          border-color: #8a6a30;
          color: #ffffff;
          box-shadow: 0 6px 20px -6px rgba(204,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.35);
        }
        [data-theme="light"] .ff-bar .ff-chip-on:hover {
          color: #ffffff;
        }
        [data-theme="light"] .ff-bar .ff-input {
          background: #ffffff;
          border-color: rgba(104,66,9,0.3);
          color: #1c1c1c;
        }
        [data-theme="light"] .ff-bar .ff-input:focus {
          border-color: #cc0000;
          box-shadow: 0 0 0 3px rgba(204,0,0,0.12);
        }
        @keyframes ff-apply-pulse-light {
          0% { box-shadow: 0 8px 24px -8px rgba(204,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.35), 0 0 0 0 rgba(204,0,0,0.4); }
          70% { box-shadow: 0 8px 24px -8px rgba(204,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.35), 0 0 0 9px rgba(204,0,0,0); }
          100% { box-shadow: 0 8px 24px -8px rgba(204,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.35), 0 0 0 0 rgba(204,0,0,0); }
        }
        [data-theme="light"] .ff-bar .ff-apply:not(:disabled) {
          background: linear-gradient(135deg, #d42a2a, #a80000);
          border: 1px solid #8a6a30;
          color: #ffffff;
          text-shadow: none;
          animation: ff-apply-pulse-light 2s ease-out infinite;
        }
        [data-theme="light"] .ff-bar .ff-clear:hover {
          border-color: #cc0000;
          color: #a80000;
        }
        @media (prefers-reduced-motion: reduce) {
          .ff-bar .ff-apply:not(:disabled) {
            animation: none;
          }
          .ff-bar .ff-chip, .ff-bar .ff-apply, .ff-bar .ff-clear {
            transition: none;
          }
          .ff-bar .ff-chip:hover, .ff-bar .ff-apply:hover:not(:disabled), .ff-bar .ff-clear:hover {
            transform: none;
          }
        }
      `}</style>
      <div
        className={`w-full bg-bj-bg-elevated/95 backdrop-blur-md pb-4 pt-4 border-b border-bj-border px-4 sm:px-6 md:px-16 lg:px-15 relative ${className ?? ''}`}
      >
        <div className="flex flex-col gap-4 max-w-[100vw]">
          {!hideCategories && (
            <FltrGroup label="Category" count={categoryCount}>
              {collectionButtons.map((cat) => (
                <FltrChip
                  key={cat}
                  selected={activeCollections.includes(cat)}
                  onClick={() => handleCollectionClick(cat)}
                  extraClass="collection-filter"
                >
                  {cat === 'ALL' ? 'ALL' : cat}
                </FltrChip>
              ))}
            </FltrGroup>
          )}

          {!hideCategories && occasionButtons.length > 0 && (
            <FltrGroup label="Occasion" count={occasionCount}>
              {occasionButtons.map((occ) => (
                <FltrChip
                  key={occ}
                  selected={activeOccasions.includes(occ)}
                  onClick={() => handleOccasionClick(occ)}
                  extraClass="collection-filter"
                >
                  {occ}
                </FltrChip>
              ))}
            </FltrGroup>
          )}

          <FltrGroup label="Material" count={materialCount}>
            {materialButtons.map((mat) => (
              <FltrChip
                key={mat}
                selected={activeMaterial === mat}
                onClick={() => {
                  setActiveMaterial(mat);
                  setActiveGroup('ALL');
                }}
              >
                {mat}
              </FltrChip>
            ))}
          </FltrGroup>

          {activeMaterial !== 'ALL' && groupButtons.length > 1 && (
            <FltrGroup label="Purity" count={groupCount}>
              {groupButtons.map((grp) => (
                <FltrChip
                  key={grp}
                  selected={activeGroup === grp}
                  onClick={() => setActiveGroup(grp)}
                >
                  {grp}
                </FltrChip>
              ))}
            </FltrGroup>
          )}

          <div className="flex flex-wrap items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-bj-text-muted">
            <span className={`${tenorSans.className} pieces-count opacity-60 hidden sm:block`}>
              {productCount} Pieces
            </span>

            {showActions && (onApply || onClear) && (
              <div className="flex items-center gap-2 sm:ml-auto">
                {onClear && (
                  <button
                    onClick={onClear}
                    className={`${tenorSans.className} ff-clear`}
                  >
                    Clear
                  </button>
                )}
                {onApply && (
                  <button
                    onClick={onApply}
                    disabled={!hasChanges}
                    className={`${tenorSans.className} ff-apply`}
                  >
                    Apply
                  </button>
                )}
              </div>
            )}

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

      <div className={`px-4 sm:px-6 md:px-16 lg:px-15 py-4 border-b border-bj-border/60 ${className ?? ''}`}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {tagButtons.length > 1 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`${tenorSans.className} text-[9px] tracking-[0.2em] uppercase text-bj-text-dim`}>Tag</span>
              {tagButtons.map((t) => (
                <FltrChip
                  key={t}
                  selected={activeTag === t}
                  onClick={() => setActiveTag(t)}
                  extraClass="tag-filter"
                >
                  {t}
                </FltrChip>
              ))}
            </div>
          )}

          <label className={`${tenorSans.className} stock-only-label flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-bj-text-muted cursor-pointer`}>
            <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} className="accent-[#cda274] h-4 w-4" />
            In Stock Only
          </label>

          <div className="flex items-center gap-2">
            <span className={`${tenorSans.className} text-[9px] tracking-[0.2em] uppercase text-bj-text-dim`}>Price</span>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min"
              className={`${tenorSans.className} ff-input w-20`}
            />
            <span className="text-bj-text-dim text-[10px]">–</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max"
              className={`${tenorSans.className} ff-input w-20`}
            />
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            <span className={`${tenorSans.className} text-[9px] tracking-[0.2em] uppercase text-bj-text-dim`}>Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className={`${tenorSans.className} ff-input uppercase`}
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
    </div>
  );
}
