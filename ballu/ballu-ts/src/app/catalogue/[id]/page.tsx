"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Cormorant_Garamond, Tenor_Sans } from "next/font/google";
import { productService } from "@/services/product-service";
import { useProductData } from "@/hooks/useProductData";
import { WHATSAPP_URL } from "@/lib/constants";
import { ArrowRight } from "@/components/shared/Icons";
import Button from "@/components/ui/Button";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const tenorSans = Tenor_Sans({
  subsets: ["latin"],
  weight: ["400"],
});

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id as string;
  const dataReady = useProductData();
  const [product, setProduct] = useState(productService.getById(id) || productService.getById(Number(id)));

  useEffect(() => {
    if (dataReady) {
      setProduct(productService.getById(id) || productService.getById(Number(id)));
    }
  }, [dataReady, id]);

  if (!dataReady) {
    return (
      <div className="min-h-screen bg-[#0a0806] text-[#e5e5e0] flex items-center justify-center p-6">
        <p className={`${tenorSans.className} text-xs tracking-widest text-[#8e897e] uppercase`}>Loading ...</p>
      </div>
    );
  }

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
        <nav className={`${tenorSans.className} text-[9px] tracking-[0.3em] uppercase text-[#8e897e] mb-8 lg:mb-12 flex flex-wrap gap-2`}>
          <Link href="/" className="hover:text-[#cda274] cursor-pointer transition-colors">Home</Link>
          <span>·</span>
          <Link href="/catalogue" className="hover:text-[#cda274] cursor-pointer transition-colors">Catalogue</Link>
          <span>·</span>
          <span className="hover:text-[#cda274] cursor-pointer transition-colors">{product.category}</span>
          <span>·</span>
          <span className="text-[#cda274]">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-20">
          <div className="w-full bg-[#110e0b] p-4 lg:p-6 rounded-sm border border-[#1f1a10]">
            <div className="relative w-full aspect-[4/5] bg-[radial-gradient(circle_at_35%_40%,_#fbe4b5_0%,_#cda274_25%,_#6e5229_60%,_#2b210a_100%)] overflow-hidden shadow-inner">
              <div className="absolute top-[40%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full border border-white/20" />
              <div className="absolute top-[40%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-[55%] h-[55%] rounded-full border border-white/10" />
              <div className="absolute top-[40%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full border border-white/5" />

              <div className="absolute top-4 right-4 border border-[#cda274] bg-[#000000]/40 backdrop-blur-md text-[#cda274] px-3 py-1.5 flex items-center gap-2">
                <span className="text-[8px]">✦</span>
                <span className={`${tenorSans.className} text-[8px] tracking-[0.25em] uppercase font-semibold`}>
                  Hallmarked 916
                </span>
              </div>

              <div className="absolute bottom-6 left-6 flex gap-1.5">
                <div className="w-6 h-[2px] bg-[#cda274]" />
                <div className="w-6 h-[2px] bg-[#8e897e]/40" />
                <div className="w-6 h-[2px] bg-[#8e897e]/40" />
                <div className="w-6 h-[2px] bg-[#8e897e]/40" />
              </div>
            </div>
          </div>

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

            <div className="flex items-baseline gap-4 mb-8">
              <span className={`${cormorant.className} text-4xl lg:text-[40px] text-[#cda274] tracking-wide`}>
                {product.price}
              </span>
              <span className={`${tenorSans.className} text-[9px] tracking-[0.2em] text-[#8e897e] uppercase`}>
                Incl. Making
              </span>
            </div>

            {product.description && (
              <p className={`${tenorSans.className} text-[13px] text-[#a8a397] leading-[1.8] mb-10 pr-4`}>
                {product.description}
              </p>
            )}

            <div className="w-full h-px bg-[#2b2415] mb-8" />

            {product.pricing && (
              <>
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

                  <div className="flex justify-between pt-5 border-t border-[#2b2415]">
                    <span className={`${tenorSans.className} text-[12px] text-[#cda274]`}>Total</span>
                    <span className={`${cormorant.className} text-xl text-[#cda274]`}>{product.price}</span>
                  </div>
                </div>

                <div className="w-full h-px bg-[#2b2415] mb-8" />
              </>
            )}

            <div className="grid grid-cols-4 gap-4 mb-10">
              <div>
                <div className={`${tenorSans.className} text-[8px] tracking-[0.25em] uppercase text-[#8e897e] mb-2`}>Purity</div>
                <div className={`${cormorant.className} text-[17px] text-[#e5e5e0]`}>{product.purity || product.karat}</div>
              </div>
              <div>
                <div className={`${tenorSans.className} text-[8px] tracking-[0.25em] uppercase text-[#8e897e] mb-2`}>Weight</div>
                <div className={`${cormorant.className} text-[17px] text-[#e5e5e0]`}>{product.weight}</div>
              </div>
              <div>
                <div className={`${tenorSans.className} text-[8px] tracking-[0.25em] uppercase text-[#8e897e] mb-2`}>Stones</div>
                <div className={`${cormorant.className} text-[17px] text-[#e5e5e0]`}>{product.stones || 'None'}</div>
              </div>
              <div>
                <div className={`${tenorSans.className} text-[8px] tracking-[0.25em] uppercase text-[#8e897e] mb-2`}>Karigar</div>
                <div className={`${cormorant.className} text-[17px] text-[#e5e5e0]`}>{product.karigar || '—'}</div>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_minmax(120px,auto)] gap-4">
              <Button variant="primary" size="lg" className="w-full py-4 justify-center">
                Reserve To View
              </Button>
              <a
                href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Hi, I'm interested in ${product.title} (${product.price})`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="w-full py-4 justify-center px-8">
                  Whatsapp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
