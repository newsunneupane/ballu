"use client";
import React, { useState, useRef } from 'react';
import { Cormorant_Garamond,Cormorant_SC,  Noto_Serif_Devanagari } from 'next/font/google';
import Card from './Card';
import { star } from "@/components/Icons";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: '--font-serif-editorial', 
});
  
const cormorantSC = Cormorant_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: '--font-serif-title',
});



// Added font import for the premium Nepali serif look
const notoDevanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  weight: ['300', '400'],
  variable: '--font-nepali-serif',
});



export default function HeroSection() {
  const buttonRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    
    // Calculate the center point of the button
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;
    
    // Calculate distance from mouse to center
    const distanceX = e.clientX - buttonCenterX;
    const distanceY = e.clientY - buttonCenterY;
    
    // Controls the strength of the magnetic pull (Max 15px movement)
    const maxPull = 15; 
    
    const pullX = (distanceX / rect.width) * maxPull;
    const pullY = (distanceY / rect.height) * maxPull;

    setTransformStyle({ x: pullX, y: pullY });
  };

  const handleMouseLeave = () => {
    // Snap cleanly back to origin when mouse exits
    setTransformStyle({ x: 0, y: 0 });
  };
  return (
    <div className={`${cormorant.variable} ${cormorantSC.variable}  ${notoDevanagari.variable} min-h-screen w-full text-cream-luxury p-6 md:p-20 flex flex-col justify-between font-serif-editorial relative overflow-x-hidden`}>
      
      {/* Rotating gradient SVG background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#0e0b08] overflow-hidden">
        <svg
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[180vw] max-w-none opacity-100 animate-bj-grad-shift"
          width="100%"
          height="100%"
          viewBox="0 0 100 125"
          preserveAspectRatio="xMinYMid slice"
        >
          <defs>
            <radialGradient id="g1" cx="20%" cy="45%" r="95%">
              <stop offset="0%" stopColor="#fff7dd" stopOpacity="1" />
              <stop offset="30%" stopColor="#f7d18f" stopOpacity="0.92" />
              <stop offset="55%" stopColor="#d5a560" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#0e0b08" stopOpacity="0.06" />
            </radialGradient>
            <linearGradient id="gline" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f5e3b8" stopOpacity="0.22" />
              <stop offset="50%" stopColor="#f5e3b8" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#f5e3b8" stopOpacity="0.22" />
            </linearGradient>
            <radialGradient id="gvignette" cx="75%" cy="55%" r="65%">
              <stop offset="0%" stopColor="#0e0b08" stopOpacity="0" />
              <stop offset="70%" stopColor="#0e0b08" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0e0b08" stopOpacity="0.42" />
            </radialGradient>
          </defs>

          <rect width="100" height="125" fill="#0e0b08" />
          <rect width="100" height="125" fill="url(#g1)" />
          <rect width="100" height="125" fill="url(#gvignette)" />
          
          <circle cx="50" cy="65" r="45" fill="none" stroke="url(#gline)" strokeWidth="0.15" />
          <circle cx="50" cy="65" r="32" fill="none" stroke="url(#gline)" strokeWidth="0.12" />
          <circle cx="50" cy="65" r="18" fill="none" stroke="url(#gline)" strokeWidth="0.08" opacity="0.6" />
        </svg>
      </div>

      {/* Top Header Label */}
     <div className="text-[11px] tracking-[0.4em] text-[#dbb86b] text-thin uppercase opacity-80 mt-4 font-sans fade-in-up fade-in-up-1">
  <span className="inline-block animate-[float_4s_ease-in-out_infinite]">
    <span className="relative inline-block select-none">
      {/* Background Stroke Layer */}
      <span className="absolute  inset-0 text-transparent [-webkit-text-stroke:1px_#d4b77a] pointer-events-none">
        ☆
      </span>
      {/* Foreground Shimmering Layer */}
      <span className="relative  text-transparent bg-clip-text bg-[linear-gradient(110deg,#dbb86b_30%,#fff_50%,#dbb86b_70%)] bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite]">
        ☆
      </span>
    </span>
  </span>{' '}
  EST. 1984 · KAKARVITTA
</div>
      {/* Main Content Area */}
      <div className="grow flex items-end pt-5 pb-8">
        
        {/* LEFT SIDE TEXT */}
        <div className="flex flex-col space-y-4 max-w-4xl lg:pr-380px w-full"> 
          
          {/* Main Headline */}
          <h1 className="text-[clamp(3.5rem,7.5vw,5.8rem)] font-light leading-[1.1] text-cream-luxury tracking-tight font-serif-editorial">
  <span className="block fade-in-up" style={{ animationDelay: '0ms' }}>
    Heirlooms,
  </span>
  <span className="block fade-in-up"  style={{ animationDelay: '200ms' }}>
    made for
  </span>
  <span className="block fade-in-up" style={{ animationDelay: '400ms' }}>
    a quieter wear.
  </span>
</h1>
          
          {/* Devanagari Script text (Fixed: Styled with custom font-nepali-serif) */}
          <p className="italic  font-nepali-serif text-xl tracking-wide md:text-2xl font-light text-[#e2d5c3] opacity-85  fade-in-up fade-in-up-5">
            तीन पुस्ताको कारीगरी — एउटै बेन्चबाट
          </p>
          
          {/* Description Copy */}
          <p className="text-xs md:text-[13px] font-sans font-light leading-relaxed max-w-md text-[#c4b9a6] tracking-wide fade-in-up fade-in-up-6">
            Forty years on the same bench in Kakarvitta. Hallmarked gold, hand-finished silver, 
            made-to-order bridal sets. Browse online, reserve, collect in store.
          </p>
          
          {/* CTA Buttons */}
          <div className="relative flex flex-row flex-wrap items-start justify-start gap-4 fade-in-up fade-in-up-7">
            <div className="relative  flex justify-center items-center">
      <button
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `translate3d(${transformStyle.x}px, ${transformStyle.y}px, 0)`,
        }}
        className="bg-[linear-gradient(110deg,#d5a560_40%,#ffffff40_50%,#d5a560_60%)]
