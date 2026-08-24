import React from 'react'
import HeroSection from '@/components/sections/HeroSection'
import CollectionsRow from '@/components/sections/CollectionsRow'
import RecommendedRow from '@/components/sections/RecommendedRow'
import BrandTrust from '@/components/sections/BrandTrust'
import OnboardingWizard from '@/components/sections/OnboardingWizard'
import { getGroupRateData } from '@/lib/server/catalog-data'

const Home = async () => {
  const groupRate = await getGroupRateData()
  return (
    <>
      <OnboardingWizard />
      <HeroSection />
      <BrandTrust groupRates={groupRate} />
      <CollectionsRow />
      <RecommendedRow />
    </>
  )
}

export default Home