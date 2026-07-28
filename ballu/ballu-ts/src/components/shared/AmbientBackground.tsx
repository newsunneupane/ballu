'use client';

import React from 'react';

interface Particle {
  left: string;
  size: number;
  speed: number;
  delay: number;
  opacity: number;
}

const ambientParticles: Particle[] = [
  { left: '93.0%', size: 3.4, speed: 22.0, delay: -0.7, opacity: 0.61 },
  { left: '47.9%', size: 1.8, speed: 18.2, delay: -0.8, opacity: 0.35 },
  { left: '13.0%', size: 2.6, speed: 14.1, delay: -4.7, opacity: 0.55 },
  { left: '9.6%', size: 1.8, speed: 27.0, delay: -12.5, opacity: 0.49 },
  { left: '5.3%', size: 3.0, speed: 23.2, delay: -4.8, opacity: 0.43 },
  { left: '0.9%', size: 3.3, speed: 24.6, delay: -4.7, opacity: 0.79 },
  { left: '52.2%', size: 2.6, speed: 21.5, delay: -1.3, opacity: 0.53 },
  { left: '56.2%', size: 3.4, speed: 22.5, delay: -4.2, opacity: 0.70 },
  { left: '18.0%', size: 3.1, speed: 14.7, delay: -2.4, opacity: 0.37 },
  { left: '3.6%', size: 2.8, speed: 18.4, delay: -13.7, opacity: 0.72 },
  { left: '38.8%', size: 2.4, speed: 21.7, delay: -2.8, opacity: 0.78 },
];

export function AmbientParticles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {ambientParticles.map((particle, idx) => (
        <span
          key={idx}
          className="inline-flex items-center justify-center"
          style={{
            position: 'absolute',
            left: particle.left,
            bottom: '-20px',
            animation: `bj-dust ${particle.speed}s linear ${particle.delay}s infinite`,
          }}
        >
          <svg
            width={particle.size * 3}
            height={particle.size * 3}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f5e3b8"
            strokeWidth="1.2"
            style={{
              animation: `bj-sparkle ${2 + (idx % 5) * 0.4}s ease-in-out ${particle.delay}s infinite`,
              filter: 'drop-shadow(0 0 4px #f5e3b8)',
            }}
          >
            <path d="M12 2l1.5 6.5L20 10l-5.5 4.5L16 22l-4-3.5L8 22l1.5-7.5L4 10l6.5-1.5z" fill="#f5e3b8" />
          </svg>
        </span>
      ))}
    </div>
  );
}

export function GradientOrbit() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 bg-[#0e0b08]" style={{ overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: '-80%', willChange: 'transform' }}>
        <div className="bj-grad-shift" style={{ position: 'absolute', inset: 0 }}>
          <svg width="100%" height="100%" viewBox="0 0 100 125" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
            <defs>
              <radialGradient id="g1" cx="35%" cy="30%" r="80%">
                <stop offset="0%" stopColor="#f5e3b8" stopOpacity="0.95" />
                <stop offset="40%" stopColor="#d4a857" stopOpacity="0.7" />
                <stop offset="80%" stopColor="#8a5e1f" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3a2510" stopOpacity="0.1" />
              </radialGradient>
              <radialGradient id="g2" cx="75%" cy="80%" r="60%">
                <stop offset="0%" stopColor="#d4a857" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3a2510" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100" height="125" fill="#0e0b08" />
            <rect width="100" height="125" fill="url(#g1)" />
            <rect width="100" height="125" fill="url(#g2)" />
            <circle cx="50" cy="50" r="8" fill="none" stroke="#c9a96e" strokeWidth="0.35" opacity="0.4" />
            <circle cx="50" cy="50" r="5" fill="none" stroke="#c9a96e" strokeWidth="0.3" opacity="0.35" />
            <circle cx="50" cy="50" r="2.5" fill="none" stroke="#c9a96e" strokeWidth="0.2" opacity="0.3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function GradientOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-[5]"
      style={{
        background:
          'linear-gradient(180deg, rgba(15,13,10,0.92) 0%, transparent 50%), linear-gradient(90deg, rgba(15,13,10,0.98) 0%, transparent 100%)',
      }}
    />
  );
}

export function HeroAnimations() {
  return (
    <style>{`
      @keyframes bj-dust {
        0% { transform: translateY(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-105vh); opacity: 0; }
      }
      @keyframes bj-sparkle {
        0%, 100% { opacity: 0; transform: scale(0); }
        20% { opacity: 1; transform: scale(1); }
        80% { opacity: 0.6; transform: scale(0.8); }
      }
      @keyframes bj-rot { to { transform: rotate(360deg); } }
      @keyframes bj-rotr { to { transform: rotate(-360deg); } }
      @keyframes bj-grad {
        0% { transform: rotate(0deg) scale(1.5); }
        100% { transform: rotate(360deg) scale(1.5); }
      }
      .bj-orbit-slow { transform-origin: center; animation: bj-rot 80s linear infinite; }
      .bj-orbit-slow-rev { transform-origin: center; animation: bj-rotr 110s linear infinite; }
      .bj-grad-shift { animation: bj-grad 90s linear infinite; transform-origin: center; }
    `}</style>
  );
}
