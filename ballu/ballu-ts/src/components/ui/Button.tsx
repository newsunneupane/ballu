'use client';

import React, { useRef, useState } from 'react';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'magnetic';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  magnetic?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#c9a96e] text-[#0a0806] hover:brightness-110 shadow-md',
  outline:
    'border border-bj-gold-dark text-bj-gold-dark bg-transparent hover:bg-bj-gold-dark/12',
  ghost:
    'bg-transparent text-[#c9a96e] hover:bg-white/5',
  magnetic:
    'bg-[#c9a96e] text-[#0a0806] shadow-md',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-[18px] py-[10px] text-[10px] tracking-[0.25em]',
  md: 'px-[26px] py-[14px] text-[11px] tracking-[0.3em]',
  lg: 'px-[30px] py-[16px] text-[13px] tracking-[0.3em]',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  magnetic = false,
  icon,
  iconPosition = 'right',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!magnetic || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setTransform({ x: x / 3.5, y: y / 3.5 });
  };

  const handleMouseLeave = () => {
    if (!magnetic) return;
    setTransform({ x: 0, y: 0 });
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={magnetic ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined}
      className={`
        relative overflow-hidden isolation-isolate
        uppercase flex items-center gap-[10px]
        transition-all duration-300
        bj-shine-btn bj-press-btn
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
      <style>{`
        .bj-shine-btn { position:relative; overflow:hidden; isolation:isolate; }
        .bj-shine-btn::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(105deg, transparent 30%, var(--bj-shine) 50%, transparent 70%);
          background-size:250% 100%; background-position:-150% 50%;
          pointer-events:none; transition: background-position .85s ease;
        }
        .bj-shine-btn:hover::after { background-position: 250% 50%; }
        .bj-press-btn { transition: transform .15s ease; }
        .bj-press-btn:active { transform: scale(.97); }
      `}</style>
    </button>
  );
}
