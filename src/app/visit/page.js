'use client';

import React from 'react';

export default function VisitPage() {
  return (
    <div className="min-h-screen bg-[#0c0a08] text-[#e9e2d5] px-6 py-16 md:px-12 lg:px-20">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="border-b border-[#2c2a20] pb-8">
          <div className="text-sm tracking-[0.4em] uppercase text-[#a9936f]">Visit</div>
          <h1 className="mt-4 text-5xl font-serif text-white">Visit the Atelier</h1>
          <p className="mt-5 text-base leading-8 text-[#c5b99d]">Private viewings, appointments, and a small storefront in Kakarvitta.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl bg-[#13110d] border border-[#322e24] p-8">
            <h2 className="text-xl font-semibold text-[#f0e6d0]">Book a viewing</h2>
            <p className="mt-4 text-sm leading-7 text-[#b9ae94]">Message us to arrange a time for you or your family to try pieces in person.</p>
          </div>
          <div className="rounded-3xl bg-[#13110d] border border-[#322e24] p-8">
            <h2 className="text-xl font-semibold text-[#f0e6d0]">Atelier address</h2>
            <p className="mt-4 text-sm leading-7 text-[#b9ae94]">Kakarvitta, eastern Nepal · Hallmarked gold and hand-finished silver.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
