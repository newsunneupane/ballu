'use client';

import React from 'react';
import Link from 'next/link';

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
          src="/darkmode.jpg"
          alt="Personalize your jewellery"
          className={`absolute inset-0 h-full w-full object-cover [[data-theme=light]_&]:hidden ${imgClassName}`}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/lightmode.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 hidden h-full w-full object-cover [[data-theme=light]_&]:block"
        />
      </div>
    </Link>
  );
}
