"use client";
import React from 'react'
import { Cormorant_Garamond } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const features = [
  {
    title: 'BIS',
    description: 'HALLMARKED GOLD, EVERY PIECE'
  },
  {
    title: 'Buyback',
    description: 'LIFETIME · TODAY\'S RATE'
  },
  {
    title: 'Care',
    description: 'FREE ANNUAL DEEP-CLEAN'
  },
  {
    title: 'Bespoke',
    description: 'SKETCH IN 2 WORKING DAYS'
  }
];

const BrandTrust = () => {
  return (
    <div className="bg-[#0e0b08] text-[#fbf7f0] w-full min-h-[60vh] flex flex-col justify-between relative overflow-hidden font-sans border-t border-white/5">
      
      {/* SELF-CONTAINED ROTATION ENGINE */}
      <style jsx global>{`
        @keyframes spinClockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes spinCounterClockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }

        .local-spin-clockwise {
          animation: spinClockwise 45s linear infinite !important;
        }

        .local-spin-counter {
          animation: spinCounterClockwise 45s linear infinite !important;
        }
      `}</style>

      {/* 1. UPPER TESTIMONIAL QUOTE SECTION */}
      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 lg:px-16 pt-24 pb-20 flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Editorial Star Icon Divider */}
        <div className="text-[#dbb86b] text-sm tracking-widest mb-6 opacity-80 relative z-10">
          ★
        </div>

        {/* Central Masterpiece Quote Statement */}
        <p className={`${cormorant.className} italic text-[clamp(1.5rem,4vw,2.5rem)] font-light tracking-wide max-w-4xl text-[#e2d5c3] leading-relaxed mb-4 relative z-10`}>
          "Every piece, named for the bench that made it."
        </p>

        {/* Signature Attribution Tag */}
        <span className="text-[10px] tracking-[0.4em] text-[#dbb86b] uppercase opacity-70 relative z-10">
          — Ballu Suvedi, Master Karigar
        </span>

     {/* ==========================================================
   FIXED: EXACT LAYOUT MATCHING Screenshot 2026-06-17 161300.png
   ========================================================== */}
<div className="absolute right-[5%]  md:right-[15%] bottom-0 w-[420px] h-[420px] translate-y-[270px] pointer-events-none opacity-[0.14] select-none z-0">
  
  {/* GROUP 1: CLOCKWISE ROTATION (Ring 3 & Ring 4) */}
  <div className="absolute inset-0  w-full h-full flex items-center justify-center local-spin-clockwise">
    
    {/* Ring 4: Outermost Ring (Fine SVG Dots) - [100%] */}
    <div className="absolute inset-0 w-full h-full">
      <svg className="w-full h-full  transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="49"
          fill="none"
          stroke="white"
          strokeWidth="0.2"
          strokeDasharray="1 2" 
          strokeLinecap="round"
          
        />
      </svg>
    </div>
    
    {/* Ring 3: Third From Center (Solid Line with Embedded Accent Beads) - [82%] */}
    <div className="absolute w-[82%] h-[82%]">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* The solid track line */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          className="opacity-70"
        />
        {/* The accent beads sitting directly on the line */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="white"
          strokeWidth="1.8" /* Thicker weight to create the distinct beads */
          strokeDasharray="0.1 24" /* 0.1 creates a round dot when combined with round linecap, 24 creates the large gap */
          strokeLinecap="round"
        />
      </svg>
    </div>

  </div>

  {/* GROUP 2: COUNTER-CLOCKWISE ROTATION (Ring 1 & Ring 2) */}
  <div className="absolute inset-0 w-full h-full flex items-center justify-center local-spin-counter">
    
    {/* Ring 2: Second From Center (Clean Solid Line) - [64%] */}
    <div className="w-[64%] h-[64%] rounded-full border border-white/70" />
    
    {/* Ring 1: Innermost Ring (Fine SVG Dots) - [42%] */}
    <div className="absolute w-[42%] h-[42%]">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          strokeDasharray="1.5 3.5" 
          strokeLinecap="round"
        />
      </svg>
    </div>

  </div>

</div>

      </div>

      {/* 2. LOWER VALUE PROPOSITION QUAD-GRID GRID SYSTEMS */}
      <div className="w-full border-t border-white/10 border-b border-white/5 relative z-10 bg-[#0e0b08]">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, idx) => (
            <div 
              key={idx}
              className={`
                flex flex-col items-center justify-center text-center p-12 md:p-16 min-h-[220px]
                border-b border-white/10 sm:border-b-0
                ${idx !== 3 ? 'lg:border-r lg:border-white/10' : ''}
                ${idx % 2 === 0 ? 'sm:border-r sm:border-white/10' : ''}
                hover:bg-white/[0.01] transition-colors duration-300 group
              `}
            >
              <h3 className={`${cormorant.className} italic text-3xl md:text-4xl font-light text-[#dbb86b] mb-3 group-hover:translate-y-[-2px] transition-transform duration-300`}>
                {item.title}
              </h3>
              <p className="text-[10px] tracking-[0.25em] text-[#e2d5c3] opacity-60 uppercase font-sans">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SUBFOOTER RIGHTS NAVIGATION LINE */}
      <div className="w-full bg-[#0a0806] border-t border-white/5 relative z-10">
        <div className="max-w-7xl w-full mx-auto px-6 md:px-12 lg:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] tracking-[0.3em] uppercase text-white/40">
          
          <div>
            © 2026 BALLU JEWELLERS · KAKARVITTA
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[#dbb86b]/60">
            HALLMARKED · BIS · NRB REGISTERED
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#dbb86b] transition-colors duration-200">Instagram</a>
            <a href="#" className="hover:text-[#dbb86b] transition-colors duration-200">Facebook</a>
            <a href="#" className="hover:text-[#dbb86b] transition-colors duration-200">Whatsapp</a>
          </div>

        </div>
      </div>

    </div>
  )
}

export default BrandTrust;