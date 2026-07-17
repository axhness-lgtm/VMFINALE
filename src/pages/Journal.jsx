import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, animate, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import EdgeDivider from '../components/EdgeDivider';

const loveRecipes = [
  { id: 1, img: "/fo1.png", title: "Citrus & Herb Spritz", desc: "A refreshing start with rosemary and grapefruit." },
  { id: 2, img: "/fo2.png", title: "Burrata & Figs", desc: "Creamy burrata topped with roasted figs and honey." },
  { id: 3, img: "/fo3.png", title: "Wild Mushroom Risotto", desc: "Earthy, rich, and slow-cooked to perfection." },
  { id: 4, img: "/fo4.png", title: "Grilled Sea Bass", desc: "Lightly charred with lemon butter sauce." },
  { id: 5, img: "/fo5.png", title: "Almond Panna Cotta", desc: "Silky smooth with a tart berry compote." }
];

const blogCards = [
  { 
    id: 1, 
    img: "/card1.png", 
    title: "The Conversations That Only Happen After Dessert",
    date: "May 14, 2025",
    readTime: "4 min read",
    author: "Vantammayilu Editorial",
    content: [
      "There is a distinct shift in energy around a dining table around the fourth or fifth hour. Early in the evening, conversations are polite, architectural, exploring the safe boundaries of what people do for work and where they grew up.",
      "But once the dessert plates are cleared and only candlelight remains, the table transforms. People stop performing and start reflecting. Someone shares an unexpected childhood memory. Another talks about a dream they haven't spoken aloud in years.",
      "At Vantammayilu, we intentionally pace our dinners to invite this exact moment. Because the best food is merely a prologue to human connection."
    ]
  },
  { 
    id: 2, 
    img: "/card2.png", 
    title: "Why Eight is the Unbreakable Number",
    date: "April 28, 2025",
    readTime: "3 min read",
    author: "Vantammayilu Editorial",
    content: [
      "In hospitality design, seating capacity dictates social geometry. When you seat six guests, the circle can feel overly intimate, placing an intense burden on every participant to keep the dialogue flowing.",
      "When you seat ten or twelve, the table unavoidably fractures into smaller, parallel sub-conversations of two or three. The collective magic is lost.",
      "Eight is the golden mean. It is large enough for diverse perspectives and unexpected sparks, yet small enough that a single whisper can hold the entire table's attention. Eight seats. One conversation."
    ]
  },
  { 
    id: 3, 
    img: "/card3.png", 
    title: "Anatomy of a Lingering Evening",
    date: "March 19, 2025",
    readTime: "5 min read",
    author: "Vantammayilu Editorial",
    content: [
      "What makes a guest stay until 1:00 AM on a weeknight? It isn't just the wine, nor is it merely the background playlist.",
      "It is the psychological comfort of knowing you are not being rushed. In modern dining, turning tables is the economic imperative. At our gatherings, time slows down. We design the physical environment—the warm acoustics, the tactile stoneware, the indirect amber lighting—to whisper one instruction: stay.",
      "When nobody is looking at the clock, strangers quickly become friends."
    ]
  },
  { 
    id: 4, 
    img: "/card4.png", 
    title: "Recipes Passed Around Like Contraband",
    date: "February 04, 2025",
    readTime: "3 min read",
    author: "Vantammayilu Editorial",
    content: [
      "Our culinary philosophy revolves around nostalgia and comfort. Dishes are rarely over-intellectualized; instead, they carry the weight of tradition and memory.",
      "Often, halfway through the pasta course or the slow-braised stew, a guest will pull out their phone or ask for a pen to scribble down a technique. We love when recipes leave the house on torn napkins.",
      "Food meant for sharing should never be kept secret."
    ]
  },
  { 
    id: 5, 
    img: "/card5.png", 
    title: "Notes on a World That Disappears by Midnight",
    date: "January 15, 2025",
    readTime: "4 min read",
    author: "Vantammayilu Editorial",
    content: [
      "Every gathering is an ephemeral art installation. We spend days prepping sauces, arranging florals, and curating playlists for an experience that exists for just one night.",
      "By midnight, the candles burn down to wax puddles, the glasses are empty, and the guests step back out into the quiet street. What remains is intangible.",
      "That temporary quality is precisely what gives the evening its beauty. Knowing it cannot be repeated makes every shared laugh infinitely precious."
    ]
  }
];

