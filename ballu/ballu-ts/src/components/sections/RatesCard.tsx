'use client';

import React, { useEffect, useRef, useState } from 'react';

export type GroupRate = {
  groupId: string;
  name: string;
  materialName: string | null;
  rateNpr: number | null;
  lastItemChangedAt: string | null;
  lastItemChangedLabel: string | null;
};

function groupByMaterial(rates: GroupRate[]) {
  const order: string[] = [];
  const map = new Map<string, GroupRate[]>();
  for (const r of rates) {
    const key = r.materialName || 'Other';
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(r);
  }
  return order.map((materialName) => ({ materialName, groups: map.get(materialName)! }));
}

export default function RatesCard({
  groupRates,
  variant = 'full',
  className = '',
}: {
  groupRates: GroupRate[] | null;
  variant?: 'full' | 'compact';
  className?: string;
}) {
  const grouped = groupRates && groupRates.length ? groupByMaterial(groupRates) : [];

  let lastUpdated: string | null = null;
  for (const g of groupRates || []) {
    if (g.lastItemChangedAt) {
      const t = new Date(g.lastItemChangedAt).getTime();
      if (!isNaN(t) && (lastUpdated === null || t > new Date(lastUpdated).getTime())) {
        lastUpdated = g.lastItemChangedAt;
      }
    }
  }
  const updatedLabel = lastUpdated
    ? new Date(lastUpdated).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : null;

  const compact = variant === 'compact';
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScroll(el.scrollHeight - el.clientHeight > 4);
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 8);
  };

  useEffect(() => {
    checkScroll();
    // Re-check after fonts settle; heights can shift once webfonts load.
    const t = setTimeout(checkScroll, 600);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', checkScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupRates]);

  return (
    <>
      <style>{`
        [data-theme="light"] .brand-rates-card {
          background: #F4F0EA !important;
          border-color: rgba(0,0,0,0.08) !important;
        }
        [data-theme="light"] .brand-rates-card .rt-material { color: #1C1C1C !important; opacity: 0.55; }
        [data-theme="light"] .brand-rates-card .rt-name { color: #1C1C1C !important; }
        [data-theme="light"] .brand-rates-card .rt-value { color: #9A7B38 !important; }
        [data-theme="light"] .brand-rates-card .rt-empty { color: #6b655b !important; }
        [data-theme="light"] .brand-rates-card .rt-updated { color: #6b655b !important; opacity: 0.75; }
        [data-theme="light"] .brand-rates-card .rt-row { border-color: rgba(0,0,0,0.08) !important; }

        /* Desktop hero rates: dark-luxe spotlight with gold glow (dark + light readable). */
        .brand-rates-card.brand-rates-desktop {
          position: relative;
          isolation: isolate;
          background:
            radial-gradient(120% 90% at 20% 0%, rgba(233,207,143,0.16), transparent 55%),
            radial-gradient(100% 80% at 90% 100%, rgba(212,168,87,0.14), transparent 60%),
            linear-gradient(180deg, #1a130a 0%, #14100a 55%, #0f0c08 100%) !important;
          border-color: rgba(201,169,110,0.45) !important;
          box-shadow:
            0 18px 60px -18px rgba(201,169,110,0.45),
            0 0 0 1px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.06) !important;
        }
        .brand-rates-card.brand-rates-desktop::before {
          content: '';
          position: absolute;
          left: 2rem;
          right: 2rem;
          top: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(233,207,143,0.9), transparent);
          pointer-events: none;
        }
        .brand-rates-card.brand-rates-desktop::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(233,207,143,0.08) 50%, transparent 60%);
          pointer-events: none;
        }
        .brand-rates-card.brand-rates-desktop .rt-value {
          color: #e9cf8f !important;
          font-weight: 600;
          text-shadow: 0 0 12px rgba(233,207,143,0.35);
        }
        .brand-rates-card.brand-rates-desktop .rt-updated {
          font-size: 13px !important;
          font-weight: 600;
          letter-spacing: 0.04em;
          opacity: 1;
        }
        [data-theme="light"] .brand-rates-card.brand-rates-desktop {
          background: linear-gradient(180deg, #fffdf6 0%, #faf3e0 55%, #f5ead0 100%) !important;
          border-color: rgba(184,137,48,0.5) !important;
          box-shadow:
            0 18px 50px -20px rgba(184,137,48,0.5),
            inset 0 1px 0 rgba(255,255,255,0.8) !important;
        }
        [data-theme="light"] .brand-rates-card.brand-rates-desktop .rt-material {
          color: #8a6a30 !important;
          opacity: 1;
          font-weight: 700;
        }
        [data-theme="light"] .brand-rates-card.brand-rates-desktop .rt-name {
          color: #1c1c1c !important;
          font-weight: 600;
        }
        [data-theme="light"] .brand-rates-card.brand-rates-desktop .rt-value {
          color: #684209 !important;
          font-weight: 700;
          text-shadow: none;
        }
        [data-theme="light"] .brand-rates-card.brand-rates-desktop .rt-empty { color: #4a3d24 !important; }
        [data-theme="light"] .brand-rates-card.brand-rates-desktop .rt-updated {
          color: #1c1c1c !important;
          font-size: 13px !important;
          font-weight: 600;
          opacity: 1;
        }
        [data-theme="light"] .brand-rates-card.brand-rates-desktop .rt-row {
          border-color: rgba(104,66,9,0.18) !important;
        }

        /* Scrollable rates list: thin always-visible gold scrollbar (site hides all others). */
        .brand-rates-card .rt-scroll {
          overscroll-behavior: contain;
          scrollbar-width: thin;
          scrollbar-color: #c9a96e transparent;
        }
        .brand-rates-card .rt-scroll::-webkit-scrollbar {
          display: block !important;
          width: 6px;
        }
        .brand-rates-card .rt-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .brand-rates-card .rt-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #e9cf8f, #9a7b38);
          border-radius: 999px;
        }
        .brand-rates-card .rt-scroll::-webkit-scrollbar-thumb:hover {
          background: #e9cf8f;
        }
        [data-theme="light"] .brand-rates-card .rt-scroll {
          scrollbar-color: #8a6a30 transparent;
        }
        [data-theme="light"] .brand-rates-card .rt-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #8a6a30, #684209);
        }
        [data-theme="light"] .brand-rates-card .rt-scroll-hint {
          color: #8a6a30 !important;
        }
        @keyframes rt-scroll-nudge {
          0%, 100% { transform: translateY(0); opacity: 0.85; }
          50% { transform: translateY(3px); opacity: 1; }
        }
        .brand-rates-card .rt-scroll-hint {
          animation: rt-scroll-nudge 1.8s ease-in-out infinite;
        }


      `}</style>
    <div
      className={`brand-rates-card rounded-2xl border border-bj-border bg-bj-bg-elevated flex flex-col min-h-0 ${
        compact ? 'p-4 md:p-5' : 'p-6 md:p-8'
      } ${className}`}
    >
      <div className={`flex items-center gap-3 ${compact ? 'mb-4' : 'mb-6'}`}>
        <span className="h-px w-8 bg-bj-gold/60" />
        <span className="text-[10px] tracking-[0.4em] text-bj-gold uppercase opacity-80">
          Today&apos;s Rates
        </span>
        {canScroll && !atBottom && (
          <span className="rt-scroll-hint ml-auto hidden md:inline-block font-sans text-[9px] tracking-[0.3em] uppercase text-[#c9a96e]">
            scroll ↓
          </span>
        )}
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className={`rt-scroll ${compact ? 'md:flex-1 md:min-h-0 md:overflow-y-auto md:pr-1' : ''}`}
      >
        {grouped.length > 0 ? (
          <div className={compact ? 'grid grid-cols-1 gap-y-5' : 'grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7'}>
            {grouped.map(({ materialName, groups }) => (
              <div key={materialName}>
                <h4 className="rt-material text-[11px] tracking-[0.3em] uppercase text-bj-text-body opacity-60 mb-3 font-sans">
                  {materialName}
                </h4>
                <ul className="space-y-1.5">
                  {groups.map((g) => (
                    <li
                      key={g.groupId}
                      className="rt-row grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-b border-white/5 pb-2"
                    >
                      <span
                        className={`rt-name tracking-[0.01em] text-bj-text-heading font-sans ${
                          compact ? 'text-[13px]' : 'text-[14px]'
                        }`}
                      >
                        {g.name}
                      </span>
                      {g.rateNpr != null ? (
                        <span
                          className={`rt-value font-medium font-sans text-[#9A7B38] whitespace-nowrap ${
                            compact ? 'text-[13px]' : 'text-[14px]'
                          }`}
                        >
                          ₨ {g.rateNpr.toLocaleString('en-IN')} / g
                        </span>
                      ) : (
                        <span className="rt-empty text-[11px] tracking-[0.18em] uppercase text-bj-text-muted whitespace-nowrap">
                          Contact for quote
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] tracking-[0.25em] text-bj-text-body opacity-60 uppercase font-sans">
            Rates unavailable
          </p>
        )}
      </div>

      <div className={`${compact ? 'mt-4 pt-3' : 'mt-6 pt-4'} border-t border-white/5`}>
        <span className="rt-updated text-[13px] font-medium tracking-[0.04em] text-bj-text-muted">
          {updatedLabel ? `Updated: ${updatedLabel}` : 'Rates updated daily'}
        </span>
      </div>
    </div>
    </>
  );
}
