import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import ScrollHighlight from '../components/ScrollHighlight';
import EdgeDivider from '../components/EdgeDivider';

function useColumns() {
  const [cols, setCols] = useState(5);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setCols(1);
      else if (w < 1024) setCols(2);
      else if (w < 1280) setCols(3);
      else setCols(4);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return cols;
}

const gridPhotos = [
  "/grid/PUS01765.jpg",
  "/grid/PUS01922 (1).jpg",
  "/grid/PUS02024 (1).jpg",
  "/grid/PUS02027.jpg",
  "/grid/PUS02031.jpg",
  "/grid/_DSC0296.jpg",
  "/grid/_DSC0343 (1).jpg"
];

const flowGridItems = Array.from({ length: 12 }).map((_, i) => {
  const pseudoRandom = Math.abs(Math.sin(i * 12.9898 + 78.233)) * 43758.5453;
  const uniqueAspectRatio = 0.7 + (pseudoRandom % 0.8);
  
  return {
    id: i + 1,
    imgSrc: gridPhotos[i % gridPhotos.length],
    aspectRatio: uniqueAspectRatio,
    altText: `Vantammayilu Gathering ${i + 1}`
  };
});

const HoverVideoCard = ({ imgSrc, aspectRatio, altText, isLast }) => {
  return (
    <div 
      style={{ 
        aspectRatio: isLast ? undefined : aspectRatio,
        minHeight: isLast ? '220px' : undefined
      }}
      className={`relative w-full rounded-xl overflow-hidden shadow-lg hover-lift hover:shadow-2xl group cursor-pointer inline-block bg-[#efe8db] will-change-transform ${isLast ? 'flex-grow mb-0' : 'mb-0'}`}
    >
      <img 
        src={imgSrc} 
        alt={altText} 
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform" 
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />
    </div>
  );
};

