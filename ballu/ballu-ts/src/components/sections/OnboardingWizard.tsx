'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Cormorant_Garamond, Tenor_Sans } from 'next/font/google';
import { FiArrowRight, FiX } from 'react-icons/fi';
import { hasSeenOnboarding, markOnboardingSeen } from '@/lib/visitTracking';

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });
const tenorSans = Tenor_Sans({ subsets: ['latin'], weight: ['400'] });

interface Option {
  _id: string;
  name: { en: string; np: string };
}

export default function OnboardingWizard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState(0);
  const [material, setMaterial] = useState<Option | null>(null);

  useEffect(() => {
    if (!hasSeenOnboarding()) setMounted(true);
  }, []);

  const { data: materials = [] } = useQuery<Option[]>({
    queryKey: ['onboarding-materials'],
    queryFn: async () => {
      const res = await fetch('/api/materials');
      return res.ok ? res.json() : [];
    },
    enabled: mounted,
  });

  const { data: collections = [] } = useQuery<Option[]>({
    queryKey: ['onboarding-collections'],
    queryFn: async () => {
      const res = await fetch('/api/collections');
      return res.ok ? res.json() : [];
    },
    enabled: mounted && step === 1,
  });

  if (!mounted) return null;

  const close = (material?: Option, collection?: Option) => {
    markOnboardingSeen();
    setVisible(false);
    setTimeout(() => {
      setMounted(false);
      const params = new URLSearchParams();
      if (material) params.set('material', material.name.en);
      if (collection) params.set('collection', collection.name.en);
      const qs = params.toString();
      if (qs) router.push(`/catalogue?${qs}`);
    }, 400);
  };

  const pickMaterial = (m: Option) => {
    setMaterial(m);
    setStep(1);
  };

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center px-6 transition-opacity duration-400 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="absolute inset-0 bg-bj-bg-ticker/95 backdrop-blur-md" />

      <button
        onClick={() => close(material || undefined)}
        aria-label="Skip"
        className={`${tenorSans.className} absolute top-6 right-6 sm:top-10 sm:right-10 z-10 flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-bj-text-muted hover:text-bj-gold-alt transition-colors`}
      >
        Skip <FiX size={14} />
      </button>

      <div key={step} className="relative z-10 w-full max-w-xl fade-in-up text-center">
        <div className={`${tenorSans.className} text-[9px] tracking-[0.4em] uppercase text-bj-gold-alt mb-4`}>
          Step {step + 1} of 2
        </div>

        {step === 0 ? (
          <>
            <h1 className={`${cormorant.className} text-3xl sm:text-5xl font-light text-bj-text-heading mb-10`}>
              What would you like to see?
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {materials.map((m) => (
                <button
                  key={m._id}
                  onClick={() => pickMaterial(m)}
                  className={`${tenorSans.className} px-6 py-3 text-xs tracking-[0.2em] uppercase border border-bj-border rounded-full text-bj-text-alt hover:border-bj-gold-alt hover:text-bj-gold-alt transition-all`}
                >
                  {m.name.en}
                </button>
              ))}
              {materials.length === 0 && (
                <span className={`${tenorSans.className} text-xs text-bj-text-dim`}>Loading…</span>
              )}
            </div>
          </>
        ) : (
          <>
            <h1 className={`${cormorant.className} text-3xl sm:text-5xl font-light text-bj-text-heading mb-10`}>
              For which occasion?
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {collections.map((c) => (
                <button
                  key={c._id}
                  onClick={() => close(material || undefined, c)}
                  className={`${tenorSans.className} px-6 py-3 text-xs tracking-[0.2em] uppercase border border-bj-border rounded-full text-bj-text-alt hover:border-bj-gold-alt hover:text-bj-gold-alt transition-all`}
                >
                  {c.name.en}
                </button>
              ))}
              {collections.length === 0 && (
                <span className={`${tenorSans.className} text-xs text-bj-text-dim`}>Loading…</span>
              )}
            </div>
            <button
              onClick={() => close(material || undefined)}
              className={`${tenorSans.className} inline-flex items-center gap-2 mt-10 text-[10px] tracking-[0.2em] uppercase text-bj-text-muted hover:text-bj-gold-alt transition-colors`}
            >
              Show me everything <FiArrowRight size={12} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
