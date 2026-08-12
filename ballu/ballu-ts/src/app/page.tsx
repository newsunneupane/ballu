import React from 'react'
import HeroSection from '@/components/sections/HeroSection'
import CollectionsRow from '@/components/sections/CollectionsRow'
import RecommendedRow from '@/components/sections/RecommendedRow'
import BrandTrust from '@/components/sections/BrandTrust'
import OnboardingWizard from '@/components/sections/OnboardingWizard'

const Home = () => {
  return (
    <>
      <OnboardingWizard />
      <HeroSection />
      <CollectionsRow />
      <RecommendedRow />
      <BrandTrust />
    </>
  )
}

export default Home