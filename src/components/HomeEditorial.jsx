import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import './HomeEditorial.css';

const HomeEditorial = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="home-editorial">
      {/* SECTION 1 — HERO */}
      <section className="editorial-section hero-section relative overflow-hidden">
        <motion.div 
          className="hero-content relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div className="hero-annotation mb-8" variants={fadeInUp}>
            <span className="font-script text-[#e45a0b] opacity-60 text-lg italic">
              — A signal from a living house at night.
            </span>
          </motion.div>

          <motion.h1 className="hero-headline font-serif" variants={fadeInUp}>
            <span className="text-drift" style={{ '--drift-rotation': '-1deg' }}>A table</span> <br />
            <span className="text-drift" style={{ '--drift-rotation': '0.5deg', '--drift-y': '-10px' }}>for strangers.</span>
          </motion.h1>

          <motion.p className="hero-subline max-w-lg mt-8" variants={fadeInUp}>
            Five courses. Slow evenings. <br />
            <span className="opacity-60">Conversations that linger longer than dinner.</span>
          </motion.p>
          
          <motion.div className="hero-btns mt-12 flex gap-8" variants={fadeInUp}>
            <Link to="/dinner" className="btn-primary group relative">
              Reserve a Seat
              <span className="discovered-note left-full ml-4 whitespace-nowrap">Only eight spots left.</span>
            </Link>
            <Link to="/community" className="btn-secondary">Explore the Evening</Link>
          </motion.div>
        </motion.div>
        
        {/* HERO FRAGMENTS */}
        <div className="hero-ambient-glow"></div>
        
        <motion.div 
          className="absolute top-[20%] right-[10%] w-64 h-64 opacity-20 pointer-events-none"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src="https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover rounded-full mix-blend-multiply grayscale contrast-125" alt="Bowl Fragment" />
        </motion.div>

        <motion.div 
          className="absolute bottom-[10%] left-[5%] w-48 opacity-30 pointer-events-none"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="font-script text-2xl text-[#e45a0b] rotate-[-12deg]">
            “The steam still <br /> rises from the bowls.”
          </div>
        </motion.div>

        <div className="hero-bg-overlay"></div>
      </section>

      {/* SECTION 2 — WHAT VANTAMMAYILU IS — CLASSIFICATION WALL */}
      <section className="editorial-section classification-wall-section py-32 bg-[#efe9e1]">
        <div className="container">
          <div className="wall-header mb-16">
            <span className="section-label text-[#e45a0b]">/ CLASSIFICATION OF THE TEMPORARY</span>
            <h2 className="section-title mt-4">Notes on a world <br /> that disappears by midnight.</h2>
          </div>

          <div className="classification-grid">
            {/* LARGE FRAGMENT */}
            <div className="classification-item fragment-large col-span-7 bg-white/20 p-12 border-l border-[#e45a0b]/10 group relative">
              <span className="fragment-tag text-xs tracking-widest opacity-40">ITEM #01 — THE INTENTION</span>
              <p className="section-body text-3xl leading-relaxed mt-8">
                Vantammayilu began with a simple idea: <br />
                that people still crave <span className="text-[#e45a0b] italic">slower</span> forms of discovery. 
              </p>
              {/* Hand-drawn arrow */}
              <svg className="absolute -bottom-12 right-12 w-24 h-24 text-[#e45a0b]/30" viewBox="0 0 100 100">
                <path d="M10,50 Q40,10 90,50 M90,50 L70,40 M90,50 L70,60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div className="discovered-note bottom-8 right-8">“Written on a napkin in 2023.”</div>
            </div>

            {/* FLOATING SCRAPS */}
            <div className="classification-item col-span-5 flex flex-col gap-12">
              <div className="scrap-paper p-8 bg-[#fdfaf6] shadow-sm rotate-[1deg] border border-black/5 group">
                <span className="text-xs opacity-30">OBSERVATION #22</span>
                <p className="mt-4 font-serif text-xl italic">“Someone brought a poem last Thursday. Nobody asked what anyone did for work.”</p>
                <div className="discovered-note top-4 right-4">A rare occurrence.</div>
              </div>

              <div className="scrap-paper p-8 bg-[#fdfaf6] shadow-sm rotate-[-1.5deg] border border-black/5 group self-end max-w-sm">
                <p className="font-sans text-sm tracking-wide leading-loose">
                  One guest stayed back helping clean plates because the evening felt too nice to end. 
                  <span className="block mt-4 text-[#e45a0b]">— MARGINALIA</span>
                </p>
              </div>
            </div>

            {/* SMALL LABELS */}
            <div className="classification-item col-span-4 mt-12">
              <div className="museum-tag border border-[#13368d]/10 p-6 flex flex-col gap-2 hover:bg-white/40 transition-colors cursor-help group">
                <span className="text-[10px] uppercase tracking-widest text-[#e45a0b]">Temporary World</span>
                <p className="text-sm opacity-60">Everything here is built for one night. It leaves no residue but memory.</p>
                <div className="discovered-note bottom-full mb-2 italic">“That disappears by midnight.”</div>
              </div>
            </div>
            
            <div className="classification-item col-span-8 mt-12 flex justify-center">
               <div className="torn-paper-note font-script text-4xl opacity-40 hover:opacity-100 transition-opacity rotate-[2deg] cursor-default">
                 Conversations recently happened here.
               </div>
            </div>
          </div>
           {/* SECTION 3 — THE EVENING — MEMORY CINEMA */}
      <section className="editorial-section evening-memory-section py-32 overflow-hidden">
        <div className="container">
          <div className="memory-header mb-24 relative">
            <span className="section-label">/ CINEMATIC RECONSTRUCTION</span>
            <h2 className="section-title">The anatomy of <br /> a lingering evening.</h2>
            {/* Hand-drawn circle around 'lingering' */}
            <svg className="absolute top-1/2 left-48 w-64 h-24 text-[#e45a0b]/20 pointer-events-none" viewBox="0 0 200 100">
               <ellipse cx="100" cy="50" rx="90" ry="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="500" strokeDashoffset="500">
                 <animate attributeName="stroke-dashoffset" from="500" to="0" dur="3s" fill="freeze" />
               </ellipse>
            </svg>
          </div>

          <div className="memory-architecture relative h-[800px]">
            {[
              { 
                label: 'Arrival', 
                img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800', 
                desc: 'The soft hum of a home preparing for guests.',
                pos: { top: '0%', left: '5%', width: '400px' },
                rotate: '-2deg',
                delay: 0.2
              },
              { 
                label: 'Conversation', 
                img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800', 
                desc: 'Words that flow like the wine we share.',
                pos: { top: '15%', right: '5%', width: '350px' },
                rotate: '3deg',
                delay: 0.5
              },
              { 
                label: 'Laughter', 
                img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800', 
                desc: 'The universal language of a table well-hosted.',
                pos: { bottom: '10%', left: '20%', width: '300px' },
                rotate: '1deg',
                delay: 0.8
              },
              { 
                label: 'Lingering', 
                img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800', 
                desc: 'Nobody is in a rush to leave.',
                pos: { bottom: '5%', right: '15%', width: '450px' },
                rotate: '-1.5deg',
                delay: 1.1
              }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className="memory-fragment absolute group"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item.delay, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ ...item.pos, rotate: item.rotate }}
              >
                <div className="memory-img-frame relative overflow-hidden shadow-2xl transition-transform duration-[2000ms] group-hover:scale-[1.02]">
                   <img src={item.img} alt={item.label} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-1000" />
                   <div className="absolute inset-0 bg-[#e45a0b]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 mix-blend-overlay"></div>
                </div>
                <div className="memory-caption mt-6 opacity-40 group-hover:opacity-100 transition-all duration-1000 translate-y-2 group-hover:translate-y-0">
                  <span className="text-[10px] tracking-[0.3em] uppercase block mb-2">{item.label}</span>
                  <p className="font-serif text-lg leading-relaxed">{item.desc}</p>
                </div>
                {/* DISCOVERED ANNOTATION */}
                <div className="discovered-note bottom-full left-1/2 -translate-x-1/2 mb-4 whitespace-nowrap">
                   {i === 0 ? "Someone missed their cab..." : i === 1 ? "Brought poems." : "The steam still rises."}
                </div>
              </motion.div>
            ))}

            {/* FLOATING PARTICLES WITHIN SECTION */}
            <div className="absolute inset-0 pointer-events-none">
               {[...Array(10)].map((_, i) => (
                 <motion.div 
                   key={i}
                   className="absolute w-1 h-1 rounded-full bg-[#e45a0b]/20"
                   style={{ 
                     top: `${Math.random() * 100}%`, 
                     left: `${Math.random() * 100}%` 
                   }}
                   animate={{ 
                     y: [0, -100, 0],
                     opacity: [0, 0.5, 0]
                   }}
                   transition={{ 
                     duration: 10 + Math.random() * 10, 
                     repeat: Infinity, 
                     delay: Math.random() * 5 
                   }}
                 />
               ))}
            </div>
          </div>
        </div>
      </section>       </div>
      </section>

      {/* SECTION 4 — FOOD — SOCIAL INTERACTION */}
      <section className="editorial-section food-social-section py-32 bg-[#13368d]/5">
        <div className="container">
          <div className="editorial-grid items-center">
            <div className="col-span-5">
              <span className="section-label">/ THE LIVING TABLE</span>
              <h2 className="section-title text-[#13368d]">Social choreography <br /> over a shared plate.</h2>
              <p className="section-body mt-8 opacity-60">
                Each cuisine is an emotional environment. <br />
                We focus on hands serving, bowls passing, and the messy beauty of a table in full flow.
              </p>
            </div>
            <div className="col-span-7">
              <div className="interaction-collage relative h-[500px]">
                <motion.div 
                  className="absolute top-0 right-0 w-80 h-96 overflow-hidden shadow-xl"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Serving" />
                  <div className="discovered-note bottom-4 left-4 text-white">“The third course was an anchor.”</div>
                </motion.div>
                <motion.div 
                  className="absolute bottom-0 left-0 w-64 h-80 overflow-hidden shadow-xl rotate-[-3deg]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <img src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Sharing" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — UPCOMING DINNER — EMOTIONAL PREVIEW */}
      <section className="editorial-section dinner-environment-section relative py-48 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover opacity-20 scale-110 blur-sm" alt="Atmosphere" />
           <div className="absolute inset-0 bg-gradient-to-b from-[#efe9e1] via-transparent to-[#efe9e1]"></div>
        </div>

        <div className="container relative z-10 text-center">
          <motion.span 
            className="preview-eyebrow uppercase tracking-[0.4em] text-[10px] text-[#e45a0b]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            / THE NEXT ENVIRONMENT
          </motion.span>
          <motion.h2 
            className="preview-theme font-serif text-7xl mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Vietnamese Evenings
          </motion.h2>
          <motion.div 
            className="preview-details mt-12 flex flex-col gap-4 font-sans text-sm tracking-widest opacity-60 uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span>Eight seats. One long table.</span>
            <span>JUNE 14 / 8:00 PM / THE LOFT</span>
          </motion.div>
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/dinner" className="btn-primary px-12 py-6 text-lg hover:scale-105 transition-transform">
              Claim a seat at the table
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SECTION 6 — MEMORY ARCHIVE CLOUD */}
      <section className="editorial-section memory-cloud-section py-32 bg-[#efe9e1]">
        <div className="container relative">
          <div className="archive-header text-center mb-24">
             <span className="section-label">/ THE LONG TABLE SOCIETY</span>
             <h2 className="section-title">An archive of <br /> collective residue.</h2>
          </div>

          <div className="archive-cloud relative h-[700px]">
             {[
               { type: 'polaroid', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400', note: 'Stayed until 1:12am.', pos: { top: '5%', left: '10%' }, rotate: '-5deg' },
               { type: 'note', text: 'Brought poems about the sea.', pos: { top: '20%', right: '15%' }, rotate: '3deg' },
               { type: 'postcard', img: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&q=80&w=400', note: 'Asked everyone about their favorite city.', pos: { bottom: '15%', left: '20%' }, rotate: '-2deg' },
               { type: 'recipe', text: 'Handwritten recipe passed around like contraband.', pos: { bottom: '10%', right: '10%' }, rotate: '6deg' },
               { type: 'polaroid', img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=400', note: 'Shared a secret about a hidden garden.', pos: { top: '40%', left: '45%' }, rotate: '1deg' }
             ].map((item, i) => (
               <motion.div 
                 key={i}
                 className={`archive-item absolute group cursor-pointer ${item.type}`}
                 style={{ ...item.pos, rotate: item.rotate }}
                 whileHover={{ scale: 1.05, rotate: '0deg', zIndex: 50 }}
                 transition={{ type: 'spring', stiffness: 300, damping: 20 }}
               >
                 {item.img ? (
                   <div className="polaroid-frame p-3 pb-12 bg-white shadow-xl border border-black/5">
                      <div className="w-48 h-48 overflow-hidden bg-gray-100">
                        <img src={item.img} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="Archive" />
                      </div>
                      <div className="discovered-note bottom-4 left-4 text-xs">{item.note}</div>
                   </div>
                 ) : (
                   <div className="scrap-note p-6 bg-[#fdfaf6] shadow-md border-l-2 border-[#e45a0b]/20 max-w-xs">
                      <p className="font-serif italic text-lg opacity-80">{item.text}</p>
                   </div>
                 )}
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — JOURNAL — THE QUIET ROOM */}
      <section className="editorial-section quiet-journal-section py-48 bg-[#efe9e1]">
        <div className="container max-w-4xl mx-auto text-center">
          <span className="section-label opacity-40">/ THE QUIET ROOM</span>
          <h2 className="section-title mt-8 text-4xl leading-tight">Gatherings are <br /> temporary, but the <br /> <span className="italic">resonance</span> remains.</h2>
          
          <div className="journal-entry-preview mt-24 text-left group">
            <span className="text-[10px] uppercase tracking-widest opacity-40">LATEST ENTRY</span>
            <div className="mt-6 flex gap-12 items-start">
               <div className="w-1/2 overflow-hidden border border-black/5">
                 <img src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800" className="w-full grayscale group-hover:grayscale-0 transition-all duration-[2000ms]" alt="Journal" />
               </div>
               <div className="w-1/2 pt-4">
                 <h3 className="font-serif text-2xl group-hover:text-[#e45a0b] transition-colors duration-1000">The architecture of a conversation.</h3>
                 <p className="mt-6 text-sm opacity-60 leading-loose">
                   We spent four hours talking about things that don't exist. The wine was cold, but the room was warm.
                 </p>
                 <Link to="/journal" className="inline-block mt-8 text-xs uppercase tracking-widest border-b border-[#e45a0b]/40 pb-1 hover:border-[#e45a0b] transition-all">
                   Read the Journal ↗
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — FINAL CLOSE — THE AFTERGLOW */}
      <section className="editorial-section final-afterglow-section h-screen flex items-center justify-center relative bg-[#0d0d0d] overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="shadow-drift"></div>
           <div className="candle-flicker"></div>
        </div>

        <div className="text-center z-10">
           <motion.div 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             transition={{ duration: 3 }}
             className="text-white/40 font-script text-3xl italic"
           >
             Leaving the house at night.
           </motion.div>
           
           <motion.div 
             className="mt-24"
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             transition={{ delay: 1, duration: 2 }}
           >
              <Link to="/reserve" className="text-[#efe9e1] border border-[#efe9e1]/20 px-12 py-5 rounded-full hover:bg-[#efe9e1] hover:text-black transition-all duration-1000 uppercase tracking-[0.3em] text-[10px]">
                The table is waiting
              </Link>
           </motion.div>
        </div>

        {/* DISTANT BLUR LIGHTS */}
        <div className="absolute bottom-20 left-1/4 w-32 h-32 bg-[#e45a0b]/10 blur-[100px] animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-[#13368d]/10 blur-[120px] animate-pulse"></div>
      </section>

      <Footer />
    </div>
  );
};

export default HomeEditorial;
