import React from 'react'
import { Cormorant_Garamond, Inter } from 'next/font/google';
import Link from 'next/link';
import { Cormorant_SC } from "next/font/google";


const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],

});
const cormorantSC = Cormorant_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  
});

const Card = () => {
  return (
    <div className="group w-[7.5cm] h-[9cm] slide-in-left slide-in-left-delay overflow-hidden transform transition duration-800 ease-out hover:-translate-y-2.5">
      <div className="h-full bg-[#241f1a]/90 border border-white/5 p-3 my-3 shadow-2xl backdrop-blur-md">
            
            <div className={`${cormorant.variable}  ${cormorantSC.variable} flex text-[#dbb86b] justify-between items-center text-[10px] tracking-[0.2em] uppercase font-thin opacity-90 font-sans mb-3`}>
              <span className="pl-2">PIECE OF THE WEEK</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#dbb86b] animate-infinite-zoom"></span>
            </div>
            
            {/* Image Block (Fixed: Width adjusted so mx-2 leaves an even margin on BOTH sides) */}
            <div className="w-[calc(100%-1rem)] h-[5cm] bg-linear-to-tr from-[#3a3127] to-[#5a4b3b] opacity-80 mb-3 mx-2 rounded-sm transform transition duration-800 ease-out group-hover:scale-110"></div>
            
            {/* Metadata */}
            <div className="space-y-1">
              <h3 className="text-[20px] mx-2 font-normal text-white">Chandra Haar</h3>
              <p className="text-[10px] mx-2 tracking-wider font-sans opacity-50">
                22K · 12 G · Rs. 1,78,000
              </p>
              <div className="pt-1 mx-2">
                <Link 
      href="#view" 
      className={`${cormorant.variable}  ${cormorantSC.variable} view-piece-link inline-flex items-center gap-1 text-[12px] font-thin antialiased tracking-[0.2em] uppercase font-sans font-semibold text-[#dbb86b]`}
    >
      VIEW PIECE    <span className=" ml-2 arrow">→</span>
    </Link>
              </div>
            </div>

          </div>
        </div>
  )
}

export default Card