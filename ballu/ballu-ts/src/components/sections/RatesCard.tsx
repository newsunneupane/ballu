'use client';

import React from 'react';

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
      </div>

      <div className={compact ? 'md:flex-1 md:min-h-0 md:overflow-y-auto md:pr-1' : ''}>
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
        <span className="rt-updated text-[11px] tracking-[0.04em] text-bj-text-muted">
          {updatedLabel ? `Updated: ${updatedLabel}` : 'Rates updated daily'}
        </span>
      </div>
    </div>
    </>
  );
}
