import React from 'react';
import { Cormorant_Garamond, Inter } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-serif',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
});

export default function HeroSection() {
  return (
    <div className={`${cormorant.variable} ${inter.variable} min-h-screen w-full text-[#e2d5c3] p-8 md:p-20 flex flex-col justify-between font-serif relative overflow-x-hidden`}>
      
      {/* Rotating page background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-black flex items-center justify-center overflow-hidden">
        <img
          src="/globe.svg"
          alt="rotating decorative background"
          className="max-h-[110vh] max-w-[110vw] object-contain opacity-30 rotate-background"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Top Header Label */}
      <div className="text-[10px] tracking-[0.5em]  text-red-500  uppercase opacity-70 font-sans">
        ★ EST. 1984 · KAKARVITTA
      </div>

      {/* Main Content Area: 
          Keeps normal document flow for the left text, pushing it to the bottom naturally. 
          The parent container must have `relative` so the card has a point of reference.
      */}
      <div className="flex-grow flex items-end pt-8 pb-8">
        
        {/* LEFT SIDE TEXT: Static flow (No absolute coordinates) */}
        <div className="flex flex-col space-y-6 max-w-3xl "> 
          {/* Note: `pr-[320px]` creates a padding safety buffer on the right side 
              so the text wraps elegantly instead of bleeding underneath the card. */}
          <h1 className="text-6xl md:text-8xl lg:text-[100px] font-normal leading-[0.95] text-[rgb(218,206,183)] tracking-tight">
            Heirlooms,<br />
            made for<br />
            a quieter wear.
          </h1>
          
          <p className="text-xl md:text-2xl font-normal opacity-90">
            तीन पुस्ताको कारीगरी — एउटै बेन्चबाट
          </p>
          
          <p className="text-sm md:text-base font-sans font-light leading-relaxed max-w-xl opacity-70 tracking-wide">
            Forty years on the same bench in Kakarvitta. Hallmarked gold, hand-finished silver, 
            made-to-order bridal sets. Browse online, reserve, collect in store.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2 font-sans text-[10px] tracking-[0.2em] uppercase font-medium">
            <button className="bg-[#ebd9be] text-[#2c251e] px-10 py-5 flex items-center gap-2 hover:bg-white transition-all">
              ENTER THE ATELIER <span>→</span>
            </button>
            <button className="border border-[#ebd9be]/40 text-[#ebd9be] px-10 py-5 bg-transparent hover:bg-white/10 transition-all">
              BRIDAL LOOKBOOK
            </button>
          </div>
        </div>

        {/* RIGHT SIDE CARD: STRICTLY ABSOLUTE & HIGH Z-INDEX 
            Anchored to the absolute coordinates relative to the screen wrapper.
        */}
        <div className="absolute right-20 bottom-20  z-20 w-full  max-w-[320px]">
          <div className="bg-[#241f1a]/90 border border-white/5 p-5 shadow-2xl backdrop-blur-md">
            
            <div className="flex justify-between items-center text-[8px] tracking-[0.2em] uppercase opacity-50 font-sans mb-4">
              <span>PIECE OF THE WEEK</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ebd9be]/70"></span>
            </div>
            
            {/* Image Block (reduced height) */}
            <div className="w-full h-44 md:h-56 bg-gradient-to-tr from-[#3a3127] to-[#5a4b3b] opacity-90 mb-5"></div>
            
            {/* Metadata */}
            <div className="space-y-1">
              <h3 className="text-lg font-normal text-[rgb(218,206,183)]">Chandra Haar</h3>
              <p className="text-[9px] tracking-wider font-sans opacity-50">
                22K · 12 G · Rs. 1,78,000
              </p>
              <div className="pt-3">
                <a href="#view" className="inline-flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase font-sans font-semibold text-[#ebd9be] hover:underline">
                  VIEW PIECE <span>→</span>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Center Indicator */}
      <div className="flex flex-col items-center mx-auto space-y-2 font-sans opacity-40 pt-4">
        <span className="text-[9px] tracking-[0.4em] uppercase">SCROLL</span>
        <div className="w-[1px] h-6 bg-current"></div>
      </div>

      

    </div>
  );
}