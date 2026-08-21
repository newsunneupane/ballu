'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, ChevronDown, X, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  multiple?: boolean;
  values?: string[];
  onValuesChange?: (values: string[]) => void;
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
  multiple = false,
  values,
  onValuesChange,
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

  const isMulti = multiple && !!onValuesChange;
  const selectedValues = isMulti ? values || [] : [];
  const selected = !isMulti ? options.find((o) => o.value === value) : undefined;

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

  let buttonText = placeholder as string;
  if (isMulti) {
    if (selectedValues.length === 1) {
      buttonText = options.find((o) => o.value === selectedValues[0])?.label || placeholder;
    } else if (selectedValues.length > 1) {
      const first = options.find((o) => o.value === selectedValues[0])?.label;
      buttonText = `${first} +${selectedValues.length - 1}`;
    }
  } else if (selected) {
    buttonText = selected.label;
  }

  const toggleValue = (v: string) => {
    if (!onValuesChange) return;
    const next = selectedValues.includes(v)
      ? selectedValues.filter((x) => x !== v)
      : [...selectedValues, v];
    onValuesChange(next);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => { setOpen((o) => !o); setQuery(''); }}
        className={`w-full flex items-center justify-between gap-2 bg-[#faf8f4] rounded ${sizes} text-left focus:outline-none focus:border-[#b8860b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${open ? 'border border-[#b8860b]' : 'border border-[#e5ded2]'} ${(isMulti ? selectedValues.length > 0 : selected) ? 'text-[#26221d]' : 'text-[#6b655b]'}`}
      >
        <span className="truncate">{buttonText}</span>
        <ChevronDown size={14} className={`shrink-0 text-[#6b655b] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full min-w-[200px] bg-[#ffffff] border border-[#e5ded2] rounded-lg shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[#e5ded2]">
            <Search size={13} className="text-[#6b655b] shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              autoFocus
              className="w-full bg-transparent text-sm text-[#26221d] focus:outline-none placeholder:text-[#6b655b]"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="text-[#6b655b] hover:text-[#26221d]">
                <X size={13} />
              </button>
            )}
          </div>
          <div className="max-h-52 overflow-y-auto py-1">
            {clearLabel && (
              <button
                type="button"
                onClick={() => {
                  if (isMulti) onValuesChange!([]);
                  else onChange!('');
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-black/5 ${(isMulti ? selectedValues.length === 0 : !value) ? 'text-[#b8860b]' : 'text-[#7d776c]'}`}
              >
                {clearLabel}
              </button>
            )}
            {filtered.map((o) => {
              const active = isMulti ? selectedValues.includes(o.value) : o.value === value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    if (isMulti) toggleValue(o.value);
                    else { onChange!(o.value); setOpen(false); }
                  }}
                  className={`w-full flex items-center justify-between gap-2 text-left px-3 py-2 text-sm hover:bg-black/5 ${active ? 'text-[#b8860b] bg-[#b8860b]/5' : 'text-[#26221d]'}`}
                >
                  <span className="truncate">{o.label}</span>
                  {isMulti && active && <Check size={14} className="shrink-0" />}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-sm text-[#6b655b]">No matches</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
