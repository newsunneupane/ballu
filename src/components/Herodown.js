"use client";
import React from 'react'
import { Cormorant_Garamond, Cormorant_SC } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: '--font-serif-editorial', 
});
  
const cormorantSC = Cormorant_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: '--font-serif-title',
});

const collections = [
  {
    id: '01',
    nepaliTitle: 'विवाह',
    englishTitle: 'Bridal Heritage',
    pieces: '24 PIECES',
    glowStyle: 'radial-gradient(circle at 40% 40%, rgba(213,165,96,0.22) 0%, rgba(14,11,8,0) 70%)',
    borderColor: 'border-[#d5a560]/10'
  },
  {
    id: '02',
    nepaliTitle: 'आधुनिक',
    englishTitle: 'Modern Minimal',
    pieces: '22 PIECES',
    glowStyle: 'radial-gradient(circle at 40% 40%, rgba(200,190,175,0.18) 0%, rgba(14,11,8,0) 70%)',
    borderColor: 'border-[#c8beaf]/10'
  },
  {
    id: '03',
    nepaliTitle: 'चाँदी',
    englishTitle: 'Silver Studio',
    pieces: '31 PIECES',
    glowStyle: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.1) 0%, rgba(14,11,8,0) 70%)',
    borderColor: 'border-white/5'
  },
  {
    id: '04',
    nepaliTitle: 'पर्व',
    englishTitle: 'Festive Core',
    pieces: '18 PIECES',
    glowStyle: 'radial-gradient(circle at 40% 40%, rgba(197,143,77,0.18) 0%, rgba(14,11,8,0) 70%)',
    borderColor: 'border-[#c58f4d]/10'
  }
];

const Herodown = () => {
  return (
    <div className="text-white min-h-[30vh] flex flex-col justify-end">
      
    {/* SCOPED INJECTED CSS */}
<style jsx global>{`
  /* 1. HOVER ENTRY: Lifts up slightly, then shakes */
  @keyframes subtleLiftThenVibrate {
    0% { 
      transform: scaleY(1) translateX(0); 
    }
    30% { 
      transform: scaleY(0.985) translateX(0); 
    }
    45% { 
      transform: scaleY(0.985) translateX(-1px); 
    }
    60% { 
      transform: scaleY(0.985) translateX(1px); 
    }
    75% { 
      transform: scaleY(0.985) translateX(-0.5px); 
    }
    90% { 
      transform: scaleY(0.985) translateX(0.5px); 
    }
    100% { 
      transform: scaleY(0.985) translateX(0); 
    }
  }

  /* 2. MOUSE LEAVE: Shakes immediately while lifted, then drops down smoothly */
  @keyframes vibrateThenSettleDown {
    0% { 
      transform: scaleY(0.985) translateX(0); 
    }
    15% { 
      transform: scaleY(0.985) translateX(-1px); 
    }
    30% { 
      transform: scaleY(0.985) translateX(1px); 
    }
    45% { 
      transform: scaleY(0.985) translateX(-0.5px); 
    }
    60% { 
      transform: scaleY(0.985) translateX(0); 
    }
    /* 60% to 100%: The vibration stops and the bottom edge glides down to normal */
    100% { 
      transform: scaleY(1) translateX(0); 
    }
  }
  
  .vibrate-card-hover {
    transform-origin: top !important; 
    transition: shadow 0.3s ease-out;
    /* Default animation state: Plays the exit drop when NOT hovering */
    animation: vibrateThenSettleDown 0.35s ease-out forwards;
  }

  .vibrate-card-hover:hover {
    /* Plays the entry lift when hovering */
    animation: subtleLiftThenVibrate 0.35s ease-out forwards !important;
    
  }
`}</style>

      {/* SECTION HEADER BLOCK */}
      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 lg:px-16 pt-16 pb-8">
        <div className="text-[11px] tracking-[0.4em] text-[#dbb86b] uppercase opacity-80 mb-6 font-sans">
          The collections
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="flex flex-col space-y-3 max-w-4xl"> 
            <h1 className={`${cormorantSC.variable} ${cormorant.variable} antialiased text-[clamp(1.8rem,5vw,3.5rem)] font-light leading-[1.1] text-[#fbf7f0] tracking-tight font-serif-editorial`}>
              <span className="block fade-in-up" style={{ animationDelay: '0ms' }}>
                Curated, never crowded.
              </span>
            </h1>
          </div>

          {/* Right Side: Navigation Slider Buttons */}
          <div className="flex items-center gap-3 self-end md:self-auto pb-2">
            <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:border-white/50 transition-colors duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full bg-[#dbb86b] flex items-center justify-center text-[#080808] hover:bg-[#c9a65a] transition-colors duration-200 shadow-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* CAROUSEL CONTAINER */}
      <div className="w-full pb-20 overflow-hidden select-none">
        <div className="max-w-7xl w-full mx-auto px-6 md:px-12 lg:px-16">
          
          <div className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth overflow-y-visible py-4 -mx-6 md:-mx-12 lg:-mx-16 px-6 md:px-12 lg:px-16">
            {collections.map((item) => (
              <div
                key={item.id}
                className={`
                  flex-none w-[82vw] sm:w-[45vw] lg:w-[355px] aspect-[3/4]
                  bg-[#13100d] border ${item.borderColor} relative overflow-hidden group 
                  flex flex-col justify-between p-6 md:p-8 
                  hover:shadow-2xl
                  
                  vibrate-card-hover
                `}
              >
                {/* Radial Glow Layer */}
                <div 
                  className="absolute inset-0 pointer-events-none mix-blend-screen opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ backgroundImage: item.glowStyle }}
                />

                {/* Concentric Decorative Rings */}
                <div className="absolute top-[40%] left-[40%] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.12] group-hover:opacity-[0.22] transition-opacity duration-500">
                  <div className="w-[140px] h-[140px] rounded-full border border-white flex items-center justify-center">
                    <div className="w-[110px] h-[110px] rounded-full border border-white flex items-center justify-center">
                      <div className="w-[80px] h-[80px] rounded-full border border-white flex items-center justify-center">
                        <div className="w-[50px] h-[50px] rounded-full border border-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Index Badge */}
                <div className="relative z-10 self-start">
                  <span className="text-[10px] tracking-widest text-white/40 bg-white/5 border border-white/10 px-2.5 py-1 font-sans">
                    {item.id}
                  </span>
                </div>

                {/* Bottom Info Details */}
                <div className="relative z-10 flex flex-col space-y-4 pt-12">
                  <div>
                    <p className="font-nepali-serif text-[#dbb86b] text-xs tracking-wide font-light mb-1 opacity-90">
                      {item.nepaliTitle}
                    </p>
                    <h3 className={`${cormorant.variable} text-xl md:text-2xl font-light font-serif-editorial text-[#fbf7f0] tracking-wide`}>
                      {item.englishTitle}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] tracking-[0.25em] text-white/40 font-sans">
                    <span>{item.pieces}</span>
                    <span className="group/inner flex items-center gap-1 text-[#dbb86b] transition-colors duration-300 tracking-widest ">
                      EXPLORE <span className="transform group-hover/inner:translate-x-1 transition-transform duration-300">→</span>
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  )
}

export default Herodown;