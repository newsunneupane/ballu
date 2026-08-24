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
    <section className="mt-24 lg:mt-32">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-bj-text-muted">Social</p>
          <h2 className="mt-2 font-serif-editorial text-2xl font-light text-bj-text-heading md:text-3xl">
            From our Instagram
          </h2>
        </div>
        {siteConfig.social.instagram && siteConfig.social.instagram !== '#' && (
          <Link
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 whitespace-nowrap text-[12px] tracking-[0.2em] uppercase text-bj-gold-richer transition-colors hover:text-bj-gold-rich"
          >
            Follow us
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </Link>
        )}
      </div>

      <Script
        src="https://elfsightcdn.com/platform.js"
        strategy="afterInteractive"
      />

      <div className={`elfsight-app-${INSTAGRAM_WIDGET_ID}`} data-elfsight-app-lazy="" />
    </section>
  );
}
