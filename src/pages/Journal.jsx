import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useSpring } from 'framer-motion';
import { ArrowRight, BookOpen, Music, Film, Compass, Disc, MapPin, Coffee, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';

const editorialCards = [
  {
    num: "01",
    title: "The conversations that only happen after dessert",
    desc: "Sometimes all a table needs is enough time.",
    category: "Reflections",
    img: "/herofordinner.jpeg",
    rot: "-rotate-1"
  },
  {
    num: "02",
    title: "A recipe we keep coming back to",
    desc: "Because some dishes deserve another evening.",
    category: "Recipes",
    img: "/sushi_platter.jpg",
    rot: "rotate-2"
  },
  {
    num: "03",
    title: "The city that inspired this month's dinner",
    desc: "A place that stayed with us long after we left.",
    category: "Travel",
    img: "/italy_pasta_table.png",
    rot: "-rotate-2"
  },
  {
    num: "04",
    title: "Things guests left behind",
    desc: "Not everything fits into a bag when you leave.",
    category: "Observations",
    img: "/hero-collage.png",
    rot: "rotate-1"
  }
];

const tinyObservations = [
  "People always ask for the playlist.",
  "Someone always stays back to help clean up.",
  "Every dinner has one unforgettable conversation.",
  "The loudest laughter usually comes from strangers.",
  "Recipes are rarely written exactly the same twice.",
  "The candles always burn longer than expected."
];

const loveRecipes = [
  { id: 1, img: "/fo1.png", title: "Citrus & Herb Spritz", desc: "A refreshing start with rosemary and grapefruit." },
  { id: 2, img: "/fo2.png", title: "Burrata & Figs", desc: "Creamy burrata topped with roasted figs and honey." },
  { id: 3, img: "/fo3.png", title: "Wild Mushroom Risotto", desc: "Earthy, rich, and slow-cooked to perfection." },
  { id: 4, img: "/fo4.png", title: "Grilled Sea Bass", desc: "Lightly charred with lemon butter sauce." },
  { id: 5, img: "/fo5.png", title: "Almond Panna Cotta", desc: "Silky smooth with a tart berry compote." }
];

const blogCards = [
  { id: 1, img: "/card1.png" },
  { id: 2, img: "/card2.png" },
  { id: 3, img: "/card3.png" },
  { id: 4, img: "/card4.png" },
  { id: 5, img: "/card5.png" }
];
const fullBlogRing = [...blogCards, ...blogCards, ...blogCards].map((c, i) => ({ ...c, uniqueId: i }));

const funIcons = Array.from({ length: 12 }).map(() => ["/ass1.png", "/ass2.png", "/ass3.png"]).flat();

const funImages = Array.from({ length: 36 }).map((_, i) => ({
  id: `fun-${i}`,
  img: "/ass4.png",
  title: "SUNDAY SUPPER",
  date: "22 de Agosto 2024",
  count: "127 fotos",
  tags: ["family", "friends", "food", "celebration"]
}));

export default function Journal() {
  const [hoveredRecipe, setHoveredRecipe] = useState(null);
  
  const [isDraggingRing, setIsDraggingRing] = useState(false);
  const ringRotation = useMotionValue(0);
  const smoothRingRotation = useSpring(ringRotation, { stiffness: 100, damping: 20 });

  useEffect(() => {
    if (isDraggingRing) return;
    const controls = animate(ringRotation, ringRotation.get() - 360, {
      duration: 60,
      ease: "linear",
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [isDraggingRing, ringRotation]);

  // The Fun Section State
  const [activeFunItem, setActiveFunItem] = useState(null);
  const [isHoveringWheel, setIsHoveringWheel] = useState(false);
  const [isDraggingFun, setIsDraggingFun] = useState(false);
  const funRotation = useMotionValue(0);
  const smoothFunRotation = useSpring(funRotation, { stiffness: 100, damping: 20 });
  const funAreaRef = useRef(null);

  useEffect(() => {
    if (isDraggingFun || isHoveringWheel) return;
    const controls = animate(funRotation, funRotation.get() - 360, {
      duration: 120,
      ease: "linear",
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [isDraggingFun, isHoveringWheel, funRotation]);

  useEffect(() => {
    const wheelHandler = (e) => {
      e.preventDefault();
      funRotation.set(funRotation.get() - e.deltaY * 0.1);
    };
    const el = funAreaRef.current;
    if (el) {
      el.addEventListener("wheel", wheelHandler, { passive: false });
    }
    return () => {
      if (el) el.removeEventListener("wheel", wheelHandler);
    };
  }, [funRotation]);

  return (
    <div className="w-full relative bg-[var(--bg-primary)]">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen w-full flex flex-col lg:flex-row items-center px-6 lg:px-16 overflow-hidden bg-[#f4ebd9] z-0 pt-24 pb-12 lg:py-0">
        {/* Background Texture Overlay */}
        <div className="absolute inset-0 paper-texture opacity-50 mix-blend-multiply pointer-events-none" />
        
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent-primary)]/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 relative z-10 w-full">
          
          {/* LEFT COLUMN: TEXT & FLORALS */}
          <div className="flex flex-col justify-center relative pt-12 lg:pt-0 max-w-xl">
            {/* Date Stamp Overlay */}
            <div className="absolute -top-8 left-4 md:-top-12 md:left-8 stamp rotate-[-8deg] opacity-70 border-dashed border-2 border-[#cc785c] text-[#cc785c] px-3 py-1 font-mono text-xs tracking-widest bg-transparent">
              VOL 04 <br/> 2025
            </div>
            
            <span className="text-[#c16e4f] font-body tracking-[0.2em] uppercase text-xs mb-4 block font-bold">
              THE JOURNAL
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-body leading-[1.1] text-[#2c2b29] mb-8">
              The evening doesn't end <br className="hidden md:inline" />
              <span className="relative inline-block mt-2 md:mt-0">
                when everyone leaves.
                <svg className="absolute w-[90%] h-3 -bottom-3 left-[5%] text-[#c16e4f] opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M5,5 Q40,8 95,5" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="font-body text-xl md:text-[1.35rem] text-[#2c2b29] max-w-md leading-relaxed mb-10">
              Stories, recipes, places, conversations and little things worth holding on to.
            </p>
            
            <div>
              <a 
                href="#featured-essays" 
                className="inline-block bg-[#efe8db] text-[#2c2b29] border border-[#2c2b29]/10 shadow-sm hover:shadow-md transition-all duration-300 rounded-full px-6 py-3 font-body text-[1.05rem]"
              >
                Read the latest entry
              </a>
            </div>

            {/* Bottom Left Decoration (Flowers) */}
            <motion.img 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              src="/journal4.png" 
              alt="Floral decoration" 
              className="absolute -bottom-12 -left-8 lg:-bottom-20 lg:-left-12 w-24 md:w-32 lg:w-40 object-contain mix-blend-multiply opacity-90 pointer-events-none"
            />
            
            {/* Bottom Right Decoration (Olive Branch) */}
            <motion.img 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              src="/journal3.png" 
              alt="Olive branch" 
              className="absolute -bottom-8 right-12 lg:-bottom-12 lg:right-4 w-16 md:w-24 lg:w-28 object-contain mix-blend-multiply opacity-90 pointer-events-none"
            />
          </div>

          {/* RIGHT COLUMN: MAIN ILLUSTRATION */}
          <div className="relative flex items-center justify-center min-h-[50vh] lg:min-h-0 w-full mt-12 lg:mt-0">
            <motion.img 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              src="/journal1.png" 
              alt="People at dinner table illustration" 
              className="w-full lg:w-[110%] max-w-none object-contain mix-blend-multiply drop-shadow-sm -mr-0 lg:-mr-8 pointer-events-none"
            />
            
            {/* Extra scattered elements around the main illustration */}
            <motion.img 
              initial={{ opacity: 0, rotate: -15 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              src="/journal2.png" 
              alt="Scrap note" 
              className="absolute bottom-[5%] left-[20%] w-24 md:w-32 object-contain mix-blend-multiply pointer-events-none"
            />
            <motion.img 
              initial={{ opacity: 0, rotate: 15 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              src="/journal5.png" 
              alt="Small decoration" 
              className="absolute bottom-[10%] right-[15%] w-20 md:w-28 object-contain mix-blend-multiply pointer-events-none"
            />
          </div>

        </div>
      </section>

      {/* 1.5. RECIPES WE LOVE (RING/ARC SECTION) */}
      <section className="sticky top-0 h-[800px] md:h-screen w-full flex flex-col items-center justify-center bg-[var(--bg-primary)] overflow-hidden z-[5] relative border-t border-[var(--text-main)]/30">
        {/* Background texture */}
        <div className="absolute inset-0 paper-texture opacity-30 mix-blend-multiply pointer-events-none" />

        {/* Center Text (Headline + Hover Info) */}
        <div className="absolute top-20 md:top-32 left-1/2 -translate-x-1/2 text-center z-20 w-full px-6 pointer-events-none">
          <span className="font-body italic text-3xl text-[var(--accent-primary)] block mb-2 font-logo">Our Favorites</span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading text-[var(--text-main)] mb-6 transition-all duration-500">
            {hoveredRecipe ? hoveredRecipe.title : "Recipes we love."}
          </h2>
          
          <div className="h-20 max-w-lg mx-auto flex items-center justify-center">
            {hoveredRecipe && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-body text-xl md:text-2xl text-[var(--text-main)]/80 italic leading-relaxed"
              >
                "{hoveredRecipe.desc}"
              </motion.p>
            )}
          </div>
        </div>

        {/* Rotating Arc/Ring */}
        <div className="absolute bottom-[-150px] md:bottom-[-200px] left-1/2 -translate-x-1/2 z-10 w-full flex items-center justify-center">
          <div className={`relative flex items-center justify-center animate-spin-arc ${hoveredRecipe ? 'pause-anim' : ''}`}>
            {[...loveRecipes, ...loveRecipes].map((recipe, idx, arr) => {
              const angle = idx * (360 / arr.length);
              return (
                <div 
                  key={`${recipe.id}-${idx}`}
                  className="absolute origin-center arc-radius-flatter"
                  style={{ '--angle': `${angle}deg` }}
                >
                  <div 
                    className={`w-72 h-72 md:w-[420px] md:h-[420px] cursor-pointer group transition-all duration-500`}
                    onMouseEnter={() => setHoveredRecipe(recipe)}
                    onMouseLeave={() => setHoveredRecipe(null)}
                  >
                    <img 
                      src={recipe.img} 
                      alt={recipe.title} 
                      className="w-full h-full object-contain drop-shadow-2xl group-hover:-translate-y-8 group-hover:scale-105 transition-transform duration-500 pointer-events-auto select-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 1.6 BLOGS FROM THE CHAPATHI LOVER (INTERACTIVE RING) */}
      <section className="sticky top-0 h-screen w-full flex flex-col items-center justify-center bg-[var(--accent-primary)] overflow-hidden z-[6] relative border-t border-[var(--text-main)]/30">
        <div className="absolute inset-0 paper-texture opacity-30 mix-blend-multiply pointer-events-none" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-20 w-[250px] md:w-[300px] px-6 pointer-events-none">
          <span className="font-body italic text-2xl text-[#efe8db]/80 block mb-2 font-logo">Selected Works</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-[var(--bg-primary)] drop-shadow-sm leading-tight">Blogs from the chapathi lover</h2>
        </div>

        <div className="relative w-full h-full flex items-center justify-center z-10">
          <motion.div 
            className="relative flex items-center justify-center cursor-grab active:cursor-grabbing touch-none w-[300px] h-[300px] md:w-[600px] md:h-[600px]"
            style={{ rotate: smoothRingRotation }}
            onPanStart={() => setIsDraggingRing(true)}
            onPanEnd={() => setIsDraggingRing(false)}
            onPan={(e, info) => ringRotation.set(ringRotation.get() + info.delta.x * 0.3 + info.delta.y * 0.3)}
          >
            {fullBlogRing.map((card, idx) => {
              const angle = idx * (360 / fullBlogRing.length);
              return (
                <div 
                  key={card.uniqueId}
                  className="absolute origin-center blog-ring-radius"
                  style={{ '--angle': `${angle}deg` }}
                >
                  <motion.div 
                    className="w-32 md:w-48 hover:scale-110 transition-transform duration-300 pointer-events-none"
                  >
                    <img src={card.img} alt={`Blog ${idx}`} className="w-full h-auto object-contain drop-shadow-xl" />
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 1.7 THE FUN (VERTICAL ARC) */}
      <section 
        className="sticky top-0 h-screen w-full flex bg-[var(--bg-primary)] overflow-hidden z-[7] relative border-t border-[var(--text-main)]/30"
        ref={funAreaRef}
        onMouseEnter={() => setIsHoveringWheel(true)}
        onMouseLeave={() => setIsHoveringWheel(false)}
      >
        <div className="absolute inset-0 paper-texture opacity-50 mix-blend-multiply pointer-events-none z-0" />

        {/* Left Side: Vertical Arc Container */}
        <div className="absolute top-1/2 left-[calc(0px-700px)] md:left-[calc(0px-850px)] w-0 h-0 z-10">
          {/* Inner & Outer Hollow Circle Strokes */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#3b2b24]/20 pointer-events-none" style={{ width: '2700px', height: '2700px' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#3b2b24]/20 pointer-events-none" style={{ width: '3100px', height: '3100px' }} />
          
          <motion.div 
            className="absolute top-1/2 left-1/2 w-0 h-0 cursor-grab active:cursor-grabbing touch-none"
            style={{ rotate: smoothFunRotation }}
            onPanStart={() => setIsDraggingFun(true)}
            onPanEnd={() => setIsDraggingFun(false)}
            onPan={(e, info) => funRotation.set(funRotation.get() + info.delta.y * 0.2)}
          >
            {/* Small Icons Arc */}
            {funIcons.map((icon, idx) => {
              const angle = idx * (360 / funIcons.length);
              return (
                <div 
                  key={`icon-${idx}`}
                  className="absolute origin-center"
                  style={{ top: '50%', left: '50%', transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(1250px)` }}
                >
                  <img 
                    src={icon} 
                    alt="Icon" 
                    className="w-12 h-12 object-contain pointer-events-none opacity-80 drop-shadow-md"
                    style={{ transform: 'rotate(90deg)' }}
                  />
                </div>
              );
            })}

            {/* Images Arc (Film Strip) */}
            {funImages.map((item, idx) => {
              const angle = idx * (360 / funImages.length);
              return (
                <div 
                  key={item.id}
                  className="absolute origin-center"
                  style={{ top: '50%', left: '50%', transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(1450px)` }}
                >
                  <div 
                    className="w-[180px] h-[254px] pointer-events-auto cursor-pointer relative transition-transform duration-300 hover:-translate-x-6 hover:scale-105"
                    onMouseEnter={() => setActiveFunItem(item)}
                    onMouseLeave={() => setActiveFunItem(null)}
                  >
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover border-2 border-white rounded-lg shadow-md" style={{ transform: 'rotate(90deg)' }} />
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Ass Images on Left Side */}
        <div className="absolute left-[5%] md:left-[10%] top-1/2 -translate-y-1/2 flex flex-col gap-4 z-30 pointer-events-auto">
          {['ass1', 'ass2', 'ass3'].map((ass, i) => (
            <div 
              key={i} 
              className="relative cursor-pointer transition-transform duration-300 hover:scale-110 hover:-translate-y-1"
              onClick={() => funRotation.set(funRotation.get() - 1080)}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-[#fcf8f2] bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-white/80 flex items-center justify-center p-4">
                <img src={`/${ass}.png`} alt={ass} className="w-full h-full object-contain" />
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Video Player */}
        <div className={`absolute right-[5%] top-1/2 -translate-y-1/2 z-30 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${activeFunItem ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12 pointer-events-none'}`}>
          <div className="w-[350px] md:w-[550px] lg:w-[650px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#f4ebd9]/80 bg-black relative">
            {activeFunItem && (
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              </video>
            )}
            <div className="absolute bottom-4 left-4 z-10 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-[#efe8db]">
              <p className="font-body text-sm italic">{activeFunItem?.title || "Video playback"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. UNTIL NEXT TIME (CTA) */}
      <section className="relative w-full py-32 flex flex-col justify-center items-center text-center overflow-hidden bg-[var(--accent-primary)] z-50">
        {/* Background Texture */}
        <div className="absolute inset-0 z-0">
          <img src="/texture.png" alt="Background texture" className="w-full h-full object-cover opacity-30 mix-blend-multiply" />
        </div>

        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-body text-[#fcf8f2] mb-12 leading-tight drop-shadow-sm"
          >
            Until next time.
          </motion.h2>

          <div className="font-body text-xl md:text-2xl text-[#fcf8f2]/90 max-w-xl mx-auto flex flex-col items-center justify-center mb-16 text-center space-y-6">
            <p className="italic font-light">The table will be set again soon.</p>
            <div className="w-16 h-[1px] bg-[#fcf8f2]/30"></div>
            <div className="space-y-3 text-base md:text-lg tracking-wide">
              <p>Cook something new.</p>
              <p>Invite someone over.</p>
              <p>Take the longer route home.</p>
            </div>
            <p className="font-logo font-bold text-4xl text-[#fcf8f2] mt-8 transform -rotate-2">Stay curious.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/dinner"
              className="inline-block bg-[#fcf8f2] text-[#d45d3a] border-2 border-[#fcf8f2] font-sans text-sm md:text-base font-bold tracking-wider uppercase px-10 py-4 rounded-full shadow-lg hover:bg-[#d45d3a] hover:text-[#fcf8f2] transition-colors duration-300"
            >
              See the next dinner
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
