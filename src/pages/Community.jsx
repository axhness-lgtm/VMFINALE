import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import EdgeDivider from '../components/EdgeDivider';

const gridImages = [
  "/grid/PUS01765.jpg",
  "/grid/PUS01922 (1).jpg",
  "/grid/PUS02024 (1).jpg",
  "/grid/PUS02027.jpg",
  "/grid/PUS02031.jpg",
  "/grid/_DSC0296.jpg",
  "/grid/_DSC0343 (1).jpg"
];

export default function Community() {
  const horizontalScrollData = [...gridImages, ...gridImages, ...gridImages];

  return (
    <div className="w-full relative bg-[var(--bg-primary)]">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 px-6 lg:px-16 overflow-hidden flex flex-col items-center">
        {/* Soft background accents */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent-primary)]/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-4xl text-center relative z-10 flex flex-col items-center">
          <div className="w-full flex flex-col items-center">
            <span className="text-[var(--accent-primary)] font-body tracking-[0.25em] uppercase text-xs md:text-sm mb-3 block font-bold">
              LONG TABLE SOCIETY
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading leading-tight text-[var(--text-main)] mb-6">
              A table that keeps growing.
            </h1>
            <div className="font-body text-lg md:text-xl text-[var(--text-main)]/80 max-w-xl mx-auto space-y-1.5 relative z-10">
              <p>Some people come once.</p>
              <p>Some keep coming back.</p>
              <p className="italic text-[var(--accent-primary)] relative inline-block mt-3 text-xl md:text-2xl">
                Either way, they leave a little something behind.
              </p>
            </div>
          </div>
          
          <Link 
            to="/dinner" 
            className="group relative inline-block bg-[var(--accent-primary)] text-white border-2 border-[var(--accent-primary)] shadow-md hover:shadow-xl transition-all duration-300 rounded-md px-10 py-4 font-body text-lg font-bold tracking-wide mt-8 mb-0 hover:bg-[var(--bg-primary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] active:bg-[var(--bg-primary)] active:text-[var(--accent-primary)] z-20"
          >
            Join the next gathering
          </Link>
        </div>

        {/* Bottom Hero Image placed right under CTA button */}
        <div className="relative w-full max-w-[1366px] -mt-20 md:-mt-36 lg:-mt-44 flex items-end justify-center pointer-events-none z-0">
          <img src="/communityfinal.png" alt="Long Table Society" className="w-full h-auto max-h-[70vh] object-contain object-bottom" />
        </div>
      </section>

      <EdgeDivider src="/edge2.png" />

      {/* 2. ARTIFACTS SECTION (ORANGE SECTION 1) */}
      <section className="py-32 relative overflow-hidden bg-[var(--accent-primary)] text-[#efe8db]">
        <div className="absolute inset-0 paper-texture opacity-20 mix-blend-multiply pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <span className="font-body italic text-3xl text-[#efe8db]/90 block mb-2 font-logo">Artifacts</span>
            <h2 className="text-5xl md:text-6xl font-heading text-[var(--bg-primary)] drop-shadow-sm">Things we've found at the table.</h2>
          </div>

          <div className="w-full overflow-hidden relative border-y border-[var(--bg-primary)]/20 py-12" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
            <div className="flex gap-8 w-max animate-marquee-horizontal">
              {horizontalScrollData.map((img, idx) => (
                <div 
                  key={`art-${idx}`} 
                  className="w-72 h-72 md:w-80 md:h-80 bg-[var(--bg-primary)] border border-white/20 shadow-xl p-3 flex items-center justify-center rounded-2xl flex-shrink-0"
                >
                  <img src={img} alt="Artifact" className="w-full h-full object-cover rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <EdgeDivider src="/edge4.png" />

      {/* 3. SNIPPET ECHOES SECTION */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-[var(--bg-primary)] flex items-center justify-center">
        
        {/* snipecho.png slightly scaled down */}
        <div className="relative w-full max-w-5xl h-auto pointer-events-none z-10 px-6 flex items-center justify-center">
          <img src="/snipecho.png" alt="Snippet Echoes" className="w-[85%] md:w-[80%] max-w-[920px] h-auto object-contain shadow-xl rounded-lg drop-shadow-md" />
        </div>
      </section>

      <EdgeDivider src="/edge2.png" />

      {/* 4. THE TABLE IS ALWAYS CHANGING (CTA - ORANGE SECTION 2) */}
      <section className="py-20 md:py-24 relative text-center overflow-hidden bg-[var(--accent-primary)] flex flex-col items-center justify-center text-[#efe8db]">
        <div className="absolute inset-0 paper-texture opacity-20 mix-blend-multiply pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-heading text-[var(--bg-primary)] mb-6 leading-tight drop-shadow-sm"
          >
            The table is <br className="md:hidden" /> always changing.
          </motion.h2>

          <div className="font-body text-xl md:text-2xl text-[var(--bg-primary)]/90 max-w-md mx-auto space-y-2 mb-12 italic">
            <p>Different cuisine.</p>
            <p>Different people.</p>
            <p className="font-heading text-white not-italic underline decoration-white/40 underline-offset-4">Same feeling.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/dinner"
              className="inline-block bg-[var(--bg-primary)] text-[var(--accent-primary)] border-2 border-[var(--bg-primary)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] hover:border-[var(--bg-primary)] px-12 py-5 text-xl font-bold tracking-[0.1em] rounded-md shadow-2xl transition-all duration-300 hover:scale-105 uppercase"
            >
              Find your seat
            </Link>
          </motion.div>
        </div>
      </section>

      <EdgeDivider src="/edge4.png" />
    </div>
  );
}
