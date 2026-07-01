"use client";
import React, { useState, useRef } from 'react';
import { Cormorant_Garamond, Cormorant_SC, Noto_Serif_Devanagari } from 'next/font/google';
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

const notoDevanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  weight: ['300', '400'],
  variable: '--font-nepali-serif',
});

// Structural properties to shape the drifting ambient gold particles
const ambientParticles = [
  { left: "93.0%", size: 3.4, speed: 22.0, delay: -0.7, opacity: 0.61 },
  { left: "47.9%", size: 1.8, speed: 18.2, delay: -0.8, opacity: 0.35 },
  { left: "13.0%", size: 2.6, speed: 14.1, delay: -4.7, opacity: 0.55 },
  { left: "9.6%",  size: 1.8, speed: 27.0, delay: -12.5, opacity: 0.49 },
  { left: "5.3%",  size: 3.0, speed: 23.2, delay: -4.8, opacity: 0.43 },
  { left: "0.9%",  size: 3.3, speed: 24.6, delay: -4.7, opacity: 0.79 },
  { left: "52.2%", size: 2.6, speed: 21.5, delay: -1.3, opacity: 0.53 },
  { left: "56.2%", size: 3.4, speed: 22.5, delay: -4.2, opacity: 0.70 },
  { left: "18.0%", size: 3.1, speed: 14.7, delay: -2.4, opacity: 0.37 },
  { left: "3.6%",  size: 2.8, speed: 18.4, delay: -13.7, opacity: 0.72 },
  { left: "38.8%", size: 2.4, speed: 21.7, delay: -2.8, opacity: 0.78 }
];

