"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Cormorant_Garamond, Cormorant_SC } from "next/font/google";
import { FiSearch, FiHeart, FiMenu, FiX } from "react-icons/fi";

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
  const [isOpen, setIsOpen] = useState(false); // State for mobile drawer menu

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
      {/* Fixed: Replaced <style jsx global> with a safe standard string injection to eliminate hydration mismatches */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes inlineMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-inline-marquee {
          animation: inlineMarquee 25s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
      
      {/* Top Bar (h-8 = 32px) - Enhanced with marquee text fallback for mobile screens */}
      <div className="bg-black border-b border-[#2b2415]/30 md:border-none">
        <div className="max-w-[1400px] font-normal mx-auto px-4 md:px-10 h-8 md:h-6 flex items-center justify-between text-[11px] tracking-[4px] uppercase [font-variant-numeric:lining-nums] overflow-hidden">
          {/* Desktop Topbar Content Layout */}
          <div className="hidden md:flex items-center justify-between w-full">
            <span>TODAY · 22K GOLD ₨ 14,260/G · SILVER ₨ 175/G</span>
            <span>TIHAR ATELIER HOURS · NOW EXTENDED TO 9PM</span>
            <span>WHATSAPP +977 9842 000 000</span>
          </div>

          {/* Mobile Ticker Content Loop */}
          <div className="flex md:hidden w-full whitespace-nowrap overflow-x-hidden relative">
            <div className="animate-inline-marquee inline-block pl-[100%] flex gap-12 shrink-0">
              <span>TODAY · 22K GOLD ₨ 14,260/G · SILVER ₨ 175/G</span>
              <span>TIHAR ATELIER HOURS · NOW EXTENDED TO 9PM</span>
              <span>WHATSAPP +977 9842 000 000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder spacer element - ensures smooth transition when fixed positioning kicks in */}
      {isPinned && <div className="h-[56px] md:h-[68px] w-full bg-transparent" />}

      {/* Main Navbar Row */}
      <div 
        className={`
          bg-[#0e0b08] border-b border-[#2b2415] w-full left-0 right-0 transition-all duration-500 ease-in-out
          ${isPinned ? 'fixed top-0 z-50 shadow-xl' : 'relative'}
        `}
      >
        <div 
          className={`max-w-[1400px] mx-auto px-4 md:px-10 flex items-center justify-between transition-all duration-500 ease-in-out
            ${isShrunk ? 'h-[50px]' : 'h-[56px] md:h-[68px]'}
          `}
        >
          
          {/* Mobile Hamburger Icon Controller Toggle Menu button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[rgb(218,206,183)] hover:text-[#d4b77a] focus:outline-none transition-colors p-1"
            aria-label="Toggle structural menu layout"
          >
            {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>

          {/* Left Links - Desktop View Only */}
          <div className="hidden md:flex gap-5 text-[13px] text-[rgb(218,206,183)] tracking-[4px] uppercase">
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
                ${isShrunk ? 'text-[15px] md:text-[16px]' : 'text-[17px] md:text-[18px]'}
              `}
            >
              Ballu
            </div>
            <div 
              className={`${cormorantSC.className} tracking-[0.35em] leading-none [font-variant:small-caps] transition-all duration-500 ease-in-out
                ${isShrunk ? 'text-[13px] md:text-[15px]' : 'text-[15px] md:text-[18px]'}
              `}
            >
              JEWELLERS
            </div>
          </div>

          {/* Right Links & Action Utilities */}
          <div className="flex items-center gap-3 md:gap-5 text-[13px] text-[rgb(218,206,183)]">
            {/* Desktop View Right Links Links Container */}
            <div className="hidden md:flex gap-5 tracking-[8px]">
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
            </div>

            <div className="hidden md:block text-[13px] text-[#4e4226]">
              <span>|</span>
            </div>

            {/* Icons Context Area */}
            <div className="flex items-center gap-4 md:gap-6 ml-0 md:ml-4">
              <span className="relative inline-flex cursor-pointer group text-[rgb(218,206,183)] hover:text-[#d4b77a] transition-all duration-300">
                <FiSearch size={14} className="transition-all duration-300 group-hover:text-[#d4b77a]" />
                <span className="absolute left-0 -bottom-1 h-px w-0 bg-[#d4b77a] transition-all duration-500 group-hover:w-full" />
              </span>

              <span className="relative inline-flex cursor-pointer group text-[rgb(218,206,183)] hover:text-[#d4b77a] transition-all duration-300">
                <FiHeart size={14} className="transition-all duration-300 group-hover:text-[#d4b77a]" />
                <span className="absolute left-0 -bottom-1 h-px w-0 bg-[#d4b77a] transition-all duration-500 group-hover:w-full" />
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Overlay Layer */}
      <div 
        className={`md:hidden fixed inset-x-0 bottom-0 bg-[#0e0b08]/98 border-t border-[#2b2415] backdrop-blur-lg transition-all duration-500 ease-in-out overflow-hidden z-40
          ${isOpen ? 'top-[88px] opacity-100 visible' : 'top-[100%] opacity-0 invisible'}
        `}
      >
        <div className="flex flex-col items-center justify-center space-y-6 h-full pb-24 text-[16px] tracking-[6px] uppercase text-[rgb(218,206,183)] px-6">
          <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-[#d4b77a] py-2 transition-all">Atelier</Link>
          <Link href="/catalogue" onClick={() => setIsOpen(false)} className="hover:text-[#d4b77a] py-2 transition-all">Catalogue</Link>
          <Link href="/bespoke" onClick={() => setIsOpen(false)} className="hover:text-[#d4b77a] py-2 transition-all">Bespoke</Link>
          <div className="w-12 h-px bg-[#2b2415] my-2" />
          <Link href="/bridal" onClick={() => setIsOpen(false)} className="hover:text-[#d4b77a] py-2 transition-all">Bridal</Link>
          <Link href="/journal" onClick={() => setIsOpen(false)} className="hover:text-[#d4b77a] py-2 transition-all">Journal</Link>
          <Link href="/visit" onClick={() => setIsOpen(false)} className="hover:text-[#d4b77a] py-2 transition-all">Visit</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;