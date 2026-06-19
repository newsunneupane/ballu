"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Cormorant_Garamond, Cormorant_SC } from "next/font/google";
import { FiSearch, FiHeart } from "react-icons/fi";

const cormorantSC = Cormorant_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const Navbar = () => {
  const [isPinned, setIsPinned] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false); // New state for the shrink effect

  useEffect(() => {
    const handleScroll = () => {
      // Pin to the top right after the 32px top bar is scrolled past
      if (window.scrollY > 32) {
        setIsPinned(true);
      } else {
        setIsPinned(false);
      }

      // Wait for a little more scroll (150px) before shrinking
      if (window.scrollY > 150) {
        setIsShrunk(true);
      } else {
        setIsShrunk(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${cormorant.className} bg-black text-[#dbb86b] w-full relative z-50`}>
      
      {/* Top Bar (h-8 = 32px) */}
      <div className="bg-black">
        <div className="max-w-[1400px] font-normal mx-auto px-10 h-6 flex items-center justify-between text-[11px] tracking-[4px] uppercase [font-variant-numeric:lining-nums]">
          <span>TODAY · 22K GOLD ₨ 14,260/G · SILVER ₨ 175/G</span>
          <span>TIHAR ATELIER HOURS · NOW EXTENDED TO 9PM</span>
          <span>WHATSAPP +977 9842 000 000</span>
        </div>
      </div>

      {/* Placeholder spacer element - ensures smooth transition when fixed positioning kicks in */}
      {isPinned && <div className="h-[68px] w-full bg-transparent" />}

      {/* Main Navbar Row */}
      <div 
        className={`
          bg-[#0e0b08] border-b border-[#2b2415] w-full left-0 right-0 transition-all duration-500 ease-in-out
          ${isPinned ? 'fixed top-0 z-50 shadow-xl' : 'relative'}
        `}
      >
        <div 
          className={`max-w-[1400px] mx-auto px-10 flex items-center justify-between transition-all duration-500 ease-in-out
            ${isShrunk ? 'h-[50px]' : 'h-[68px]'}
          `}
        >
          
          {/* Left Links */}
          <div className="flex gap-5 text-[13px] text-[rgb(218,206,183)] tracking-[4px] uppercase">
            <Link
              href="/"
              className="relative text-[13px] tracking-[4px] uppercase text-[rgb(218,206,183)] hover:text-[#d4b77a] active:text-[#b99755] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-[#d4b77a] after:transition-all after:duration-500 hover:after:w-full"
            >
              Atelier
            </Link>
            <Link
              href="/catalogue"
              className="relative text-[13px] tracking-[4px] uppercase text-[rgb(218,206,183)] hover:text-[#d4b77a] active:text-[#b99755] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-[#d4b77a] after:transition-all after:duration-500 hover:after:w-full"
            >
              Catalogue
            </Link>
            <Link
              href="/bespoke"
              className="relative text-[13px] tracking-[4px] uppercase text-[rgb(218,206,183)] hover:text-[#d4b77a] active:text-[#b99755] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-[#d4b77a] after:transition-all after:duration-500 hover:after:w-full"
            >
              Bespoke
            </Link>
          </div>

          {/* Center Brand Identity */}
          <div className="text-center flex flex-row space-x-2 items-baseline">
            <div 
              className={`italic text-[rgb(218,206,183)] leading-none transition-all duration-500 ease-in-out
                ${isShrunk ? 'text-[16px]' : 'text-[18px]'}
              `}
            >
              Ballu
            </div>
            <div 
              className={`${cormorantSC.className} tracking-[0.35em] leading-none [font-variant:small-caps] transition-all duration-500 ease-in-out
                ${isShrunk ? 'text-[15px]' : 'text-[18px]'}
              `}
            >
              JEWELLERS
            </div>
          </div>

          {/* Right Links & Action Utilities */}
          <div className="flex gap-5 text-[13px] text-[rgb(218,206,183)] tracking-[8px]">
            <Link
              href="/bridal"
              className="relative text-[13px] tracking-[4px] uppercase text-[rgb(218,206,183)] hover:text-[#d4b77a] active:text-[#b99755] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-[#d4b77a] after:transition-all after:duration-500 hover:after:w-full"
            >
              Bridal
            </Link>
            <Link
              href="/journal"
              className="relative text-[13px] tracking-[4px] uppercase text-[rgb(218,206,183)] hover:text-[#d4b77a] active:text-[#b99755] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-[#d4b77a] after:transition-all after:duration-500 hover:after:w-full"
            >
              Journal
            </Link>
            <Link
              href="/visit"
              className="relative text-[13px] tracking-[4px] uppercase text-[rgb(218,206,183)] hover:text-[#d4b77a] active:text-[#b99755] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-[#d4b77a] after:transition-all after:duration-500 hover:after:w-full"
            >
              Visit
            </Link>

            <div className="text-[13px] text-[#4e4226]">
              <span>|</span>
            </div>

            <div className="flex items-center gap-6 ml-4">
              <span className="relative inline-flex cursor-pointer group text-[rgb(218,206,183)] hover:text-[#d4b77a] transition-all duration-300">
                <FiSearch size={13} className="transition-all duration-300 group-hover:text-[#d4b77a]" />
                <span className="absolute left-0 -bottom-1 h-px w-0 bg-[#d4b77a] transition-all duration-500 group-hover:w-full" />
              </span>

              <span className="relative inline-flex cursor-pointer group text-[rgb(218,206,183)] hover:text-[#d4b77a] transition-all duration-300">
                <FiHeart size={13} className="transition-all duration-300 group-hover:text-[#d4b77a]" />
                <span className="absolute left-0 -bottom-1 h-px w-0 bg-[#d4b77a] transition-all duration-500 group-hover:w-full" />
              </span>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;