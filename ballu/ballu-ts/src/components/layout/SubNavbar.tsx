'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Cormorant_Garamond } from 'next/font/google';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { productService } from '@/services/product-service';
import {
  buildNavItems,
  getPanelData,
  type SubNavItem,
  type PanelLink,
  type PanelCollection,
  type PanelData,
} from '@/components/layout/subnav-data';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-serif-editorial',
});

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
      className="absolute left-[8%] right-[8%] top-full z-[60] flex h-[calc(80vh-15px)] flex-col overflow-hidden border-4 border-bj-border border-t-0 rounded-b-2xl bg-bj-bg-secondary shadow-[0_30px_38px_-12px_rgba(0,0,0,0.85)] backdrop-blur-md"
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
              <CollectionCards cards={data.collections} baseQuery={data.baseQuery} onClose={onClose} />
            ) : data.categoryMode === 'mixed' ? (
              <>
                <CollectionCards cards={data.collections} baseQuery={data.baseQuery} onClose={onClose} />
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

function CollectionCards({ cards, baseQuery, onClose }: { cards: PanelCollection[]; baseQuery?: string; onClose: () => void }) {
  if (cards.length === 0) {
    return <p className="text-[12px] tracking-wide text-bj-text-muted">No collections available.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {cards.map((card) => {
        const q = new URLSearchParams(baseQuery || '');
        q.set('collection', card.name.trim().toUpperCase());
        const href = `/catalogue?${q.toString()}`;
        return (
        <Link
          key={card.slug}
          href={href}
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
        );
      })}
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
