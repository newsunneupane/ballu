'use client';

import React from 'react';

export default function BridalPage() {
  return (
    <div className="min-h-screen bg-[#090705] text-[#efe6d5] px-6 py-16 md:px-12 lg:px-20">
      <div className="max-w-5xl mx-auto">
        <div className="border-b border-[#352f22] pb-8">
          <div className="text-sm tracking-[0.4em] uppercase text-[#a78f63]">Bridal</div>
          <h1 className="mt-4 text-5xl font-serif text-white">Bridal Heritage</h1>
          <p className="mt-5 text-base leading-8 text-[#c4b99d]">Discover our signature bridal sets, drawn from traditional motifs with a modern bench finish.</p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <div className="rounded-[30px] bg-[#11100f] border border-[#322d22] p-8">
            <h2 className="text-xl font-semibold text-[#f5e7c4]">The collection</h2>
            <p className="mt-4 text-sm leading-7 text-[#b8ad92]">Carefully curated necklaces, earrings, bangles and rings for ceremonies and festive celebrations.</p>
          </div>
          <div className="rounded-[30px] bg-[#11100f] border border-[#322d22] p-8">
            <h2 className="text-xl font-semibold text-[#f5e7c4]">Reserve a viewing</h2>
            <p className="mt-4 text-sm leading-7 text-[#b8ad92]">Book a private appointment to try pieces in our showroom or ask about custom set variations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
