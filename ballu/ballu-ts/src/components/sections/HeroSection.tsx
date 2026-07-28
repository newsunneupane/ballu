'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Cormorant_Garamond, Cormorant_SC, Noto_Serif_Devanagari } from 'next/font/google';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ArrowRight, StarIcon } from '@/components/shared/Icons';
import { AmbientParticles, GradientOrbit, GradientOverlay, HeroAnimations } from '@/components/shared/AmbientBackground';
import { SITE } from '@/lib/constants';

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

const notoDevanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  weight: ['300', '400'],
  variable: '--font-nepali-serif',
});

export default function HeroSection() {
  const router = useRouter();

  return (
    <div
      className={`${cormorant.variable} ${cormorantSC.variable} ${notoDevanagari.variable} min-h-screen w-full text-cream-luxury p-6 md:p-10 flex flex-col justify-between font-serif-editorial relative overflow-x-hidden`}
    >
      <HeroAnimations />
      <GradientOrbit />
      <GradientOverlay />
      <AmbientParticles />

      <div className="text-[11px] tracking-[0.4em] text-[#dbb86b] text-thin uppercase opacity-80 font-sans fade-in-up fade-in-up-1 z-10">
        <span className="inline-block animate-[float_4s_ease-in-out_infinite]">
          <StarIcon size={16} fill="#dbb86b" />
        </span>{' '}
        EST. {SITE.est} · {SITE.location}
      </div>

      <div className="grow flex items-start z-10 pt-6">
        <div className="flex flex-col max-w-4xl lg:pr-380px w-full">
          <h1 className="text-[80px] font-light leading-[0.8] text-cream-luxury tracking-tight font-serif-editorial">
            <span className="block fade-in-up" style={{ animationDelay: '0ms' }}>Heirlooms,</span>
            <span className="block fade-in-up" style={{ animationDelay: '200ms' }}>made for</span>
            <span className="block fade-in-up" style={{ animationDelay: '400ms' }}>a quieter wear.</span>
          </h1>

          <p className="italic my-6 font-nepali-serif text-[16px] tracking-widest font-light text-[#e2d5c3] opacity-85 fade-in-up fade-in-up-5">
            तीन पुस्ताको कारीगरी — एउटै बेन्चबाट
          </p>

          <p className="text-xs mb-2 md:text-[13px] font-sans font-light leading-relaxed max-w-md text-[#c4b9a6] tracking-wide fade-in-up fade-in-up-6">
            {SITE.description}
          </p>

          <div className="relative flex flex-row flex-wrap items-start justify-start gap-6 fade-in-up fade-in-up-7 w-full">
            <div className="flex flex-row flex-wrap items-start gap-4">
              <Button
                variant="magnetic"
                size="lg"
                magnetic
                icon={<ArrowRight />}
                onClick={() => router.push('/catalogue')}
              >
                Enter the Atelier
              </Button>

              <Button
                variant="outline"
                size="lg"
                icon={<ArrowRight />}
                onClick={() => router.push('/bridal')}
              >
                Bridal Lookbook
              </Button>
            </div>

            <div className="hidden md:flex flex-col items-center space-y-2 font-sans opacity-50 pt-1 z-10 ml-12">
              <span className="text-[9px] tracking-[0.4em] uppercase text-cream-luxury">SCROLL</span>
              <div className="w-[1px] h-7 bg-cream-luxury/60 animate-[bounce-y_3s_ease-in-out_infinite]" />
            </div>
          </div>

          <div className="lg:hidden mt-8 w-full flex justify-center">
            <div className="scale-[0.75] origin-top">
              <FeaturedCard />
            </div>
          </div>
        </div>

        <div className="absolute right-8 md:right-20 bottom-24 z-10 hidden lg:block">
          <FeaturedCard />
        </div>
      </div>
    </div>
  );
}

function FeaturedCard() {
  return (
    <div className="group w-[240px] sm:w-[280px] lg:w-[7.5cm] slide-in-left slide-in-left-delay overflow-hidden transform transition duration-800 ease-out hover:-translate-y-2.5">
      <Card hover={false} className="h-full bg-[#241f1a]/90 border border-white/5 p-3 shadow-2xl backdrop-blur-md">
        <div className="flex text-[#dbb86b] justify-between items-center text-[10px] tracking-[0.2em] uppercase font-thin opacity-90 font-sans mb-3">
          <span className="pl-2">PIECE OF THE WEEK</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#dbb86b] animate-infinite-zoom" />
        </div>
        <div className="w-[calc(100%-1rem)] aspect-[4/3] bg-linear-to-tr from-[#3a3127] to-[#5a4b3b] opacity-80 mb-3 mx-2 rounded-sm group-hover:scale-110 transition-transform duration-500" />
        <div className="space-y-1">
          <h3 className="text-[20px] mx-2 font-normal text-white">Chandra Haar</h3>
          <p className="text-[10px] mx-2 tracking-wider font-sans opacity-50">22K . 12 G . Rs. 1,78,000</p>
          <div className="pt-1 mx-2">
            <span className="inline-flex items-center gap-1 text-[12px] text-[#dbb86b] group/view cursor-pointer">
              VIEW PIECE
              <span className="ml-2 inline-block transition-transform duration-300 group-hover/view:translate-x-1.5">→</span>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
