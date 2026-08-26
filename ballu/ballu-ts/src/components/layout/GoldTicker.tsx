'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Cormorant_Garamond } from 'next/font/google';
import { useCurrency } from '@/hooks/useCurrency';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-serif-editorial',
});

export default function GoldTicker() {
  const { format } = useCurrency();
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
    (r) => `${r.name.toUpperCase()} ${format(r.ratePerGramNrs)}/G`
  );

  const parts = ['TODAY', ...rateItems, ...tickerItems.filter(Boolean), `WHATSAPP ${phone}`];
  const text = parts.join(' · ');

  const oneCopy = (
    <span className="inline-flex items-center shrink-0">
      <span>{text}</span>
      <span className="inline-block w-32" />
    </span>
  );

  const [repeats, setRepeats] = useState(2);
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const measure = () => {
      const el = measureRef.current;
      if (!el) return;
      const oneWidth = el.getBoundingClientRect().width;
      if (oneWidth <= 0) return;
      const needed = Math.max(2, Math.ceil(window.innerWidth / oneWidth) + 1);
      setRepeats((prev) => (prev === needed ? prev : needed));
    };
    measure();
    window.addEventListener('resize', measure);
    (document as any).fonts?.ready?.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [text]);

  const group = (keyPrefix: string, ariaHidden = false) => (
    <div className="inline-flex shrink-0" aria-hidden={ariaHidden}>
      {Array.from({ length: repeats }, (_, i) => (
        <span key={`${keyPrefix}-${i}`}>{oneCopy}</span>
      ))}
    </div>
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

      <span
        ref={measureRef}
        aria-hidden
        className={`${cormorant.className} pointer-events-none invisible absolute -z-10 whitespace-nowrap text-[11px] tracking-[4px] uppercase [font-variant-numeric:lining-nums]`}
      >
        {oneCopy}
      </span>

      <div className={`${cormorant.className} bg-black text-[#dbb86b] border-b border-[#2b2415]/30`}>
      <div className="w-full mx-auto h-8 md:h-6 flex items-center text-[11px] tracking-[4px] uppercase [font-variant-numeric:lining-nums] overflow-hidden">
        <div className="flex w-full whitespace-nowrap overflow-hidden relative">
          <div className="animate-ticker inline-flex shrink-0">
            {group('a')}
            {group('b', true)}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