const fullBlogRing = [...blogCards, ...blogCards, ...blogCards].map((c, i) => ({ ...c, uniqueId: i }));

// We only keep the 2 icons: vantammayilu & vantabbayilu (ass2 & ass1)
const funIcons = Array.from({ length: 6 }).map(() => ["/ass2.png", "/ass1.png"]).flat();

const sampleVideos = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://media.w3.org/2010/05/sintel/trailer.mp4",
  "https://media.w3.org/2010/05/bunny/trailer.mp4"
];

const funImages = [
  { id: "ig-1", img: "/grid/PUS01765.jpg", account: "@vantammayilu", title: "Candlelit table setup for 8", video: sampleVideos[0] },
  { id: "ig-2", img: "/grid/PUS01922 (1).jpg", account: "@vantabbayilu", title: "Slow roasting culinary prep", video: sampleVideos[1] },
  { id: "ig-3", img: "/grid/PUS02024 (1).jpg", account: "@vantammayilu", title: "Passing plates around the table", video: sampleVideos[2] },
  { id: "ig-4", img: "/grid/PUS02027.jpg", account: "@vantabbayilu", title: "Fresh sourdough & farm butter", video: sampleVideos[3] },
  { id: "ig-5", img: "/grid/PUS02031.jpg", account: "@vantammayilu", title: "Dessert conversation flow", video: sampleVideos[0] },
  { id: "ig-6", img: "/grid/_DSC0296.jpg", account: "@vantabbayilu", title: "Stoneware plating details", video: sampleVideos[1] },
  { id: "ig-7", img: "/grid/_DSC0343 (1).jpg", account: "@vantammayilu", title: "Pouring wine for new friends", video: sampleVideos[2] },
  { id: "ig-8", img: "/grid/PUS01765.jpg", account: "@vantabbayilu", title: "Artisanal platter crafting", video: sampleVideos[3] },
  { id: "ig-9", img: "/grid/PUS01922 (1).jpg", account: "@vantammayilu", title: "An evening well hosted", video: sampleVideos[0] },
  { id: "ig-10", img: "/grid/PUS02024 (1).jpg", account: "@vantabbayilu", title: "Passing plates around the table", video: sampleVideos[1] },
  { id: "ig-11", img: "/grid/PUS02027.jpg", account: "@vantammayilu", title: "The loft gathering ambiance", video: sampleVideos[2] },
  { id: "ig-12", img: "/grid/PUS02031.jpg", account: "@vantabbayilu", title: "Recipes left on napkins", video: sampleVideos[3] }
];

// Repeat to fill the circle smoothly
const fullFunImages = [...funImages, ...funImages, ...funImages].map((item, i) => ({ ...item, uniqueId: `fun-img-${i}` }));

