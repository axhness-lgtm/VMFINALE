import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import ScrollHighlight from '../components/ScrollHighlight';

export default function Home() {
  const heroRef = useRef(null);
  const notJustDinnerRef = useRef(null);
  const flowRef = useRef(null);
  const destConstraintsRef = useRef(null);

  const { scrollYProgress: notJustDinnerProgress } = useScroll({
    target: notJustDinnerRef,
    offset: ["start start", "end end"]
  });

  const { scrollYProgress: flowProgress } = useScroll({
    target: flowRef,
    offset: ["start start", "end end"]
  });

  // Flow Animation Transforms
  const img1X = useTransform(flowProgress, [0, 0.15, 0.4, 0.6], ["150%", "0%", "0%", "-25%"]);
  const img1Scale = useTransform(flowProgress, [0, 0.15, 0.4, 0.6], [0.85, 1, 1, 0.85]);
  const img1Rot = useTransform(flowProgress, [0, 0.15, 0.4, 0.6], [15, -2, -2, -8]);

  const img2X = useTransform(flowProgress, [0.3, 0.5, 0.7, 0.9], ["150%", "0%", "0%", "-10%"]);
  const img2Scale = useTransform(flowProgress, [0.3, 0.5, 0.7, 0.9], [0.85, 1, 1, 0.95]);
  const img2Rot = useTransform(flowProgress, [0.3, 0.5, 0.7, 0.9], [15, 2, 2, -1]);

  const img3X = useTransform(flowProgress, [0.65, 0.85, 1], ["150%", "10%", "10%"]);
  const img3Scale = useTransform(flowProgress, [0.65, 0.85, 1], [0.85, 1, 1]);
  const img3Rot = useTransform(flowProgress, [0.65, 0.85, 1], [20, 3, 3]);

  const text1Opacity = useTransform(flowProgress, [0, 0.1, 0.25, 0.3], [0, 1, 1, 0]);
  const text1Y = useTransform(flowProgress, [0, 0.1, 0.25, 0.3], ["20%", "0%", "0%", "-20%"]);

  const text2Opacity = useTransform(flowProgress, [0.3, 0.4, 0.6, 0.65], [0, 1, 1, 0]);
  const text2Y = useTransform(flowProgress, [0.3, 0.4, 0.6, 0.65], ["20%", "0%", "0%", "-20%"]);

  const text3Opacity = useTransform(flowProgress, [0.65, 0.75, 1], [0, 1, 1]);
  const text3Y = useTransform(flowProgress, [0.65, 0.75, 1], ["20%", "0%", "0%"]);

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

          <div className="flex flex-col items-center relative z-20 max-w-2xl">
            <span className="reveal-item text-orange font-body tracking-[0.2em] uppercase text-[10px] mb-4 block font-bold">
              Visakhapatnam, India
            </span>
            <h1 className="reveal-item text-3xl md:text-4xl lg:text-5xl font-heading leading-[1.1] text-cream mb-6 drop-shadow-[0_4px_6px_rgba(59,43,36,0.9)]">
              For people who love <span className="text-orange italic drop-shadow-[1px_1.5px_0.5px_rgba(255,255,255,1)]">discovering the world.</span>
            </h1>
            <p className="reveal-item font-body text-sm md:text-base text-cream/90 mb-8 max-w-lg leading-relaxed drop-shadow-[0_4px_6px_rgba(59,43,36,0.9)]">
              Every month, eight strangers gather around one table to explore a different cuisine, share stories, and leave with something more than a good meal.
            </p>

            <div className="reveal-item flex flex-col sm:flex-row gap-6 items-center justify-center mt-6">
              <Link to="/dinner" className="group relative btn-paper !overflow-visible bg-cream text-[var(--text-main)] border-[var(--text-main)] border hover:bg-orange hover:text-[var(--bg-primary)] hover:border-orange transition-colors text-sm px-6 py-3 drop-shadow-md rounded-full font-[Hibernate] tracking-[0.1em] z-10">
                <img
                  src="/assets/d2.png"
                  alt="doodle"
                  className="absolute -top-10 -left-6 w-16 h-16 object-contain opacity-0 translate-y-4 scale-50 -rotate-12 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:-rotate-12 transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none -z-10"
                />
                See the next Dinner
              </Link>
              <Link to="/about" className="group relative btn-paper !overflow-visible bg-cream text-[var(--text-main)] border-[var(--text-main)] border hover:bg-orange hover:text-[var(--bg-primary)] hover:border-orange transition-colors text-sm px-6 py-3 drop-shadow-md rounded-full font-[Hibernate] tracking-[0.1em] z-10">
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

      {/* 2. NOT JUST DINNER */}
      <section ref={notJustDinnerRef} className="bg-[var(--bg-secondary)] relative h-[200vh]">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">

          {/* Doodle Background Pattern */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <img
              src="/pattern.png"
              alt="doodle pattern background"
              className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
            />
            {/* Creme gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-secondary)]/95 via-[var(--bg-secondary)]/60 to-[var(--bg-secondary)]/95 z-10" />
          </div>

          <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
            {/* Contextual Visual: Coffee Ring & Recipe Card */}
            <div className="absolute -top-12 -left-12 lg:-left-24 w-32 h-32 coffee-ring opacity-60 rotate-[15deg]" />
            <motion.div 
              initial={{ opacity: 0, rotate: -15, y: 20 }}
              whileInView={{ opacity: 0.9, rotate: -8, y: 0 }}
              viewport={{ once: true }}
              className="absolute top-20 -right-8 lg:-right-32 w-48 h-64 bg-white shadow-xl p-4 torn-edge hidden md:block z-0 pointer-events-none"
            >
              <div className="masking-tape w-12 h-4 -top-2 left-1/2 -translate-x-1/2 rotate-2" />
              <div className="w-full h-full border border-dashed border-gray-300 p-2 flex flex-col items-center">
                <span className="font-heading text-xl text-[var(--accent-primary)] mb-2">Recipe #04</span>
                <div className="w-full h-px bg-gray-200 mb-2"></div>
                <div className="w-full h-px bg-gray-200 mb-2"></div>
                <div className="w-full h-px bg-gray-200 mb-2"></div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.25 }
                }
              }}
              className="relative z-10"
            >
              <div className="overflow-hidden pb-4 mb-8">
                <motion.h2
                  variants={{
                    hidden: { y: "120%", opacity: 0, rotate: 3 },
                    visible: { y: 0, opacity: 1, rotate: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="text-5xl md:text-6xl font-heading text-[var(--text-main)] origin-bottom-left inline-block relative"
                >
                  Not just dinner.
                  <span className="handwritten-annotation absolute -right-24 -top-8 text-2xl hidden md:inline-block rotate-[12deg]">An experience!</span>
                </motion.h2>
              </div>

              <div className="font-body text-2xl md:text-3xl lg:text-4xl leading-relaxed text-[var(--text-main)] max-w-4xl mx-auto space-y-12 py-12">
                <ScrollHighlight
                  text="A Vantammayilu evening is built around food, conversation and curiosity."
                  scrollYProgress={notJustDinnerProgress}
                  range={[0.1, 0.45]}
                />
                <ScrollHighlight
                  text="Each dinner explores a different part of the world through a carefully curated menu, thoughtful details and the people around the table."
                  scrollYProgress={notJustDinnerProgress}
                  range={[0.45, 0.9]}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. WHAT USUALLY HAPPENS */}
      <section ref={flowRef} className="relative h-[300vh] bg-[var(--bg-primary)]">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden py-20 px-4 md:px-12">

          <div className="text-center mb-12 relative z-50">
            <span className="font-body italic text-2xl md:text-3xl text-[var(--accent-primary)] -rotate-2 block mb-2 font-logo drop-shadow-sm">The evening flow</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-[var(--text-main)]">What usually happens.</h2>
          </div>

          <div className="flex flex-col md:flex-row w-full max-w-6xl flex-1 items-center justify-center relative">

            {/* Subtle Stitched Thread SVG connecting images */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20 hidden md:block" viewBox="0 0 1000 500" preserveAspectRatio="none">
              <path d="M200,250 C400,100 600,400 800,250" stroke="var(--accent-primary)" strokeWidth="3" strokeDasharray="10 10" fill="none" />
            </svg>

            {/* Left Side: Stacking Images */}
            <div className="relative w-full md:w-1/2 h-[40vh] md:h-full flex items-center justify-center">
              {/* Image 1 */}
              <motion.div
                style={{ x: img1X, scale: img1Scale, rotate: img1Rot }}
                className="absolute w-64 md:w-80 lg:w-96 aspect-square md:aspect-[4/5] z-10 torn-edge shadow-2xl polaroid-frame"
              >
                <div className="masking-tape w-20 h-6 -top-3 left-6 -rotate-6" />
                <img src="/flow1.png" alt="flow 1" className="w-full h-full object-cover" />
              </motion.div>

              {/* Image 2 */}
              <motion.div
                style={{ x: img2X, scale: img2Scale, rotate: img2Rot }}
                className="absolute w-64 md:w-80 lg:w-96 aspect-square md:aspect-[4/5] z-20 torn-edge shadow-2xl polaroid-frame"
              >
                <div className="masking-tape w-16 h-5 top-1/2 -right-4 rotate-90" />
                <img src="/flow2.png" alt="flow 2" className="w-full h-full object-cover" />
              </motion.div>

              {/* Image 3 */}
              <motion.div
                style={{ x: img3X, scale: img3Scale, rotate: img3Rot }}
                className="absolute w-64 md:w-80 lg:w-96 aspect-square md:aspect-[4/5] z-30 torn-edge shadow-2xl polaroid-frame"
              >
                <div className="masking-tape w-24 h-6 -bottom-3 left-1/2 -translate-x-1/2 rotate-2" />
                <img src="/flow3.png" alt="flow 3" className="w-full h-full object-cover" />
              </motion.div>
            </div>

            {/* Right Side: Fading Texts */}
            <div className="relative w-full md:w-1/2 h-[20vh] md:h-full flex items-center justify-center text-center md:text-left mt-8 md:mt-0">
              <motion.div
                style={{ opacity: text1Opacity, y: text1Y }}
                className="absolute w-full px-4 md:px-12"
              >
                <p className="text-3xl md:text-5xl lg:text-6xl font-body text-[var(--text-main)] leading-tight relative inline-block">
                  Someone tells about<br />a city they miss
                  <span className="handwritten-annotation absolute -top-12 -right-10 text-xl hidden lg:block rotate-[15deg]">"I still dream about Rome..."</span>
                </p>
              </motion.div>

              <motion.p
                style={{ opacity: text2Opacity, y: text2Y }}
                className="absolute text-3xl md:text-5xl lg:text-6xl font-body text-[var(--text-main)] w-full px-4 md:px-12 leading-tight"
              >
                A recipe gets<br />passed around
              </motion.p>

              <motion.div
                style={{ opacity: text3Opacity, y: text3Y }}
                className="absolute w-full px-4 md:px-12"
              >
                <p className="text-3xl md:text-5xl lg:text-6xl font-body text-[var(--text-main)] leading-tight relative inline-block">
                  Desserts last longer<br />than expected
                  <span className="handwritten-annotation absolute -bottom-10 right-0 text-xl hidden lg:block rotate-[-5deg]">The best part!</span>
                </p>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. EIGHT SEATS */}
      <section className="py-28 bg-[var(--bg-secondary)] relative overflow-hidden">
        {/* Large overlapping background "8" */}
        <div className="absolute right-0 bottom-0 lg:-right-10 lg:-bottom-20 text-[20rem] md:text-[30rem] lg:text-[40rem] font-heading text-[var(--accent-primary)]/5 select-none pointer-events-none leading-none">
          8
        </div>

        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5">
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-heading text-[var(--accent-primary)] mb-4 leading-none">
                Eight <br /> seats.
              </h2>
            </div>
            <div className="md:col-span-7 space-y-6 md:border-l border-[var(--text-main)]/15 md:pl-12">
              <p className="font-body text-2xl md:text-3xl text-[var(--text-main)] leading-relaxed italic">
                "Small enough for everyone to be part of the conversation."
              </p>
              <p className="font-body text-2xl md:text-3xl text-[var(--text-main)] leading-relaxed font-heading text-[var(--accent-secondary)]">
                "Big enough for unexpected friendships."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EVERY DINNER BEGINS SOMEWHERE ELSE */}
      <section className="py-32 relative overflow-hidden bg-[var(--bg-primary)]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="font-body italic text-3xl text-[var(--accent-primary)] -rotate-2 block mb-2 font-logo drop-shadow-sm">Our Destinations</span>
              <h2 className="text-5xl md:text-6xl font-heading text-[var(--text-main)]">Every dinner begins somewhere else.</h2>
            </div>
          </div>

          {/* Interactive Map Container */}
          <div 
            ref={destConstraintsRef}
            className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] bg-[var(--bg-secondary)] rounded-3xl overflow-hidden shadow-2xl border border-[var(--text-main)]/10"
            style={{ boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.1), 0 20px 40px rgba(0,0,0,0.2)' }}
          >
            {/* Added Postage Stamps on Map Corners */}
            <div className="absolute top-4 right-4 stamp rotate-12 opacity-80 z-20">VIS-08</div>
            <div className="absolute bottom-6 left-6 stamp -rotate-6 opacity-60 z-20">JOURNEY</div>
            {/* Background Map Image */}
            <img
              src="/destination.png"
              alt="World Map Destinations"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />

            {/* Destination Texts */}
            <div className="absolute top-1/2 -translate-y-1/2 left-8 md:left-16 pointer-events-none">
              <h3 className="font-heading text-5xl md:text-7xl lg:text-8xl text-[var(--text-main)] opacity-40">Vietnam</h3>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-8 md:right-16 pointer-events-none text-right">
              <h3 className="font-heading text-5xl md:text-7xl lg:text-8xl text-[var(--accent-primary)] opacity-40">Morocco</h3>
              <span className="font-logo text-2xl text-[var(--accent-primary)] block mt-2">Next up!</span>
            </div>

            {/* Draggable Vietnam Elements on the left side */}
            {[
              { src: "/vietnam/1.png", top: "10%", left: "5%", w: "w-24 md:w-32", rot: -5 },
              { src: "/vietnam/5.png", top: "40%", left: "15%", w: "w-32 md:w-40", rot: 12 },
              { src: "/vietnam/14.png", top: "65%", left: "8%", w: "w-28 md:w-36", rot: -8 },
              { src: "/vietnam/22.png", top: "20%", left: "25%", w: "w-20 md:w-28", rot: 4 },
              { src: "/vietnam/8.png", top: "75%", left: "28%", w: "w-24 md:w-32", rot: -15 }
            ].map((el, idx) => (
              <motion.div
                key={idx}
                drag
                dragConstraints={destConstraintsRef}
                dragElastic={0.2}
                initial={{ top: el.top, left: el.left, rotate: el.rot }}
                whileDrag={{ scale: 1.15, cursor: "grabbing", zIndex: 50, rotate: 0 }}
                className={`absolute cursor-grab z-10 hover-lift origin-center ${el.w}`}
              >
                <img src={el.src} alt="Vietnam artifact" className="w-full h-auto drop-shadow-lg filter sepia-[0.2]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PEOPLE LEAVE THINGS BEHIND */}
      <section className="py-16 md:py-20 bg-[var(--bg-secondary)] relative overflow-hidden">

        {/* Decorative Background Elements */}
        <img src="/aftermath/7.png" className="absolute top-10 -left-10 md:left-0 w-64 md:w-80 opacity-90 z-0 pointer-events-none drop-shadow-sm" alt="decoration" />
        <img src="/aftermath/8.png" className="absolute top-20 right-0 md:right-20 w-40 md:w-56 opacity-90 z-0 pointer-events-none drop-shadow-sm" alt="decoration" />
        <img src="/aftermath/9.png" className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 md:w-96 opacity-90 z-0 pointer-events-none drop-shadow-sm" alt="decoration" />
        <img src="/aftermath/10.png" className="absolute bottom-10 right-0 md:right-10 w-40 md:w-56 opacity-90 z-0 pointer-events-none drop-shadow-sm" alt="decoration" />

        <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
          <div className="text-center mb-0 md:mb-0 relative z-20">
            <span className="font-body italic text-2xl text-[var(--accent-primary)] block mb-4 drop-shadow-sm">- The Aftermath -</span>
            <h2 className="text-6xl md:text-7xl lg:text-[5.5rem] font-body text-[var(--text-main)] leading-[1.1] tracking-tight">
              People leave<br />things behind.
            </h2>
            <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-items-center relative z-10 gap-y-16 lg:gap-y-8">
            {[1, 2, 3, 4, 5, 6].map((num, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.05, rotate: i % 2 === 0 ? 2 : -2, transition: { type: "spring", stiffness: 300 } }}
                className="w-full max-w-[320px] lg:max-w-[400px] flex justify-center cursor-pointer relative hover-lift"
              >
                {/* Add Masking Tape to some items */}
                {i % 3 === 0 && <div className="masking-tape w-16 h-6 -top-2 left-1/4 rotate-[-8deg] z-20" />}
                {i === 2 && <div className="masking-tape w-20 h-5 bottom-4 right-4 rotate-[15deg] z-20" />}
                
                <img src={`/aftermath/${num}.png`} alt={`Aftermath Item ${num}`} className="w-full h-auto object-contain drop-shadow-[0_10px_15px_rgba(59,43,36,0.15)] transition-all duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. COME CURIOUS */}
      <section className="py-40 relative text-center overflow-hidden flex flex-col items-center justify-center bg-[var(--bg-primary)] cursor-crosshair">
        {/* Abstract Orange Interactive Particles */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [Math.random() * -20, Math.random() * 20, Math.random() * -20],
                x: [Math.random() * -20, Math.random() * 20, Math.random() * -20],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute opacity-60"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${10 + Math.random() * 30}px`,
                height: `${10 + Math.random() * 30}px`,
                backgroundColor: 'var(--accent-primary)',
                borderRadius: i % 2 === 0 ? '50%' : '30% 70% 70% 30% / 30% 30% 70% 70%',
                filter: 'blur(8px)'
              }}
            />
          ))}
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-primary)]/10 rounded-full filter blur-[80px] pointer-events-none z-0" />

        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -2 }}
            className="inline-block"
          >
            <h2 className="text-6xl md:text-8xl font-heading text-[var(--accent-primary)] mb-6 leading-tight drop-shadow-sm">
              Come curious.
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="font-body text-2xl md:text-3xl text-[var(--text-main)]/90 mb-14"
          >
            We'll take care of the rest.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative z-20"
          >
            <Link
              to="/dinner"
              className="btn-paper !bg-[var(--text-main)] !text-[var(--bg-primary)] border-[var(--text-main)] hover:!bg-[var(--accent-primary)] hover:!border-[var(--accent-primary)] px-12 py-5 text-xl tracking-[0.15em] hover:scale-105 shadow-xl hover:shadow-[0_0_30px_rgba(232,99,33,0.4)]"
            >
              Join the next evening
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
