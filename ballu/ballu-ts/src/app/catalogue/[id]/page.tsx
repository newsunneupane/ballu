"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Cormorant_Garamond, Tenor_Sans } from "next/font/google";
import { productService } from "@/services/product-service";
import { useProductData } from "@/hooks/useProductData";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { categorySlugMap } from "@/data/collections";
import { useCurrency } from "@/hooks/useCurrency";
import { buildWhatsappLink } from "@/lib/utils/whatsapp";
import { recordView } from "@/lib/visitTracking";
import { ArrowRight, ChevronLeft, ChevronRight } from "@/components/shared/Icons";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/shared/ProductCard";

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
  const { format } = useCurrency();
  const [product, setProduct] = useState(productService.getById(id) || productService.getById(Number(id)));
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const images = product?.images?.length ? product.images : [];

  useEffect(() => {
    if (dataReady) {
      setProduct(productService.getById(id) || productService.getById(Number(id)));
    }
  }, [dataReady, id]);

  useEffect(() => {
    setActiveIndex(0);
  }, [id]);

  useEffect(() => {
    if (!product) return;
    recordView({ id: product.id, category: product.category, material: product.material });
    const sessionKey = `bj_viewed_${product.id}`;
    if (sessionStorage.getItem(sessionKey)) return;
    sessionStorage.setItem(sessionKey, '1');
    fetch(`/api/items/${product.id}`, { method: 'POST' }).catch(() => {});
  }, [product?.id]);

  const similarProducts = product
    ? productService.getRecommended({ excludeId: product.id, category: product.category, material: product.material, limit: 4 })
    : [];

  useEffect(() => {
    if (paused || images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [paused, images.length]);

  const goTo = (index: number) => {
    setActiveIndex((index + images.length) % images.length);
  };

  const hasGallery = images.length > 1;

  const categorySlug =
    categorySlugMap[product?.category as keyof typeof categorySlugMap] ||
    (product?.category || "").toLowerCase().replace(/\s+/g, "-");

  if (!dataReady) {
    return (
      <div className="min-h-screen bg-bj-bg text-bj-text-alt flex items-center justify-center p-6">
        <p className={`${tenorSans.className} text-xs tracking-widest text-bj-text-muted uppercase`}>Loading ...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-bj-bg text-bj-text-alt flex flex-col items-center justify-center p-6">
        <h2 className={`${cormorant.className} text-2xl mb-4 text-bj-gold-alt`}>Design Specimen Not Found</h2>
        <p className={`${tenorSans.className} text-xs tracking-widest text-bj-text-muted uppercase`}>
          The requested Catalogue ID ({id || "none"}) does not exist in this drawer.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bj-bg text-bj-text-alt antialiased p-6 md:p-12 lg:p-16 flex justify-center">
      <div className="max-w-[1200px] w-full">
        <nav className={`${tenorSans.className} text-[9px] tracking-[0.3em] uppercase text-breadcrumb mb-8 lg:mb-12 flex flex-wrap gap-2`}>
          <Link href="/" className="hover:text-bj-gold-alt cursor-pointer transition-colors">Home</Link>
          <span>·</span>
          <Link href="/catalogue" className="hover:text-bj-gold-alt cursor-pointer transition-colors">Catalogue</Link>
          <span>·</span>
          <Link href={`/${categorySlug}`} className="hover:text-bj-gold-alt cursor-pointer transition-colors">{product.category}</Link>
          <span>·</span>
          <span>{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-20">
          <div className="w-full bg-bj-bg-elevated p-4 lg:p-6 rounded-sm border border-bj-border-light">
            <div
              className="group relative w-full aspect-[4/5] bg-[radial-gradient(circle_at_35%_40%,_#fbe4b5_0%,_#cda274_25%,_#6e5229_60%,_#2b210a_100%)] overflow-hidden shadow-inner"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="absolute top-[40%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full border border-white/20" />
              <div className="absolute top-[40%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-[55%] h-[55%] rounded-full border border-white/10" />
              <div className="absolute top-[40%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full border border-white/5" />

              {images.length > 0 && (
                <div className="absolute inset-0">
                  {images.map((src, i) => (
                    <img
                      key={i}
                      src={cloudinaryUrl(src, { width: 900, aspect: '4:5' })}
                      alt={`${product.title} ${i + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${i === activeIndex ? 'opacity-100' : 'opacity-0'}`}
                    />
                  ))}
                </div>
              )}

              {hasGallery && (
                <>
                  <button
                    onClick={() => goTo(activeIndex - 1)}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-bj-bg-ticker/40 backdrop-blur-md border border-white/10 text-bj-gold-alt flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-bj-bg-ticker/70 transition-opacity z-30 cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => goTo(activeIndex + 1)}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-bj-bg-ticker/40 backdrop-blur-md border border-white/10 text-bj-gold-alt flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-bj-bg-ticker/70 transition-opacity z-30 cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              <div className="absolute top-4 right-4 border border-bj-gold-alt bg-bj-bg-ticker/40 backdrop-blur-md text-bj-gold-alt px-3 py-1.5 flex items-center gap-2">
                <span className="text-[8px]">✦</span>
                <span className={`${tenorSans.className} text-[8px] tracking-[0.25em] uppercase font-semibold`}>
                  Hallmarked 916
                </span>
              </div>

              <div className="absolute bottom-6 left-6 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to image ${i + 1}`}
                    className={`h-[2px] cursor-pointer transition-all duration-500 ${i === activeIndex ? 'w-6 bg-bj-gold-alt' : 'w-4 bg-bj-text-muted/40 hover:bg-bj-text-muted/70'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center py-4">
            <div className={`${tenorSans.className} text-bj-gold-alt text-[9px] tracking-[0.3em] uppercase mb-5 flex items-center gap-3`}>
              <span>CATALOGUE · {product.tag || "COLLECTION"}</span>
              {!product.isAvailable && (
                <span className="text-red-400 border border-red-400/30 rounded px-2 py-0.5">Unavailable - Need to Order</span>
              )}
            </div>

            <h1 className={`${cormorant.className} text-4xl lg:text-5xl leading-none text-bj-text-heading mb-2 font-light tracking-wide`}>
              {product.title}
            </h1>

            <p className="text-bj-text-gold opacity-80 text-[17px] italic mb-8 font-serif tracking-wide">
              {product.subTitle}
            </p>

            <div className="flex items-baseline gap-4 mb-8">
              <span className={`${cormorant.className} text-4xl lg:text-[40px] text-bj-gold-alt tracking-wide`}>
                {product.showPrice ? (product.priceNpr != null ? format(product.priceNpr) : '—') : 'Price on Request'}
              </span>
              {product.showPrice && (
                <span className={`${tenorSans.className} text-[9px] tracking-[0.2em] text-bj-text-muted uppercase`}>
                  Incl. Making
                </span>
              )}
            </div>

            {product.estimatedMakingDays?.min != null && (
              <div className={`${tenorSans.className} inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-bj-gold-alt border border-bj-border rounded-full px-3 py-1.5 mb-8 w-fit`}>
                Ready in {product.estimatedMakingDays.min}
                {product.estimatedMakingDays.max != null && product.estimatedMakingDays.max !== product.estimatedMakingDays.min
                  ? `–${product.estimatedMakingDays.max}`
                  : ''} days
              </div>
            )}

            {product.description && (
              <p className={`${tenorSans.className} text-[13px] text-bj-text-description leading-[1.8] mb-10 pr-4`}>
                {product.description}
              </p>
            )}

            <div className="w-full h-px bg-bj-border mb-8" />

            {product.showPrice && product.pricing && (
              <>
                <div className="mb-10">
                  <h3 className={`${tenorSans.className} text-[9px] tracking-[0.3em] uppercase text-bj-text-muted mb-6`}>
                    Transparent Pricing
                  </h3>

                  <div className={`${tenorSans.className} flex flex-col gap-3 text-[12px] text-bj-text-description mb-5`}>
                    <div className="flex justify-between">
                      <span>Gold value ({product.purity} - {product.weight} @ {format(product.pricing.ratePerGramNpr)}/g)</span>
                      <span className={`${cormorant.className} text-[15px] italic text-bj-text-alt`}>{format(product.pricing.goldValueNpr)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wastage ({product.pricing.wastagePercent}%)</span>
                      <span className={`${cormorant.className} text-[15px] italic text-bj-text-alt`}>{format(product.pricing.wastageNpr)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Making charges</span>
                      <span className={`${cormorant.className} text-[15px] italic text-bj-text-alt`}>{format(product.pricing.makingNpr)}</span>
                    </div>
                    {product.pricing.accessoriesNpr > 0 && (
                      <div className="flex justify-between">
                        <span>Accessories charge</span>
                        <span className={`${cormorant.className} text-[15px] italic text-bj-text-alt`}>{format(product.pricing.accessoriesNpr)}</span>
                      </div>
                    )}
                    {product.pricing.discountNpr > 0 && (
                      <div className="flex justify-between">
                        <span>Less: boutique deduction</span>
                        <span className={`${cormorant.className} text-[15px] italic text-bj-text-alt`}>− {format(product.pricing.discountNpr)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-5 border-t border-bj-border">
                    <span className={`${tenorSans.className} text-[12px] text-bj-gold-alt`}>Total</span>
                    <span className={`${cormorant.className} text-xl text-bj-gold-alt`}>{product.priceNpr != null ? format(product.priceNpr) : '—'}</span>
                  </div>
                </div>

                <div className="w-full h-px bg-bj-border mb-8" />
              </>
            )}

            <div className={`grid gap-4 mb-10 ${product.caratWeight ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' : 'grid-cols-4'}`}>
              <div>
                <div className={`${tenorSans.className} text-[8px] tracking-[0.25em] uppercase text-bj-text-muted mb-2`}>Purity</div>
                <div className={`${cormorant.className} text-[17px] text-bj-text-alt`}>{product.purity || product.karat}</div>
              </div>
              <div>
                <div className={`${tenorSans.className} text-[8px] tracking-[0.25em] uppercase text-bj-text-muted mb-2`}>Weight</div>
                <div className={`${cormorant.className} text-[17px] text-bj-text-alt`}>{product.weight}</div>
              </div>
              {product.caratWeight ? (
                <div>
                  <div className={`${tenorSans.className} text-[8px] tracking-[0.25em] uppercase text-bj-text-muted mb-2`}>Carat</div>
                  <div className={`${cormorant.className} text-[17px] text-bj-text-alt`}>{product.caratWeight}ct</div>
                </div>
              ) : null}
              <div>
                <div className={`${tenorSans.className} text-[8px] tracking-[0.25em] uppercase text-bj-text-muted mb-2`}>Stones</div>
                <div className={`${cormorant.className} text-[17px] text-bj-text-alt`}>{product.stones || 'None'}</div>
              </div>
              <div>
                <div className={`${tenorSans.className} text-[8px] tracking-[0.25em] uppercase text-bj-text-muted mb-2`}>Karigar</div>
                <div className={`${cormorant.className} text-[17px] text-bj-text-alt`}>{product.karigar || '—'}</div>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_minmax(120px,auto)] gap-4">
              <Button variant="primary" size="lg" className="w-full py-4 justify-center">
                Reserve To View
              </Button>
              <a
                href={buildWhatsappLink(product, product.showPrice && product.priceNpr != null ? format(product.priceNpr) : null)}
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

        {similarProducts.length > 0 && (
          <div className="mt-24 lg:mt-32">
            <h2 className={`${tenorSans.className} text-[9px] tracking-[0.3em] uppercase text-bj-text-muted mb-6`}>
              Similar Pieces
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} viewMode="GRID" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
