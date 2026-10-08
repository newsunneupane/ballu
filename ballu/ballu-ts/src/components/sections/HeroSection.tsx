'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Cormorant_Garamond, Cormorant_SC, Noto_Serif_Devanagari } from 'next/font/google';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ArrowRight, Sparkle, StarIcon } from '@/components/shared/Icons';
import { AmbientParticles, HeroAnimations } from '@/components/shared/AmbientBackground';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { SITE } from '@/lib/constants';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import PersonalizeCard from '@/components/sections/PersonalizeCard';
import RatesCard, { type GroupRate } from '@/components/sections/RatesCard';

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

export default function HeroSection({ groupRates = null }: { groupRates?: GroupRate[] | null }) {
  const { data: settings } = useStoreSettings();
  const banners = settings?.heroBanners?.length ? settings.heroBanners : null;

  if (banners && banners.length > 0) {
    return <HeroSlider banners={banners} groupRates={groupRates} />;
  }

  return <StaticHero settings={settings} />;
}

function StaticHero({ settings }: { settings?: any }) {
  const router = useRouter();
  const potw = settings?.pieceOfTheWeek?.item ? settings.pieceOfTheWeek : null;

  return (
    <div
      className={`${cormorant.variable} ${cormorantSC.variable} ${notoDevanagari.variable} hero-section min-h-screen w-full text-bj-text-heading px-6 md:px-10 lg:px-16 2xl:px-24 py-6 md:py-10 flex flex-col justify-between font-serif-editorial relative overflow-x-hidden`}
    >
      <HeroAnimations />
      <AmbientParticles />

      <div className="text-[11px] tracking-[0.4em] text-bj-gold-thin text-thin uppercase opacity-80 font-sans fade-in-up fade-in-up-1 z-10">
        <span className="inline-block animate-[float_4s_ease-in-out_infinite]">
          <StarIcon size={16} fill="var(--bj-gold-light)" />
        </span>{' '}
        EST. {SITE.est} · {SITE.location}
      </div>

      <div className="grow flex items-start z-10 pt-6">
        <div className="flex flex-col max-w-4xl lg:pr-[380px] w-full">
          <h1 className="text-[clamp(2.75rem,13vw,5rem)] font-light leading-[0.9] break-words text-bj-text-heading tracking-tight font-serif-editorial">
            <span className="block fade-in-up" style={{ animationDelay: '0ms' }}>Heirlooms,</span>
            <span className="block fade-in-up" style={{ animationDelay: '200ms' }}>made for</span>
            <span className="block fade-in-up" style={{ animationDelay: '400ms' }}>a quieter wear.</span>
          </h1>

          <p className="italic my-6 font-nepali-serif text-[16px] tracking-widest font-light text-bj-text-body opacity-85 fade-in-up fade-in-up-5">
            तीन पुस्ताको कारीगरी — एउटै बेन्चबाट
          </p>

          <p className="text-xs mb-2 md:text-[13px] font-sans font-light leading-relaxed max-w-md text-bj-text-subtle tracking-wide fade-in-up fade-in-up-6">
            {SITE.description}
          </p>

          <div className="relative flex flex-row flex-wrap items-start justify-start gap-6 fade-in-up fade-in-up-7 w-full">
            <div className="flex flex-row flex-wrap items-start gap-4">
              <Button
                variant="primary"
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
              <span className="text-[9px] tracking-[0.4em] uppercase text-amber-50">SCROLL</span>
              <div className="w-[1px] h-7 bg-amber-50/80 animate-[scroll-down_2s_ease-in-out_infinite]" />
            </div>
          </div>

          <div className="lg:hidden mt-8 w-full flex justify-center">
            <div className="scale-[0.75] origin-top">
              <FeaturedCard potw={potw} />
            </div>
          </div>
        </div>

        <div className="absolute right-8 md:right-20 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
          <FeaturedCard potw={potw} />
        </div>
      </div>
    </div>
  );
}

