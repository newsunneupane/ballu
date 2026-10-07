'use client';

import React from 'react';
import Link from 'next/link';
import { Cormorant_Garamond } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
});

export default function PersonalizeCard({ className = '', imgClassName = '' }: { className?: string; imgClassName?: string }) {
  return (
    <Link
      href="/personalize"
      className={`group/pz relative block overflow-hidden rounded-xl md:rounded-2xl border border-white/10 hover:border-bj-gold/40 transition-colors duration-500 h-full w-full min-h-full ${className}`}
      aria-label="Personalize your jewellery"
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/personalize.jpg"
          alt="Personalize your jewellery"
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/pz:scale-[1.03] ${imgClassName}`}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/0 to-black/0 p-5 md:p-6">
        <span className={`${cormorant.className} italic text-2xl md:text-3xl font-light text-white`}>
          Personalize
        </span>
      </div>
    </Link>
  );
}
