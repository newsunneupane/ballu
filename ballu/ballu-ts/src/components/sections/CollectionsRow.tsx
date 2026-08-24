'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Cormorant_Garamond, Cormorant_SC } from 'next/font/google';
import { productService } from '@/services/product-service';
import { useProductData } from '@/hooks/useProductData';
import { cloudinaryUrl } from '@/lib/cloudinary';
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

const MATERIAL_COLORS: Record<string, string> = {
  GOLD: 'bg-[#b8860b]',
  SILVER: 'bg-[#808080]',
  PLATINUM: 'bg-[#a6a19a]',
  DIAMOND: 'bg-[#4a90c4]',
};

export default function CollectionsRow() {
  const dataReady = useProductData();
  const collections = productService.getCollectionsCards();
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
    <div className="text-bj-text-heading min-h-[30vh] flex flex-col justify-end bg-bj-bg-secondary">
      <style>{`
        @keyframes subtleLiftThenVibrate {
          0% { transform: translateY(0) translateX(0); }
          30% { transform: translateY(-3px) translateX(0); }
          45% { transform: translateY(-3px) translateX(-1px); }
          60% { transform: translateY(-3px) translateX(1px); }
          75% { transform: translateY(-3px) translateX(-0.5px); }
          90% { transform: translateY(-3px) translateX(0.5px); }
          100% { transform: translateY(-3px) translateX(0); }
        }
        @keyframes vibrateThenSettleDown {
          0% { transform: translateY(-3px) translateX(0); }
          15% { transform: translateY(-2px) translateX(-1px); }
          30% { transform: translateY(-1px) translateX(1px); }
          45% { transform: translateY(-1px) translateX(-0.5px); }
          60% { transform: translateY(0) translateX(0); }
          100% { transform: translateY(0) translateX(0); }
        }
        .vibrate-card-hover {
          transform: translateZ(0);
          transition: box-shadow 0.3s ease-out;
          animation: vibrateThenSettleDown 0.35s ease-out forwards;
        }
        .vibrate-card-hover:hover {
          animation: subtleLiftThenVibrate 0.35s ease-out forwards !important;
        }
        .card-luxury-svg { display: none; }
        [data-theme="light"] .card-luxury-svg { display: block; }
        [data-theme="light"] .collection-card {
          background: #ffffff;
          border-color: #cc0000 !important;
          box-shadow: 0 1px 2px rgba(204,0,0,0.12);
        }
        [data-theme="light"] .collection-card:hover {
          box-shadow: 0 8px 30px rgba(204,0,0,0.3), 0 2px 8px rgba(204,0,0,0.12);
        }
        [data-theme="light"] .collection-card .card-circle,
        [data-theme="light"] .collection-card .card-circle > div {
          border-color: #cc0000 !important;
        }
        [data-theme="light"] .collection-card .card-circle {
          opacity: 0.35;
        }
        [data-theme="light"] .collection-card .card-glow {
          mix-blend-mode: normal;
          opacity: 0.04;
        }
        [data-theme="light"] .collection-card .card-nepali-title,
        [data-theme="light"] .collection-card .card-explore {
          color: #000000 !important;
        }
        [data-theme="light"] .collection-card .card-text-area {
          background-image: none !important;
        }
        [data-theme="light"] .collection-card .card-title {
          background-image: none !important;
          -webkit-text-fill-color: #cc0000 !important;
          color: #cc0000 !important;
        }
        [data-theme="light"] .collection-card .card-nepali-title {
          opacity: 1;
        }
        [data-theme="light"] .collections-row-btn {
          background: #cc0000 !important;
          color: #ffffff !important;
          box-shadow: 0 0 15px rgba(204,0,0,0.4) !important;
        }
        [data-theme="light"] .collections-row-btn:hover {
          background: #b30000 !important;
        }
        [data-theme="light"] .collections-row-heading {
          color: #cc0000 !important;
        }
      `}</style>

      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 lg:px-16 pt-16 pb-8">
        

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="flex flex-col space-y-3 max-w-4xl">
            <h1 className={`${cormorantSC.variable} ${cormorant.variable} antialiased collections-row-heading text-[clamp(1.8rem,5vw,3.5rem)] font-light leading-[1.1] text-bj-text-heading tracking-tight font-serif-editorial`}>
              <span className="block fade-in-up" style={{ animationDelay: '0ms' }}>
                The Collections
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto pb-2">
            <IconButton active={canScrollLeft} onClick={() => handleScroll('left')} disabled={!canScrollLeft} className="collections-row-btn">
              <ChevronLeft />
            </IconButton>
            <IconButton active={canScrollRight} onClick={() => handleScroll('right')} disabled={!canScrollRight} className="collections-row-btn">
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
                  flex-none w-[82vw] sm:w-[45vw] lg:w-[355px]
                  collection-card bg-bj-bg-card border ${item.borderColor} relative overflow-hidden group
                  flex hover:shadow-2xl vibrate-card-hover
                `}
              >
                <div className="relative z-0 w-[46%] sm:w-[48%] shrink-0 self-stretch overflow-hidden">
                  {item.image ? (
                      <img
                        src={cloudinaryUrl(item.image, { width: 400 })}
                        alt={item.englishTitle}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                  ) : (
                    <>
                      <div
                        className="card-glow absolute inset-0 pointer-events-none mix-blend-screen opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                        style={{ backgroundImage: item.glowStyle }}
                      />

                      <div className="card-luxury-svg absolute inset-0 pointer-events-none" aria-hidden="true">
                        <svg className="h-full w-full" viewBox="0 0 355 473" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <pattern id={`mv-${item.id}`} x="0" y="0" width="240" height="240" patternUnits="userSpaceOnUse">
                              <path d="M0 50 Q60 30 120 60 T240 40" stroke="#dbb86b" strokeWidth="0.3" opacity="0.07" fill="none"/>
                              <path d="M0 110 Q80 130 140 95 T240 115" stroke="#dbb86b" strokeWidth="0.2" opacity="0.05" fill="none"/>
                              <path d="M0 170 Q50 160 100 185 T240 175" stroke="#dbb86b" strokeWidth="0.2" opacity="0.04" fill="none"/>
                              <path d="M60 0 Q40 60 70 120 T50 240" stroke="#dbb86b" strokeWidth="0.2" opacity="0.05" fill="none"/>
                              <path d="M170 0 Q190 70 150 130 T180 240" stroke="#dbb86b" strokeWidth="0.15" opacity="0.04" fill="none"/>
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill={`url(#mv-${item.id})`}/>
                        </svg>
                      </div>

                      <div className="card-circle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.12] group-hover:opacity-[0.22] transition-opacity duration-500">
                        <div className="w-[80px] h-[80px] rounded-full border border-white flex items-center justify-center">
                          <div className="w-[60px] h-[60px] rounded-full border border-white flex items-center justify-center">
                            <div className="w-[40px] h-[40px] rounded-full border border-white" />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="card-text-area relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-3 p-5 md:p-6" style={{ backgroundImage: item.glowStyle }}>
                  <p className="card-nepali-title font-nepali-serif italic text-bj-gold text-[11px] tracking-[0.16em] font-light opacity-90">
                    {item.nepaliTitle}
                  </p>

                  <div className="relative pt-3">
                    <span className="absolute top-0 left-0 h-px w-9 bg-gradient-to-r from-bj-gold via-bj-gold/60 to-transparent" />
                    <h3 className={`card-title ${cormorant.variable} text-[27px] leading-[1.08] font-light font-serif-editorial tracking-wide bg-gradient-to-br from-[#e9cf8f] via-[#c79a3b] to-[#9a7212] bg-clip-text text-transparent [-webkit-text-stroke:0.3px_rgba(184,134,11,0.35)] drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]`}>
                      {item.englishTitle}
                    </h3>
                  </div>

                  <span className="pieces-count block text-[10px] tracking-[0.3em] uppercase text-bj-gold/60 font-sans">
                    {item.pieces}
                  </span>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[9px] tracking-[0.22em] uppercase font-sans text-bj-gold/55">
                    {item.materialCounts.map((mc) => (
                      <span key={mc.material} className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${MATERIAL_COLORS[mc.material] || 'bg-white/40'}`} />
                        {mc.count} {mc.material}
                      </span>
                    ))}
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
