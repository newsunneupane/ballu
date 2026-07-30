'use client';

import React from 'react';
import { Cormorant_Garamond } from 'next/font/google';
import { brandFeatures } from '@/data/site';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
});

export default function BrandTrust() {
  return (
    <div className="brand-section bg-bj-bg-secondary text-bj-text-heading w-full min-h-[60vh] flex flex-col justify-between relative overflow-hidden font-sans border-t border-white/5">
      <style>{`
        [data-theme="light"] .brand-section { border-color: rgba(0,0,0,0.08) !important; }
        [data-theme="light"] .brand-grid, [data-theme="light"] .brand-grid > div, [data-theme="light"] .brand-grid > div > div { border-color: #c49a45 !important; }
        [data-theme="light"] .brand-grid h3 { color: #000000 !important; }
        [data-theme="light"] .brand-grid p { color: #000000 !important; opacity: 0.7 !important; }
        [data-theme="light"] .brand-orbit { opacity: 0.6; }
        [data-theme="light"] .brand-orbit .bo-black { stroke: rgba(0,0,0,0.5) !important; }
        [data-theme="light"] .brand-orbit .bo-darkgold { stroke: #996515 !important; }
        [data-theme="light"] .brand-orbit .brand-orbit-circle { border-color: #996515 !important; }
      `}</style>
      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 lg:px-16 pt-24 pb-20 flex flex-col items-center text-center relative overflow-hidden">
        <div className="text-bj-gold tracking-widest mb-6 opacity-80 relative z-10">☆</div>

        <p className={`${cormorant.className} italic text-[clamp(1.5rem,4vw,2.5rem)] font-light tracking-wide max-w-4xl text-bj-text-body leading-relaxed mb-4 relative z-10`}>
          &ldquo;Every piece, named for the bench that made it.&rdquo;
        </p>

        <span className="text-[10px] tracking-[0.4em] text-bj-gold uppercase opacity-70 relative z-10">
          — Ballu Suvedi, Master Karigar
        </span>

        <OrbitalDecoration />
      </div>

      <FeatureGrid />
    </div>
  );
}

function OrbitalDecoration() {
  return (
    <div className="brand-orbit absolute right-[5%] md:right-[15%] bottom-0 w-[420px] h-[420px] translate-y-[270px] pointer-events-none opacity-[0.14] select-none z-0">
      <div className="absolute inset-0 w-full h-full flex items-center justify-center animate-[spin_45s_linear_infinite]">
        <div className="absolute inset-0 w-full h-full">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle className="bo-black" cx="50" cy="50" r="49" fill="none" stroke="#dbb86b" strokeWidth="0.2" strokeDasharray="1 2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="absolute w-[82%] h-[82%]">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle className="bo-darkgold opacity-70" cx="50" cy="50" r="48" fill="none" stroke="#dbb86b" strokeWidth="0.5" />
            <circle className="bo-darkgold" cx="50" cy="50" r="48" fill="none" stroke="#dbb86b" strokeWidth="1.8" strokeDasharray="0.1 24" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-0 w-full h-full flex items-center justify-center animate-[spin_45s_linear_infinite_reverse]">
        <div className="brand-orbit-circle w-[64%] h-[64%] rounded-full border border-white/70" />
        <div className="absolute w-[42%] h-[42%]">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle className="bo-black" cx="50" cy="50" r="48" fill="none" stroke="#dbb86b" strokeWidth="0.5" strokeDasharray="1.5 3.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function FeatureGrid() {
  return (
    <div className="brand-grid w-full border-t border-white/10 border-b border-white/5 relative z-10 bg-bj-bg-secondary">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {brandFeatures.map((item, idx) => (
          <div
            key={idx}
            className={`
              flex flex-col items-center justify-center text-center p-12 md:p-16 min-h-[220px]
              border-b border-white/10 sm:border-b-0
              ${idx !== 3 ? 'lg:border-r lg:border-white/10' : ''}
              ${idx % 2 === 0 ? 'sm:border-r sm:border-white/10' : ''}
              hover:bg-white/[0.01] transition-colors duration-300 group
            `}
          >
            <h3 className={`${cormorant.className} italic text-3xl md:text-4xl font-light text-bj-gold mb-3 group-hover:translate-y-[-2px] transition-transform duration-300`}>
              {item.title}
            </h3>
            <p className="text-[10px] tracking-[0.25em] text-bj-text-body opacity-60 uppercase font-sans">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
