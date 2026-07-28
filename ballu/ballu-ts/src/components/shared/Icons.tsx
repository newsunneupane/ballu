import React from 'react';

interface IconProps {
  size?: number;
  fill?: string;
}

export function StarIcon({ size = 14, fill = 'currentColor' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={fill} stroke="none">
      <path d="m12 2 2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.5L6 22l1.5-7.2L2 10l7.1-1.1L12 2Z" />
    </svg>
  );
}

export function ArrowRight({ size = 12 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

export function ChevronLeft({ size = 16 }: { size?: number }) {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

export function ChevronRight({ size = 16 }: { size?: number }) {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function Sparkle({ size = 12 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="#cda274" strokeWidth="1.2">
      <path d="M12 2l1.5 6.5L20 10l-5.5 4.5L16 22l-4-3.5L8 22l1.5-7.5L4 10l6.5-1.5z" fill="currentColor" />
    </svg>
  );
}
