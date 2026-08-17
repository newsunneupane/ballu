'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  clearLabel?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export default function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  clearLabel,
  disabled = false,
  size = 'md',
  className = '',
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const sizes = size === 'sm' ? 'px-3 py-2 text-xs' : 'px-3 py-2 text-sm';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => { setOpen((o) => !o); setQuery(''); }}
        className={`w-full flex items-center justify-between gap-2 bg-[#0a0806] rounded ${sizes} text-left focus:outline-none focus:border-[#dbb86b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${open ? 'border border-[#dbb86b]' : 'border border-[#1f1a10]'} ${selected ? 'text-[#e5e5e0]' : 'text-[#6e695f]'}`}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown size={14} className={`shrink-0 text-[#6e695f] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full min-w-[200px] bg-[#0f0c0a] border border-[#1f1a10] rounded-lg shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[#1f1a10]">
            <Search size={13} className="text-[#6e695f] shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              autoFocus
              className="w-full bg-transparent text-sm text-[#e5e5e0] focus:outline-none placeholder:text-[#6e695f]"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="text-[#6e695f] hover:text-[#e5e5e0]">
                <X size={13} />
              </button>
            )}
          </div>
          <div className="max-h-52 overflow-y-auto py-1">
            {clearLabel && (
              <button
                type="button"
                onClick={() => { onChange(''); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-white/[0.03] ${!value ? 'text-[#dbb86b]' : 'text-[#8e897e]'}`}
              >
                {clearLabel}
              </button>
            )}
            {filtered.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => { onChange(o.value); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-white/[0.03] ${o.value === value ? 'text-[#dbb86b] bg-[#dbb86b]/5' : 'text-[#e5e5e0]'}`}
              >
                {o.label}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-sm text-[#6e695f]">No matches</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
