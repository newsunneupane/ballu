'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Cormorant_Garamond } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-serif-editorial',
});

export default function GoldTicker() {
  const { data: rates = [] } = useQuery({
    queryKey: ['rates-current'],
    queryFn: async () => {
      const res = await fetch('/api/rates/current');
      if (!res.ok) return [];
      const data = await res.json();
      return data?.rates || [];
    },
  });

  const { data: settings } = useQuery({
    queryKey: ['store-settings'],
    queryFn: async () => {
      const res = await fetch('/api/store-settings');
      if (!res.ok) return null;
      return res.json();
    },
  });

  const tickerItems: string[] = settings?.tickerItems || [];
  const phone: string = settings?.phoneNumbers?.[0] || '+977 9842 000 000';

  const rateItems = (rates as { name: string; ratePerGramNrs: number }[]).map(
    (r) => `${r.name.toUpperCase()} ₨ ${r.ratePerGramNrs.toLocaleString('en-IN')}/G`
  );

  const parts = ['TODAY', ...rateItems, ...tickerItems.filter(Boolean), `WHATSAPP ${phone}`];
  const text = parts.join(' · ');

  const content = (
    <span className="inline-flex items-center shrink-0">
      <span>{text}</span>
      <span className="inline-block w-32" />
    </span>
  );

  return (
    <>
      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker { animation: tickerScroll 40s linear infinite; will-change: transform; backface-visibility: hidden; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className={`${cormorant.className} bg-black text-[#dbb86b] border-b border-[#2b2415]/30`}>
      <div className="w-full mx-auto h-8 md:h-6 flex items-center text-[11px] tracking-[4px] uppercase [font-variant-numeric:lining-nums] overflow-hidden">
        <div className="flex w-full whitespace-nowrap overflow-hidden relative">
          <div className="animate-ticker inline-flex shrink-0">
            {content}{content}
          </div>
        </div>
</div>
      </div>
    </>
  );
}
