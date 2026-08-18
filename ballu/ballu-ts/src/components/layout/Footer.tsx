'use client';

import React from 'react';
import { siteConfig } from '@/data/site';
import { useStoreSettings, whatsappNumber } from '@/hooks/useStoreSettings';
import { whatsappBaseUrl } from '@/lib/utils/whatsapp';

export default function Footer() {
  const { data: settings } = useStoreSettings();
  return (
    <div className="footer-section w-full bg-bj-bg border-t border-bj-border">
      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 lg:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] tracking-[0.3em] uppercase text-bj-text-muted">
        <div>© 2026 {siteConfig.name.toUpperCase()} {siteConfig.suffix} · {siteConfig.address.split(' · ')[1]}</div>
        <div className="footer-gold hidden lg:flex items-center gap-2 text-bj-gold">
          HALLMARKED · BIS · NRB REGISTERED
        </div>
        <div className="flex items-center gap-6">
          <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-bj-gold transition-colors duration-200">Instagram</a>
          <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-bj-gold transition-colors duration-200">Facebook</a>
          <a href={whatsappBaseUrl(whatsappNumber(settings))} target="_blank" rel="noopener noreferrer" className="hover:text-bj-gold transition-colors duration-200">Whatsapp</a>
        </div>
      </div>
    </div>
  );
}
