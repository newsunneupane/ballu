import React from 'react'
import Link from 'next/link'
import HeroSection from '@/components/sections/HeroSection'
import CollectionsRow from '@/components/sections/CollectionsRow'
import RecommendedRow from '@/components/sections/RecommendedRow'
import BrandTrust from '@/components/sections/BrandTrust'
import OnboardingWizard from '@/components/sections/OnboardingWizard'
import OccasionsBento from '@/components/sections/OccasionsBento'
import { getGroupRateData, getOccasionsData } from '@/lib/server/catalog-data'

const Home = async () => {
  const groupRate = await getGroupRateData()
  const allOccasions = await getOccasionsData()
  const occasions = (allOccasions as any[])
    .slice(0, 6)
    .map((o) => ({ _id: o._id, name: o.name, image: o.image }))

  return (
    <>
      <OnboardingWizard />
      <HeroSection />
      <BrandTrust groupRates={groupRate} />
      <CollectionsRow />
      <section className="bg-bj-bg-secondary text-bj-text-heading px-6 md:px-12 lg:px-16 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="font-serif-title text-[clamp(1.6rem,4vw,2.6rem)] font-light text-bj-text-heading">Shop by Occasions</h2>
          </div>
          <OccasionsBento occasions={occasions} />
          <div className="mt-8 flex justify-end">
            <Link
              href="/occasions"
              className="group inline-flex items-center gap-2 text-[12px] tracking-[0.25em] uppercase text-bj-gold transition-colors hover:text-bj-gold-rich"
            >
              <span>All Occasions</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                &rarr;
              </span>
            </Link>
          </div>
        </div>
      </section>
      <RecommendedRow />
    </>
  )
}

export default Home