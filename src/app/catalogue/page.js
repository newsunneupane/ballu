'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Cormorant_Garamond, Cormorant_SC, Tenor_Sans } from "next/font/google";

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

const initialProducts = [
  { id: 1, tag: 'HERITAGE', category: 'BRIDAL', type: 'Necklace', material: 'GOLD', title: 'Tilhari Mangalsutra', subTitle: 'तिलहरी मङ्गलसूत्र', karat: 'Gold 22K', weight: '28.40 g', price: '₨ 3,12,000' },
  { id: 2, tag: 'BESTSELLER', category: 'FESTIVE', type: 'Necklace', material: 'GOLD', title: 'Chandra Haar', subTitle: 'चन्द्र हार', karat: 'Gold 22K', weight: '42.00 g', price: '₨ 4,78,000' },
  { id: 3, tag: null, category: 'DAILY WEAR', type: 'Bangles', material: 'SILVER', title: 'Naugedi Bala', subTitle: 'नौगेडी बाला', karat: 'Gold 22K', weight: '18.60 g', price: '₨ 2,08,000' },
  { id: 4, tag: null, category: 'ENGAGEMENT', type: 'Headpiece', material: 'GOLD', title: 'Phuli Sirbandi', subTitle: 'फूली सिर्बन्दी', karat: 'Gold 22K', weight: '12.30 g', price: '₨ 1,38,000' },
  { id: 5, tag: 'NEW', category: 'BRIDAL', type: 'Earrings', material: 'GOLD', title: 'Phool Jhumka', subTitle: 'फूल झुम्का', karat: 'Gold 22K', weight: '18.50 g', price: '₨ 2,25,000' },
];

