'use client';

import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  size?: 'sm' | 'md';
}

export default function IconButton({
  children,
  active = false,
  size = 'md',
  className = '',
  ...props
}: IconButtonProps) {
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
  };

  const activeStyles = active
    ? 'bg-[#dbb86b] text-[#080808] shadow-[0_0_15px_rgba(219,184,107,0.4)] hover:bg-[#c9a65a] hover:scale-105'
    : 'border border-white/10 text-white/30 opacity-40';

  return (
    <button
      className={`
        rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer
        ${sizeStyles[size]}
        ${activeStyles}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
