'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Cormorant_Garamond, Cormorant_SC } from 'next/font/google';
import { productService } from '@/services/product-service';
import { useProductData } from '@/hooks/useProductData';
import { ChevronLeft, ChevronRight } from '@/components/shared/Icons';
import IconButton from '@/components/ui/IconButton';

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

export default function CollectionsRow() {
  const dataReady = useProductData();
  const collections = productService.getCategoryCollections();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 1);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.4;
      container.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <div className="text-white min-h-[30vh] flex flex-col justify-end bg-[#0e0b08]">
      <style>{`
        @keyframes subtleLiftThenVibrate {
          0% { transform: scaleY(1) translateX(0); }
          30% { transform: scaleY(0.985) translateX(0); }
          45% { transform: scaleY(0.985) translateX(-1px); }
          60% { transform: scaleY(0.985) translateX(1px); }
          75% { transform: scaleY(0.985) translateX(-0.5px); }
          90% { transform: scaleY(0.985) translateX(0.5px); }
          100% { transform: scaleY(0.985) translateX(0); }
        }
        @keyframes vibrateThenSettleDown {
          0% { transform: scaleY(0.985) translateX(0); }
          15% { transform: scaleY(0.985) translateX(-1px); }
          30% { transform: scaleY(0.985) translateX(1px); }
          45% { transform: scaleY(0.985) translateX(-0.5px); }
          60% { transform: scaleY(0.985) translateX(0); }
          100% { transform: scaleY(1) translateX(0); }
        }
        .vibrate-card-hover {
          transform-origin: top !important;
          transition: shadow 0.3s ease-out;
          animation: vibrateThenSettleDown 0.35s ease-out forwards;
        }
        .vibrate-card-hover:hover {
          animation: subtleLiftThenVibrate 0.35s ease-out forwards !important;
        }
      `}</style>

      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 lg:px-16 pt-16 pb-8">
        <div className="text-[11px] tracking-[0.4em] text-[#dbb86b] uppercase font-thin opacity-80 mb-6 font-sans">
          The collections
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="flex flex-col space-y-3 max-w-4xl">
            <h1 className={`${cormorantSC.variable} ${cormorant.variable} antialiased text-[clamp(1.8rem,5vw,3.5rem)] font-light leading-[1.1] text-[#fbf7f0] tracking-tight font-serif-editorial`}>
              <span className="block fade-in-up" style={{ animationDelay: '0ms' }}>
                Curated, never crowded.
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto pb-2">
            <IconButton active={canScrollLeft} onClick={() => handleScroll('left')} disabled={!canScrollLeft}>
              <ChevronLeft />
            </IconButton>
            <IconButton active={canScrollRight} onClick={() => handleScroll('right')} disabled={!canScrollRight}>
              <ChevronRight />
            </IconButton>
          </div>
        </div>
      </div>

      <div className="w-full pb-20 overflow-hidden select-none">
        <div className="max-w-7xl w-full mx-auto px-6 md:px-12 lg:px-16">
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth overflow-y-visible py-4 -mx-6 md:-mx-12 lg:-mx-16 px-6 md:px-12 lg:px-16"
          >
            {collections.map((item) => (
              <Link
                key={item.id}
                href={`/${item.slug}`}
                className={`
                  flex-none w-[82vw] sm:w-[45vw] lg:w-[355px] aspect-[3/4]
                  bg-[#13100d] border ${item.borderColor} relative overflow-hidden group 
                  flex flex-col justify-between p-6 md:p-8 
                  hover:shadow-2xl vibrate-card-hover
                `}
              >
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-screen opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ backgroundImage: item.glowStyle }}
                />

                <div className="absolute top-[40%] left-[40%] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.12] group-hover:opacity-[0.22] transition-opacity duration-500">
                  <div className="w-[140px] h-[140px] rounded-full border border-white flex items-center justify-center">
                    <div className="w-[110px] h-[110px] rounded-full border border-white flex items-center justify-center">
                      <div className="w-[80px] h-[80px] rounded-full border border-white flex items-center justify-center">
                        <div className="w-[50px] h-[50px] rounded-full border border-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 self-start">
                  <span className="text-[10px] tracking-widest text-white/40 bg-white/5 border border-white/10 px-2.5 py-1 font-sans">
                    {item.id}
                  </span>
                </div>

                <div className="relative z-10 flex flex-col space-y-4 pt-12">
                  <div>
                    <p className="font-nepali-serif italic text-[#dbb86b] text-xs tracking-wide font-light mb-1 opacity-90">
                      {item.nepaliTitle}
                    </p>
                    <h3 className={`${cormorant.variable} text-2xl inline-block scale-y-[1.2] md:text-2xl font-light font-serif-editorial text-[#fbf7f0] tracking-wide`}>
                      {item.englishTitle}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[10px] tracking-[0.25em] text-white/40 font-sans">
                      <span>{item.pieces}</span>
                      <span className="group/inner flex items-center gap-1 text-[#dbb86b] transition-colors duration-300 tracking-widest">
                        EXPLORE{' '}
                        <span className="transform group-hover/inner:translate-x-1 transition-transform duration-300">→</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[9px] tracking-[0.2em] uppercase font-sans">
                      {item.goldCount > 0 && (
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#dbb86b]" />
                          {item.goldCount} GOLD
                        </span>
                      )}
                      {item.silverCount > 0 && (
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#c8c8c8]" />
                          {item.silverCount} SILVER
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
