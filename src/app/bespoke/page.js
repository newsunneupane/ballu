"use client";

import React, { useState, useRef } from "react";
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

export default function CommissionPage() {
  const [selectedType, setSelectedType] = useState("BRIDAL SET");
  const [budget, setBudget] = useState(500000);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Magnetic Button States & Refs (Clean JavaScript)
  const buttonRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState({ x: 0, y: 0 });

  // Removed the TypeScript type definition here
  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    
    // Calculate distance from center of the button
    const x = e.clientX - (left + width / 2);
    const y = e.clientY - (top + height / 2);
    
    // Dampen the movement magnitude
    setTransformStyle({ x: x / 3.5, y: y / 3.5 });
  };

  const handleMouseLeave = () => {
    setTransformStyle({ x: 0, y: 0 });
  };

  const pieceTypes = [
    "BRIDAL SET",
    "NECKLACE",
    "EARRINGS",
    "RING",
    "BANGLES",
    "REMODEL",
    "OTHER",
  ];

  const formattedBudget = new Intl.NumberFormat("en-IN").format(budget);

  const minBudget = 50000;
  const maxBudget = 2000000;
  const sliderFillPercentage = ((budget - minBudget) / (maxBudget - minBudget)) * 100;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0a0806] text-[#e5e5e0] antialiased">
      
      {/* LEFT COLUMN: Visual / Brand Area */}
      <div className="w-full md:w-[45%] lg:w-[40%] relative flex flex-col justify-end p-6 sm:p-10 md:p-16 overflow-hidden min-h-[360px] sm:min-h-[450px] md:min-h-screen bg-[radial-gradient(circle_at_35%_35%,_#fbe4b5_0%,_#cda274_20%,_#6e5229_45%,_#16110a_100%)] shadow-[inset_0_-20px_40px_rgba(0,0,0,0.6)] md:shadow-[inset_-20px_0_40px_rgba(0,0,0,0.5)] border-b md:border-b-0 md:border-r border-[#1a140f]">
        <div className="absolute top-[35%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-[35%] h-[35%] rounded-full border border-white/10 pointer-events-none"></div>
        <div className="absolute top-[35%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full border border-white/5 pointer-events-none"></div>
        <div className="absolute top-[35%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-full border border-white/[0.02] pointer-events-none"></div>

        <div className="relative z-10 max-w-sm mt-auto pb-2">
          <FiStar className="text-[#cda274] mb-4 md:mb-6 opacity-80" size={16} />
          <h1 className={`${cormorant.className} text-[42px] sm:text-[56px] lg:text-[72px] leading-[1.1] md:leading-[1.05] text-[#fbf7f0] tracking-tight mb-2 font-light`}>
            Commission<br />a piece.
          </h1>
          <p className="italic font-serif text-[16px] sm:text-[18px] text-[#e2d5c3] opacity-80 mb-4 md:mb-8 tracking-wide">
            विशेष अर्डर
          </p>
          <p className={`${tenorSans.className} text-[12px] sm:text-[13px] text-[#ebd3b4] opacity-70 leading-[1.6] md:leading-[1.7]`}>
            No template. Our karigar drafts a sketch within two working days. Pay only on approval.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-[#080605] to-transparent pointer-events-none" />
      </div>

      {/* RIGHT COLUMN: Interactive Form */}
      <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col justify-center px-4 py-10 sm:px-10 md:px-16 lg:px-24">
        <div className="max-w-2xl w-full mx-auto">
          
          <div className={`${tenorSans.className} flex justify-between items-center text-[9px] tracking-[0.3em] uppercase text-[#cda274] mb-4`}>
            <span>Step 01 of 02</span>
            <span className="opacity-60">Ref. BJ-2026-0148</span>
          </div>

          <h2 className={`${cormorant.className} text-[32px] sm:text-[40px] text-[#fbf7f0] font-light mb-8 md:mb-12`}>
            What shall we make?
          </h2>

          <div className="space-y-8 md:space-y-12">
            
            {/* TYPE OF PIECE */}
            <div>
              <label className={`${tenorSans.className} block text-[9px] tracking-[0.3em] uppercase text-[#8e897e] mb-4`}>
                Type of Piece
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {pieceTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`${tenorSans.className} px-3 py-2 sm:px-4 sm:py-2.5 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase transition-all duration-300 border ${
                      selectedType === type
                        ? "border-[#cda274] text-[#cda274] bg-[#cda274]/5"
                        : "border-[#2b2415] text-[#8e897e] hover:border-[#4a3d24] hover:text-[#ebd3b4]"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* BUDGET SLIDER */}
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-3 sm:mb-4">
                <label className={`${tenorSans.className} block text-[9px] tracking-[0.3em] uppercase text-[#8e897e]`}>
                  Budget
                </label>
                <div className={`${cormorant.className} text-xl sm:text-2xl text-[#cda274] tracking-wide`}>
                  Rs <span className="text-[22px] sm:text-[26px]">{formattedBudget}</span>
                </div>
              </div>
              
              <div className="relative w-full h-8 flex items-center">
                <input
                  type="range"
                  min={minBudget}
                  max={maxBudget}
                  step={10000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="absolute w-full appearance-none bg-transparent cursor-pointer z-20 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#fbe4b5] [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(205,162,116,0.5)]
                    [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#fbe4b5]"
                />
                <div 
                  className="absolute w-full h-[3px] rounded-full z-10 pointer-events-none"
                  style={{
                    background: `linear-gradient(to right, #cda274 0%, #cda274 ${sliderFillPercentage}%, #2b2415 ${sliderFillPercentage}%, #2b2415 100%)`
                  }}
                />
              </div>
            </div>

            {/* YOUR NAME */}
            <div>
              <label className={`${tenorSans.className} block text-[9px] tracking-[0.3em] uppercase text-[#8e897e] mb-1`}>
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="So we know who to call"
                className={`${cormorant.className} w-full bg-transparent border-b border-[#2b2415] py-2.5 text-base sm:text-lg text-[#ebd3b4] placeholder:text-[#4a3d24] placeholder:italic focus:outline-none focus:border-[#cda274] transition-colors rounded-none`}
              />
            </div>

            {/* WHATSAPP / PHONE */}
            <div>
              <label className={`${tenorSans.className} block text-[9px] tracking-[0.3em] uppercase text-[#8e897e] mb-1`}>
                Whatsapp / Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+977 98..."
                className={`${cormorant.className} w-full bg-transparent border-b border-[#2b2415] py-2.5 text-base sm:text-lg text-[#ebd3b4] placeholder:text-[#4a3d24] placeholder:italic focus:outline-none focus:border-[#cda274] transition-colors rounded-none`}
              />
            </div>

            {/* REFERENCE IMAGE UPLOAD */}
            <div>
              <label className={`${tenorSans.className} block text-[9px] tracking-[0.3em] uppercase text-[#8e897e] mb-3`}>
                Reference Image (Optional)
              </label>
              <div className="w-full border border-dashed border-[#2b2415] rounded-sm py-8 sm:py-10 flex items-center justify-center cursor-pointer hover:border-[#cda274] transition-colors group bg-[#0a0806] px-4 text-center">
                <span className={`${tenorSans.className} text-[10px] sm:text-[11px] text-[#8e897e] group-hover:text-[#cda274] transition-colors`}>
                  Drop Image here - or click to upload
                </span>
                <input type="file" className="hidden" accept="image/*" />
              </div>
            </div>

          </div>

          {/* Footer Actions Area */}
          <div className="mt-10 md:mt-14 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-[#1a140f] pt-8 md:pt-10">
            <span className={`${tenorSans.className} text-[8px] tracking-[0.4em] uppercase text-[#6e695f] text-center sm:text-left`}>
              No Obligation · No Advance
            </span>
            
            <button
              ref={buttonRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `translate3d(${transformStyle.x}px, ${transformStyle.y}px, 0)`,
              }}
              className={`${tenorSans.className} bg-[linear-gradient(110deg,#d5a560_40%,#ffffff40_50%,#d5a560_60%)]
                bg-[length:200%_100%]
                text-[#080808] text-[10px] tracking-[0.3em] font-semibold uppercase
                px-7 py-4
                flex items-center justify-center gap-5
                shadow-md
                relative z-20
                w-full sm:w-auto
                transition-transform duration-200 ease-out
                animate-[shimmerRight_0.6s_ease-out_forwards]
                hover:animate-[shimmerLeft_0.33s_linear_3]`}
            >
              CONTINUE <span>→</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}