function HeroSlider({ banners, groupRates = null }: { banners: any[]; groupRates?: GroupRate[] | null }) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [ratesOpen, setRatesOpen] = useState(false);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const active = banners[activeIndex] || banners[0];

  const renderDots = (keyPrefix: string) => (
    <>
      {banners.map((_, i) => (
        <button
          key={`${keyPrefix}-${i}`}
          onClick={() => setActiveIndex(i)}
          aria-label={`Go to slide ${i + 1}`}
          className={`w-2.5 h-2.5 rotate-45 transition-all duration-500 ${
            i === activeIndex ? 'hero-dot-active scale-125' : 'bg-bj-text-muted/50 hover:bg-bj-text-muted/80'
          }`}
        />
      ))}
    </>
  );

  const navigate = (banner: any) => {
    if (banner.type === 'item') {
      router.push(`/catalogue/${banner.refId}`);
      return;
    }
    const params = new URLSearchParams();
    if (banner.type === 'collection') params.set('collection', banner.name || '');
    else if (banner.type === 'material') params.set('material', banner.name || '');
    else if (banner.type === 'group') {
      params.set('material', banner.material?.name?.en || '');
      params.set('group', banner.name || '');
    } else if (banner.type === 'occasion') {
      params.set('occasion', banner.name || '');
    }
    router.push(`/catalogue?${params.toString()}`);
  };

  return (
    <div
      className={`${cormorant.variable} ${cormorantSC.variable} ${notoDevanagari.variable} hero-section min-h-0 md:min-h-[80vh] w-full text-bj-text-heading relative overflow-hidden font-serif-editorial flex flex-col px-6 md:px-10 lg:px-16 2xl:px-24 pb-0`}
    >
      <HeroAnimations />
      <AmbientParticles />

      <div className="relative z-10 flex md:flex-1 flex-col md:flex-row gap-2 md:gap-4 mt-1 md:mt-3 items-stretch">
        {/* Left 65% — hero banner. Mobile: top 50%. */}
        <div className="relative overflow-hidden rounded-xl md:rounded-2xl flex-none shrink-0 md:flex-none md:basis-[65%] md:max-w-[65%] min-h-[38vh] md:min-h-[60vh]">
          {banners.map((banner, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-1000 ${i === activeIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${cloudinaryUrl(banner.image, { width: 1920, aspect: '16:9' })})` }}
              />
            </div>
          ))}

          <div className="absolute bottom-4 right-4 md:hidden z-30">
            <Button variant="primary" size="sm" magnetic className="hero-btn" icon={<ArrowRight />} onClick={() => navigate(active)}>
              {active?.type === 'item' ? 'Shop' : 'Explore'}
            </Button>
          </div>
        </div>

        {/* Desktop-only banner button — pure overlay straddling the banner's right edge. */}
        <div className="hidden md:block absolute bottom-6 right-[calc(35%+1rem)] translate-x-[95%] z-30">
          <Button variant="primary" size="sm" magnetic className="hero-btn" icon={<ArrowRight />} onClick={() => navigate(active)}>
            {active?.type === 'item' ? 'Shop' : 'Explore'}
          </Button>
        </div>

        {/* Mobile-only dots: just below the hero banner, above the personalize card. */}
        <div className="flex md:hidden shrink-0 flex-none items-center justify-center gap-2 pt-1">
          {renderDots('m')}
        </div>

        {/* Mobile collapsible rates — above the personalize button. */}
        <div className="md:hidden w-full shrink-0 flex-none overflow-hidden rounded-2xl border border-[#c9a96e]/35 bg-[#14100a]">
          <button
            onClick={() => setRatesOpen((v) => !v)}
            aria-expanded={ratesOpen}
            aria-label="Toggle today's rates"
            className="flex w-full items-center gap-3 px-5 py-4 text-left"
          >
            <span className="h-px w-8 bg-bj-gold/60" />
            <span className="flex-1 font-sans text-[10px] tracking-[0.4em] uppercase text-[#c9a96e]/80">
              Today&apos;s Rates
            </span>
            <span
              className={`inline-block text-[#e9cf8f] transition-transform duration-300 ${ratesOpen ? 'rotate-180' : ''}`}
            >
              ↓
            </span>
          </button>
          <div
            className={`grid transition-all duration-300 ease-out ${ratesOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="px-3 pb-3">
                <RatesCard groupRates={groupRates} variant="compact" className="w-full h-auto border-white/10 bg-white/[0.03]" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile personalize CTA — modern button below the rates card on small screens. */}
        <button
          onClick={() => router.push('/personalize')}
          aria-label="Personalize your jewellery"
          className="group md:hidden relative w-full shrink-0 flex-none overflow-hidden rounded-2xl border border-[#c9a96e]/35 bg-[#14100a] px-5 py-4 text-left shadow-[0_10px_40px_-12px_rgba(201,169,110,0.45)] transition-all duration-300 active:scale-[0.98]"
        >
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#c9a96e]/[0.12] to-transparent bg-[length:250%_100%] animate-[pz-sheen_3.5s_ease-in-out_infinite]" />
          <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#e9cf8f]/80 to-transparent" />
          <span className="relative flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#e9cf8f] to-[#9a7b38] text-[#0a0806] shadow-md">
              <Sparkle size={16} />
            </span>
            <span className="flex flex-1 flex-col">
              <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-[#c9a96e]/80">Make it yours</span>
              <span className="font-serif-editorial italic text-2xl font-light leading-tight text-[#f3e9d2]">Personalize</span>
            </span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#c9a96e]/40 text-[#e9cf8f] transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight size={14} />
            </span>
          </span>
          <style>{`
            @keyframes pz-sheen {
              0% { background-position: 150% 0; }
              60%, 100% { background-position: -50% 0; }
            }
          `}</style>
        </button>

        {/* Right 35% — Rates card + personalize image card (desktop only). */}
        <div className="hidden md:flex md:flex-none md:basis-[35%] md:max-w-[35%] flex-col gap-3 md:gap-4 md:h-[60vh] md:min-h-[60vh] w-full shrink-0 min-h-0">
          <div className="flex-1 min-h-0 flex">
            <RatesCard groupRates={groupRates} variant="compact" className="w-full h-full overflow-hidden" />
          </div>
          <div className="relative w-full h-[42%] shrink-0 min-h-0">
            <PersonalizeCard className="md:min-h-0" />
          </div>
        </div>
      </div>

      <div className="relative z-20 hidden md:flex items-center justify-center md:justify-start md:w-[65%] gap-2 pt-2">
        {renderDots('d')}
      </div>
    </div>
  );
}

function FeaturedCard({ potw }: { potw: any }) {
  const router = useRouter();
  const item = potw?.item;
  const purity = item?.purity || '';
  const weight = item?.weightGrams ? `${item.weightGrams} G` : '';
  const detailStr = [purity, weight].filter(Boolean).join(' . ');
  const collectionName = potw?.collection?.name?.en || '';
  const materialName = potw?.material?.name?.en || '';

  return (
    <div
      className="group w-[240px] sm:w-[280px] lg:w-[300px] xl:w-[330px] slide-in-left slide-in-left-delay overflow-hidden transform transition duration-800 ease-out hover:-translate-y-2.5 cursor-pointer"
      onClick={() => item?._id && router.push(`/catalogue/${item._id}`)}
    >
      <Card hover={false} className="potw-card h-full bg-bj-bg-card/90 border border-white/5 p-3 shadow-2xl backdrop-blur-md">
        <div className="flex text-bj-gold-rich justify-between items-center text-[10px] tracking-[0.2em] uppercase  opacity-90 font-sans mb-3">
          <span className="pl-2">PIECE OF THE WEEK</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#dbb86b] animate-infinite-zoom" />
        </div>
        {item?.images?.[0] ? (
          <div
            className="w-[calc(100%-1rem)] aspect-[4/3] mb-3 mx-2 rounded-sm overflow-hidden group-hover:scale-110 transition-transform duration-500 bg-cover bg-center"
            style={{ backgroundImage: `url(${cloudinaryUrl(item.images[0], { width: 640, aspect: '4:3' })})` }}
          />
        ) : (
          <div className="w-[calc(100%-1rem)] aspect-[4/3] bg-linear-to-tr from-[#3a3127] to-[#5a4b3b] opacity-80 mb-3 mx-2 rounded-sm group-hover:scale-110 transition-transform duration-500" />
        )}
        <div className="space-y-1">
          <h3 className="text-[20px] mx-2 font-normal text-bj-text-heading">{item?.name?.en || 'Piece of the Week'}</h3>
          <p className="text-[10px] mx-2 tracking-wider font-sans opacity-50">
            {detailStr || [materialName, collectionName].filter(Boolean).join(' · ') || '—'}
          </p>
          <div className="pt-1 mx-2">
            <span className="inline-flex items-center gap-1 text-[12px] tracking-widest font-semibold text-bj-gold-richer group/view cursor-pointer">
              VIEW PIECE
              <span className="ml-2 inline-block transition-transform duration-300 group-hover/view:translate-x-1.5">→</span>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
