'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Cormorant_Garamond, Cormorant_SC } from 'next/font/google';
import { FiSearch, FiX } from 'react-icons/fi';
import { productService } from '@/services/product-service';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { useCurrency } from '@/hooks/useCurrency';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-serif-editorial',
});

const cormorantSC = Cormorant_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-serif-title',
});

const MATERIAL_COLORS: Record<string, string> = {
  GOLD: 'bg-[#dbb86b]',
  SILVER: 'bg-[#c8c8c8]',
  PLATINUM: 'bg-[#e5e4e2]',
  DIAMOND: 'bg-[#b9f2ff]',
};

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { format } = useCurrency();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        setResults(productService.search(query));
      } else {
        setResults([]);
      }
      setSelectedIndex(-1);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      }
      if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
        router.push(`/catalogue/${results[selectedIndex].id}`);
        onClose();
      }
    },
    [results, selectedIndex, router, onClose]
  );

  return (
    <div
      className={`${cormorant.variable} ${cormorantSC.variable} fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] md:pt-[20vh]`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-bj-bg-ticker/85 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-xl mx-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 bg-bj-bg-secondary border border-bj-border rounded-lg px-4 py-3 focus-within:border-[#dbb86b] transition-colors">
          <FiSearch className="text-bj-text-dim shrink-0" size={18} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pieces, materials, collections..."
            className="flex-1 bg-transparent text-bj-text-heading text-sm md:text-base placeholder:text-bj-text-dim outline-none font-sans"
          />
          <button onClick={onClose} className="text-bj-text-dim hover:text-bj-gold transition-colors">
            <FiX size={18} />
          </button>
        </div>

        {query.trim() && (
          <div className="mt-2 bg-bj-bg-secondary border border-bj-border rounded-lg max-h-[55vh] overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-bj-text-dim text-xs tracking-widest uppercase text-center py-10 font-sans">
                No pieces found
              </p>
            ) : (
              <div className="py-2">
                {results.map((product, index) => {
                  const matColor = MATERIAL_COLORS[product.material] || 'bg-white/40';
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={product.id}
                      onClick={() => { router.push(`/catalogue/${product.id}`); onClose(); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        isSelected ? 'bg-bj-selected' : 'hover:bg-bj-selected'
                      }`}
                    >
                      <div className="w-12 h-12 rounded border border-bj-border-light overflow-hidden shrink-0 bg-bj-bg">
                        {product.images?.[0] ? (
                          <img src={cloudinaryUrl(product.images[0], { width: 96, aspect: '1:1' })} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiSearch className="text-[#2b2415]" size={14} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-bj-text-heading font-medium truncate font-serif-editorial">
                          {product.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-bj-text-muted uppercase tracking-wider font-sans">
                            {product.collection}
                          </span>
                          <span className="text-bj-text-separator text-[10px]">|</span>
                          <span className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${matColor}`} />
                            <span className="text-[10px] text-bj-text-muted uppercase tracking-wider font-sans">
                              {product.material}
                            </span>
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-bj-gold font-medium whitespace-nowrap font-sans">
                        {product.showPrice && product.priceNpr != null ? format(product.priceNpr) : 'On Request'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}