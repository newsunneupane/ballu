'use client';

import React, { useState, useEffect } from 'react';
import { Cormorant_Garamond } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-serif-editorial',
});

export default function GoldTicker() {
  const [rates, setRates] = useState<{ name: string; ratePerGramNrs: number }[]>([]);
  const [tickerItems, setTickerItems] = useState<string[]>([]);
  const [phone, setPhone] = useState('+977 9842 000 000');

  useEffect(() => {
    fetch('/api/rates/current')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.rates) setRates(data.rates);
      })
      .catch(() => {});
    fetch('/api/store-settings')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setTickerItems(data.tickerItems || []);
          if (data.phoneNumbers?.length) setPhone(data.phoneNumbers[0]);
        }
      })
      .catch(() => {});
  }, []);

  const rateItems = rates.map((r) => `${r.name.toUpperCase()} ₨ ${r.ratePerGramNrs.toLocaleString('en-IN')}/G`);

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