export default function Journal() {
  const [hoveredRecipe, setHoveredRecipe] = useState(null);
  const [activeBlogRead, setActiveBlogRead] = useState(null);
  
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

  // Space out recipes to 8 items along the circle to increase distance
  const displayRecipes = [...loveRecipes, ...loveRecipes.slice(0, 3)].map((r, idx) => ({ ...r, ringIdx: idx }));

  return (
    <div className="w-full relative bg-[var(--bg-primary)]">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen w-full flex flex-col lg:flex-row items-center px-6 lg:px-16 overflow-hidden bg-[#f4ebd9] z-0 pt-24 pb-12 lg:py-0 no-reveal">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent-primary)]/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 relative z-10 w-full">
          
          <div className="flex flex-col justify-center relative pt-12 lg:pt-0 max-w-xl py-8">
            <div className="absolute -top-8 left-4 md:-top-12 md:left-8 stamp rotate-[-8deg] opacity-70 border-dashed border-2 border-[#cc785c] text-[#cc785c] px-3 py-1 font-mono text-xs tracking-widest bg-transparent z-10">
              VOL 04 <br/> 2025
            </div>
            
            <div className="relative z-10">
              <span className="text-[#c16e4f] font-body tracking-[0.2em] uppercase text-xs mb-4 block font-bold">
                THE JOURNAL
              </span>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-heading italic leading-[1.08] text-[var(--text-main)] mb-6">
                the table notes
              </h1>
              <p className="font-heading font-normal not-italic text-2xl md:text-3xl text-[var(--text-main)] max-w-lg leading-relaxed mb-10">
                What happens at the table doesn't always stay there.
              </p>
              
              <div>
                <a 
                  href="#selected-works" 
                  className="group relative inline-block bg-[var(--accent-primary)] text-white border-2 border-[var(--accent-primary)] shadow-md hover:shadow-xl transition-all duration-300 rounded-md px-8 py-3.5 font-body font-bold text-[1.05rem] uppercase tracking-wider hover:bg-[var(--text-main)] hover:text-white hover:border-[var(--text-main)] active:bg-[var(--text-main)] active:text-white cursor-pointer"
                >
                  Read the latest entry
                </a>
              </div>
            </div>

            <motion.img 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              src="/journal4.png" 
              alt="Floral decoration" 
              className="absolute -bottom-12 -left-8 lg:-bottom-20 lg:-left-12 w-24 md:w-32 lg:w-40 object-contain mix-blend-multiply opacity-90 pointer-events-none"
            />
            
            <motion.img 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              src="/journal3.png" 
              alt="Olive branch" 
              className="absolute -bottom-8 right-12 lg:-bottom-12 lg:right-4 w-16 md:w-24 lg:w-28 object-contain mix-blend-multiply opacity-90 pointer-events-none"
            />
          </div>

          <div className="relative flex items-center justify-center min-h-[50vh] lg:min-h-0 w-full mt-12 lg:mt-0">
            <motion.img 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              src="/journal1.png" 
              alt="People at dinner table illustration" 
              className="w-full lg:w-[110%] max-w-none object-contain mix-blend-multiply drop-shadow-sm -mr-0 lg:-mr-8 pointer-events-none"
            />
            
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

      <EdgeDivider src="/edge5.png" />

      {/* 1.5. RECIPES WE LOVE (FITS 1366x768 RELATIVE SCREEN, BIGGER ITEMS, CLOSE DESCRIPTION) */}
      <section className="relative w-full max-w-[1100px] h-[780px] mx-auto flex flex-col items-center justify-center bg-[var(--bg-primary)] overflow-hidden z-[5]">

        <div className="absolute top-24 md:top-32 left-1/2 -translate-x-1/2 text-center z-20 w-full px-6 pointer-events-none">
          <span className="font-body italic text-3xl md:text-4xl text-[var(--accent-primary)] block mb-1 font-logo">Our Favorites</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-[var(--text-main)] mb-1 transition-all duration-500">
            {hoveredRecipe ? hoveredRecipe.title : "Recipes we love."}
          </h2>
          
          <div className="min-h-12 max-w-lg mx-auto flex items-center justify-center">
            {hoveredRecipe && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-body text-xl md:text-2xl text-[var(--text-main)]/90 italic leading-snug"
              >
                "{hoveredRecipe.desc}"
              </motion.p>
            )}
          </div>
        </div>

        {/* Rotating Arc/Ring with increased menu item size */}
        <div className="absolute bottom-[-280px] md:bottom-[-350px] left-1/2 -translate-x-1/2 z-10 w-full flex items-center justify-center pointer-events-none">
          <div className={`relative flex items-center justify-center animate-spin-arc ${hoveredRecipe ? 'pause-anim' : ''}`}>
            {displayRecipes.map((recipe, idx, arr) => {
              const angle = idx * (360 / arr.length);
              const isAnyHovered = hoveredRecipe !== null;
              const isThisHovered = hoveredRecipe && hoveredRecipe.id === recipe.id;

              return (
                <div 
                  key={`${recipe.id}-${idx}`}
                  className="absolute origin-center arc-radius-flatter pointer-events-none flex items-center justify-center"
                  style={{ '--angle': `${angle}deg` }}
                >
                  <div 
                    className={`w-60 h-60 md:w-80 md:h-80 cursor-pointer group transition-all duration-500 rounded-full pointer-events-auto flex items-center justify-center ${
                      isThisHovered 
                        ? 'opacity-100 scale-125 -translate-y-6 drop-shadow-2xl z-50' 
                        : isAnyHovered 
                        ? 'opacity-35 scale-95 blur-[0.5px]' 
                        : 'opacity-100 scale-100'
                    }`}
                    onMouseEnter={() => setHoveredRecipe(recipe)}
                    onMouseLeave={() => setHoveredRecipe(null)}
                  >
                    <img 
                      src={recipe.img} 
                      alt={recipe.title} 
                      className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <EdgeDivider src="/edge2.png" />

      {/* 1.6 BLOGS FROM THE CHAPATHI LOVER (NORMAL SCROLL, REDUCED SIZE, CLICKABLE TO BLOG READ) */}
      <section id="selected-works" className="relative min-h-[760px] pt-36 pb-24 w-full flex flex-col items-center justify-center bg-[var(--accent-primary)] overflow-hidden z-[6]">
        <div className="absolute inset-0 paper-texture opacity-30 mix-blend-multiply pointer-events-none" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-20 w-[280px] md:w-[340px] px-6 pointer-events-none">
          <span className="font-body italic text-2xl text-[#efe8db]/80 block mb-2 font-logo">Selected Works</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-[var(--bg-primary)] drop-shadow-sm leading-tight">Blogs from the chapathi lover</h2>
          <p className="text-xs font-mono tracking-widest text-[#efe8db]/70 mt-4 uppercase">Click any card to read</p>
        </div>

        <div className="relative w-full h-full flex items-center justify-center z-10">
          <motion.div 
            className="relative flex items-center justify-center cursor-grab active:cursor-grabbing touch-none w-[280px] h-[280px] md:w-[480px] md:h-[480px]"
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
                    onClick={() => setActiveBlogRead(card)}
                    className="w-24 md:w-36 cursor-pointer hover:scale-125 transition-all duration-300 pointer-events-auto drop-shadow-xl hover:drop-shadow-2xl hover:z-50"
                  >
                    <img src={card.img} alt={`Blog ${idx}`} className="w-full h-auto object-contain rounded-md" />
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <EdgeDivider src="/edge4.png" />

      {/* 1.7 THE FUN (NORMAL SCROLL, BIGGER INSTAGRAM ICONS WITHOUT BOXES, INSTAGRAM VIDEO HOVERS) */}
      <section 
        className="relative min-h-[650px] py-16 w-full flex bg-[var(--bg-primary)] overflow-hidden z-[7]"
        ref={funAreaRef}
        onMouseEnter={() => setIsHoveringWheel(true)}
        onMouseLeave={() => setIsHoveringWheel(false)}
      >

        {/* Left Side: Vertical Arc Container */}
        <div className="absolute top-1/2 left-[calc(0px-700px)] md:left-[calc(0px-850px)] w-0 h-0 z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--text-main)]/20 pointer-events-none" style={{ width: '2700px', height: '2700px' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--text-main)]/20 pointer-events-none" style={{ width: '3100px', height: '3100px' }} />
          
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
                    className="w-16 h-16 object-contain pointer-events-none opacity-80 drop-shadow-md"
                    style={{ transform: 'rotate(90deg)' }}
                  />
                </div>
              );
            })}

            {/* Images Arc (Instagram Media Film Strip) */}
            {fullFunImages.map((item, idx) => {
              const angle = idx * (360 / fullFunImages.length);
              return (
                <div 
                  key={item.uniqueId}
                  className="absolute origin-center"
                  style={{ top: '50%', left: '50%', transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(1450px)` }}
                >
                  <div 
                    className="w-[180px] h-[254px] pointer-events-auto cursor-pointer relative transition-transform duration-300 hover:-translate-x-6 hover:scale-105 group"
                    onMouseEnter={() => setActiveFunItem(item)}
                    onMouseLeave={() => setActiveFunItem(null)}
                  >
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover border-2 border-white rounded-xl shadow-lg group-hover:border-[var(--accent-primary)] transition-colors" style={{ transform: 'rotate(90deg)' }} />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none flex items-center justify-center" style={{ transform: 'rotate(90deg)' }}>
                      <span className="text-white text-xs font-mono tracking-widest bg-black/60 px-2 py-1 rounded">PLAY</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Bigger Instagram Account Icons on Left Side (No boxes, directly linked) */}
        <div className="absolute left-[6%] md:left-[10%] top-1/2 -translate-y-1/2 flex flex-col gap-12 z-30 pointer-events-auto">
          <a 
            href="https://www.instagram.com/vantammayilu/" 
            target="_blank" 
            rel="noopener noreferrer"
            title="Follow @vantammayilu on Instagram"
            className="group relative block transition-all duration-300 hover:scale-125 hover:-translate-y-2 drop-shadow-2xl"
          >
            <img src="/ass2.png" alt="Vantammayilu Instagram" className="w-36 h-36 md:w-44 md:h-44 object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)]" />
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--text-main)] text-cream text-[10px] font-mono uppercase px-3 py-1 rounded-full whitespace-nowrap shadow-md pointer-events-none">
              @vantammayilu ↗
            </span>
          </a>

          <a 
            href="https://www.instagram.com/vantabbayilu/" 
            target="_blank" 
            rel="noopener noreferrer"
            title="Follow @vantabbayilu on Instagram"
            className="group relative block transition-all duration-300 hover:scale-125 hover:-translate-y-2 drop-shadow-2xl"
          >
            <img src="/ass1.png" alt="Vantabbayilu Instagram" className="w-36 h-36 md:w-44 md:h-44 object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)]" />
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--text-main)] text-cream text-[10px] font-mono uppercase px-3 py-1 rounded-full whitespace-nowrap shadow-md pointer-events-none">
              @vantabbayilu ↗
            </span>
          </a>
        </div>

        {/* Right Side: Instagram Video Player when hovering thumbnail */}
        <div className={`absolute right-[5%] top-1/2 -translate-y-1/2 z-30 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${activeFunItem ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12 pointer-events-none'}`}>
          <div className="w-[350px] md:w-[550px] lg:w-[650px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#f4ebd9]/80 bg-black relative">
            {activeFunItem && (
              <video key={activeFunItem.id} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                <source src={activeFunItem.video} type="video/mp4" />
              </video>
            )}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-center bg-black/60 backdrop-blur-md px-5 py-3 rounded-2xl text-[#efe8db] border border-white/10">
              <div>
                <span className="text-[#e86321] font-mono text-xs font-bold mr-2">{activeFunItem?.account}</span>
                <span className="font-body text-sm md:text-base italic">{activeFunItem?.title}</span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-white/20 px-2 py-1 rounded text-cream">Reel Preview</span>
            </div>
          </div>
        </div>
      </section>

      <EdgeDivider src="/edge2.png" />

      {/* 7. UNTIL NEXT TIME (CTA) */}
      <section className="relative w-full py-24 md:py-32 flex flex-col justify-center items-center text-center overflow-hidden bg-[var(--accent-primary)] z-10">
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
              className="inline-block bg-[#fcf8f2] text-[#d45d3a] border-2 border-[#fcf8f2] font-sans text-sm md:text-base font-bold tracking-wider uppercase px-8 py-3.5 rounded-full shadow-md hover:bg-[#d45d3a] hover:text-[#fcf8f2] transition-colors duration-300"
            >
              See the next dinner
            </Link>
          </motion.div>
        </div>
      </section>

      <EdgeDivider src="/edge4.png" />

      {/* BLOG READ POPUP MODAL */}
      <AnimatePresence>
        {activeBlogRead && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setActiveBlogRead(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent="true"
              className="bg-[#fcf8f2] text-[var(--text-main)] max-w-3xl w-full max-h-[85vh] overflow-y-auto rounded-3xl p-6 md:p-12 shadow-2xl relative border border-[var(--text-main)]/10"
              style={{ overscrollBehavior: "contain" }}
            >
              <button 
                onClick={() => setActiveBlogRead(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-[#efe8db] hover:bg-[#e86321] hover:text-white transition-colors text-[var(--text-main)]"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-wrap gap-4 items-center text-xs font-mono uppercase tracking-widest text-[#e86321] mb-4">
                <span>{activeBlogRead.date}</span>
                <span>•</span>
                <span>{activeBlogRead.readTime}</span>
                <span>•</span>
                <span>{activeBlogRead.author}</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-heading text-[var(--text-main)] mb-8 leading-tight">
                {activeBlogRead.title}
              </h2>

              <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8 shadow-md bg-[#efe8db] flex items-center justify-center p-4">
                <img src={activeBlogRead.img} alt={activeBlogRead.title} className="w-full h-full object-contain" />
              </div>

              <div className="space-y-6 font-body text-lg md:text-xl text-[var(--text-main)]/90 leading-relaxed">
                {activeBlogRead.content ? (
                  activeBlogRead.content.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))
                ) : (
                  <p>Thank you for exploring our selected works. Every gathering brings new stories, conversations, and recipes.</p>
                )}
              </div>

              <div className="mt-12 pt-8 border-t border-[var(--text-main)]/10 flex justify-between items-center">
                <span className="font-logo text-3xl text-[#e86321]">Vantammayilu Journal</span>
                <button 
                  onClick={() => setActiveBlogRead(null)}
                  className="bg-[var(--text-main)] text-[#fcf8f2] px-6 py-2 rounded-md text-sm hover:bg-[#e86321] transition-colors"
                >
                  Close Article
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
