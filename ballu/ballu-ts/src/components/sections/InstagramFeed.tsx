'use client';

import Script from 'next/script';
import Link from 'next/link';
import { useEffect } from 'react';
import { siteConfig } from '@/data/site';

// Elfsight Instagram Feed widget ID (from the Elfsight dashboard embed code).
const INSTAGRAM_WIDGET_ID = 'bef8509b-6205-42d1-824b-e376d0d35c33';

export default function InstagramFeed() {
  useEffect(() => {
    let tries = 0;
    const interval = setInterval(() => {
      const platform = (window as unknown as { ElfSightPlatform?: { init?: () => void } }).ElfSightPlatform;
      if (platform && typeof platform.init === 'function') {
        try {
          platform.init();
        } catch {
          // already initialized
        }
        clearInterval(interval);
      }
      if (++tries > 20) clearInterval(interval);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-16 lg:px-15 pt-10 lg:pt-14">
      

      <Script
        src="https://elfsightcdn.com/platform.js"
        strategy="afterInteractive"
      />

      <div className={`elfsight-app-${INSTAGRAM_WIDGET_ID}`} data-elfsight-app-lazy="" />
    </section>
  );
}
