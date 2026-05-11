import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const courses = [
  { cuisine: "Japan", phrase: "Winter breath on silk", country: "JAPAN", poem: "Snow falls on broth,\nQuiet steam, a frozen heart\nMelting in the bowl." },
  { cuisine: "Morocco", phrase: "Saffron dust and sun", country: "MOROCCO", poem: "Spices in the air,\nOrange trees whisper secrets\nTo the hungry night." },
  { cuisine: "Italy", phrase: "Ancient flour, new hands", country: "ITALY", poem: "Gold thread of pasta,\nRolling through the centuries\nOnto our shared table." },
  { cuisine: "India", phrase: "Coastal monsoon spice", country: "INDIA", poem: "Rain hitting the dust,\nGinger tea and clay-baked bread,\nHome in every bite." },
  { cuisine: "France", phrase: "Butter and blue dusk", country: "FRANCE", poem: "Crust breaks like silence,\nRich cream, velvet afternoon,\nParis in a glass." }
];

const staggeredPositions = [
  { x: -300, y: 60, r: -6 },
  { x: -150, y: -20, r: 3 },
  { x: 0, y: 40, r: -2 },
  { x: 150, y: -10, r: 5 },
  { x: 300, y: 50, r: -4 },
];

const Card = ({ course, pos, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="absolute top-1/2 left-1/2 pointer-events-auto"
      style={{
        transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) rotate(${pos.r}deg)`,
        zIndex: hovered ? 50 : 10 + index
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="course-card-inner">
        <div 
          className="relative cursor-pointer shadow-2xl transition-transform duration-700 ease-out"
          style={{
            width: '160px',
            height: '240px',
            transformStyle: 'preserve-3d',
            transform: hovered ? 'rotateY(180deg) scale(1.05)' : 'rotateY(0deg) scale(1)',
          }}
        >
          {/* Front of Card */}
          <div 
            className="absolute inset-0 bg-[#f5efe7] border border-black/10 p-5 flex flex-col justify-between items-center text-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-mono text-[8px] tracking-[0.25em] uppercase text-[#1a0e05] mt-2">{course.country}</span>
            <span className="text-serif italic font-light text-[16px] text-[#1a0e05] leading-snug px-2">{course.phrase}</span>
            <span className="text-mono text-[8px] tracking-widest text-[#1a0e05]/30 mb-2">0{index + 1}</span>
          </div>

          {/* Back of Card */}
          <div 
            className="absolute inset-0 bg-[#e45a0b] border border-white/10 p-5 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-serif italic font-light text-[14px] text-white leading-relaxed whitespace-pre-line">
              {course.poem}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Atmosphere = () => {
  const sectionRef = useRef();
  const headlineRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Wipe reveal for headline
      gsap.fromTo(headlineRef.current.querySelectorAll('.wipe-text'),
        { clipPath: 'inset(0% 100% 0% 0%)' },
        { 
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.5,
          stagger: 0.15,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          }
        }
      );
      
      // Fade up for subline
      gsap.fromTo(headlineRef.current.querySelector('.subline'),
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          delay: 0.6, 
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: "top 60%" } 
        }
      );
      
      // Staggered floating entrance for cards
      gsap.fromTo('.course-card-inner',
        { y: 80, opacity: 0 },
        { 
          y: 0, opacity: 1, 
          duration: 1.2, 
          stagger: 0.1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full min-h-screen flex items-center overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 60% 50%, #2c160a 0%, #1a0e05 50%, #0d0804 100%)'
      }}
    >
      {/* Drifting particles background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-1 h-1 bg-[#e45a0b] rounded-full blur-[1px] animate-drift"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 15}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-[10%] relative z-20 flex flex-col lg:flex-row items-center justify-between pointer-events-none">
        
        {/* Left: Headline Typography */}
        <div ref={headlineRef} className="w-full lg:w-[40%] mb-20 lg:mb-0 pointer-events-auto">
          <div className="flex flex-col">
            <h2 className="wipe-text text-[72px] font-serif italic font-light text-white leading-[1.1] m-0 p-0 block">Five courses.</h2>
            <h2 className="wipe-text text-[72px] font-serif italic font-light text-white leading-[1.1] m-0 p-0 block">Five worlds.</h2>
          </div>
          <p className="subline text-mono text-[11px] text-white/50 tracking-[0.15em] mt-10 uppercase leading-loose max-w-[280px]">
            Each evening, a different country. A different story. A different table.
          </p>
        </div>

        {/* Right: Tilted 3D Cards Plane */}
        <div className="w-full lg:w-[60%] h-[500px] relative pointer-events-none perspective-[1200px]">
          <div 
            className="absolute inset-0"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'rotateX(15deg) rotateY(-10deg) rotateZ(3deg)',
              transformOrigin: 'center center'
            }}
          >
            {courses.map((course, i) => (
              <Card key={i} course={course} pos={staggeredPositions[i]} index={i} />
            ))}
          </div>
        </div>

      </div>

      <style>{`
        .perspective-\\[1200px\\] { perspective: 1200px; }
        .animate-drift { animation: drift linear infinite; }
        @keyframes drift {
          from { transform: translate(0, 0); opacity: 0.5; }
          to { transform: translate(100px, -150px); opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default Atmosphere;