export default function Home() {
  const cols = useColumns();
  const columns = Array.from({ length: cols }, () => []);
  flowGridItems.forEach((item, i) => columns[i % cols].push(item));

  const heroRef = useRef(null);
  const notJustDinnerRef = useRef(null);
  const flowRef = useRef(null);
  const destConstraintsRef = useRef(null);





  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityFade = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.reveal-item', {
        y: 40,
        opacity: 0,
        duration: 1.5,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.1
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full relative">

      {/* 1. HERO SECTION */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6 lg:px-16 overflow-hidden">
        {/* Cinematic Video Background */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/assets/heroland.mp4" type="video/mp4" />
          </video>
          {/* Semi-transparent overlay to ensure excellent readability of off-white text */}
          <div className="absolute inset-0 bg-black/25" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10 flex flex-col items-center justify-center text-center h-full">

          <div className="flex flex-col items-center relative z-20 max-w-4xl">
            <span className="reveal-item text-orange font-body tracking-[0.25em] uppercase text-xs md:text-sm mb-4 block font-bold" style={{ WebkitTextStroke: '0.5px var(--accent-primary)' }}>
              Visakhapatnam, India
            </span>
            <h1 className="reveal-item text-4xl md:text-6xl lg:text-7xl font-heading leading-[1.08] text-cream mb-6 drop-shadow-[0_4px_6px_rgba(59,43,36,0.9)]">
              For people who love <span className="text-orange italic drop-shadow-[1px_1.5px_0.5px_rgba(255,255,255,1)]">discovering the world.</span>
            </h1>
            <p className="reveal-item font-body text-base md:text-lg text-cream/90 mb-6 max-w-xl leading-relaxed drop-shadow-[0_4px_6px_rgba(59,43,36,0.9)]">
              Every week, eight strangers gather around one table to explore a different cuisine, share stories, and leave with something more than a good meal.
            </p>

            <div className="reveal-item flex flex-col sm:flex-row gap-6 items-center justify-center mt-2">
              <Link to="/dinner" className="group relative btn-paper !overflow-visible bg-cream text-[var(--text-main)] border-[var(--text-main)] border hover:bg-orange hover:text-[var(--bg-primary)] hover:border-orange transition-colors text-sm px-6 py-3 drop-shadow-md rounded-md font-body font-bold tracking-wider uppercase z-10">
                <img
                  src="/assets/d2.png"
                  alt="doodle"
                  className="absolute -top-10 -left-6 w-16 h-16 object-contain opacity-0 translate-y-4 scale-50 -rotate-12 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:-rotate-12 transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none -z-10"
                />
                Upcoming dinner
              </Link>
              <Link to="/about" className="group relative btn-paper !overflow-visible bg-cream text-[var(--text-main)] border-[var(--text-main)] border hover:bg-orange hover:text-[var(--bg-primary)] hover:border-orange transition-colors text-sm px-6 py-3 drop-shadow-md rounded-md font-body font-bold tracking-wider uppercase z-10">
                <img
                  src="/assets/d1.png"
                  alt="doodle"
                  className="absolute -top-12 -right-6 w-20 h-20 object-contain opacity-0 translate-y-4 scale-50 rotate-12 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:rotate-12 transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none -z-10"
                />
                Our Story
              </Link>
            </div>
          </div>

        </div>
      </section>

      <EdgeDivider src="/edge.png" />

      {/* 2. NOT JUST DINNER */}
      <section className="bg-[var(--bg-primary)] relative py-20 md:py-28 flex flex-col justify-center items-center overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src="/texture.png"
            alt="paper texture"
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-60 mix-blend-multiply"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center px-6">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-logo text-[var(--accent-primary)] drop-shadow-md text-center">
            Not just a dinner.
          </h2>
        </div>
      </section>

      <EdgeDivider src="/edge5.png" />

      {/* 3. WHAT USUALLY HAPPENS */}
      <section className="relative bg-[var(--bg-primary)] py-20 md:py-24 px-2 md:px-4 w-full">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-[var(--text-main)] flex flex-wrap items-center justify-center gap-2 md:gap-4">
            <span className="font-logo text-5xl md:text-6xl lg:text-7xl text-[var(--accent-primary)] font-normal -rotate-2 inline-block">Glimpses</span>
            <span className="font-heading">from the table</span>
          </h2>
        </div>

        <div className="w-full relative z-10">
          <div className="flex w-full gap-2 md:gap-3 items-stretch">
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-2 md:gap-3 flex-1">
                {col.map((item, itemIdx) => (
                  <HoverVideoCard key={item.id} {...item} isLast={itemIdx === col.length - 1} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <EdgeDivider src="/edge3.png" />

      {/* 4. EIGHT SEATS */}
      <section className="py-20 md:py-24 bg-[var(--accent-primary)] relative overflow-hidden text-[#efe8db]" style={{ cursor: "url('/custcor.png'), auto" }}>
        <div className="absolute inset-0 paper-texture opacity-20 mix-blend-multiply pointer-events-none z-0" />
        
        {/* Large overlapping background "8" */}
        <div className="absolute right-0 bottom-0 lg:right-[-5%] lg:-bottom-20 text-[25rem] md:text-[35rem] lg:text-[45rem] font-heading font-light text-white/10 select-none pointer-events-none leading-none">
          8
        </div>

        {/* Small floating doodle */}
        <img src="/ass2.png" className="absolute top-[20%] right-[15%] w-24 md:w-32 opacity-20 rotate-12 mix-blend-multiply pointer-events-none" alt="" />
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10 flex flex-col md:flex-row items-center gap-16 md:gap-24">
          
          <div className="w-full md:w-5/12 relative pl-4 md:pl-0">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#efe8db] mb-6 block border-b border-[#efe8db]/30 pb-2 w-max">The Capacity</span>
            <h2 className="text-7xl md:text-8xl lg:text-9xl font-heading text-[var(--bg-primary)] leading-[0.9] tracking-tight mb-4 drop-shadow-sm">
              Eight<br /><span className="text-white italic">seats.</span>
            </h2>
          </div>
          
          <div className="w-full md:w-7/12 relative mt-8 md:mt-0">
            <div className="bg-[#fcfbf9] text-[var(--text-main)] p-10 md:p-14 shadow-2xl border border-[#3b2b24]/5 hover-lift relative group -rotate-1 z-10 transition-transform duration-500 rounded-2xl">
              <div className="masking-tape w-24 h-6 -top-3 left-1/2 -translate-x-1/2 rotate-[-2deg]" />
              <div className="absolute top-6 right-6 stamp rotate-12 opacity-60 scale-75 border-[var(--accent-primary)] text-[var(--accent-primary)]">INTIMATE</div>
              
              <div className="space-y-8 relative z-10">
                <div>
                  <h3 className="font-heading text-3xl md:text-4xl text-[var(--text-main)] leading-tight">Small enough</h3>
                  <p className="font-body text-xl text-[var(--text-main)]/70 italic mt-2">for everyone to be part of the conversation.</p>
                </div>
                
                <div className="w-12 h-[1px] bg-[var(--accent-primary)]/40" />
                
                <div>
                  <h3 className="font-heading text-3xl md:text-4xl text-[var(--accent-primary)] leading-tight">Big enough</h3>
                  <p className="font-body text-xl text-[var(--text-main)]/70 italic mt-2">for unexpected friendships.</p>
                </div>
              </div>
            </div>
            
            {/* Background offset card for depth */}
            <div className="absolute inset-0 bg-[#efe8db] border border-[#3b2b24]/10 shadow-lg translate-x-3 translate-y-3 rotate-2 z-0 hidden md:block pointer-events-none rounded-2xl" />
          </div>
          
        </div>
      </section>

      <EdgeDivider src="/edge4.png" />

      {/* 5. EVERY DINNER BEGINS SOMEWHERE ELSE */}
      <section className="relative overflow-hidden bg-[var(--bg-primary)] w-full py-20 md:py-24 mx-auto">
        {/* Background Paper Texture */}
        <div className="absolute inset-0 paper-texture opacity-40 mix-blend-multiply z-0 pointer-events-none" />

        <div className="container mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Text Content */}
            <div className="lg:col-span-5 relative z-20 text-center lg:text-left">
              <span className="font-logo text-5xl md:text-7xl text-[var(--accent-primary)] mb-4 block transform -rotate-2 drop-shadow-sm">
                Our Destinations
              </span>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading text-[var(--text-main)] leading-tight mb-8">
                Every dinner begins somewhere else.
              </h2>
              <p className="font-body text-xl text-[var(--text-main)]/70 italic max-w-md mx-auto lg:mx-0 leading-relaxed">
                We draw inspiration from around the globe, turning distant memories into shared plates and unforgettable conversations.
              </p>
              
              {/* Little decorative elements */}
              <img src="/assets/d1.png" className="absolute -bottom-16 right-10 w-20 opacity-30 rotate-12 hidden lg:block" alt="doodle" />
            </div>

            {/* Structured Polaroid Grid */}
            <div className="lg:col-span-7 relative mt-16 lg:mt-0">
              {/* Background decorative square */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[120%] bg-[#f4ebd9]/80 border border-[#3b2b24]/5 rounded-[3rem] -rotate-1 z-0 shadow-inner hidden md:block" />
              
              <div className="grid grid-cols-2 gap-6 md:gap-10 relative z-10 p-4 md:p-10">
                
                {/* Card 1 */}
                <div className="polaroid hover-lift rotate-2 translate-y-4 md:translate-y-8 z-10 transition-all duration-500 hover:z-30">
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#efe8db]">
                    <img src="/fo1.png" alt="Italy" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                  </div>
                  <div className="mt-4 flex justify-between items-center px-1">
                    <span className="font-heading text-lg md:text-xl text-[var(--text-main)] font-bold">Roma, IT</span>
                    <span className="stamp text-[10px] md:text-xs scale-75 border-[var(--accent-primary)] text-[var(--accent-primary)]">POSTED</span>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="polaroid hover-lift -rotate-3 z-20 transition-all duration-500 hover:z-30">
                  <div className="masking-tape w-20 md:w-24 h-6 md:h-8 -top-3 md:-top-4 left-1/2 -translate-x-1/2 rotate-[-2deg]" />
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#efe8db]">
                    <img src="/fo2.png" alt="Destination" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                  </div>
                  <div className="mt-4 flex justify-between items-center px-1">
                    <span className="font-heading text-lg md:text-xl text-[var(--text-main)] font-bold">Oaxaca, MX</span>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="polaroid hover-lift -rotate-2 translate-y-8 md:translate-y-12 z-20 transition-all duration-500 hover:z-30">
                  <div className="push-pin" />
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#efe8db]">
                    <img src="/fo3.png" alt="Destination" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                  </div>
                  <div className="mt-4 flex justify-between items-center px-1">
                    <span className="font-heading text-lg md:text-xl text-[var(--text-main)] font-bold">Kyoto, JP</span>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="polaroid hover-lift rotate-4 -translate-y-4 md:-translate-y-2 z-10 transition-all duration-500 hover:z-30">
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#efe8db]">
                    <img src="/fo4.png" alt="Destination" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                  </div>
                  <div className="mt-4 flex justify-between items-center px-1">
                    <span className="font-heading text-lg md:text-xl text-[var(--text-main)] font-bold">Marrakech, MA</span>
                    <span className="handwritten-note text-sm md:text-base -rotate-6 absolute bottom-10 md:bottom-12 right-2 md:right-4 text-[var(--accent-primary)]">Memories</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      <EdgeDivider src="/edge5.png" />

      {/* 6. PEOPLE LEAVE THINGS BEHIND */}
      <section className="py-16 md:py-20 bg-[var(--bg-secondary)] relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
          <div className="text-center mb-12 relative z-20">
            <span className="font-body italic text-2xl text-[var(--accent-primary)] block mb-4 drop-shadow-sm">- The Aftermath -</span>
            <h2 className="text-6xl md:text-7xl lg:text-[5.5rem] font-body text-[var(--text-main)] leading-[1.1] tracking-tight">
              People leave<br />things behind.
            </h2>
            <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] mx-auto mt-6"></div>
          </div>

          <div className="relative w-full max-w-5xl mx-auto z-10 flex flex-col items-center px-4">
            
            {/* Background floating doodles from a.png to h.png */}
            <img src="/a.png" className="absolute top-[-40px] left-[5%] w-16 md:w-24 object-contain opacity-70 pointer-events-none -rotate-12 mix-blend-multiply" alt="" />
            <img src="/b.png" className="absolute top-[20%] right-[-5%] w-12 md:w-20 object-contain opacity-80 pointer-events-none rotate-12 mix-blend-multiply" alt="" />
            <img src="/c.png" className="absolute bottom-[-10px] left-[-2%] w-14 md:w-20 object-contain opacity-75 pointer-events-none -rotate-6 mix-blend-multiply" alt="" />
            <img src="/d.png" className="absolute bottom-[20%] right-[10%] w-16 md:w-24 object-contain opacity-60 pointer-events-none rotate-45 mix-blend-multiply" alt="" />
            <img src="/e.png" className="absolute top-[40%] left-[2%] w-10 md:w-16 object-contain opacity-70 pointer-events-none -rotate-45 mix-blend-multiply" alt="" />
            <img src="/f.png" className="absolute top-[-10px] right-[25%] w-12 md:w-16 object-contain opacity-80 pointer-events-none rotate-12 mix-blend-multiply" alt="" />
            <img src="/g.png" className="absolute bottom-[-20px] left-[25%] w-12 md:w-20 object-contain opacity-70 pointer-events-none -rotate-12 mix-blend-multiply" alt="" />
            <img src="/h.png" className="absolute bottom-[50%] right-[5%] w-16 md:w-24 object-contain opacity-80 pointer-events-none rotate-6 mix-blend-multiply" alt="" />

            {/* Row 1 */}
            <div className="flex justify-center items-end relative z-10 space-x-4 md:space-x-8 w-full">
              {[1, 2, 3].map((num, i) => (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -20, scale: 1.2, rotate: i % 2 === 0 ? 4 : -4, zIndex: 50, transition: { type: "spring", stiffness: 300 } }}
                  className="inline-block cursor-pointer relative z-10"
                >
                  <img 
                    src={`/c${num}.png`} 
                    alt={`Artifact ${num}`} 
                    className="h-56 md:h-80 lg:h-96 w-auto object-contain pointer-events-auto drop-shadow-2xl" 
                  />
                </motion.div>
              ))}
            </div>

            {/* Row 2 */}
            <div className="flex justify-center items-end relative z-20 space-x-4 md:space-x-8 w-full -mt-10 md:-mt-16 lg:-mt-20">
              {[4, 5, 6].map((num, i) => (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: (i + 3) * 0.1 }}
                  whileHover={{ y: -20, scale: 1.2, rotate: i % 2 === 0 ? -4 : 4, zIndex: 50, transition: { type: "spring", stiffness: 300 } }}
                  className="inline-block cursor-pointer relative z-20"
                >
                  <img 
                    src={`/c${num}.png`} 
                    alt={`Artifact ${num}`} 
                    className="h-56 md:h-80 lg:h-96 w-auto object-contain pointer-events-auto drop-shadow-2xl" 
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <EdgeDivider src="/edge.png" />

      {/* 7. COME CURIOUS */}
      <section className="py-40 relative text-center overflow-hidden flex flex-col items-center justify-center bg-[var(--accent-primary)] text-[#efe8db] cursor-crosshair">
        <div className="absolute inset-0 paper-texture opacity-20 mix-blend-multiply pointer-events-none z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/10 rounded-full filter blur-[80px] pointer-events-none z-0" />

        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.05, rotate: -2 }}
            className="inline-block"
          >
            <h2 className="text-6xl md:text-8xl font-heading text-[var(--bg-primary)] mb-6 leading-tight drop-shadow-sm">
              Come curious.
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="font-logo text-3xl md:text-4xl text-white mb-14 drop-shadow-sm -rotate-2"
          >
            We'll take care of the rest.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.8 }}
            className="relative z-20"
          >
            <Link
              to="/dinner"
              className="inline-block bg-[var(--bg-primary)] text-[var(--accent-primary)] border-2 border-[var(--bg-primary)] hover:bg-white hover:text-[var(--accent-primary)] px-12 py-5 text-xl font-bold tracking-[0.15em] rounded-full shadow-2xl transition-all duration-300 hover:scale-105 uppercase"
            >
              Join the next evening
            </Link>
          </motion.div>
        </div>
      </section>

      <EdgeDivider src="/edge4.png" />
    </div>
  );
}
