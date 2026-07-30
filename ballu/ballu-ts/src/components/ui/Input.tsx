'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'underline';
}

export default function Input({
  label,
  error,
  variant = 'underline',
  className = '',
  ...props
}: InputProps) {
  const baseStyles =
    'w-full bg-transparent py-2.5 text-base sm:text-lg text-bj-text-gold placeholder:text-bj-text-placeholder placeholder:italic focus:outline-none transition-colors rounded-none';
  const variantStyles = {
    default: 'border border-bj-border px-4 focus:border-[#cda274]',
    underline: 'border-b border-bj-border focus:border-[#cda274]',
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-[9px] tracking-[0.3em] uppercase text-bj-text-muted mb-1">
          {label}
        </label>
      )}
      <input className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props} />
      {error && (
        <p className="text-[10px] text-red-400 mt-1 tracking-wide">{error}</p>
      )}
    </div>
  );
}
