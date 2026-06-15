"use client";

import Link from "next/link";
import React from "react";
import { Cormorant_Garamond } from "next/font/google";
import { FiSearch, FiHeart,  } from "react-icons/fi";
import { Cormorant_SC } from "next/font/google";

const cormorantSC = Cormorant_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const Navbar = () => {
  return (
    <nav className={`${cormorant.className} bg-black text-[#dbb86b]`}>
      {/* Top Bar */}
      <div >
        <div className="max-w-[1400px] font-normal mx-auto px-10 h-8 flex items-center justify-between text-[12px] tracking-[4px] uppercase [font-variant-numeric:lining-nums]">
          <span>TODAY · 22K GOLD ₨ 14,260/G · SILVER ₨ 175/G</span>
          <span>TIHAR ATELIER HOURS · NOW EXTENDED TO 9PM</span>
          <span>WHATSAPP +977 9842 000 000</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-[1400px] bg-[#0d0d0d] border-b border-[#2b2415] mx-30px px-10 h-[68px] flex items-center justify-between">
        <div className="flex gap-5 text-[13px] text-[rgb(218,206,183)] tracking-[4px] uppercase">
           <Link
    href="/"
    className="relative text-[13px] tracking-[4px] uppercase text-[rgb(218,206,183)]
hover:text-[#d4b77a]
active:text-[#b99755]
transition-colors duration-300

after:content-['']
after:absolute after:left-0 after:-bottom-1
after:h-[1px] after:w-0 after:bg-[#d4b77a]
after:transition-all after:duration-500

hover:after:w-full"
  >Atelier</Link>
           <Link
    href="/"
    className="relative text-[13px] tracking-[4px] uppercase text-[rgb(218,206,183)]
hover:text-[#d4b77a]
active:text-[#b99755]
transition-colors duration-300

after:content-['']
after:absolute after:left-0 after:-bottom-1
after:h-[1px] after:w-0 after:bg-[#d4b77a]
after:transition-all after:duration-500

hover:after:w-full"
  >Catalogue</Link>
           <Link
    href="/"
    className="relative text-[13px] tracking-[4px] uppercase text-[rgb(218,206,183)]
hover:text-[#d4b77a]
active:text-[#b99755]
transition-colors duration-300

after:content-['']
after:absolute after:left-0 after:-bottom-1
after:h-[1px] after:w-0 after:bg-[#d4b77a]
after:transition-all after:duration-500

hover:after:w-full"
  >Bespoke</Link>
        </div>

        <div className="text-center flex flex-row space-x-2 items-baseline">
  <div className="italic text-[rgb(218,206,183)] text-[18px] leading-none">
    Ballu
  </div>

  <div className={`${cormorantSC.className} tracking-[0.35em] text-[18px] leading-none [font-variant:small-caps]`}>
    JEWELLERS
  </div>
</div>

        <div className="flex gap-5 text-[13px] text-[rgb(218,206,183)] tracking-[8px]">
  <Link
    href="/"
    className="
relative text-[13px] tracking-[4px] uppercase text-[rgb(218,206,183)]
hover:text-[#d4b77a]
active:text-[#b99755]
transition-colors duration-300

after:content-['']
after:absolute after:left-0 after:-bottom-1
after:h-[1px] after:w-0 after:bg-[#d4b77a]
after:transition-all after:duration-500

hover:after:w-full
"
  >
    Bridal
  </Link>

  <Link
    href="/"
    className="relative text-[13px] tracking-[4px] uppercase text-[rgb(218,206,183)]
hover:text-[#d4b77a]
active:text-[#b99755]
transition-colors duration-300

after:content-['']
after:absolute after:left-0 after:-bottom-1
after:h-[1px] after:w-0 after:bg-[#d4b77a]
after:transition-all after:duration-500

hover:after:w-full"
  >
    Journal
  </Link>

  <Link
    href="/"
    className="relative text-[13px] tracking-[4px] uppercase text-[rgb(218,206,183)]
hover:text-[#d4b77a]
active:text-[#b99755]
transition-colors duration-300

after:content-['']
after:absolute after:left-0 after:-bottom-1
after:h-[1px] after:w-0 after:bg-[#d4b77a]
after:transition-all after:duration-500

hover:after:w-full"
  >
    Visit
  </Link>

  <div className="text-[13px]  text-[#4e4226] ">
    <span>
      |
    </span>
  </div>

  <div className="flex items-center gap-6 ml-4">
  <span className="relative inline-flex cursor-pointer group text-[rgb(218,206,183)] hover:text-[#d4b77a] transition-all duration-300">
  <FiSearch
    size={13}
    className="transition-all duration-300 group-hover:text-[#d4b77a]"
  />

  <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-[#d4b77a] transition-all duration-500 group-hover:w-full" />
</span>

    <span className="relative inline-flex cursor-pointer group text-[rgb(218,206,183)] hover:text-[#d4b77a] transition-all duration-300">
  <FiHeart
    size={13}
    className="transition-all duration-300 group-hover:text-[#d4b77a]"
  />

  <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-[#d4b77a] transition-all duration-500 group-hover:w-full" />
</span>

    
  </div>
</div>
      </div>
    </nav>
  );
};

export default Navbar;