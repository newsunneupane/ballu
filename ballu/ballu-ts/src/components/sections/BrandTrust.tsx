'use client';

import React from 'react';
import { Cormorant_Garamond } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
});

export default function BrandTrust() {
  return (
    <div className="brand-section bg-bj-bg-secondary text-bj-text-heading w-full flex flex-col justify-between relative overflow-hidden font-sans border-t border-white/5">
      <style>{`
        [data-theme="light"] .brand-section { border-color: rgba(0,0,0,0.08) !important; }
        [data-theme="light"] .brand-orbit { opacity: 0.6; }
        [data-theme="dark"] .brand-orbit { opacity: 0.5 !important; }
        [data-theme="light"] .brand-orbit .bo-black { stroke: #000000 !important; }
        [data-theme="light"] .brand-orbit .bo-darkgold { stroke: #cc0000 !important; }
        [data-theme="light"] .brand-orbit .brand-orbit-circle { border-color: #cc0000 !important; }
      `}</style>
      <div className="max-w-7xl w-full  mx-auto px-6 md:px-12 lg:px-16 pt-6 pb-40 flex flex-col items-center text-center relative overflow-hidden">

        <p className={`${cormorant.className} italic text-[clamp(1.5rem,4vw,2.5rem)] font-light tracking-wide max-w-4xl text-bj-text-body leading-relaxed mb-4 relative z-10`}>
          30+ Years of Trust. Jewellery for Generations.
        </p>

        <span className="text-[10px] tracking-[0.4em]  text-bj-gold uppercase opacity-70 relative z-10">
          Authentic Gold Jewellery . Transparent Pricing . Trusted Service
        </span>

        <OrbitalDecoration />
      </div>
    </div>
  );
}

function OrbitalDecoration() {
  return (
        <div className="brand-orbit absolute left-1/2 -translate-x-1/2 translate-y-[270px] md:left-auto md:right-[15%] md:translate-x-0 bottom-0 w-[min(420px,90vw)] h-[min(420px,90vw)] pointer-events-none opacity-30 select-none z-0">
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
