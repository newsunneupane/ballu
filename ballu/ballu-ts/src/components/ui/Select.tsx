'use client';

import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: readonly string[] | string[];
}

export default function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[9px] tracking-[0.3em] uppercase text-[#8e897e] mb-1">
          {label}
        </label>
      )}
      <select
        className={`w-full bg-transparent border border-[#2b2415] py-2.5 px-4 text-sm text-[#ebd3b4] focus:outline-none focus:border-[#cda274] transition-colors ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#0e0b08] text-[#ebd3b4]">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