export default function HeroSection() {
  const buttonRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - buttonCenterX;
    const distanceY = e.clientY - buttonCenterY;
    
    const maxPull = 15; 
    const pullX = (distanceX / rect.width) * maxPull;
    const pullY = (distanceY / rect.height) * maxPull;

    setTransformStyle({ x: pullX, y: pullY });
  };

  const handleMouseLeave = () => {
    setTransformStyle({ x: 0, y: 0 });
  };

  return (
    <div className={`${cormorant.variable} ${cormorantSC.variable} ${notoDevanagari.variable} min-h-screen w-full text-cream-luxury p-6 md:p-10 flex flex-col justify-between font-serif-editorial relative overflow-x-hidden`}>
      
      {/* Dynamic Keyframe Injection Block */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bj-dust {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: var(--base-opacity, 0.5);
          }
          90% {
            opacity: var(--base-opacity, 0.5);
          }
          100% {
            transform: translateY(-105vh);
            opacity: 0;
          }
        }
        @keyframes bj-spin-clock {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bj-spin-counter {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .bj-orbit-slow {
          transform-origin: center;
          animation: bj-spin-clock 80s linear infinite;
        }
        .bj-orbit-slow-rev {
          transform-origin: center;
          animation: bj-spin-counter 60s linear infinite;
        }
      `}} />

      {/* Background Container Layer */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#0e0b08] overflow-hidden">
        
        {/* Ambient Golden Particle Layer */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {ambientParticles.map((particle, idx) => (
            <span
              key={idx}
              style={{
                position: 'absolute',
                left: particle.left,
                bottom: '-20px',
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                borderRadius: '50%',
                background: 'rgb(201, 169, 110)',
                boxShadow: `0px 0px ${particle.size * 2}px rgb(201, 169, 110)`,
                animation: `${particle.speed}s linear ${particle.delay}s infinite normal none running bj-dust`,
                '--base-opacity': particle.opacity,
              }}
            />
          ))}
        </div>

        {/* Dynamic Horizontal Gradient Mask Overlay */}
        <div style={{
          position: 'absolute',
          inset: '0px',
          background: 'linear-gradient(90deg, rgba(15, 13, 10, 0.95) 0%, rgba(15, 13, 10, 0.55) 50%, rgba(15, 13, 10, 0.35) 100%)',
          zIndex: 5
        }}></div>

        {/* Custom Large Geometric Orbit Blueprint Layout Container */}
        <div style={{
          position: 'absolute',
          right: '-180px',
          top: '50px',
          opacity: 0.55,
          transform: 'translate3d(0px, 0px, 0px)',
          zIndex: 2
        }}>
          <div aria-hidden="true" style={{ position: 'absolute', width: '720px', height: '720px', pointerEvents: 'none' }}>
            <svg width="720" height="720" viewBox="0 0 100 100" className="bj-orbit-slow" style={{ position: 'absolute', inset: '0px' }}>
              <circle cx="50" cy="50" r="48" fill="none" stroke="#c9a96e" strokeWidth="0.15" opacity="0.6" strokeDasharray="0.3 1.5"></circle>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#c9a96e" strokeWidth="0.2" opacity="0.5"></circle>
              <g fill="#c9a96e" opacity="0.6">
                <circle cx="88" cy="50" r="0.6"></circle>
                <circle cx="82.90896534380867" cy="69" r="0.6"></circle>
                <circle cx="69" cy="82.90896534380866" r="0.6"></circle>
                <circle cx="50" cy="88" r="0.6"></circle>
                <circle cx="31.000000000000007" cy="82.90896534380867" r="0.6"></circle>
                <circle cx="17.091034656191326" cy="69" r="0.6"></circle>
                <circle cx="12" cy="50.00000000000001" r="0.6"></circle>
                <circle cx="17.091034656191333" cy="30.999999999999996" r="0.6"></circle>
                <circle cx="30.999999999999982" cy="17.09103465619134" r="0.6"></circle>
                <circle cx="49.99999999999999" cy="12" r="0.6"></circle>
                <circle cx="69" cy="17.091034656191333" r="0.6"></circle>
                <circle cx="82.90896534380866" cy="30.999999999999982" r="0.6"></circle>
              </g>
            </svg>
            <svg width="720" height="720" viewBox="0 0 100 100" className="bj-orbit-slow-rev" style={{ position: 'absolute', inset: '0px' }}>
              <circle cx="50" cy="50" r="28" fill="none" stroke="#c9a96e" strokeWidth="0.3" opacity="0.4"></circle>
              <circle cx="50" cy="50" r="20" fill="none" stroke="#c9a96e" strokeWidth="0.25" opacity="0.35" strokeDasharray="0.5 1.2"></circle>
            </svg>
          </div>
        </div>

        {/* Rotating background base gradient SVG layer */}
        <svg
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[180vw] max-w-none opacity-100 animate-bj-grad-shift"
          width="100%"
          height="100%"
          viewBox="0 0 100 125"
          preserveAspectRatio="xMinYMid slice"
          style={{ zIndex: 1 }}
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
      <div className="text-[11px] tracking-[0.4em] text-[#dbb86b] text-thin uppercase opacity-80 font-sans fade-in-up fade-in-up-1 z-10">
        <span className="inline-block animate-[float_4s_ease-in-out_infinite]">
          <span className="relative inline-block select-none">
            <span className="absolute inset-0 text-transparent [-webkit-text-stroke:1px_#d4b77a] pointer-events-none">
              ☆
            </span>
            <span className="relative text-transparent bg-clip-text bg-[linear-gradient(110deg,#dbb86b_30%,#fff_50%,#dbb86b_70%)] bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite]">
              ☆
            </span>
          </span>
        </span>{' '}
        EST. 1984 · KAKARVITTA
      </div>

      {/* Main Content Area */}
      <div className="grow flex items-end z-10"> 
        {/* LEFT SIDE TEXT */}
        <div className="flex flex-col max-w-4xl lg:pr-380px w-full"> 
          
          {/* Main Headline */}
          <h1 className="text-[80px] font-light leading-[0.8] text-cream-luxury tracking-tight font-serif-editorial">
            <span className="block fade-in-up" style={{ animationDelay: '0ms' }}>
              Heirlooms,
            </span>
            <span className="block fade-in-up" style={{ animationDelay: '200ms' }}>
              made for
            </span>
            <span className="block fade-in-up" style={{ animationDelay: '400ms' }}>
              a quieter wear.
            </span>
          </h1>
          
          {/* Devanagari Script text */}
          <p className="italic my-6 font-nepali-serif text-[16px] tracking-widest font-light text-[#e2d5c3] opacity-85 fade-in-up fade-in-up-5">
            तीन पुस्ताको कारीगरी — एउटै बेन्चबाट
          </p>
          
          {/* Description Copy */}
          <p className="text-xs mb-2 md:text-[13px] font-sans font-light leading-relaxed max-w-md text-[#c4b9a6] tracking-wide fade-in-up fade-in-up-6">
            Forty years on the same bench in Kakarvitta. Hallmarked gold, hand-finished silver, 
            made-to-order bridal sets. Browse online, reserve, collect in store.
          </p>
          
          {/* CTA Buttons */}
          <div className="relative flex flex-row flex-wrap items-start justify-start gap-4 fade-in-up fade-in-up-7">
            <div className="relative flex justify-center items-center">
              <button
                ref={buttonRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: `translate3d(${transformStyle.x}px, ${transformStyle.y}px, 0)`,
                }}
                className={[
                  "bg-[linear-gradient(110deg,#d5a560_40%,#ffffff40_50%,#d5a560_60%)]",
                  "bg-[length:200%_100%] text-[#080808] tracking-widest font-light",
                  "px-7 py-3.5 flex items-center gap-5 shadow-md relative z-20",
                  "transition-transform duration-200 ease-out",
                  "animate-[shimmerRight_0.6s_ease-out_forwards]",
                  "hover:animate-[shimmerLeft_0.33s_linear_3]"
                ].join(" ")}
              >
                ENTER THE ATELIER <span>→</span>
              </button>
              <div className="peer/bottom absolute -bottom-10 left-0 right-0 h-10 bg-transparent"></div>
            </div>

            <button
              className={[
                "border border-[#9b8465] tracking-widest font-light",
                "text-cream-luxury bg-[#241f1a]/100",
                "px-7 py-3.5 hover:bg-[#241f1a]/90",
                "transition-colors duration-300 relative z-10 cursor-pointer"
              ].join(" ")}
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
      <div className="flex flex-col items-center mx-auto space-y-2 font-sans opacity-50 pt-4 z-10">
        <span className="text-[9px] tracking-[0.4em] uppercase text-cream-luxury">SCROLL</span>
        <div className="w-[1px] h-7 bg-cream-luxury/60 animate-[bounce-y_3s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );
}