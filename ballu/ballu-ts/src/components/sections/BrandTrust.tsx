'use client';

import React from 'react';
import Link from 'next/link';
import { Cormorant_Garamond } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
});

type GroupRate = {
  groupId: string;
  name: string;
  materialName: string | null;
  rateNpr: number | null;
  lastItemChangedAt: string | null;
  lastItemChangedLabel: string | null;
};

export default function BrandTrust({ groupRates }: { groupRates: GroupRate[] | null }) {
  return (
    <div className="brand-section bg-bj-bg-secondary text-bj-text-heading w-full min-h-[60vh] flex flex-col justify-between relative overflow-hidden font-sans border-t border-white/5">
      <style>{`
        [data-theme="light"] .brand-section { border-color: rgba(0,0,0,0.08) !important; }
        [data-theme="light"] .brand-grid { border-color: #cc0000 !important; }
        [data-theme="light"] .brand-grid h3,
        [data-theme="light"] .brand-grid h4 { color: #000000 !important; }
        [data-theme="light"] .brand-grid p { color: #000000 !important; opacity: 0.7 !important; }
        [data-theme="light"] .brand-orbit { opacity: 0.6; }
        [data-theme="dark"] .brand-orbit { opacity: 0.5 !important; }
        [data-theme="light"] .brand-orbit .bo-black { stroke: #000000 !important; }
        [data-theme="light"] .brand-orbit .bo-darkgold { stroke: #cc0000 !important; }
        [data-theme="light"] .brand-orbit .brand-orbit-circle { border-color: #cc0000 !important; }
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
      `}</style>
      <div className="max-w-7xl w-full  mx-auto px-6 md:px-12 lg:px-16 pt-10 pb-40 flex flex-col items-center text-center relative overflow-hidden">
       

        <p className={`${cormorant.className} italic text-[clamp(1.5rem,4vw,2.5rem)] font-light tracking-wide max-w-4xl text-bj-text-body leading-relaxed mb-4 relative z-10`}>
          30+ Years of Trust. Jewellery for Generations.
        </p>

        <span className="text-[10px] tracking-[0.4em]  text-bj-gold uppercase opacity-70 relative z-10">
          Authentic Gold Jewellery . Transparent Pricing . Trusted Service
        </span>

        <OrbitalDecoration />
      </div>

      <FeatureGrid groupRates={groupRates} />
    </div>
  );
}

function OrbitalDecoration() {
  return (
        <div className="brand-orbit absolute left-1/2 -translate-x-1/2 translate-y-[270px] md:left-auto md:right-[15%] md:translate-x-0 bottom-0 w-[420px] h-[420px] pointer-events-none opacity-30 select-none z-0">
      <div className="absolute inset-0 w-full h-full flex items-center justify-center animate-[spin_45s_linear_infinite]">
        <div className="absolute inset-0 w-full h-full">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle className="bo-black" cx="50" cy="50" r="49" fill="none" stroke="#e9cf8f" strokeWidth="0.2" strokeDasharray="1 2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="absolute w-[82%] h-[82%]">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle className="bo-darkgold opacity-70" cx="50" cy="50" r="48" fill="none" stroke="#e9cf8f" strokeWidth="0.5" />
            <circle className="bo-darkgold" cx="50" cy="50" r="48" fill="none" stroke="#e9cf8f" strokeWidth="1.8" strokeDasharray="0.1 24" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-0 w-full h-full flex items-center justify-center animate-[spin_45s_linear_infinite_reverse]">
        <div className="brand-orbit-circle w-[64%] h-[64%] rounded-full border border-white/70" />
        <div className="absolute w-[42%] h-[42%]">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle className="bo-black" cx="50" cy="50" r="48" fill="none" stroke="#e9cf8f" strokeWidth="0.5" strokeDasharray="1.5 3.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

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

function FeatureGrid({ groupRates }: { groupRates: GroupRate[] | null }) {
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

  return (
    <div className="brand-grid w-full   relative z-10 bg-bj-bg-secondary">
      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 lg:px-16 pb-10 md:pb-14 grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10 lg:gap-16 items-center">
        <div className="order-1">
          <div className="brand-rates-card rounded-2xl border border-bj-border bg-bj-bg-elevated p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-bj-gold/60" />
              <span className="text-[10px] tracking-[0.4em] text-bj-gold uppercase opacity-80">
                Today&apos;s Rates
              </span>
            </div>

            {grouped.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7">
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
                          <span className="rt-name text-[14px] tracking-[0.01em] text-bj-text-heading font-sans">
                            {g.name}
                          </span>
                          {g.rateNpr != null ? (
                            <span className="rt-value text-[14px] font-medium font-sans text-[#9A7B38] whitespace-nowrap">
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

            <div className="mt-6 pt-4 border-t border-white/5">
              <span className="rt-updated text-[11px] tracking-[0.04em] text-bj-text-muted">
                {updatedLabel ? `Updated: ${updatedLabel}` : 'Rates updated daily'}
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/personalize"
          className="group/pz order-2 relative block overflow-hidden rounded-2xl border border-white/10 hover:border-bj-gold/40 transition-colors duration-500"
          aria-label="Personalize your jewellery"
        >
          <div className="w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/personalize.jpg"
              alt="Personalize your jewellery"
              className="block w-full h-auto object-contain transition-transform duration-700 group-hover/pz:scale-[1.02]"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/0 to-black/0 p-6">
            <span className={`${cormorant.className} italic text-2xl md:text-3xl font-light text-white`}>
              Personalize
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
