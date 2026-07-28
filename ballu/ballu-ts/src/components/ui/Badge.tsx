import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'outline';
  className?: string;
}

const variants = {
  default: 'bg-[#0e0b08]/90 text-[#ebd3b4] border border-[#2b2415]',
  gold: 'bg-[#cda274] text-[#0a0806]',
  outline: 'bg-transparent text-[#cda274] border border-[#cda274]',
};

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-block px-2 py-0.5 text-[9px] tracking-widest font-medium uppercase
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
