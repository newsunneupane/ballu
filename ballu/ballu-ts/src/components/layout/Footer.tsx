'use client';

import React from 'react';
import { siteConfig } from '@/data/site';

export default function Footer() {
  return (
    <div className="w-full bg-[#0a0806] border-t border-white/5">
      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 lg:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] tracking-[0.3em] uppercase text-white/40">
        <div>© 2026 {siteConfig.name.toUpperCase()} {siteConfig.suffix} · {siteConfig.address.split(' · ')[1]}</div>
        <div className="hidden lg:flex items-center gap-2 text-[#dbb86b]/60">
          HALLMARKED · BIS · NRB REGISTERED
        </div>
        <div className="flex items-center gap-6">
          <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#dbb86b] transition-colors duration-200">Instagram</a>
          <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-[#dbb86b] transition-colors duration-200">Facebook</a>
          <a href={siteConfig.social.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-[#dbb86b] transition-colors duration-200">Whatsapp</a>
        </div>
      </div>
    </div>
  );
}
