import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const HtmlOverlay = () => {
  const horizontalRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: horizontalRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  return (
    <div className="w-full">
      {/* SECTION 1 — ATMOSPHERIC HERO */}
      <section className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden">
        <div className="absolute top-[10%] left-[5%] font-mono text-sm tracking-widest text-[#2F2D2A]/60">
          Visakhapatnam, India
        </div>
        
        <div className="flex flex-col items-start z-10 max-w-4xl px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
            className="font-heading italic text-6xl md:text-8xl text-[#2F2D2A] leading-tight"
          >
            A table for strangers.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="mt-8 font-sans font-light text-lg md:text-xl text-[#726E65] max-w-md"
          >
            Five courses. Slow evenings. Conversations that linger longer than dinner.
          </motion.p>
        </div>

        <div className="absolute bottom-[10%] right-[5%] font-mono text-xs tracking-[0.2em] uppercase text-[#e86321] flex flex-col items-center gap-4">
          <span>Enter slowly</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#e86321] to-transparent"></div>
        </div>
      </section>

      {/* SECTION 2 — FLOATING FRAGMENTS */}
      <section className="relative w-full min-h-[150vh] flex items-center justify-center py-32 pointer-events-none">
        <div className="w-full max-w-6xl mx-auto px-8 relative h-[100vh]">
          <div className="absolute top-[20%] left-[10%] max-w-xs p-6 bg-[#efe9e1]/60 backdrop-blur-md border border-[#2F2D2A]/5 rotate-[-2deg] pointer-events-auto hover:scale-105 transition-transform duration-700">
            <p className="font-heading italic text-xl text-[#2F2D2A]">"Someone brought a poem last Thursday."</p>
          </div>
          <div className="absolute top-[40%] right-[15%] max-w-sm p-8 bg-[#efe9e1]/50 backdrop-blur-md border border-[#2F2D2A]/5 rotate-[3deg] pointer-events-auto hover:scale-105 transition-transform duration-700">
            <p className="font-heading italic text-2xl text-[#2F2D2A]">"A stranger stayed for tea until midnight."</p>
          </div>
          <div className="absolute top-[70%] left-[25%] max-w-xs p-6 bg-[#e86321]/5 backdrop-blur-md border border-[#e86321]/10 rotate-[-1deg] pointer-events-auto hover:scale-105 transition-transform duration-700">
            <p className="font-heading italic text-xl text-[#e86321]">"Nobody asked what anyone did for work."</p>
          </div>
        </div>
      </section>
      
      {/* SECTION 3 — WHAT HAPPENS AT THE TABLE (Horizontal Scroll) */}
      <section ref={horizontalRef} className="relative h-[400vh] bg-transparent">
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <motion.div style={{ x }} className="flex gap-32 px-[10vw]">
            {[
              "Arrival", 
              "Shared table", 
              "Stories unfolding", 
              "Courses arriving", 
              "Conversations softening", 
              "Lingering after dinner"
            ].map((scene, i) => (
              <div key={i} className="w-[60vw] h-[60vh] flex items-center justify-center bg-black/5 backdrop-blur-sm border border-white/10 p-12">
                <h2 className="font-heading italic text-4xl text-[#2F2D2A] mix-blend-color-burn">{scene}</h2>
              </div>
            ))}
          </motion.div>
        </div>
        <div className="absolute bottom-[10vh] left-1/2 -translate-x-1/2 w-full text-center pointer-events-none">
          <p className="font-heading italic text-2xl text-[#726E65]">The table changes every evening. The feeling rarely does.</p>
        </div>
      </section>

      {/* SECTION 4 — THE LONG TABLE FEELING */}
      <section className="relative w-full h-[150vh] flex items-center justify-center pointer-events-none">
        <div className="text-center z-10 max-w-2xl px-4 mix-blend-color-burn">
          <p className="font-heading italic text-3xl md:text-5xl text-[#2F2D2A] mb-8">
            "I came alone. I didn't leave feeling alone."
          </p>
          <p className="font-sans font-light text-[#726E65]">
            "Nobody was performing. That was rare."
          </p>
        </div>
      </section>

      {/* SECTION 5 — UPCOMING DINNER REVEAL */}
      <section className="relative w-full h-[120vh] flex items-center justify-center">
        {/* The 3D card sits behind this, we just provide the text that floats on top or beside it */}
        <div className="z-20 pointer-events-none flex flex-col items-center text-center p-12 bg-[#efe9e1]/40 backdrop-blur-md border border-white/20">
          <h3 className="font-heading italic text-4xl text-[#2F2D2A] mb-2">Vietnamese Evenings</h3>
          <p className="font-mono text-xs uppercase tracking-widest text-[#e86321] mb-6">Eight seats. One long table.</p>
          <p className="font-sans font-light text-[#726E65] mb-8 max-w-sm">A slower Thursday night exploring complex broths and fresh herbs.</p>
          <button className="pointer-events-auto group relative font-heading italic text-xl text-[#2F2D2A] hover:text-[#e86321] transition-colors duration-500">
            Reserve a Seat
            <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-[#e86321] transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:w-full"></span>
          </button>
        </div>
      </section>

      {/* SECTION 6 — MEMORY FRAGMENTS / JOURNAL */}
      <section className="relative w-full min-h-[200vh] py-32 pointer-events-none">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 px-8">
          <div className="col-span-12 mb-24 text-center">
            <h2 className="font-heading italic text-5xl text-[#2F2D2A]">Found Fragments</h2>
          </div>
          
          <div className="col-span-5 col-start-2 mt-12 bg-black/10 aspect-square flex items-center justify-center p-8 pointer-events-auto hover:bg-black/15 transition-colors duration-700 cursor-pointer">
            <p className="font-heading italic text-2xl text-[#2F2D2A] text-center">A note left under a napkin</p>
          </div>
          
          <div className="col-span-4 col-start-8 bg-[#e86321]/10 aspect-[3/4] flex items-center justify-center p-8 pointer-events-auto hover:bg-[#e86321]/20 transition-colors duration-700 cursor-pointer">
            <p className="font-sans font-light text-[#e86321] text-center">Sketch of the first course</p>
          </div>
          
          <div className="col-span-6 col-start-4 mt-32 bg-white/40 aspect-video flex items-center justify-center p-8 pointer-events-auto hover:bg-white/60 transition-colors duration-700 cursor-pointer backdrop-blur-md">
            <p className="font-heading italic text-3xl text-[#2F2D2A] text-center">"The broth took three days."</p>
          </div>
        </div>
      </section>

      {/* SECTION 7 — FOUNDER REFLECTION */}
      <section className="relative w-full h-[100vh] flex items-center justify-center bg-[#efe9e1]/50 backdrop-blur-sm">
        <div className="max-w-3xl px-8 flex flex-col md:flex-row gap-12 items-center">
          <div className="w-48 h-64 bg-black/20 flex-shrink-0"></div>
          <div>
            <p className="font-heading italic text-3xl md:text-4xl text-[#2F2D2A] leading-relaxed">
              "I started this because I missed slow evenings. The kind where people stay longer than planned."
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 8 — FINAL INVITATION FOOTER */}
      <section className="relative w-full h-[100vh] flex flex-col items-center justify-center bg-[#050b14] text-[#efe9e1]">
        <h2 className="font-heading italic text-4xl md:text-6xl mb-12">The table returns next month.</h2>
        <div className="flex items-center border-b border-[#efe9e1]/30 pb-2 w-64 group pointer-events-auto">
          <input 
            type="email" 
            placeholder="Leave your email" 
            className="bg-transparent border-none outline-none text-[#efe9e1] font-sans font-light placeholder:text-[#efe9e1]/40 w-full"
          />
          <button className="text-[#efe9e1]/60 font-mono text-xs uppercase tracking-widest group-hover:text-[#e86321] transition-colors">
            Waitlist
          </button>
        </div>
      </section>
    </div>
  );
};

export default HtmlOverlay;
