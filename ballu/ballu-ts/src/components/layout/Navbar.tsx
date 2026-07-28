'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Cormorant_Garamond, Cormorant_SC } from 'next/font/google';
import { FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { NAV_LINKS, SITE, WHATSAPP_URL } from '@/lib/constants';

const cormorantSC = Cormorant_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

export default function Navbar() {
  const { isPinned, isShrunk } = useScrollPosition();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`${cormorant.className} bg-black text-[#dbb86b] w-full relative z-50`}>
      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker { animation: tickerScroll 40s linear infinite; will-change: transform; backface-visibility: hidden; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <GoldTicker />

      {isPinned && <div className="h-[56px] md:h-[68px] w-full bg-transparent" />}

      <div
        className={`
          bg-[#0e0b08] border-b border-[#2b2415] w-full left-0 right-0 transition-all duration-500 ease-in-out
          ${isPinned ? 'fixed top-0 z-50 shadow-xl' : 'relative'}
        `}
      >
        <div
          className={`max-w-[1400px] mx-auto px-4 md:px-10 flex items-center justify-between transition-all duration-500 ease-in-out ${
            isShrunk ? 'h-[50px]' : 'h-[56px] md:h-[68px]'
          }`}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[rgb(218,206,183)] hover:text-[#d4b77a] focus:outline-none transition-colors p-1"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>

          <DesktopNav links={NAV_LINKS.left} />

          <Logo isShrunk={isShrunk} />

          <div className="flex items-center gap-3 md:gap-5 text-[13px] text-[rgb(218,206,183)]">
            <div className="hidden md:flex gap-5 tracking-[8px]">
              <NavLink href="/bridal">Bridal</NavLink>
              <NavLink href="/journal">Stories</NavLink>
              <NavLink href="/visit">Visit</NavLink>
            </div>

            <div className="hidden md:block text-[13px] text-[#4e4226]">
              <span>|</span>
            </div>

            <div className="flex items-center gap-4 md:gap-6 ml-0 md:ml-4">
              <span className="relative inline-flex cursor-pointer group text-[rgb(218,206,183)] hover:text-[#d4b77a] transition-all duration-300">
                <FiSearch size={14} />
                <span className="absolute left-0 -bottom-1 h-px w-0 bg-[#d4b77a] transition-all duration-500 group-hover:w-full" />
              </span>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex cursor-pointer group text-[rgb(218,206,183)] hover:text-[#d4b77a] transition-all duration-300"
              >
                <FaWhatsapp size={14} />
                <span className="absolute left-0 -bottom-1 h-px w-0 bg-[#d4b77a] transition-all duration-500 group-hover:w-full" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </nav>
  );
}

function GoldTicker() {
  const [rates, setRates] = useState<{ name: string; ratePerGramNrs: number }[]>([]);
  const [tickerItems, setTickerItems] = useState<string[]>([]);
  const [phone, setPhone] = useState('+977 9842 000 000');

  useEffect(() => {
    fetch('/api/rates/current')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.rates) setRates(data.rates);
      })
      .catch(() => {});
    fetch('/api/store-settings')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setTickerItems(data.tickerItems || []);
          if (data.phoneNumbers?.length) setPhone(data.phoneNumbers[0]);
        }
      })
      .catch(() => {});
  }, []);

  const rateItems = rates.map((r) => `${r.name.toUpperCase()} ₨ ${r.ratePerGramNrs.toLocaleString('en-IN')}/G`);

  const parts = ['TODAY', ...rateItems, ...tickerItems.filter(Boolean), `WHATSAPP ${phone}`];
  const text = parts.join(' · ');

  const content = (
    <span className="inline-flex items-center shrink-0">
      <span>{text}</span>
      <span className="inline-block w-32" />
    </span>
  );

  return (
    <div className="bg-black border-b border-[#2b2415]/30">
      <div className="w-full mx-auto h-8 md:h-6 flex items-center text-[11px] tracking-[4px] uppercase [font-variant-numeric:lining-nums] overflow-hidden">
        <div className="flex w-full whitespace-nowrap overflow-hidden relative">
          <div className="animate-ticker inline-flex shrink-0">
            {content}{content}
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopNav({ links }: { links: readonly { href: string; label: string }[] }) {
  return (
    <div className="hidden md:flex gap-5 text-[13px] text-[rgb(218,206,183)] tracking-[4px] uppercase">
      {links.map((link) => (
        <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
      ))}
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative text-[13px] tracking-[4px] uppercase text-[rgb(218,206,183)] hover:text-[#d4b77a] active:text-[#b99755] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-[#d4b77a] after:transition-all after:duration-500 hover:after:w-full"
    >
      {children}
    </Link>
  );
}

function Logo({ isShrunk }: { isShrunk: boolean }) {
  return (
    <div className="text-center flex flex-row space-x-2 items-baseline">
      <div
        className={`italic text-[rgb(218,206,183)] leading-none transition-all duration-500 ease-in-out ${
          isShrunk ? 'text-[22px] md:text-[23px]' : 'text-[24px] md:text-[25px]'
        }`}
      >
        {SITE.name}
      </div>
      <div
        className={`${cormorantSC.className} tracking-[0.35em] leading-none [font-variant:small-caps] transition-all duration-500 ease-in-out ${
          isShrunk ? 'text-[18px] md:text-[20px]' : 'text-[20px] md:text-[23px]'
        }`}
      >
        {SITE.suffix}
      </div>
    </div>
  );
}

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const allLinks = [...NAV_LINKS.left, ...NAV_LINKS.right];

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 bg-[#0e0b08]/98 border-t border-[#2b2415] backdrop-blur-lg transition-all duration-500 ease-in-out overflow-y-auto z-40 no-scrollbar ${
        isOpen ? 'top-[88px] opacity-100 visible' : 'top-[100%] opacity-0 invisible'
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-6 min-h-full pb-24 text-[16px] tracking-[6px] uppercase text-[rgb(218,206,183)] px-6">
        {allLinks.map((link) => (
          <Link key={link.href} href={link.href} onClick={onClose} className="hover:text-[#d4b77a] py-2 transition-all">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
