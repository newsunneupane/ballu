'use client';

import { useState, useEffect, useRef } from 'react';

export function useFilterSticky(offset = 80) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setIsFixed(rect.top <= offset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const raf = requestAnimationFrame(() => handleScroll());
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(raf);
    };
  }, [offset]);

  return { containerRef, isFixed };
}
