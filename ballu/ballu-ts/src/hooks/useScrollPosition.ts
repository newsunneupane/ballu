'use client';

import { useState, useEffect } from 'react';

export function useScrollPosition(thresholds: { pin?: number; shrink?: number } = {}) {
  const { pin = 32, shrink = 150 } = thresholds;
  const [isPinned, setIsPinned] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsPinned(window.scrollY > pin);
      setIsShrunk(window.scrollY > shrink);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pin, shrink]);

  return { isPinned, isShrunk };
}
