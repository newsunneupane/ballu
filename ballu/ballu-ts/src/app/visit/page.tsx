"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Cormorant_Garamond, Cormorant_SC, Tenor_Sans } from "next/font/google";
import { FiStar } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { ArrowRight } from "@/components/shared/Icons";
import Footer from "@/components/layout/Footer";

const cormorantSC = Cormorant_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const tenorSans = Tenor_Sans({
  subsets: ["latin"],
  weight: ["400"],
});

interface TimingSlot {
  dayFrom: string;
  dayTo: string;
  timeFrom: string;
  timeTo: string;
}

interface StoreSettings {
  contactEmail: string;
  phoneNumbers: string[];
  timings: TimingSlot[];
}

function formatHour(hour: string): string {
  const h = parseInt(hour, 10);
  if (isNaN(h)) return hour;
  if (h === 0) return '12';
  if (h <= 12) return String(h);
  return String(h - 12);
}

function formatTiming(slot: TimingSlot): string {
  const time = `${formatHour(slot.timeFrom)}–${formatHour(slot.timeTo)}`;
  if (slot.dayFrom === slot.dayTo) {
    return `${slot.dayFrom} ${time}`;
  }
  return `${slot.dayFrom}–${slot.dayTo} ${time}`;
}

export default function AboutContactPage() {
  const { data: settings } = useQuery({
    queryKey: ['store-settings'],
    queryFn: async () => {
      const res = await fetch('/api/store-settings');
      if (!res.ok) return null;
      return res.json() as Promise<StoreSettings>;
    },
  });

  return (
    <>
      <style>{`
        @keyframes bj-pulse { 0%,100% { opacity:.55; transform:scale(1); } 50% { opacity:1; transform:scale(1.7); } }
        .bj-pulse-dot { animation: bj-pulse 2.6s ease-in-out infinite; transform-origin: center; }
      `}</style>
      <div className="bg-[#0a0806] text-[#e5e5e0] antialiased selection:bg-[#cda274]/30">
       
      <section className="min-h-screen flex flex-col relative">
        <div className="flex-grow flex flex-col items-center justify-center px-6 pt-15 pb-20 text-center">
          <div className="text-[#cda274] mb-3 opacity-80">
            <FiStar size={18} strokeWidth={1.5} />
          </div>

          <div className={`${tenorSans.className} text-[10px] tracking-[0.4em] uppercase text-[#cda274] mb-2`}>
            Find Us
          </div>

          <h1 className={`${cormorant.className} text-5xl md:text-[80px] lg:text-[96px] leading-[1.1] text-[#fbf7f0] font-light tracking-tight `}>
            Two doors from <br />
            <span className="italic text-[#cda274] pr-1">the post office.</span>
          </h1>

          <p className="italic font-serif text-[18px] md:text-[22px] text-[#e2d5c3] opacity-80 tracking-wide mt-2">
            मुख्य बजार · काँकडभिट्टा · झापा
          </p>
        </div>

        <div className="w-full border-t border-[#1f1a10] bg-[#0c0907]">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#1f1a10]">
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <h3 className={`${tenorSans.className} text-[9px] tracking-[0.3em] uppercase text-[#6e695f] mb-6`}>
                Hours
              </h3>
              <p className={`${cormorant.className} text-[18px] text-[#ebd3b4] text-center leading-relaxed opacity-90`}>
                {(settings as StoreSettings)?.timings?.length
                  ? (settings as StoreSettings).timings.map((s, i) => <React.Fragment key={i}>{formatTiming(s)}<br /></React.Fragment>)
                  : <>Mon–Sat 10–7<br />Sun 11–5</>}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center py-12 px-6">
              <h3 className={`${tenorSans.className} text-[9px] tracking-[0.3em] uppercase text-[#6e695f] mb-6`}>
                Phone
              </h3>
              <p className={`${cormorant.className} text-[18px] text-[#ebd3b4] text-center leading-relaxed opacity-90 [font-variant-numeric:lining-nums]`}>
                {(settings as StoreSettings)?.phoneNumbers?.length
                  ? (settings as StoreSettings).phoneNumbers.map((p, i) => <React.Fragment key={i}>{p}<br /></React.Fragment>)
                  : <>+977 9842 000 000<br />023-562-118</>}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center py-12 px-6">
              <h3 className={`${tenorSans.className} text-[9px] tracking-[0.3em] uppercase text-[#6e695f] mb-6`}>
                Email
              </h3>
              <p className={`${cormorant.className} text-[18px] text-[#ebd3b4] text-center leading-relaxed opacity-90`}>
                {(settings as StoreSettings)?.contactEmail || 'aalu@ballujewellers.np'}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center py-12 px-6">
              <h3 className={`${tenorSans.className} text-[9px] tracking-[0.3em] uppercase text-[#6e695f] mb-6`}>
                Languages
              </h3>
              <p className={`${cormorant.className} text-[18px] text-[#ebd3b4] text-center leading-relaxed opacity-90`}>
                नेपाली · हिन्दी · English
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col md:flex-row min-h-screen border-t border-[#1f1a10]">
        <div className="relative w-full md:w-1/2 min-h-[500px] md:min-h-screen bg-[#0e0b09] overflow-hidden border-b md:border-b-0 md:border-r border-[#1f1a10]">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 block pointer-events-none">
            <rect width="100" height="100" fill="#1a1612" />
            <g stroke="#c9a96e" strokeWidth="0.3" fill="none" opacity="0.4">
              <path d="M0 30 L100 35" /><path d="M0 65 L100 60" />
              <path d="M22 0 L25 100" /><path d="M55 0 L60 100" /><path d="M78 0 L82 100" />
            </g>
            <g stroke="#c9a96e" strokeWidth="0.7" fill="none">
              <path d="M0 48 L100 52" /><path d="M40 0 L48 100" />
            </g>
            <g transform="translate(48,49)">
              <circle className="bj-pulse-dot" r="6" fill="#c9a96e" opacity="0.18" />
              <circle r="3" fill="#c9a96e" opacity="0.35" />
              <circle r="1.2" fill="#c9a96e" />
            </g>
            <text x="52" y="46" fontFamily="Tenor Sans, serif" fontSize="2" fill="#c9a96e" letterSpacing="0.3">BALLU JEWELLERS</text>
          </svg>

          <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-10">
            <a href="https://maps.app.goo.gl/byHkwWCEZN7U2pfd6" target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="md" icon={<ArrowRight />}>
                Open in Maps
              </Button>
            </a>
          </div>

          <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] pointer-events-none"></div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center px-10 py-16 md:px-16 lg:px-24 bg-[#0a0806]">
          <div className="max-w-lg">
            <div className={`${tenorSans.className} text-[#cda274] text-[9px] tracking-[0.35em] uppercase mb-8 flex items-center gap-3`}>
              Our Story <span className="opacity-50">·</span> चालीस वर्ष
            </div>
            
            <h2 className={`${cormorant.className} text-[44px] md:text-[56px] lg:text-[64px] text-[#fbf7f0] font-light leading-[1.1] mb-8`}>
              From a single bench, in <br />
              1986.
            </h2>
            
            <p className={`${tenorSans.className} text-[#a8a397] text-[14px] leading-[1.8] mb-10`}>
              My grandfather, Hari Lal, opened the workshop with a vise, a torch and a kerosene lamp. Today the lamp is gone — but the vise is the same. The brass nameplate over our door is too. Walk in and the bench is still in the back, still occupied. Stay for tea.
            </p>

            <p className={`${cormorant.className} text-[#cda274] text-[18px] italic tracking-wide`}>
              — Saru Suvedi, third generation
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
    </>
  );
}