export default function CataloguePage() {
  const [activeCategories, setActiveCategories] = useState(['ALL']);
  const [activeMaterial, setActiveMaterial] = useState('ALL');
  const [viewMode, setViewMode] = useState('GRID');
  const [isFixed, setIsFixed] = useState(false);
  
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      // Get the absolute position of our navigation gap placeholder relative to the screen view
      const rect = containerRef.current.getBoundingClientRect();
      
      // If the top of our component hits or passes the bottom boundary of your top navbar (80px), lock it.
      if (rect.top <= 80) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // FIX: Delaying the initial calculation by one frame prevents the hydration 
    // mismatch warning if a user refreshes the page while already scrolled down.
    const rafId = requestAnimationFrame(() => {
      handleScroll();
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const categories = ['ALL', 'BRIDAL', 'DAILY WEAR', 'FESTIVE', 'ENGAGEMENT', 'OFFICE', 'GIFT'];
  const materials = ['ALL', 'GOLD', 'SILVER'];

  const handleCategoryClick = (cat) => {
    if (cat === 'ALL') {
      setActiveCategories(['ALL']);
      return;
    }
    let updatedCats = [...activeCategories];
    if (updatedCats.includes('ALL')) {
      updatedCats = updatedCats.filter(c => c !== 'ALL');
    }
    if (updatedCats.includes(cat)) {
      updatedCats = updatedCats.filter(c => c !== cat);
      if (updatedCats.length === 0) updatedCats = ['ALL'];
    } else {
      updatedCats.push(cat);
    }
    setActiveCategories(updatedCats);
  };

  const filteredProducts = initialProducts.filter((product) => {
    const matchesCategory = activeCategories.includes('ALL') || activeCategories.includes(product.category);
    const matchesMaterial = activeMaterial === 'ALL' || product.material === activeMaterial;
    return matchesCategory && matchesMaterial;
  });

  return (
    <div className={`${cormorant.className} min-h-screen bg-[#0f0d0a] text-[#e5e5e0] antialiased`}>
      
      {/* Header Container */}
      <header className="w-full pt-6 relative">
        <div className="px-4 sm:px-6 md:px-16 lg:px-15 pb-4">
          <div className={`${tenorSans.className} text-[10px] tracking-[0.35em] text-[#c9a96e] uppercase mt-2 mb-2`}>
            Atelier · Catalogue
          </div>
          <div className="flex flex-col space-y-1 max-w-4xl">
            <h1 className="antialiased text-[42px] sm:text-[75px] md:text-[90px] font-light leading-[1.1] text-[#fbf7f0] tracking-tight">
              <span className="block">The Drawer.</span>
            </h1>  
          </div>
          <p className="italic pb-5 font-nepali-serif tracking-wide text-[#e2d5c3] opacity-85">
            दराज — सबै गहना
          </p>
        </div>
      </header>

      {/* STATIC HEIGHT GAP RECONCILER
        Locks down a solid 97px placeholder layout space block. 
        When the inside component goes "fixed", this box prevents the main grid from jumping underneath,
        killing the race-condition layout glitch completely.
      */}
      <div 
        ref={containerRef} 
        className="w-full h-[97px] relative"
      >
        {/* Navigation Action Strip */}
        <div 
          className={`w-full bg-[#0f0d0a]/95 backdrop-blur-md pb-4 pt-4 border-b border-[#2b2415] px-4 sm:px-6 md:px-16 lg:px-15 left-0 right-0 ${
            isFixed 
              ? 'fixed top-[80px] z-[49] shadow-2xl' 
              : 'absolute top-0'
          }`}
        >
          <div className="flex flex-col gap-3 max-w-[100vw]">
            {/* Categories - Mobile swipe friendly horizontal container */}
            <div className="flex overflow-x-auto whitespace-nowrap gap-2 items-center no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 py-1">
              {categories.map((cat) => {
                const isSelected = activeCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`${tenorSans.className} inline-block px-3 py-1 text-[8px] hover:-translate-y-[2px] font-small tracking-widest transition-all border rounded-4xl uppercase shrink-0 ${
                      isSelected ? 'border-[#cda274] text-[#c5b89d] bg-[#1a140f]' : 'border-[#2b2415] text-[#8e897e]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Materials & Toggles */}
            <div className="flex items-center justify-between gap-4 w-full">
              <div className="flex gap-4 text-[11px] font-semibold tracking-widest uppercase">
                {materials.map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setActiveMaterial(mat)}
                    className={`${tenorSans.className} pb-0.5 border-b-2 transition-all ${
                      activeMaterial === mat ? 'border-[#cda274] text-[#ebd3b4]' : 'border-transparent text-[#8e897e]'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-[#8e897e]">
                <span className={`${tenorSans.className} opacity-60 hidden sm:block`}>
                  {filteredProducts.length} Pieces
                </span>

                <div className="flex border border-[#2b2415]">
                  <button
                    type="button"
                    onClick={() => setViewMode('GRID')}
                    className={`${tenorSans.className} px-3 py-1.5 text-[10px] tracking-[0.15em] transition-all duration-300 uppercase ${
                      viewMode === 'GRID'
                        ? 'bg-[#cda274] text-black font-semibold'
                        : 'bg-transparent text-[#cda274] hover:bg-[#cda274]/10'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('LIST')}
                    className={`${tenorSans.className} px-3 py-1.5 text-[10px] tracking-[0.15em] transition-all duration-300 uppercase ${
                      viewMode === 'LIST'
                        ? 'bg-[#cda274] text-black font-semibold'
                        : 'bg-transparent text-[#cda274] hover:bg-[#cda274]/10'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="px-4 sm:px-6 md:px-16 lg:px-15 pb-32 mt-6">
        {filteredProducts.length === 0 ? (
          <div className={`${tenorSans.className} col-span-full text-center py-20 text-xs tracking-[4px] uppercase text-[#8e897e]`}>
            No bespoke designs found matching these selections.
          </div>
        ) : viewMode === 'GRID' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/catalogue/${product.id}`}
                className="group relative flex flex-col bg-[#080605] border border-[#2b2415] overflow-hidden transition-all duration-500 ease-out hover:border-[#4a3d24] hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.7)] cursor-pointer"
              >
                <div className="relative aspect-[3/4] w-full">
                  <div className="absolute inset-0 z-10 overflow-hidden border-b border-[#2b2415] transition-transform duration-500 ease-out origin-top group-hover:scale-[1.04]">
                    <div className="absolute inset-0 bg-[#14100c] transition-transform duration-700 ease-out group-hover:scale-110 origin-center"></div>
                  </div>
                  <div className="absolute inset-0 z-20 p-4 pointer-events-none">
                    {product.tag && (
                      <span className={`${tenorSans.className} inline-block bg-[#0e0b08]/90 text-[#ebd3b4] border border-[#2b2415] px-2 py-0.5 text-[9px] tracking-widest font-medium uppercase`}>
                        {product.tag}
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative z-0 px-5 pb-[10px] pt-[23px] bg-[#0b0806]">
                  <h3 className="text-base font-normal text-[#ebd3b4] mb-1">{product.title}</h3>
                  <p className="text-xs text-[#8e897e] mb-4 opacity-80">{product.subTitle}</p>
                  <div className="flex justify-between items-baseline pt-3 border-t border-[#2b2415]">
                    <span className={`${tenorSans.className} text-[10px] text-[#6e695f] tracking-wide`}>
                      {product.karat} • {product.weight}
                    </span>
                    <span className="text-sm text-[#ebd3b4] [font-variant-numeric:lining-nums]">{product.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <div className="min-w-[700px]">
              <div className={`${tenorSans.className} border-b border-[#2b2415] text-[10px] tracking-[0.25em] text-[#6e695f] uppercase grid grid-cols-[64px_2fr_1fr_1fr_1fr_1fr_120px] pb-4 items-center font-medium`}>
                <div></div>
                <div className="pl-4">Piece</div>
                <div>Category</div>
                <div>Purity</div>
                <div>Weight</div>
                <div>Price</div>
                <div></div>
              </div>
              
              <div className="divide-y divide-[#1f1a10]">
                {filteredProducts.map((product) => (
                  <Link 
                    key={product.id} 
                    href={`/catalogue/${product.id}`}
                    className="group grid grid-cols-[64px_2fr_1fr_1fr_1fr_1fr_120px] items-center py-4 hover:bg-[#120e0a]/40 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="w-12 h-12 bg-gradient-to-br from-[#423722] to-[#1a140f] rounded-sm relative border border-[#2b2415]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(235,211,180,0.15)_0%,transparent_70%)]" />
                      </div>
                    </div>
                    
                    <div className="pl-4">
                      <div className="text-[18px] text-[#ebd3b4] font-normal leading-tight tracking-wide">{product.title}</div>
                      <div className="text-xs font-light text-[#8e897e] mt-1 opacity-80">{product.subTitle}</div>
                    </div>
                    
                    <div className="text-sm font-thin text-[#ebd3b4] opacity-80">
                      {product.type || product.category}
                    </div>
                    
                    <div className="text-sm font-thin text-[#ebd3b4] opacity-80">
                      {product.karat}
                    </div>
                    
                    <div className="text-sm font-light text-[#ebd3b4] opacity-80">
                      {product.weight.toLowerCase()}
                    </div>
                    
                    <div className="text-[20px] text-[#cda274] font-medium tracking-wide">
                      {product.price}
                    </div>
                    
                    <div className="text-right">
                      <span className="text-[10px] group/inner tracking-[0.2em] uppercase text-[#cda274] transition-colors flex items-center justify-end gap-1.5 mr-4 ml-auto">
                        View <span className='group-hover/inner:translate-x-2 transition-transform duration-200'>→</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}