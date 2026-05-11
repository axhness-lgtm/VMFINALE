import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Society = () => {
  const sectionRef = useRef();
  const contentRef = useRef();

  useEffect(() => {
    if (contentRef.current) {
      const paragraphs = contentRef.current.querySelectorAll('p, h3, a');
      gsap.fromTo(paragraphs,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 1,
          stagger: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          }
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#efe9e1] py-32 flex flex-col items-center relative overflow-hidden">
      <div ref={contentRef} className="max-w-[560px] text-center space-y-12 px-6 z-10">
        <p className="text-serif italic text-2xl leading-relaxed opacity-80 text-black">
          This is not just one dinner. It is a slow-growing map of human connections. 
          A society that doesn't meet in a hall, but across a table, one evening at a time.
        </p>
        <p className="text-serif italic text-2xl leading-relaxed opacity-80 text-black">
          We believe in the kind of conversation that requires three hours and two helpings of dessert. 
          The kind that makes the world feel smaller, warmer, and more familiar.
        </p>
        <h3 className="text-[56px] italic leading-tight orange my-16">
          "You don't know who you'll meet. That's the point."
        </h3>
        <a href="/society" className="inline-block text-mono text-[9px] uppercase tracking-[0.25em] border-b border-[#e45a0b] pb-2 hover:opacity-70 transition-opacity text-black">
          Join the society →
        </a>
      </div>

      <div className="mt-32 w-full max-w-4xl px-8 z-10">
        <div className="aspect-[21/9] border border-black/5 relative overflow-hidden bg-[#e8e0d5]/30">
          <div className="absolute inset-0 bg-gradient-to-t from-[#e8e0d5] to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[1px] bg-[#e45a0b]/20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] flex justify-between">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-[#e45a0b]/30 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 60px' }}></div>
    </section>
  );
};

export default Society;
