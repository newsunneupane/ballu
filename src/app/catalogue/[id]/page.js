"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Cormorant_Garamond, Tenor_Sans } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const tenorSans = Tenor_Sans({
  subsets: ["latin"],
  weight: ["400"],
});

// Mock database mapping IDs directly to their custom technical specifications and granular pricing breakdowns
const productsDatabase = {
  "1": {
    title: "Tilhari Mangalsutra",
    subTitle: "तिलहरी मङ्गलसूत्र",
    tag: "HERITAGE",
    category: "BRIDAL",
    price: "₨ 3,12,000",
    description: "A profound heritage wedding piece featuring handcrafted gold cylinders strung intricately on traditional red pom-pom threads.",
    purity: "22K",
    weight: "28.40 g",
    stones: "None",
    karigar: "Bench N°3",
    pricing: {
      goldValue: "Rs 4,05,000",
      wastage: "Rs 32,400",
      making: "Rs 25,000",
      discount: "− Rs 1,50,400"
    }
  },
  "2": {
    title: "Chandra Haar",
    subTitle: "चन्द्र हार",
    tag: "BESTSELLER",
    category: "FESTIVE",
    price: "₨ 4,78,000",
    description: "A graduated crescent-link haar with floral mango motifs. Elegant structural symmetry tailored perfectly for heirloom collections.",
    purity: "22K",
    weight: "42.00 g",
    stones: "None",
    karigar: "Bench N°1",
    pricing: {
      goldValue: "Rs 5,98,920",
      wastage: "Rs 47,914",
      making: "Rs 38,000",
      discount: "− Rs 2,08,834"
    }
  },
  "3": {
    title: "Naugedi Bala",
    subTitle: "नौगेडी बाला",
    tag: "DAILY WEAR",
    category: "DAILY WEAR",
    price: "₨ 2,08,000",
    description: "Classic nine-bead statement bangles forged smoothly for everyday understated luxury, accentuating contemporary standard cuts.",
    purity: "22K",
    weight: "18.60 g",
    stones: "None",
    karigar: "Bench N°7",
    pricing: {
      goldValue: "Rs 2,65,236",
      wastage: "Rs 21,218",
      making: "Rs 18,000",
      discount: "− Rs 96,454"
    }
  },
  "4": {
    title: "Phuli Sirbandi",
    subTitle: "फूली सिर्बन्दी",
    tag: "ENGAGEMENT",
    category: "ENGAGEMENT",
    price: "₨ 1,38,000",
    description: "An ethereal multi-tiered traditional forehead ornament, explicitly tuned with floral engravings for signature bridal aesthetics.",
    purity: "22K",
    weight: "12.30 g",
    stones: "None",
    karigar: "Bench N°2",
    pricing: {
      goldValue: "Rs 1,75,400",
      wastage: "Rs 14,032",
      making: "Rs 12,500",
      discount: "− Rs 63,932"
    }
  },
  "5": {
    title: "Phool Jhumka",
    subTitle: "फूल झुम्का",
    tag: "NEW",
    category: "BRIDAL",
    price: "₨ 2,25,000",
    description: "Delicately tiered statement bell drop earrings showcasing intricate filigree flower steps along elegant cascading design rings.",
    purity: "22K",
    weight: "18.50 g",
    stones: "None",
    karigar: "Bench N°4",
    pricing: {
      goldValue: "Rs 2,63,810",
      wastage: "Rs 21,104",
      making: "Rs 22,000",
      discount: "− Rs 81,914"
    }
  }
};

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id;

  // Query database matching the string id. Fall back gracefully if item route breaks.
  const product = productsDatabase[id];

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0806] text-[#e5e5e0] flex flex-col items-center justify-center p-6">
        <h2 className={`${cormorant.className} text-2xl mb-4 text-[#cda274]`}>Design Specimen Not Found</h2>
        <p className={`${tenorSans.className} text-xs tracking-widest text-[#8e897e] uppercase`}>
          The requested archive ID ({id || "none"}) does not exist in this drawer.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0806] text-[#e5e5e0] antialiased p-6 md:p-12 lg:p-16 flex justify-center">
      <div className="max-w-[1200px] w-full">
        
        {/* Breadcrumb Navigation */}
        <nav className={`${tenorSans.className} text-[9px] tracking-[0.3em] uppercase text-[#8e897e] mb-8 lg:mb-12 flex flex-wrap gap-2`}>
          <Link 
    href="/catalogue" 
    className="hover:text-[#cda274] cursor-pointer transition-colors"
  >
    Catalogue
  </Link>
          <span>·</span>
          <span className="hover:text-[#cda274] cursor-pointer transition-colors">{product.category}</span>
          <span>·</span>
          <span className="text-[#cda274]">{product.title}</span>
        </nav>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-20">
          
          {/* Left Column: Image Area */}
          <div className="w-full bg-[#110e0b] p-4 lg:p-6 rounded-sm border border-[#1f1a10]">
            <div className="relative w-full aspect-[4/5] bg-[radial-gradient(circle_at_35%_40%,_#fbe4b5_0%,_#cda274_25%,_#6e5229_60%,_#2b210a_100%)] overflow-hidden shadow-inner">
              
              {/* Concentric Circles Effect */}
              <div className="absolute top-[40%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full border border-white/20"></div>
              <div className="absolute top-[40%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-[55%] h-[55%] rounded-full border border-white/10"></div>
              <div className="absolute top-[40%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full border border-white/5"></div>

              {/* Hallmarked Badge */}
              <div className="absolute top-4 right-4 border border-[#cda274] bg-[#000000]/40 backdrop-blur-md text-[#cda274] px-3 py-1.5 flex items-center gap-2">
                <span className="text-[8px]">✦</span>
                <span className={`${tenorSans.className} text-[8px] tracking-[0.25em] uppercase font-semibold`}>
                  Hallmarked 916
                </span>
              </div>

              {/* Carousel Indicators */}
              <div className="absolute bottom-6 left-6 flex gap-1.5">
                <div className="w-6 h-[2px] bg-[#cda274]"></div>
                <div className="w-6 h-[2px] bg-[#8e897e]/40"></div>
                <div className="w-6 h-[2px] bg-[#8e897e]/40"></div>
                <div className="w-6 h-[2px] bg-[#8e897e]/40"></div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Content Loading */}
          <div className="flex flex-col justify-center py-4">
            
            <div className={`${tenorSans.className} text-[#cda274] text-[9px] tracking-[0.3em] uppercase mb-5`}>
              Atelier Archive · {product.tag || "COLLECTION"}
            </div>
            
            <h1 className={`${cormorant.className} text-4xl lg:text-5xl leading-none text-[#fbf7f0] mb-2 font-light tracking-wide`}>
              {product.title}
            </h1>
            
            <p className="text-[#ebd3b4] opacity-80 text-[17px] italic mb-8 font-serif tracking-wide">
              {product.subTitle}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className={`${cormorant.className} text-4xl lg:text-[40px] text-[#cda274] tracking-wide`}>
                {product.price}
              </span>
              <span className={`${tenorSans.className} text-[9px] tracking-[0.2em] text-[#8e897e] uppercase`}>
                Incl. Making
              </span>
            </div>

            {/* Description */}
            <p className={`${tenorSans.className} text-[13px] text-[#a8a397] leading-[1.8] mb-10 pr-4`}>
              {product.description}
            </p>

            <div className="w-full h-px bg-[#2b2415] mb-8"></div>

            {/* Transparent Pricing Section */}
            <div className="mb-10">
              <h3 className={`${tenorSans.className} text-[9px] tracking-[0.3em] uppercase text-[#8e897e] mb-6`}>
                Transparent Pricing
              </h3>
              
              <div className={`${tenorSans.className} flex flex-col gap-3 text-[12px] text-[#a8a397] mb-5`}>
                <div className="flex justify-between">
                  <span>Gold value ({product.purity} - {product.weight} @ Rs14,260/g)</span>
                  <span className={`${cormorant.className} text-[15px] italic text-[#e5e5e0]`}>{product.pricing.goldValue}</span>
                </div>
                <div className="flex justify-between">
                  <span>Wastage (8%)</span>
                  <span className={`${cormorant.className} text-[15px] italic text-[#e5e5e0]`}>{product.pricing.wastage}</span>
                </div>
                <div className="flex justify-between">
                  <span>Making charges</span>
                  <span className={`${cormorant.className} text-[15px] italic text-[#e5e5e0]`}>{product.pricing.making}</span>
                </div>
                <div className="flex justify-between">
                  <span>Less: boutique deduction</span>
                  <span className={`${cormorant.className} text-[15px] italic text-[#e5e5e0]`}>{product.pricing.discount}</span>
                </div>
              </div>

              {/* Total Row */}
              <div className="flex justify-between pt-5 border-t border-[#2b2415]">
                <span className={`${tenorSans.className} text-[12px] text-[#cda274]`}>Total</span>
                <span className={`${cormorant.className} text-xl text-[#cda274]`}>{product.price}</span>
              </div>
            </div>

            <div className="w-full h-px bg-[#2b2415] mb-8"></div>

            {/* Specs Grid */}
            <div className="grid grid-cols-4 gap-4 mb-10">
              <div>
                <div className={`${tenorSans.className} text-[8px] tracking-[0.25em] uppercase text-[#8e897e] mb-2`}>Purity</div>
                <div className={`${cormorant.className} text-[17px] text-[#e5e5e0]`}>{product.purity}</div>
              </div>
              <div>
                <div className={`${tenorSans.className} text-[8px] tracking-[0.25em] uppercase text-[#8e897e] mb-2`}>Weight</div>
                <div className={`${cormorant.className} text-[17px] text-[#e5e5e0]`}>{product.weight}</div>
              </div>
              <div>
                <div className={`${tenorSans.className} text-[8px] tracking-[0.25em] uppercase text-[#8e897e] mb-2`}>Stones</div>
                <div className={`${cormorant.className} text-[17px] text-[#e5e5e0]`}>{product.stones}</div>
              </div>
              <div>
                <div className={`${tenorSans.className} text-[8px] tracking-[0.25em] uppercase text-[#8e897e] mb-2`}>Karigar</div>
                <div className={`${cormorant.className} text-[17px] text-[#e5e5e0]`}>{product.karigar}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-[1fr_minmax(120px,auto)] gap-4">
              <button className={`${tenorSans.className} bg-[#cda274] hover:bg-[#dfb689] text-[#0a0806] text-[10px] tracking-[0.3em] uppercase py-4 font-semibold transition-colors duration-300 w-full`}>
                Reserve To View
              </button>
              <button className={`${tenorSans.className} border border-[#cda274] text-[#cda274] hover:bg-[#cda274]/10 text-[10px] tracking-[0.3em] uppercase py-4 px-8 transition-colors duration-300`}>
                Whatsapp
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}