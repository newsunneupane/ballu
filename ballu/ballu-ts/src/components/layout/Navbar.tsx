'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Cormorant_Garamond, Cormorant_SC } from 'next/font/google';
import { FiSearch, FiMenu, FiX, FiSun, FiMoon, FiChevronRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { NAV_LINKS, SITE } from '@/lib/constants';
import { useStoreSettings, whatsappNumber } from '@/hooks/useStoreSettings';
import { whatsappBaseUrl } from '@/lib/utils/whatsapp';
import SearchOverlay from '@/components/layout/SearchOverlay';
import { useTheme } from '@/components/layout/ThemeProvider';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { productService } from '@/services/product-service';
import { buildNavItems, getPanelData, type SubNavItem } from '@/components/layout/subnav-data';

const cormorantSC = Cormorant_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

export default function Navbar() {
  const { isPinned } = useScrollPosition();
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [tickerOffset, setTickerOffset] = useState(32);
  const { theme, toggleTheme } = useTheme();
  const { data: settings } = useStoreSettings();

  useEffect(() => {
    const updateOffset = () => {
      const tickerH = window.innerWidth >= 768 ? 24 : 32;
      setTickerOffset(Math.max(0, tickerH - window.scrollY));
    };
    window.addEventListener('scroll', updateOffset, { passive: true });
    updateOffset();
    return () => window.removeEventListener('scroll', updateOffset);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('bj-menu-open', isOpen);
    return () => document.body.classList.remove('bj-menu-open');
  }, [isOpen]);

  return (
    <div className={`${cormorant.className} bg-bj-bg-ticker text-[#dbb86b] w-full fixed z-50`} style={{ top: tickerOffset }}>
      <div
        className={`
          bg-bj-bg-secondary border-b border-bj-border w-full
          ${isPinned ? 'shadow-xl' : ''}
        `}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 flex items-center justify-between h-[50px]">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-bj-text-nav hover:font-semibold focus:outline-none transition-colors p-1"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>

          <DesktopNav links={NAV_LINKS.left} />

          <Logo />

          <div className="flex items-center gap-3 md:gap-5 text-[13px] text-bj-text-nav">
            <div className="hidden md:flex gap-5 tracking-[8px]">
              <NavLink href="/visit">Visit</NavLink>
            </div>

            <div className="hidden md:block text-[13px] text-bj-text-separator">
              <span>|</span>
            </div>

            <div className="flex items-center gap-4 md:gap-6 ml-0 md:ml-4">
              <span
  onClick={toggleTheme}
  className="relative inline-flex cursor-pointer group text-bj-text-nav transition-all duration-300"
  title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
>
  {theme === 'dark' ? <FiSun size={14} /> : <FiMoon size={14} />}
  <span className="absolute left-0 -bottom-1 h-px w-0 bg-[#d4b77a] transition-all duration-500 group-hover:w-full" />
</span>

              <span
  onClick={() => setShowSearch(true)}
  className="relative inline-flex cursor-pointer group text-bj-text-nav transition-all duration-300"
>
  <FiSearch size={14} />
  <span className="absolute left-0 -bottom-1 h-px w-0 bg-[#d4b77a] transition-all duration-500 group-hover:w-full" />
</span>

              <a
                href={whatsappBaseUrl(whatsappNumber(settings))}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex cursor-pointer group text-bj-text-nav transition-all duration-300"
              >
                <FaWhatsapp size={14} />
                <span className="absolute left-0 -bottom-1 h-px w-0 bg-[#d4b77a] transition-all duration-500 group-hover:w-full" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
    </div>
  );
}

function DesktopNav({ links }: { links: readonly { href: string; label: string }[] }) {
  return (
    <div className="hidden md:flex gap-5 text-[13px] text-bj-text-nav tracking-[4px] uppercase">
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
      className="relative nav-link text-[13px] tracking-[4px] uppercase text-bj-text-nav hover:font-semibold active:text-[#b99755] transition-colors duration-300"
      >
      {children}
    </Link>
  );
}

function Logo() {
  return (
    <Link
      href="/"
      aria-label="Go to homepage"
      className="text-center flex flex-row space-x-2 items-baseline cursor-pointer group/logo"
    >
      <div
        className={`italic text-bj-text-nav leading-none transition-opacity duration-300 group-hover/logo:opacity-80 text-[22px] md:text-[23px]`}
      >
        {SITE.name}
      </div>
      <div
        className={`${cormorantSC.className} jewellers-text  tracking-[0.35em] leading-none [font-variant:small-caps] transition-opacity duration-300 group-hover/logo:opacity-80 text-[18px] md:text-[20px]`}
      >
        {SITE.suffix}
      </div>
    </Link>
  );
}

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [subItems, setSubItems] = useState<SubNavItem[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { data: settings } = useStoreSettings();

  useEffect(() => {
    let cancelled = false;
    productService.ensureLoaded().then(() => {
      if (!cancelled) setSubItems(buildNavItems());
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const primaryLinks = [
    ...NAV_LINKS.left.filter((l) => l.href !== '/'),
    ...NAV_LINKS.right,
  ];

  const close = () => {
    setExpanded(null);
    onClose();
  };

  const toggle = (label: string) =>
    setExpanded((cur) => (cur === label ? null : label));

  return (
    <div
      className={`bj-mobile-menu md:hidden fixed inset-0 bg-bj-bg-secondary/98 backdrop-blur-lg transition-all duration-500 ease-in-out overflow-y-auto z-[60] no-scrollbar ${
        isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-full'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="mm-header sticky top-0 z-20 flex items-center justify-between px-5 h-16 bg-bj-bg-secondary/95 backdrop-blur border-b border-bj-border shrink-0">
          <Link
            href="/"
            onClick={onClose}
            aria-label="Go to homepage"
            className="flex items-baseline gap-2 cursor-pointer transition-opacity duration-300 hover:opacity-80"
          >
            <span className="italic text-bj-text-nav text-[20px] leading-none">{SITE.name}</span>
            <span className="text-[10px] tracking-[0.35em] uppercase text-bj-text-muted leading-none">
              {SITE.suffix}
            </span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-bj-border text-bj-text-nav transition-all duration-300 hover:border-bj-gold-rich hover:bg-bj-gold-rich/10 hover:text-bj-gold-rich"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="mm-body flex-1 overflow-y-auto no-scrollbar bg-bj-bg">
          <nav className="flex flex-col">
            <div className="flex flex-col gap-3 px-5 py-5">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="flex h-12 items-center justify-center rounded-full border border-bj-gold-rich/50 bg-bj-gold-rich/10 text-[13px] tracking-[0.2em] uppercase text-bj-gold-rich transition-all duration-300 hover:bg-bj-gold-rich hover:text-bj-bg-secondary"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3 px-5 py-5">
              <p className="mm-muted px-1 pb-1 text-[11px] tracking-[0.3em] uppercase text-bj-text-muted">
                Browse the collection
              </p>

              {subItems.map((item) => {
                const open = expanded === item.label;
                return (
                  <div key={item.label}>
                    <button
                      type="button"
                      onClick={() => toggle(item.label)}
                      aria-expanded={open}
                      className="mm-subbtn flex w-full items-center justify-between h-12 rounded-xl border border-bj-border bg-bj-bg-elevated/40 px-5 text-[13px] tracking-[0.2em] uppercase text-bj-text-nav transition-all duration-300 hover:border-bj-gold-rich/60 hover:text-bj-gold-rich"
                    >
                      <span>{item.label}</span>
                      <FiChevronRight
                        className={`h-4 w-4 text-bj-gold-richer transition-transform duration-300 ${
                          open ? 'rotate-90' : ''
                        }`}
                      />
                    </button>

                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <MobileSubPanel item={item} onClose={close} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </nav>
        </div>

        <div className="mm-footer shrink-0 border-t border-bj-border bg-bj-bg-secondary px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-[12px] tracking-[0.15em] text-bj-text-nav">{SITE.fullName}</span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-bj-text-muted">
                Est. {SITE.est} · {SITE.location}
              </span>
            </div>
            <a
              href={whatsappBaseUrl(whatsappNumber(settings))}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full border border-[#25D366] bg-[#25D366] px-4 py-2 text-[11px] tracking-[0.15em] uppercase text-white transition-colors duration-300 hover:bg-[#1ebe5b]"
            >
              <FaWhatsapp size={14} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileSubPanel({ item, onClose }: { item: SubNavItem; onClose: () => void }) {
  const data = getPanelData(item);

  return (
    <div className="mm-subpanel bg-bj-bg-elevated/30 px-5 pb-6 pt-1">
      <MobileSection title="Shop by Category">
        {data.collections.length > 0 && (
          <ul>
            {data.collections.map((card) => {
              const q = new URLSearchParams(data.baseQuery);
              q.set('collection', card.name.trim().toUpperCase());
                return (
                  <MobileLinkRow
                    key={card.slug}
                    href={`/catalogue?${q.toString()}`}
                    label={card.name}
                    sub={card.nepali}
                    image={card.image}
                    onClose={onClose}
                  />
                );
            })}
          </ul>
        )}
        {data.items.length > 0 && (
          <>
            {data.collections.length > 0 && (
              <p className="mb-2 mt-3 text-[10px] tracking-[0.3em] uppercase text-bj-text-muted">
                More pieces
              </p>
            )}
            <div className="grid grid-cols-3 gap-2">
              {data.items.map((p) => (
                <Link
                  key={p.id}
                  href={`/catalogue/${p.id}`}
                  onClick={onClose}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md border border-bj-border bg-bj-bg-elevated">
                    {p.images?.[0] ? (
                      <img
                        src={cloudinaryUrl(p.images[0], { width: 300, aspect: '3:4' })}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#423722] to-[#1a140f]" />
                    )}
                  </div>
                  <p className="mt-1.5 truncate text-[11px] tracking-wide text-bj-text-nav">
                    {p.title}
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}
      </MobileSection>

      {!item.leftover && data.occasions.length > 0 && (
        <MobileSection title="Shop by Occasions">
          <ul>
            {data.occasions.map((o) => (
              <MobileLinkRow
                key={o.href}
                href={o.href}
                label={o.name}
                sub={o.nepali}
                onClose={onClose}
              />
            ))}
          </ul>
        </MobileSection>
      )}

      {!item.leftover && data.priceRanges.length > 0 && (
        <MobileSection title="Shop by Price">
          <ul>
            {data.priceRanges.map((r) => (
              <MobileLinkRow
                key={r.href + r.label}
                href={r.href}
                label={r.label}
                onClose={onClose}
              />
            ))}
          </ul>
        </MobileSection>
      )}
    </div>
  );
}

function MobileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h3 className="mb-2 text-[11px] tracking-[0.3em] uppercase text-bj-text-muted">{title}</h3>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function MobileLinkRow({
  href,
  label,
  sub,
  image,
  onClose,
}: {
  href: string;
  label: string;
  sub?: string;
  image?: string;
  onClose: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClose}
        className="group flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-bj-bg-elevated hover:text-bj-gold-rich"
      >
        {image && (
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded border border-bj-border bg-bj-bg-elevated">
            <img
              src={cloudinaryUrl(image, { width: 80, aspect: '1:1' })}
              alt={label}
              className="h-full w-full object-cover"
            />
          </span>
        )}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[13px] tracking-[0.08em] text-bj-text-nav">{label}</span>
          {sub && <span className="text-[10px] tracking-wide text-bj-text-muted">{sub}</span>}
        </span>
        <span className="text-bj-gold-richer opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          →
        </span>
      </Link>
    </li>
  );
}
