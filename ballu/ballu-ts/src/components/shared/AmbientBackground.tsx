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
  { left: '47.9%', size: 2.2, speed: 18.2, delay: -0.8, opacity: 0.55 },
  { left: '13.0%', size: 2.6, speed: 14.1, delay: -4.7, opacity: 0.65 },
  { left: '9.6%', size: 2.0, speed: 27.0, delay: -12.5, opacity: 0.59 },
  { left: '5.3%', size: 3.0, speed: 23.2, delay: -4.8, opacity: 0.53 },
  { left: '0.9%', size: 3.3, speed: 24.6, delay: -4.7, opacity: 0.79 },
  { left: '52.2%', size: 2.6, speed: 21.5, delay: -1.3, opacity: 0.63 },
  { left: '56.2%', size: 3.4, speed: 22.5, delay: -4.2, opacity: 0.70 },
  { left: '18.0%', size: 3.1, speed: 14.7, delay: -2.4, opacity: 0.47 },
  { left: '3.6%', size: 2.8, speed: 18.4, delay: -13.7, opacity: 0.72 },
  { left: '38.8%', size: 2.4, speed: 21.7, delay: -2.8, opacity: 0.78 },
  { left: '72.0%', size: 2.8, speed: 19.0, delay: -1.5, opacity: 0.68 },
  { left: '84.0%', size: 2.2, speed: 25.0, delay: -6.0, opacity: 0.56 },
  { left: '30.0%', size: 2.5, speed: 16.0, delay: -3.0, opacity: 0.62 },
  { left: '65.0%', size: 2.0, speed: 20.0, delay: -8.0, opacity: 0.50 },
  { left: '43.0%', size: 3.0, speed: 24.0, delay: -10.0, opacity: 0.66 },
];

const topParticles: Particle[] = [
  { left: '20.0%', size: 2.5, speed: 20.0, delay: -2.0, opacity: 0.5 },
  { left: '45.0%', size: 2.0, speed: 25.0, delay: -5.0, opacity: 0.45 },
  { left: '70.0%', size: 2.8, speed: 22.0, delay: -8.0, opacity: 0.55 },
  { left: '88.0%', size: 2.2, speed: 18.0, delay: -1.0, opacity: 0.5 },
  { left: '35.0%', size: 3.0, speed: 24.0, delay: -12.0, opacity: 0.48 },
  { left: '55.0%', size: 2.4, speed: 21.0, delay: -15.0, opacity: 0.52 },
];

export function AmbientParticles() {
  return (
    <div aria-hidden="true" className="hero-particles pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {ambientParticles.map((particle, idx) => (
        <span
          key={`b-${idx}`}
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
            stroke="var(--bj-gold-light)"
            strokeWidth="1.2"
            style={{
              animation: `bj-sparkle ${2 + (idx % 5) * 0.4}s ease-in-out ${particle.delay}s infinite`,
              filter: 'drop-shadow(0 0 6px var(--bj-gold-light))',
            }}
          >
            <path d="M12 2l1.5 6.5L20 10l-5.5 4.5L16 22l-4-3.5L8 22l1.5-7.5L4 10l6.5-1.5z" fill="var(--bj-gold-light)" />
          </svg>
        </span>
      ))}
      <div className="hero-top-particles">
        {topParticles.map((particle, idx) => (
          <span
            key={`t-${idx}`}
            className="inline-flex items-center justify-center"
            style={{
              position: 'absolute',
              left: particle.left,
              top: '-20px',
              animation: `bj-dust-reverse ${particle.speed}s linear ${particle.delay}s infinite`,
            }}
          >
            <svg
              width={particle.size * 3}
              height={particle.size * 3}
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--bj-gold-light)"
              strokeWidth="1.2"
              style={{
                animation: `bj-sparkle ${2 + (idx % 5) * 0.4}s ease-in-out ${particle.delay}s infinite`,
                filter: 'drop-shadow(0 0 6px var(--bj-gold-light))',
              }}
            >
              <path d="M12 2l1.5 6.5L20 10l-5.5 4.5L16 22l-4-3.5L8 22l1.5-7.5L4 10l6.5-1.5z" fill="var(--bj-gold-light)" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

export function GradientOrbit() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 bg-bj-bg-secondary" style={{ overflow: 'hidden' }}>
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
            <rect width="100" height="125" style={{ fill: 'var(--bj-bg-secondary)' }} />
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
          'linear-gradient(180deg, var(--bj-hero-overlay-1) 0%, transparent 50%), linear-gradient(90deg, var(--bj-hero-overlay-2) 0%, transparent 100%)',
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
      @keyframes bj-dust-reverse {
        0% { transform: translateY(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(105vh); opacity: 0; }
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
      .hero-top-particles { display: none; }
      [data-theme="light"] .hero-top-particles { display: block; }
      [data-theme="light"] .hero-particles svg {
        stroke: #996515 !important;
        fill: #996515 !important;
        filter: drop-shadow(0 0 8px #996515) !important;
      }
    `}</style>
  );
}
