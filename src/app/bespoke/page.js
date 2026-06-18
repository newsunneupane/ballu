'use client';

import React from 'react';

export default function BespokePage() {
  return (
    <div className="min-h-screen bg-[#0f0d0b] text-[#ede2c4] px-6 py-16 md:px-12 lg:px-20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b border-[#3b3224] pb-8">
          <div className="text-sm tracking-[0.4em] uppercase text-[#b39f74]">Bespoke</div>
          <h1 className="mt-4 text-5xl font-serif text-white">Made-to-order jewellery, custom-designed for you.</h1>
          <p className="mt-5 text-base leading-8 text-[#b9ad98]">Choose a style, share the occasion, and we will craft a personal design from first sketch to finished piece.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-[#16130f] border border-[#2f2a22] p-8">
            <h2 className="text-xl font-semibold text-[#f1e5d1]">How it works</h2>
            <ol className="mt-4 space-y-4 text-sm text-[#b9ad98] list-decimal list-inside">
              <li>Begin with a consultation and moodboard.</li>
              <li>Approve a hand-rendered sketch.</li>
              <li>Select materials, finish, and schedule the bench time.</li>
            </ol>
          </div>
          <div className="rounded-3xl bg-[#16130f] border border-[#2f2a22] p-8">
            <h2 className="text-xl font-semibold text-[#f1e5d1]">What we make</h2>
            <p className="mt-4 text-sm leading-7 text-[#b9ad98]">Bridal sets, engagement rings, heirloom redesigns, daily-wear earrings and wedding gifts. Every bespoke piece is hallmarked and finished in our studio.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
