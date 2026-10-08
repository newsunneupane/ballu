'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Cormorant_Garamond, Cormorant_SC } from 'next/font/google';
import { FiSearch, FiMenu, FiX, FiSun, FiMoon, FiChevronRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
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
  const [isPinned, setIsPinned] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { data: settings } = useStoreSettings();

  // Shadow-only scroll flag (no positioning). rAF-throttled so it never
  // causes the navbar to lag behind the page on fast mobile flings.
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setIsPinned((prev) => {
        const next = window.scrollY > 8;
        return prev === next ? prev : next;
      });
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock background scroll when the mobile menu is open so the page
  // behind can't drift (standard drawer behavior).
  useEffect(() => {
    document.body.classList.toggle('bj-menu-open', isOpen);
    if (!isOpen) return () => document.body.classList.remove('bj-menu-open');
    const scrollY = window.scrollY;
    const prevOverflow = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    return () => {
      document.body.classList.remove('bj-menu-open');
      document.body.style.overflow = prevOverflow;
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  return (
    <div className={`${cormorant.className} bg-bj-bg-ticker text-[#dbb86b] w-full relative z-50`}>
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

export function isNavActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  const path = pathname.split('?')[0].replace(/\/+$/, '') || '/';
  const target = href.replace(/\/+$/, '') || '/';
  if (target === '/') return path === '/';
  return path === target || path.startsWith(`${target}/`);
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = isNavActive(pathname, href);
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`relative nav-link text-[13px] tracking-[4px] uppercase transition-colors duration-300 hover:font-semibold active:text-[#b99755] ${
        active ? 'nav-link-active font-semibold text-bj-gold-rich' : 'text-bj-text-nav'
      }`}
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
  const pathname = usePathname();

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

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Keep it mounted for the exit transition, then unmount.
  const [renderMenu, setRenderMenu] = useState(isOpen);
  useEffect(() => {
    if (isOpen) {
      setRenderMenu(true);
      return;
    }
    const t = setTimeout(() => setRenderMenu(false), 500);
    return () => clearTimeout(t);
  }, [isOpen]);

  if (!mounted || !renderMenu) return null;

  const menu = (
    <div
      className={`bj-mobile-menu md:hidden fixed inset-0 h-[100dvh] bg-bj-bg-secondary/98 backdrop-blur-lg transition-all duration-500 ease-in-out overflow-y-auto z-[60] no-scrollbar overscroll-contain [-webkit-overflow-scrolling:touch] ${
        isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-full'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="mm-header sticky top-0 z-20 flex items-center justify-between px-5 h-16 bg-bj-bg-secondary/95 backdrop-blur border-b border-bj-border shrink-0">
          <Link
            href="/"
            onClick={onClose}
            aria-label="Go to homepage"
            className="flex items-baseline gap-2 cursor-pointer transition-opacity duration-300 active:opacity-70"
          >
            <span className="italic text-bj-text-nav text-[20px] leading-none">{SITE.name}</span>
            <span className="text-[10px] tracking-[0.35em] uppercase text-bj-text-muted leading-none">
              {SITE.suffix}
            </span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-bj-border text-bj-text-nav transition-all duration-300 active:border-bj-gold-rich active:bg-bj-gold-rich/10 active:text-bj-gold-rich"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="mm-body flex-1 overflow-y-auto no-scrollbar bg-bj-bg">
          <nav className="flex flex-col">
            <div className="flex flex-col gap-3 px-5 py-5">
              {primaryLinks.map((link) => {
                const active = isNavActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    aria-current={active ? 'page' : undefined}
                    className={`mm-primary flex h-12 items-center justify-center rounded-full border text-[13px] tracking-[0.2em] uppercase transition-all duration-300 shadow-sm font-semibold ${
                      active
                        ? 'mm-primary-active border-[#7a0000] bg-[#7a0000] text-white shadow-[0_8px_20px_-8px_rgba(122,0,0,.7)]'
                        : 'border-[#cc0000] bg-[#cc0000] text-white active:bg-[#990000] active:border-[#990000]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
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
                      className={`mm-subbtn flex w-full items-center justify-between h-12 rounded-xl border px-5 text-[13px] tracking-[0.2em] uppercase transition-all duration-300 ${
                        open
                          ? 'mm-open border-[#7a0000] bg-[#7a0000] text-white shadow-[0_8px_20px_-8px_rgba(122,0,0,.7)]'
                          : 'border-[#cc0000] bg-[#cc0000] text-white active:bg-[#990000] active:border-[#990000]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <FiChevronRight
                        className={`h-4 w-4 transition-transform duration-300 ${
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
              className="inline-flex items-center gap-2 rounded-full border border-[#25D366] bg-[#25D366] px-4 py-2 text-[11px] tracking-[0.15em] uppercase text-white transition-colors duration-300 active:bg-[#1ebe5b]"
            >
              <FaWhatsapp size={14} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(menu, document.body);
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
            <div className="grid grid-cols-3 gap-3">
              {data.items.slice(0, 6).map((p) => (
                <Link
                  key={p.id}
                  href={`/catalogue/${p.id}`}
                  onClick={onClose}
                  className="mm-piece block"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-bj-gold-rich/20 bg-bj-bg-elevated">
                    {p.images?.[0] ? (
                      <img
                        src={cloudinaryUrl(p.images[0], { width: 300, aspect: '3:4' })}
                        alt={p.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#423722] to-[#1a140f]" />
                    )}
                  </div>
                  <p className="mt-1.5 truncate text-[11px] uppercase tracking-[0.08em] text-bj-text-nav">
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
                image={o.image}
                onClose={onClose}
              />
            ))}
          </ul>
        </MobileSection>
      )}

      {!item.leftover && data.priceRanges.length > 0 && (
        <MobileSection title="Shop by Price">
          <div className="mm-chips flex flex-wrap gap-2 px-1 pt-1">
            {data.priceRanges.map((r) => (
              <Link
                key={r.href + r.label}
                href={r.href}
                onClick={onClose}
                className="mm-chip rounded-full border border-bj-gold-rich/30 bg-bj-gold-rich/10 px-4 py-2 text-[11px] uppercase tracking-[0.15em] text-bj-gold-rich transition-all duration-300 active:border-bj-gold-rich active:bg-bj-gold-rich active:text-bj-bg-secondary"
              >
                {r.label}
              </Link>
            ))}
          </div>
        </MobileSection>
      )}
    </div>
  );
}

function MobileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="mb-2 flex items-center gap-3">
        <h3 className="shrink-0 text-[11px] tracking-[0.3em] uppercase text-bj-text-muted">{title}</h3>
        <span className="h-px flex-1 bg-gradient-to-r from-bj-gold-rich/40 to-transparent" />
      </div>
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
        className="mm-row flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors active:border-bj-gold-rich/40 active:bg-bj-gold-rich/10"
      >
        {image && (
          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-bj-gold-rich/40 bg-bj-bg-elevated ring-1 ring-bj-gold-rich/20">
            <img
              src={cloudinaryUrl(image, { width: 80, aspect: '1:1' })}
              alt={label}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </span>
        )}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[12px] font-medium uppercase tracking-[0.12em] text-bj-text-nav">{label}</span>
          {sub && <span className="text-[10px] tracking-wide text-bj-text-muted">{sub}</span>}
        </span>
        <span className="translate-x-0 text-bj-gold-rich/70 opacity-100">
          →
        </span>
      </Link>
    </li>
  );
}
