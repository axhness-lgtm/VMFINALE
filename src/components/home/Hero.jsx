import React, { useEffect, useRef } from 'react';

const Hero = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    
    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`;
        dotRef.current.style.top = `${mouseY}px`;
      }
    };
    
    window.addEventListener('mousemove', onMouseMove);
    
    let raf;
    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.12;
      cursorY += (mouseY - cursorY) * 0.12;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${cursorX}px`;
        cursorRef.current.style.top = `${cursorY}px`;
      }
      raf = requestAnimationFrame(animate);
    };
    animate();
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative w-full h-[100vh] bg-[#0f0904] flex items-center justify-center overflow-hidden">
      
      {/* Custom Cursor Ring & Dot (separate for instant dot, lagging ring) */}
      <div 
        ref={cursorRef} 
        className="fixed w-[28px] h-[28px] rounded-full border border-[#e45a0b] pointer-events-none z-[9999]"
        style={{ transform: 'translate(-50%, -50%)', top: '-100px', left: '-100px' }}
      ></div>
      <div 
        ref={dotRef} 
        className="fixed w-[6px] h-[6px] rounded-full bg-[#e45a0b] pointer-events-none z-[9999]"
        style={{ transform: 'translate(-50%, -50%)', top: '-100px', left: '-100px' }}
      ></div>

      {/* Nav */}
      <nav className="absolute top-8 left-1/2 -translate-x-1/2 inline-flex gap-10 z-30">
        {['Dinner', 'Community', 'Substack', 'Founder'].map(link => (
          <a key={link} href="#" className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#efe9e1]/50 hover:text-[#e45a0b] transition-colors duration-300">
            {link}
          </a>
        ))}
      </nav>

      {/* Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-60" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.07'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px'
      }}></div>

      {/* Warm Glow */}
      <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none z-0" style={{
        background: 'radial-gradient(ellipse, rgba(228,90,11,0.12) 0%, transparent 70%)'
      }}></div>

      {/* Doodle Illustrations */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* 1. Steam */}
        <svg className="absolute w-[30px] h-[50px] opacity-35 doodle-steam" style={{ top: '8%', left: '3%' }} viewBox="0 0 30 50">
          <path d="M5 50 Q 15 35 5 20 T 10 0" stroke="#e45a0b" strokeWidth="1.5" fill="none" />
          <path d="M15 50 Q 25 35 15 20 T 20 0" stroke="#e45a0b" strokeWidth="1.5" fill="none" />
          <path d="M25 50 Q 35 35 25 20 T 30 0" stroke="#e45a0b" strokeWidth="1.5" fill="none" />
        </svg>
        {/* 2. Fork */}
        <svg className="absolute w-[20px] h-[55px] opacity-20 -rotate-[15deg]" style={{ top: '72%', left: '82%' }} viewBox="0 0 20 55">
          <path d="M10 20 L10 50 C10 53 12 55 10 55 C8 55 10 53 10 50 Z" stroke="#efe9e1" strokeWidth="1.5" fill="none" />
          <path d="M10 20 L10 5" stroke="#efe9e1" strokeWidth="1.5" fill="none" />
          <path d="M4 15 L4 5 M16 15 L16 5" stroke="#efe9e1" strokeWidth="1.5" fill="none" />
          <path d="M4 15 Q 10 20 16 15" stroke="#efe9e1" strokeWidth="1.5" fill="none" />
        </svg>
        {/* 3. Dots */}
        <svg className="absolute w-[20px] h-[20px] opacity-30" style={{ top: '12%', left: '88%' }} viewBox="0 0 20 20">
          <circle cx="2" cy="2" r="2" fill="#e45a0b" />
          <circle cx="10" cy="10" r="2" fill="#e45a0b" />
          <circle cx="18" cy="18" r="2" fill="#e45a0b" />
        </svg>
        {/* 4. Leaf */}
        <svg className="absolute w-[24px] h-[24px] opacity-20" style={{ top: '78%', left: '6%' }} viewBox="0 0 24 24">
          <path d="M12 24 C 12 12, 0 12, 12 0 C 24 12, 12 12, 12 24" stroke="#efe9e1" strokeWidth="1" fill="none" />
          <line x1="12" y1="24" x2="12" y2="0" stroke="#efe9e1" strokeWidth="1" />
        </svg>
        {/* 5. Ceramic plate from above */}
        <svg className="absolute w-[40px] h-[40px] opacity-15" style={{ top: '45%', left: '12%' }} viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" stroke="#e45a0b" strokeWidth="1" fill="none" />
          <circle cx="20" cy="20" r="6" stroke="#e45a0b" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* Typography */}
      <div className="relative z-20 flex flex-col items-center text-center">
        <p className="font-mono text-[10px] tracking-[0.25em] text-[#efe9e1]/40 mb-6 uppercase">
          Visakhapatnam · Est. 2025
        </p>
        
        <h1 className="font-serif font-semibold italic text-[#efe9e1] tracking-[0.03em] leading-none text-[48px] md:text-[88px]">
          {"Vantammayilu".split('').map((char, i) => (
            <span 
              key={i} 
              className="char-anim"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {char}
            </span>
          ))}
        </h1>

        <p className="tagline font-serif italic font-light text-[22px] text-[#efe9e1]/55 mt-4">
          a table for strangers
        </p>
      </div>

      {/* 3D Ceramic Plate (CSS) */}
      <div className="css-plate absolute z-10 bottom-[12%] left-1/2 -translate-x-1/2 w-[280px] h-[280px] rounded-full"></div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
        <div className="w-[1px] h-[40px] scroll-line-container overflow-hidden">
          <div className="w-full h-full scroll-line bg-gradient-to-b from-[#e45a0b]/80 to-transparent"></div>
        </div>
        <span className="font-mono text-[8px] tracking-[0.2em] text-[#efe9e1]/35 mt-2 uppercase text-center">
          scroll into the evening
        </span>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,600&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');

        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-mono { font-family: 'DM Mono', monospace; }

        .doodle-steam {
          animation: steamFloat 3s ease-in-out infinite alternate;
        }

        @keyframes steamFloat {
          from { transform: translateY(0); }
          to { transform: translateY(-6px); }
        }

        .char-anim {
          display: inline-block;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeSlideUp 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeSlideUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .tagline {
          opacity: 0;
          animation: fadeIn 1.5s ease forwards;
          animation-delay: 2s;
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        .css-plate {
          background: radial-gradient(ellipse at 35% 35%, #f5efe7 0%, #d4c9bb 60%, #b8a99a 100%);
          box-shadow: 
            inset -8px -8px 20px rgba(0,0,0,0.25), 
            inset 4px 4px 12px rgba(255,255,255,0.15), 
            0 20px 60px rgba(0,0,0,0.5);
          animation: plateFloat 6s ease-in-out infinite;
        }

        .css-plate::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 85%;
          height: 85%;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.08);
        }

        @keyframes plateFloat {
          0% { transform: translateX(-50%) translateY(0) scaleX(1); }
          50% { transform: translateX(-50%) translateY(-12px) scaleX(0.97); }
          100% { transform: translateX(-50%) translateY(0) scaleX(1); }
        }

        .scroll-line {
          transform-origin: top;
          animation: scrollLineAnim 2s cubic-bezier(0.77, 0, 0.175, 1) infinite;
        }

        @keyframes scrollLineAnim {
          0% { transform: scaleY(0); transform-origin: top; }
          40% { transform: scaleY(1); transform-origin: top; }
          41% { transform: scaleY(1); transform-origin: bottom; }
          80% { transform: scaleY(0); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }

        /* Hide the global custom cursor when in the hero section to prevent doubles */
        :global(.custom-cursor) {
          display: none !important;
        }
      `}</style>
    </section>
  );
};

export default Hero;

