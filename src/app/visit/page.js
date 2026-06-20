"use client";

import React from "react";
import { Cormorant_Garamond, Cormorant_SC, Tenor_Sans } from "next/font/google";
import { FiStar } from "react-icons/fi";

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

export default function AboutContactPage() {
  return (
    <div className="bg-[#0a0806] text-[#e5e5e0] antialiased selection:bg-[#cda274]/30">
      
      {/* =========================================
          SECTION 1: FIND US (HERO & INFO GRID)
          ========================================= */}
      <section className="min-h-screen flex flex-col relative">
        
        {/* Top Main Section - Centered */}
        <div className="flex-grow flex flex-col items-center justify-center px-6 pt-15 pb-20 text-center">
          
          {/* Star Icon */}
          <div className="text-[#cda274] mb-3 opacity-80">
            <FiStar size={18} strokeWidth={1.5} />
          </div>

          {/* Find Us Label */}
          <div className={`${tenorSans.className} text-[10px] tracking-[0.4em] uppercase text-[#cda274] mb-2`}>
            Find Us
          </div>

          {/* Large Headline */}
          <h1 className={`${cormorant.className} text-5xl md:text-[80px] lg:text-[96px] leading-[1.1] text-[#fbf7f0] font-light tracking-tight `}>
            Two doors from <br />
            <span className="italic text-[#cda274] pr-1">the post office.</span>
          </h1>

          {/* Devanagari Subtitle */}
          <p className="italic font-serif text-[18px] md:text-[22px] text-[#e2d5c3] opacity-80 tracking-wide mt-2">
            मुख्य बजार · काँकडभिट्टा · झापा
          </p>

        </div>

        {/* Bottom Info Grid */}
        <div className="w-full border-t border-[#1f1a10] bg-[#0c0907]">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#1f1a10]">
            
            {/* HOURS */}
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <h3 className={`${tenorSans.className} text-[9px] tracking-[0.3em] uppercase text-[#6e695f] mb-6 hover:transition-x-2`}>
                Hours
              </h3>
              <p className={`${cormorant.className} text-[18px] text-[#ebd3b4] text-center leading-relaxed opacity-90`}>
                Mon–Sat 10–7<br />
                Sun 11–5
              </p>
            </div>

            {/* PHONE */}
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <h3 className={`${tenorSans.className} text-[9px] tracking-[0.3em] uppercase text-[#6e695f] mb-6`}>
                Phone
              </h3>
              <p className={`${cormorant.className} text-[18px] text-[#ebd3b4] text-center leading-relaxed opacity-90 [font-variant-numeric:lining-nums]`}>
                +977 9842 000 000<br />
                023-562-118
              </p>
            </div>

            {/* EMAIL */}
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <h3 className={`${tenorSans.className} text-[9px] tracking-[0.3em] uppercase text-[#6e695f] mb-6`}>
                Email
              </h3>
              <p className={`${cormorant.className} text-[18px] text-[#ebd3b4] text-center leading-relaxed opacity-90`}>
                aalu@ballujewellers.np
              </p>
            </div>

            {/* LANGUAGES */}
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

      {/* =========================================
          SECTION 2: OUR STORY & MAP (SPLIT SCREEN)
          ========================================= */}
      <section className="flex flex-col md:flex-row min-h-screen border-t border-[#1f1a10]">
        
        {/* LEFT COLUMN: Stylized Abstract Map */}
        <div className="relative w-full md:w-1/2 min-h-[500px] md:min-h-screen bg-[#0e0b09] overflow-hidden border-b md:border-b-0 md:border-r border-[#1f1a10]">
          
          {/* Subtle Background Grid */}
          <div 
            className="absolute inset-0 opacity-[0.15] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(#8e897e 1px, transparent 1px), linear-gradient(90deg, #8e897e 1px, transparent 1px)',
              backgroundSize: '120px 120px',
              backgroundPosition: 'center center'
            }}
          />

          {/* Abstract Gold Map Lines (Roads) */}
          <div className="absolute top-[-10%] bottom-[-10%] left-[35%] w-[2px] bg-[#cda274] origin-center -rotate-[4deg] opacity-80 shadow-[0_0_10px_rgba(205,162,116,0.2)]"></div>
          <div className="absolute left-[-10%] right-[-10%] top-[48%] h-[2px] bg-[#cda274] origin-center rotate-[2deg] opacity-80 shadow-[0_0_10px_rgba(205,162,116,0.2)]"></div>

          {/* Location Marker at Intersection */}
          <div className="absolute top-[48%] left-[35%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            {/* Concentric Rings */}
            <div className="absolute w-[90px] h-[90px] rounded-full bg-[#cda274]/10 border border-[#cda274]/20"></div>
            <div className="absolute w-[45px] h-[45px] rounded-full bg-[#cda274]/20 border border-[#cda274]/30"></div>
            
            {/* Solid Core Dot */}
            <div className="w-3.5 h-3.5 rounded-full bg-[#cda274] shadow-[0_0_12px_#cda274]"></div>

            {/* Location Label */}
            <div className={`${tenorSans.className} absolute left-20 w-max text-[9px] tracking-[0.3em] uppercase text-[#cda274] font-medium tracking-widest pl-2`}>
              Ballu Jewellers
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-10">
            <button className={`${tenorSans.className} bg-[#d4b77a] hover:bg-[#e6caa4] text-[#0a0806] px-6 py-3 text-[10px] tracking-[0.3em] uppercase font-bold flex items-center gap-3 transition-colors shadow-lg`}>
              Open in Maps <span className="text-lg leading-none -mt-1 mb-0.5">→</span>
            </button>
          </div>

          {/* Gradient shadow for depth */}
          <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] pointer-events-none"></div>
        </div>

        {/* RIGHT COLUMN: Typography & Story */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-10 py-16 md:px-16 lg:px-24 bg-[#0a0806]">
          <div className="max-w-lg">
            
            {/* Small Heading */}
            <div className={`${tenorSans.className} text-[#cda274] text-[9px] tracking-[0.35em] uppercase mb-8 flex items-center gap-3`}>
              Our Story <span className="opacity-50">·</span> चालीस वर्ष
            </div>
            
            {/* Main Headline */}
            <h2 className={`${cormorant.className} text-[44px] md:text-[56px] lg:text-[64px] text-[#fbf7f0] font-light leading-[1.1] mb-8`}>
              From a single bench, in <br />
              1986.
            </h2>
            
            {/* Story Paragraph */}
            <p className={`${tenorSans.className} text-[#a8a397] text-[14px] leading-[1.8] mb-10`}>
              My grandfather, Hari Lal, opened the workshop with a vise, a torch and a kerosene lamp. Today the lamp is gone — but the vise is the same. The brass nameplate over our door is too. Walk in and the bench is still in the back, still occupied. Stay for tea.
            </p>

            {/* Signature/Attribution */}
            <p className={`${cormorant.className} text-[#cda274] text-[18px] italic tracking-wide`}>
              — Saru Suvedi, third generation
            </p>
            
          </div>
        </div>

      </section>

    </div>
  );
}