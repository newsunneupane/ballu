'use client';

import React from 'react';

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-bj-bg-alt text-bj-text-alt px-6 py-16 md:px-12 lg:px-20">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="border-b border-bj-border pb-8">
          <div className="text-sm tracking-[0.4em] uppercase text-bj-text-muted">Stories</div>
          <h1 className="mt-4 text-5xl font-serif text-bj-text-heading">Stories from the Atelier</h1>
          <p className="mt-5 text-base leading-8 text-bj-text-description">Notes on craft, material, design, and the people behind each piece.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <article className="rounded-3xl bg-bj-bg-secondary border border-bj-border p-8">
            <h2 className="text-2xl font-semibold text-bj-text-heading">Hand-finished gold</h2>
            <p className="mt-4 text-sm leading-7 text-bj-text-muted">Explore the techniques we use to give every ornament a warm finish and quiet movement.</p>
          </article>
          <article className="rounded-3xl bg-bj-bg-secondary border border-bj-border p-8">
            <h2 className="text-2xl font-semibold text-bj-text-heading">Design for today</h2>
            <p className="mt-4 text-sm leading-7 text-bj-text-muted">How traditional jewellery ideas are adapted for modern wear and thoughtful gifting.</p>
          </article>
        </div>
      </div>
    </div>
  );
}