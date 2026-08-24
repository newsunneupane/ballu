import React from 'react';
import { Cormorant_Garamond, Cormorant_SC } from 'next/font/google';
import { getOccasionsData } from '@/lib/server/catalog-data';
import OccasionsBento from '@/components/sections/OccasionsBento';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-serif-editorial',
});

const cormorantSC = Cormorant_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-serif-title',
});

export const dynamic = 'force-dynamic';

export default async function OccasionsPage() {
  const allOccasions = await getOccasionsData();
  const occasions = (allOccasions as any[])
    .slice(0, 6)
    .map((o) => ({
      _id: o._id,
      name: o.name,
      image: o.image,
    }));

  return (
    <div
      className={`${cormorant.variable} ${cormorantSC.variable} min-h-screen bg-bj-bg-secondary text-bj-text-heading px-6 md:px-12 lg:px-16 py-16 md:py-24`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-14">
          <p className="text-[11px] tracking-[0.4em] uppercase text-bj-gold/80">
            Moments
          </p>
          <h1 className="mt-3 font-serif-title text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.1] text-bj-text-heading">
            Occasions
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-bj-text-muted">
            Pieces suited to the moments that matter — explore the collection by
            the occasion you are dressing for.
          </p>
        </div>

        <OccasionsBento occasions={occasions} />
      </div>
    </div>
  );
}
