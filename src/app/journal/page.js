'use client';

import React from 'react';

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-[#0b0b09] text-[#e8e1d6] px-6 py-16 md:px-12 lg:px-20">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="border-b border-[#2f2c22] pb-8">
          <div className="text-sm tracking-[0.4em] uppercase text-[#ac9b78]">Journal</div>
          <h1 className="mt-4 text-5xl font-serif text-white">Stories from the Atelier</h1>
          <p className="mt-5 text-base leading-8 text-[#c8bea7]">Notes on craft, material, design, and the people behind each piece.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <article className="rounded-3xl bg-[#14130f] border border-[#333026] p-8">
            <h2 className="text-2xl font-semibold text-[#f4e8d1]">Hand-finished gold</h2>
            <p className="mt-4 text-sm leading-7 text-[#b9af96]">Explore the techniques we use to give every ornament a warm finish and quiet movement.</p>
          </article>
          <article className="rounded-3xl bg-[#14130f] border border-[#333026] p-8">
            <h2 className="text-2xl font-semibold text-[#f4e8d1]">Design for today</h2>
            <p className="mt-4 text-sm leading-7 text-[#b9af96]">How traditional jewellery ideas are adapted for modern wear and thoughtful gifting.</p>
          </article>
        </div>
      </div>
    </div>
  );
}
