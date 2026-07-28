'use client';

import { useRef, useState, useCallback } from 'react';

export function useMagneticEffect(factor = 3.5) {
  const ref = useRef<HTMLButtonElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      setTransform({ x: x / factor, y: y / factor });
    },
    [factor]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform({ x: 0, y: 0 });
  }, []);

  const style = {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  };

  return { ref, style, handleMouseMove, handleMouseLeave };
}
