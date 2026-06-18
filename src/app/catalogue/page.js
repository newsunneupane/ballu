'use client';

import React, { useState } from 'react';
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

const star = (p = {}) => (
  <svg viewBox="0 0 24 24" width={p.size||14} height={p.size||14} fill={p.fill||'currentColor'} stroke="none"><path d="m12 2 2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.5L6 22l1.5-7.2L2 10l7.1-1.1L12 2Z"/></svg>
);

const initialProducts = [
  { id: 1, tag: 'HERITAGE', category: 'BRIDAL', type: 'Necklace', material: 'GOLD', title: 'Tilhari Mangalsutra', subTitle: 'तिलहरी मङ्गलसूत्र', karat: 'Gold 22K', weight: '28.40 g', price: 'Rs 3,12,000' },
  { id: 2, tag: 'BESTSELLER', category: 'FESTIVE', type: 'Necklace', material: 'GOLD', title: 'Chandra Haar', subTitle: 'चन्द्र हार', karat: 'Gold 22K', weight: '42.00 g', price: 'Rs 4,78,000' },
  { id: 3, tag: null, category: 'DAILY WEAR', type: 'Bangles', material: 'SILVER', title: 'Naugedi Bala', subTitle: 'नौगेडी बाला', karat: 'Gold 22K', weight: '18.60 g', price: 'Rs 2,08,000' },
  { id: 4, tag: null, category: 'ENGAGEMENT', type: 'Headpiece', material: 'GOLD', title: 'Phuli Sirbandi', subTitle: 'फूली सिर्बन्दी', karat: 'Gold 22K', weight: '12.30 g', price: 'Rs 1,38,000' },
  { id: 5, tag: 'NEW', category: 'BRIDAL', type: 'Earrings', material: 'GOLD', title: 'Phool Jhumka', subTitle: 'फूल झुम्का', karat: 'Gold 22K', weight: '18.50 g', price: 'Rs 2,25,000' },
];

export default function CataloguePage() {
  const [activeCategories, setActiveCategories] = useState(['ALL']);
  const [activeMaterial, setActiveMaterial] = useState('ALL');
  const [viewMode, setViewMode] = useState('GRID');

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
    const matchesCategory = 
      activeCategories.includes('ALL') || 
      activeCategories.includes(product.category);

    const matchesMaterial = 
      activeMaterial === 'ALL' || 
      product.material === activeMaterial;

    return matchesCategory && matchesMaterial;
  });

  return (
    <div className={`${cormorant.className} min-h-screen bg-[#0e0b08] text-[#e5e5e0] antialiased px-6 py-12 md:px-16 lg:px-15`}>
      <header className="mb-12 border-b border-[#2b2415] pb-8">
      
        <div className={`${tenorSans.className} text-[10px] tracking-[0.35em] text-[#c9a96e] uppercase`}>
          Atelier · Catalogue
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-8">
          <div className="flex flex-col space-y-3 max-w-4xl"> 
            <h1 className="antialiased text-[90px] font-light leading-[1.1] text-[#fbf7f0] tracking-tight">
              <span className="block fade-in-up" style={{ animationDelay: '0ms' }}>
                The Drawer.
              </span>
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => {
            const isSelected = activeCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`${tenorSans.className} px-4 py-1.5 text-[10px] hover:-translate-y-[2px] transition-transform duration-200 font-medium tracking-widest transition-all border uppercase ${
                  isSelected ? 'border-[#cda274] text-[#ebd3b4] bg-[#1a140f]' : 'border-[#2b2415] text-[#8e897e]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4 pt-4">
          <div className="flex gap-6 text-[11px] font-semibold tracking-widest uppercase">
            {materials.map((mat) => (
              <button
                key={mat}
                onClick={() => setActiveMaterial(mat)}
                className={`${tenorSans.className} pb-1 border-b-2 transition-all ${
                  activeMaterial === mat ? 'border-[#cda274] text-[#ebd3b4]' : 'border-transparent text-[#8e897e]'
                }`}
              >
                {mat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6 text-[11px] tracking-[0.2em] uppercase text-[#8e897e]">
            <span className={`${tenorSans.className} opacity-60`}>
              {filteredProducts.length} Pieces
            </span>
            
            <div className="flex">
              <button 
                type="button"
                onClick={() => setViewMode('GRID')}
                className={`${tenorSans.className} px-4 py-1.5 text-[10px] tracking-[0.15em] transition-all duration-300 uppercase ${
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
                className={`${tenorSans.className} px-4 py-1.5 text-[10px] tracking-[0.15em] transition-all duration-300 uppercase ${
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
      </header>

      <main>
        {filteredProducts.length === 0 ? (
          <div className={`${tenorSans.className} col-span-full text-center py-20 text-xs tracking-[4px] uppercase text-[#8e897e]`}>
            No bespoke designs found matching these selections.
          </div>
        ) : viewMode === 'GRID' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group relative flex flex-col bg-[#080605] border border-[#2b2415] overflow-hidden transition-all duration-500 ease-out hover:border-[#4a3d24] hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.7)]"
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

              </div>
            ))}

          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            
            <table className="w-full border-collapse text-left min-w-[700px]">
              <thead>
                <tr className={`${tenorSans.className} border-b border-[#2b2415] text-[10px] tracking-[0.25em] text-[#6e695f] uppercase`}>
                  <th className="pb-4 font-medium w-16"></th>
                  <th className="pb-4 font-medium pl-4">Piece</th>
                  <th className="pb-4 font-medium">Category</th>
                  <th className="pb-4 font-medium">Purity</th>
                  <th className="pb-4 font-medium">Weight</th>
                  <th className="pb-4 font-medium">Price</th>
                  <th className="pb-4 font-medium w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1a10]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-[#120e0a]/40 transition-colors">
                    <td className="py-4 align-middle">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#423722] to-[#1a140f] rounded-sm relative border border-[#2b2415]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(235,211,180,0.15)_0%,transparent_70%)]" />
                      </div>
                    </td>
                    <td className="py-4 pl-4 align-middle">
                      <div className="text-[16px] text-[#ebd3b4] font-normal leading-tight tracking-wide">{product.title}</div>
                      <div className="text-xs text-[#8e897e] mt-1 opacity-80">{product.subTitle}</div>
                    </td>
                    <td className={`${tenorSans.className} py-4 text-xs text-[#ebd3b4] opacity-80 align-middle`}>
                      {product.type || product.category}
                    </td>
                    
                    <td className={`${tenorSans.className} py-4 text-xs text-[#ebd3b4] opacity-80 align-middle`}>
                      {product.karat}
                    </td>
                    <td className={`${tenorSans.className} py-4 text-xs text-[#ebd3b4] opacity-80 align-middle`}>
                      {product.weight.toLowerCase()}
                    </td>
                    
                    <td className="py-4 text-[15px] text-[#ebd3b4] font-medium tracking-wide [font-variant-numeric:lining-nums] align-middle">
                      {product.price}
                    </td>
                    <td className="py-4 text-right align-middle">
                      <button className={`${tenorSans.className} text-[10px] tracking-[0.2em] uppercase text-[#8e897e] group-hover:text-[#cda274] transition-colors flex items-center justify-end gap-1.5 ml-auto`}>
                        View <span>→</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}
      </main>
    </div>
  );
}