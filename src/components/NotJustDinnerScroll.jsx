import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotJustDinnerScroll() {
  const [currentSet, setCurrentSet] = useState(0);

  const handleNext = () => {
    if (currentSet < 4) {
      setCurrentSet(prev => prev + 1);
    } else {
      setCurrentSet(0);
    }
  };

  return (
    <section className="relative w-full min-h-[540px] md:min-h-[600px] py-12 flex flex-col justify-center items-center bg-[var(--bg-primary)] text-[var(--text-main)] select-none overflow-hidden">
      {/* Paper texture overlay */}
      <div className="absolute inset-0 paper-texture opacity-30 mix-blend-multiply pointer-events-none z-0" />

      {/* Main Display Container */}
      <div className="w-full flex items-center justify-center relative container mx-auto px-6 md:px-12 max-w-7xl z-10 min-h-[380px] md:min-h-[440px]">
        
        {/* ================= BACKGROUND WATERMARK / TITLE: Not just a dinner. ================= */}
        <motion.div
          animate={{
            opacity: currentSet === 0 ? 1 : 0.10,
            scale: currentSet === 0 ? 1 : 1.05,
            y: currentSet === 0 ? 0 : -10,
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none z-10"
        >
          <h2 className="font-logo text-6xl md:text-8xl lg:text-9xl text-[var(--accent-primary)] drop-shadow-sm text-center transform -rotate-2 leading-none">
            Not just a dinner.
          </h2>
        </motion.div>

        {/* ================= REVEALED SETS (1 to 4) ================= */}
        <AnimatePresence mode="wait">
          {/* SET 1: nd1.png (Left) & Centered Text (Right) */}
          {currentSet === 1 && (
            <motion.div
              key="set1"
              initial={{ opacity: 0, y: 25, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.98 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 items-center w-full z-20"
            >
              {/* Image Left */}
              <div className="lg:col-span-6 flex items-center justify-center">
                <img
                  src="/nd1.png"
                  alt="Food starting point"
                  loading="eager"
                  className="w-full max-w-[520px] md:max-w-[620px] lg:max-w-[700px] h-[340px] md:h-[440px] lg:h-[500px] object-contain drop-shadow-2xl mx-auto scale-115 md:scale-130"
                />
              </div>

              {/* Text Right */}
              <div className="lg:col-span-6 text-center lg:text-left relative z-20 px-4">
                <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl text-[var(--text-main)] leading-[1.35] tracking-tight font-normal max-w-lg mx-auto lg:mx-0">
                  Food is where it begins.<br />
                  <span className="text-[var(--accent-primary)] italic">Where it ends is up to the room.</span>
                </h3>
              </div>
            </motion.div>
          )}

          {/* SET 2: Centered Text (Left) & nd2.png (Right) */}
          {currentSet === 2 && (
            <motion.div
              key="set2"
              initial={{ opacity: 0, y: 25, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.98 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 items-center w-full z-20"
            >
              {/* Text Left */}
              <div className="lg:col-span-6 order-2 lg:order-1 text-center lg:text-left relative z-20 px-4">
                <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl text-[var(--text-main)] leading-[1.35] tracking-tight font-normal max-w-lg mx-auto lg:mx-0">
                  No hosts steering the table.<br />
                  <span className="text-[var(--accent-primary)] italic">No forced icebreakers.</span>
                </h3>
              </div>

              {/* Image Right */}
              <div className="lg:col-span-6 order-1 lg:order-2 flex items-center justify-center">
                <img
                  src="/nd2.png"
                  alt="No hosts steering table"
                  loading="eager"
                  className="w-full max-w-[520px] md:max-w-[620px] lg:max-w-[700px] h-[340px] md:h-[440px] lg:h-[500px] object-contain drop-shadow-2xl mx-auto scale-115 md:scale-130"
                />
              </div>
            </motion.div>
          )}

          {/* SET 3: Centered Text (Left) & nd3.png (Right) */}
          {currentSet === 3 && (
            <motion.div
              key="set3"
              initial={{ opacity: 0, y: 25, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.98 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 items-center w-full z-20"
            >
              {/* Text Left */}
              <div className="lg:col-span-6 order-2 lg:order-1 text-center lg:text-left relative z-20 px-4">
                <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl text-[var(--text-main)] leading-[1.35] tracking-tight font-normal max-w-lg mx-auto lg:mx-0">
                  It's about the people around the table.
                </h3>
              </div>

              {/* Image Right */}
              <div className="lg:col-span-6 order-1 lg:order-2 flex items-center justify-center">
                <img
                  src="/nd3.png"
                  alt="The people around the table"
                  loading="eager"
                  className="w-full max-w-[520px] md:max-w-[620px] lg:max-w-[700px] h-[340px] md:h-[440px] lg:h-[500px] object-contain drop-shadow-2xl mx-auto scale-115 md:scale-130"
                />
              </div>
            </motion.div>
          )}

          {/* SET 4: nd4.png (Doodle Line) & Centered Final Text */}
          {currentSet === 4 && (
            <motion.div
              key="set4"
              initial={{ opacity: 0, y: 25, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.98 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="flex flex-col items-center justify-center w-full z-20"
            >
              {/* Centered Final Text brought lower down right over/closer to the thread */}
              <div className="text-center relative z-20 max-w-5xl px-4 mx-auto -mb-6 md:-mb-12">
                <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl text-[var(--text-main)] leading-[1.35] tracking-tight font-normal">
                  It's about the frequency the room creates.
                </h3>
              </div>

              {/* Doodle Line threading directly across below text */}
              <div className="w-full flex items-center justify-center pointer-events-none z-10 px-2 -mt-2 md:-mt-4">
                <img
                  src="/nd4.png"
                  alt="Threading doodle line"
                  loading="eager"
                  className="w-full max-w-7xl h-[280px] md:h-[380px] lg:h-[450px] object-contain opacity-95 mix-blend-multiply mx-auto scale-125 md:scale-150"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================= FIXED ORANGE CTA BOX (CLICK HERE! -> Simple Arrow -> CLICK AGAIN!) ================= */}
      <div className="w-full flex flex-col items-center justify-center z-50 mt-4 md:mt-6 pb-2 relative">
        <motion.button
          onClick={handleNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[var(--accent-primary)] text-white border-2 border-[var(--accent-primary)] hover:bg-[var(--text-main)] hover:border-[var(--text-main)] transition-all duration-300 rounded-md shadow-lg px-6 py-2.5 min-w-[150px] h-11 flex items-center justify-center cursor-pointer select-none group"
        >
          {currentSet === 0 ? (
            <span className="uppercase tracking-[0.14em] text-white font-normal text-base md:text-lg leading-none pt-0.5" style={{ fontFamily: 'Hibernate, sans-serif' }}>
              CLICK HERE!
            </span>
          ) : currentSet < 4 ? (
            <span className="flex items-center justify-center text-white text-2xl md:text-3xl pt-0.5 leading-none transition-transform duration-300 group-hover:translate-x-1.5" style={{ fontFamily: 'Hibernate, sans-serif' }}>
              →
            </span>
          ) : (
            <span className="flex items-center gap-2 uppercase tracking-[0.12em] text-white font-normal text-base md:text-lg leading-none pt-0.5" style={{ fontFamily: 'Hibernate, sans-serif' }} title="Replay sequence">
              <span>CLICK AGAIN!</span>
            </span>
          )}
        </motion.button>
      </div>
    </section>
  );
}

