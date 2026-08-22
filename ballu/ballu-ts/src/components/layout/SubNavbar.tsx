'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { collectionSlugMap } from '@/data/collections';
import { productService } from '@/services/product-service';

interface SubNavItem {
  label: string;
  href: string;
}

function buildNavItems(): SubNavItem[] {
  const products = productService.getAll();
  const materials = productService.getMaterialsList();
  const collections = productService.getCollectionsList();

  const matCount = new Map<string, number>();
  for (const p of products) matCount.set(p.material, (matCount.get(p.material) || 0) + 1);

  const colCount = new Map<string, number>();
  for (const p of products) {
    for (const c of p.collections) colCount.set(c, (colCount.get(c) || 0) + 1);
  }

  const topMaterials = materials
    .map((m: any) => {
      const label = (m?.name?.en || '').trim();
      return { label, count: matCount.get(label.toUpperCase()) || 0 };
    })
    .filter((m) => m.label)
    .sort((a, b) => b.count - a.count)
    .slice(0, 2)
    .map((m) => ({ label: m.label, href: `/catalogue?material=${encodeURIComponent(m.label)}` }));

  const topCollections = collections
    .map((c: any) => {
      const label = (c?.name?.en || '').trim();
      return { label, upper: label.toUpperCase(), count: colCount.get(label.toUpperCase()) || 0 };
    })
    .filter((c) => c.label)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)
    .map((c) => ({
      label: c.label,
      href: `/${collectionSlugMap[c.upper] || collectionSlugMap[c.label] || c.label.toLowerCase().replace(/\s+/g, '-')}`,
    }));

  return [
    { label: 'All Collections', href: '/catalogue' },
    ...topMaterials,
    ...topCollections,
    { label: 'More', href: '/catalogue' },
  ];
}

export default function SubNavbar() {
  const [navItems, setNavItems] = useState<SubNavItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    productService.ensureLoaded().then(() => {
      if (!cancelled) setNavItems(buildNavItems());
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <nav className="subnav hidden md:flex w-full items-stretch justify-center bg-bj-bg-secondary/90 backdrop-blur-sm px-10">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="subnav-link flex items-center px-6 text-[13px] tracking-[0.18em] uppercase font-sans text-bj-text-muted whitespace-nowrap"
        >
          <span className="subnav-link-text">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
