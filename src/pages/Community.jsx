import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const artifactsData = [
  { id: 1, name: "Maya S.", personImg: "/people/11.png", artImg: "/1.png", desc: "A Polaroid from a rainy evening.", vol: "Vol 02" },
  { id: 2, name: "Rahul K.", personImg: "/people/12.png", artImg: "/2.png", desc: "A sketching of the first course.", vol: "Vol 03" },
  { id: 3, name: "Priya N.", personImg: "/people/13.png", artImg: "/3.png", desc: "A pressed jasmine flower.", vol: "Vol 01" },
  { id: 4, name: "David G.", personImg: "/people/14.png", artImg: "/4.png", desc: "A vintage matchbox.", vol: "Vol 04" },
  { id: 5, name: "Sarah & Tom", personImg: "/people/15.png", artImg: "/5.png", desc: "A handwritten thank-you note.", vol: "Vol 05" },
];

export default function Community() {
  const [hoveredId, setHoveredId] = useState(null);
  const scrollData = [...artifactsData, ...artifactsData, ...artifactsData];

  return (
    <div className="w-full relative bg-[var(--bg-primary)]">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-end pt-32 px-6 lg:px-16 overflow-hidden">
        {/* Soft background accents */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent-primary)]/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-4xl text-center relative z-10 mb-[-120px] md:mb-[-180px] mt-auto flex flex-col items-center">
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
            className="group relative inline-block bg-[#efe8db] text-[#2c2b29] border border-[#2c2b29]/10 shadow-sm hover:shadow-md transition-all duration-300 rounded-md px-10 py-4 font-body text-lg font-bold tracking-wide mt-12 mb-4 hover:bg-[var(--accent-primary)] hover:text-white hover:border-[var(--accent-primary)]"
          >
            Join the next gathering
          </Link>
        </div>

        {/* Bottom Hero Image */}
        <div className="relative w-full max-w-[1366px] mt-auto flex items-end justify-center pointer-events-none z-0">
          <img src="/ltshero.png" alt="Long Table Society" className="w-full h-auto object-cover object-bottom" />
        </div>
      </section>

      {/* 2. ARTIFACTS SECTION */}
      <section className="py-32 relative overflow-hidden bg-[var(--bg-secondary)] border-y border-[var(--text-main)]/10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <span className="font-body italic text-3xl text-[var(--accent-primary)] block mb-2 font-logo">Artifacts</span>
            <h2 className="text-5xl md:text-6xl font-heading text-[var(--text-main)]">Things we've found at the table.</h2>
          </div>

          <div className="flex w-full h-[600px] overflow-hidden gap-8 relative max-w-4xl mx-auto border-y border-[var(--text-main)]/10 py-8">
            <AnimatePresence>
              {hoveredId && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
                >
                  <div className="bg-[var(--bg-primary)] p-8 rounded-xl shadow-2xl border border-[var(--text-main)]/10 max-w-sm text-center transform backdrop-blur-md bg-opacity-95">
                    <h3 className="font-heading text-3xl text-[var(--accent-primary)] mb-2">{artifactsData.find(a => a.id === hoveredId)?.name}</h3>
                    <p className="font-body text-xl text-[var(--text-main)] my-4 italic leading-relaxed">"{artifactsData.find(a => a.id === hoveredId)?.desc}"</p>
                    <span className="font-mono text-xs tracking-widest uppercase text-[var(--text-main)]/50 border-t border-[var(--text-main)]/10 pt-4 block">{artifactsData.find(a => a.id === hoveredId)?.vol}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* People Column */}
            <div className="flex-1 flex justify-end overflow-hidden relative" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}>
              <div className={`flex flex-col gap-6 w-56 md:w-64 animate-marquee-vertical ${hoveredId ? 'pause-anim' : ''}`}>
                {scrollData.map((item, i) => (
                  <div 
                    key={`p-${i}`} 
                    className="w-56 h-56 md:w-64 md:h-64 bg-[var(--bg-primary)] border border-[var(--text-main)]/5 shadow-sm p-2 flex items-center justify-center transition-all cursor-pointer group hover:border-[var(--accent-primary)]"
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <img src={item.personImg} alt={item.name} className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Art Pieces Column */}
            <div className="flex-1 flex justify-start overflow-hidden relative" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}>
              <div className={`flex flex-col gap-6 w-56 md:w-64 animate-marquee-vertical-reverse ${hoveredId ? 'pause-anim' : ''}`}>
                {scrollData.map((item, i) => (
                  <div 
                    key={`a-${i}`} 
                    className="w-56 h-56 md:w-64 md:h-64 bg-[#faf8f5] border border-[var(--text-main)]/5 shadow-sm p-6 flex items-center justify-center transition-all cursor-pointer group hover:border-[var(--accent-primary)]"
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <img src={item.artImg} alt="Artifact" className="w-full h-full object-contain mix-blend-multiply drop-shadow-md group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONVERSATIONS WE'VE OVERHEARD (COMIC STRIP) */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-[var(--bg-primary)] border-t border-[var(--text-main)]/10 min-h-[850px]">
        {/* Cream color & texture layer */}
        <div className="absolute inset-0 paper-texture opacity-30 mix-blend-multiply pointer-events-none z-0" />
        
        {/* artifact.png Background fixed to 1366x768 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1366px] h-[768px] pointer-events-none z-0 mt-16 px-4">
          <img src="/artifact.png" alt="Background" className="w-full h-full object-contain md:object-cover shadow-2xl rounded-sm" />
        </div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10 flex flex-col items-center justify-start h-full">
          <div className="text-center absolute top-12 left-1/2 -translate-x-1/2 w-full">
            <h2 className="font-body italic text-4xl md:text-5xl lg:text-6xl text-[var(--accent-primary)] block font-logo drop-shadow-sm">Snippet Echoes</h2>
          </div>
        </div>
      </section>

      {/* 4. THE TABLE IS ALWAYS CHANGING (CTA) */}
      <section className="py-32 relative text-center overflow-hidden bg-[var(--bg-primary)] flex flex-col items-center justify-center">
        {/* Soft background accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-primary)]/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-heading text-[var(--text-main)] mb-6 leading-tight"
          >
            The table is <br className="md:hidden" /> always changing.
          </motion.h2>

          <div className="font-body text-xl md:text-2xl text-[var(--text-main)]/80 max-w-md mx-auto space-y-2 mb-12 italic">
            <p>Different cuisine.</p>
            <p>Different people.</p>
            <p className="font-heading text-[var(--accent-primary)] not-italic">Same feeling.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/dinner"
              className="btn-paper bg-[var(--accent-primary)] text-[var(--bg-primary)] border-[var(--accent-primary)] hover:bg-[var(--text-main)] hover:border-[var(--text-main)] px-10 py-5 text-xl tracking-[0.1em] rounded-full inline-block"
            >
              Find your seat
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