bg-[length:200%_100%]
text-[#080808] tracking-widest font-light
px-7 py-3.5
flex items-center gap-5
shadow-md
relative z-20

/* Smoothly transitions the position tracking transform */
transition-transform duration-200 ease-out

/* 1. MOUSE LEAVE: Plays a left-to-right animation once when NOT hovering */
animate-[shimmerRight_0.6s_ease-out_forwards]

/* 2. HOVER: Overrides with the fast 3-loop right-to-left animation */
hover:animate-[shimmerLeft_0.33s_linear_3]"
      >
        ENTER THE ATELIER <span>→</span>
      </button>

      <div className="peer/bottom absolute -bottom-10 left-0 right-0 h-10 bg-transparent"></div>
    </div>

            <button
              className="
                border border-[#9b8465] tracking-widest font-light
                text-cream-luxury bg-[#241f1a]/100
                px-7 py-3.5 hover:bg-[#241f1a]/90
                transition-colors duration-300
                relative z-10 cursor-pointer
              "
            >
              BRIDAL LOOKBOOK
            </button>
          </div>
        </div>

        {/* RIGHT SIDE CARD Container */}
        <div className="absolute right-8 md:right-20 bottom-24 z-10 hidden lg:block">
          <Card />
        </div>
      </div>
      
      {/* Bottom Center Indicator */}
      <div className="flex flex-col items-center mx-auto space-y-2 font-sans opacity-50 pt-4">
        <span className="text-[9px] tracking-[0.4em] uppercase text-cream-luxury">SCROLL</span>
        <div className="w-[1px] h-7 bg-cream-luxury/60 animate-[bounce-y_3s_ease-in-out_infinite]"></div>

      </div>
    </div>
  );
}