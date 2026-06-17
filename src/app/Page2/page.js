'use client'; // Required since we use useState for filters

import React, { useState } from 'react';

const initialProducts = [
  { id: 1, tag: 'HERITAGE', title: 'Tilhari Mangalsutra', subTitle: 'तिलहरी मङ्गलसूत्र', karat: '22K', weight: '26.40 G', price: 'Rs 3,12,000' },
  { id: 2, tag: 'BESTSELLER', title: 'Chandra Haar', subTitle: 'चन्द्र हार', karat: '22K', weight: '42.00 G', price: 'Rs 4,78,000' },
  { id: 3, tag: null, title: 'Naugedi Bala', subTitle: 'नौगेडी बाला', karat: '22K', weight: '16.80 G', price: 'Rs 2,08,000' },
  { id: 4, tag: null, title: 'Phuli Sirbandi', subTitle: 'फूली सिर्बन्दी', karat: '22K', weight: '12.30 G', price: 'Rs 1,38,000' },
];

export default function page() {
  const [activeCategory, setActiveCategory] = useState('BRIDAL');
  const [activeMaterial, setActiveMaterial] = useState('ALL');
  const [viewMode, setViewMode] = useState('GRID');

  const categories = ['ALL', 'BRIDAL', 'DAILY WEAR', 'FESTIVE', 'ENGAGEMENT', 'OFFICE', 'GIFT'];
  const materials = ['ALL', 'GOLD', 'SILVER'];

  return (
    <div className="min-h-screen bg-[#0e0d0b] text-[#e5e5e0] font-sans antialiased px-6 py-12 md:px-16 lg:px-24">
      <header className="mb-12 border-b border-[#262421] pb-8">
        <h1 className="text-5xl md:text-6xl font-serif text-[#ebd3b4] tracking-wide mb-2">The Drawer.</h1>
        <p className="text-sm font-light text-[#a39e93] tracking-widest italic mb-8">दराज — सबै गहना</p>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-widest transition-all border 
                ${activeCategory === cat ? 'border-[#cda274] text-[#ebd3b4]' : 'border-[#262421] text-[#8e897e]'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
          <div className="flex gap-6 text-xs font-semibold tracking-widest">
            {materials.map((mat) => (
              <button
                key={mat}
                onClick={() => setActiveMaterial(mat)}
                className={`pb-1 border-b-2 ${activeMaterial === mat ? 'border-[#cda274] text-[#ebd3b4]' : 'border-transparent text-[#8e897e]'}`}
              >
                {mat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Grid */}
      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {initialProducts.map((product) => (
          <div key={product.id} className="group flex flex-col bg-[#171513] border border-[#262421] overflow-hidden">
            <div className="relative aspect-[3/4] w-full bg-[#201d1a] p-4">
              {product.tag && (
                <span className="bg-[#11100f]/80 text-[#ebd3b4] border border-[#3a352e] px-2 py-0.5 text-[9px] tracking-widest font-medium uppercase">
                  {product.tag}
                </span>
              )}
            </div>
            <div className="p-5 bg-[#141210] border-t border-[#262421]">
              <h3 className="text-base font-serif text-[#ebd3b4] mb-1">{product.title}</h3>
              <p className="text-xs text-[#8e897e] mb-4">{product.subTitle}</p>
              <div className="flex justify-between items-baseline pt-3 border-t border-[#1f1d1a]">
                <span className="text-[10px] text-[#6e695f] font-mono">{product.karat} • {product.weight}</span>
                <span className="text-sm font-serif text-[#ebd3b4]">{product.price}</span>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}