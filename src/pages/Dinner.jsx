import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Check, Info, Clock, Users, MapPin, CreditCard, Sparkles } from 'lucide-react';
import BookingModal from '../components/BookingModal';

const CURRENT_DINNER = {
  id: 'vietnam-dinner-01',
  title: 'A night in Vietnam',
  price_inr: 450000, // ₹4,500
  event_date: '2026-07-25',
};

const menuItems = [
  { course: "First", title: "A bright beginning.", desc: "Fresh. Crisp. Unexpected.", dish: "Gỏi Cuốn — Fresh summer rolls with herbs & peanut dipping sauce" },
  { course: "Second", title: "Comfort in a bowl.", desc: "Fragrant star anise broth.", dish: "Phở Chay — A comforting, slow-simmered herb noodle soup" },
  { course: "Third", title: "The heart of the evening.", desc: "Bold, rich flavor pairings.", dish: "Bánh Xèo — Sizzling crispy rice pancakes with savory mushroom filling" },
  { course: "Fourth", title: "Made for sharing.", desc: "Smoky claypot eggplant.", dish: "Cà Tím Nướng — Grilled eggplant with scallion oil & garlic soy" },
  { course: "Fifth", title: "A sweet ending...", desc: "Banana coconut soup.", dish: "Chè Chuối — Warm banana coconut sweet soup with toasted sesame" }
];

const faqs = [
  {
    q: "Can I come alone?",
    a: "Yes! In fact, most of our guests sign up alone. The table is designed for strangers to meet and leave as friends."
  },
  {
    q: "What does the contribution include?",
    a: "The contribution is ₹4,500 per guest. This includes the full five-course curated tasting menu, custom mocktails, and the entire table experience."
  },
  {
    q: "What is the cancellation/refund policy?",
    a: "Because we only have eight seats, all bookings are final and non-refundable. However, you can transfer your seat to a friend if you cannot make it."
  },
  {
    q: "Is the menu vegetarian-friendly?",
    a: "Yes, we accommodate vegetarian requests. Please let us know your dietary preferences during the checkout details screen."
  },
  {
    q: "How is the secret location shared?",
    a: "The exact home address in Visakhapatnam will be sent via email and WhatsApp exactly 24 hours prior to the dinner."
  }
];



const DinnerSequence = () => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    // Preload images for smoother scrubbing
    for (let i = 1; i <= 27; i++) {
      const img = new Image();
      const num = i.toString().padStart(3, '0');
      img.src = `/dinneranimate/ezgif-frame-${num}.jpg`;
    }
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!imgRef.current) return;
    const frame = Math.max(1, Math.min(27, Math.round(latest * 26) + 1));
    const num = frame.toString().padStart(3, '0');
    imgRef.current.src = `/dinneranimate/ezgif-frame-${num}.jpg`;
  });

  return (
    <section ref={containerRef} className="h-[300vh] relative bg-[var(--bg-primary)]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden border-t border-[var(--text-main)]/10">
        
        {/* Sequence Image Background */}
        <img 
          ref={imgRef}
          src="/dinneranimate/ezgif-frame-001.jpg" 
          alt="Dinner Table Assembly Sequence" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 mx-auto"
        />

        {/* Overlay Text */}
        <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center flex flex-col items-center pointer-events-none">
          <span className="font-logo text-5xl md:text-6xl text-[var(--accent-primary)] block mb-4 transform -rotate-2 drop-shadow-sm">
            Reserve your seat
          </span>
          <h2 className="text-6xl md:text-[5.5rem] font-heading text-[var(--text-main)] mb-12 tracking-tight drop-shadow-md bg-[var(--bg-primary)]/70 backdrop-blur-md rounded-full px-12 py-4 shadow-2xl border border-[var(--text-main)]/5">
            The table is almost ready.
          </h2>
        </div>

      </div>
    </section>
  );
};

export default function Dinner() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [optionState, setOptionState] = useState('A'); // 'A' (3 seats), 'B' (1 seat), 'C' (Sold Out)
  const [revealedItems, setRevealedItems] = useState({});
  const [openFaq, setOpenFaq] = useState(null);
  const [clickedSeats, setClickedSeats] = useState({});

  const handleSeatClick = (idx) => {
    setClickedSeats(prev => ({
      ...prev,
      [idx]: true // Set to true to switch to trans.png permanently, or toggle with !prev[idx] if desired
    }));
  };

  // --- CUSHION COORDINATES ---
  // Adjust these percentages to perfectly align the clickable 5.png cushions over the dinnertable.png base image.
  const cushionPositions = [
    // Top Table - Left side
    { top: '8%', left: '14%', width: '18%', height: '18%' },
    { top: '8%', left: '34%', width: '18%', height: '18%' },
    // Top Table - Right side
    { top: '8%', left: '55%', width: '18%', height: '18%' },
    { top: '8%', left: '76%', width: '18%', height: '18%' },
    // Bottom Table - Left side
    { top: '67%', left: '13%', width: '18%', height: '18%' },
    { top: '67%', left: '34%', width: '18%', height: '18%' },
    // Bottom Table - Right side
    { top: '67%', left: '54.5%', width: '18%', height: '18%' },
    { top: '67%', left: '76%', width: '18%', height: '18%' }
  ];

  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"]
  });
  const doodleY = useTransform(scrollYProgress, [0, 1], ["0%", "95%"]);

  // House Rules Scroll Tracker
  const rulesRef = useRef(null);
  const { scrollYProgress: rulesProgress } = useScroll({
    target: rulesRef,
    offset: ["start start", "end end"]
  });

  const toggleReveal = (idx) => {
    setRevealedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="w-full relative bg-[var(--bg-primary)]">

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-12 px-6 lg:px-16 overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-primary)]/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-6 flex flex-col justify-center relative z-20">
            <span className="text-[#d87c53] font-body tracking-[0.2em] uppercase text-xs mb-6 block font-bold">
              NEXT AT VANTAMMAYILU
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-heading leading-[1.05] text-[#2c2b29] mb-8 relative">
              When in <br />Marrakech, <br />
              <span className="relative inline-block mt-2">
                Morocco.
                {/* Thick Pink Painted Stroke */}
                <svg className="absolute w-[110%] h-4 -bottom-1 -left-[5%] text-[#ea8591] opacity-90" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M2,5 Q50,7 98,4" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="font-body text-xl text-[var(--text-main)]/80 mb-10 max-w-lg leading-relaxed">
              Five courses inspired by Moroccan kitchens, shared with eight curious people around one table.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mt-6">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="group relative inline-block bg-[#efe8db] text-[#2c2b29] border border-[#2c2b29]/5 shadow-sm hover:shadow-md transition-all duration-300 rounded-full px-8 py-4 font-body text-sm font-bold tracking-wide flex items-center justify-center text-center leading-tight"
              >
                Reserve your<br/>seat
              </button>
              <a 
                href="#menu" 
                className="group relative inline-block bg-[#efe8db] text-[#2c2b29] border border-[#2c2b29]/5 shadow-sm hover:shadow-md transition-all duration-300 rounded-full px-8 py-4 font-body text-sm font-bold tracking-wide flex items-center justify-center text-center leading-tight"
              >
                Explore what's<br/>on the table
              </a>
            </div>
          </div>

          {/* Hero Image / Collage */}
          <div className="lg:col-span-6 relative w-full min-h-[50vh] flex items-center justify-center lg:justify-end mt-12 lg:mt-0 pointer-events-none">
            <motion.img 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              src="/dinnerheromix.png" 
              alt="Morocco Dinner Experience" 
              className="w-[110%] lg:w-[128%] max-w-none object-contain drop-shadow-sm -mr-16 lg:-mr-32 mix-blend-multiply z-0"
            />
          </div>
        </div>
      </section>

      {/* 2. WHAT'S ON THE TABLE? (MENU) */}
      <section id="menu" className="py-32 bg-[var(--bg-secondary)] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="font-body italic text-3xl text-[var(--accent-primary)] block mb-2 font-logo">The Menu</span>
            <h2 className="text-5xl md:text-6xl font-heading text-[var(--text-main)]">What's on the table?</h2>
            <p className="font-body text-lg text-[var(--text-main)]/60 mt-4">
              Instead of revealing the entire menu, we prefer curiosity. Pull a card to the right to reveal its dish.
            </p>
          </div>

          <div className="space-y-6 flex flex-col items-start">
            {menuItems.map((item, idx) => (
              <div
                key={idx}
                className={`relative bg-[var(--bg-primary)] p-6 md:p-8 rounded-2xl shadow-sm border border-[var(--text-main)]/10 overflow-hidden hover:shadow-md ${revealedItems[idx] ? 'w-full' : 'w-full md:w-1/2 lg:w-[40%]'} transition-[width] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-left min-h-[220px] md:min-h-[180px] flex items-center`}
              >
                {!revealedItems[idx] && (
                  <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: 100 }}
                    dragElastic={0.1}
                    onDragEnd={(e, { offset, velocity }) => {
                      if (offset.x > 50 || velocity.x > 300) {
                        toggleReveal(idx);
                      }
                    }}
                    className="absolute top-0 right-0 bottom-0 w-24 z-20 cursor-grab active:cursor-grabbing flex items-center justify-end pr-6 bg-gradient-to-l from-[var(--bg-primary)] to-transparent"
                  >
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-[var(--accent-primary)] font-bold text-2xl">→</motion.div>
                  </motion.div>
                )}
                <div className={`flex flex-col md:flex-row gap-6 items-center w-full h-full`}>

                  {/* Left part (always visible) */}
                  <div className={`flex flex-col justify-center h-full ${revealedItems[idx] ? 'md:w-1/3' : 'w-full'} transition-[width] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-body text-xs uppercase tracking-widest text-[var(--accent-primary)] font-bold">Course</span>
                      <span className="font-heading text-2xl text-[var(--text-main)]">{item.course}</span>
                    </div>
                    <h3 className="font-body text-2xl font-bold text-[var(--text-main)]">{item.title}</h3>

                    <AnimatePresence>
                      {!revealedItems[idx] && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="mt-4 font-body text-xs uppercase tracking-widest text-[var(--text-main)]/40 flex items-center gap-2 absolute bottom-6 md:bottom-8"
                        >
                          <span>Pull right edge to reveal</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Revealed part */}
                  <AnimatePresence>
                    {revealedItems[idx] && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 flex flex-col md:flex-row items-center w-full h-full"
                      >
                        {/* Center Dish Name */}
                        <div className="flex-1 flex items-center justify-center text-center md:border-l md:border-r border-[var(--text-main)]/10 px-6 py-4 w-full h-full">
                          <h4 className="font-heading text-3xl lg:text-4xl text-[var(--accent-primary)] leading-tight">{item.dish.split('—')[0]}</h4>
                        </div>

                        {/* Right Description */}
                        <div className="flex-1 md:pl-8 flex flex-col justify-center text-center md:text-left mt-4 md:mt-0 w-full h-full">
                          <p className="font-body text-lg text-[var(--text-main)]/80 italic">
                            {item.dish.split('—')[1]}
                          </p>
                          <p className="font-body text-sm text-[var(--text-main)]/60 mt-2 uppercase tracking-widest font-bold">
                            {item.desc}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
                {/* Background wash on hover */}
                <div className="absolute inset-0 bg-[var(--accent-primary)]/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THE EVENING, IN ORDER (TIMELINE) */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl relative" ref={timelineRef}>
          <div className="text-center mb-32">
            <span className="font-body italic text-3xl text-[var(--accent-primary)] block mb-2 font-logo">Timeline</span>
            <h2 className="text-5xl md:text-6xl font-heading text-[var(--text-main)]">The evening, in order.</h2>
          </div>

          <div className="relative flex flex-col items-center w-full">

            {/* The Thicker Dotted Line */}
            <div className="absolute top-0 bottom-0 left-6 md:left-1/2 md:-translate-x-1/2 w-1 border-l-[4px] border-dotted border-[var(--text-main)]/30 z-0" />

            {/* Scroll-driven doodle on path */}
            <motion.div
              style={{ top: doodleY }}
              className="absolute left-6 md:left-1/2 -translate-x-[36px] md:-translate-x-1/2 z-20 w-[102px] h-[102px] flex items-center justify-center bg-[var(--bg-primary)] rounded-full border border-[var(--text-main)]/10 shadow-sm"
            >
              <img src="/d1alt.png" alt="doodle tracker" className="w-[64px] h-[64px] object-contain drop-shadow-sm" />
            </motion.div>

            <div className="w-full space-y-28 md:space-y-40 z-10 pt-10">
              {[
                { time: "7:30 PM", title: "Doors open.", desc: "Music starts. Names become faces." },
                { time: "8:00 PM", title: "First course.", desc: "The room is still getting to know itself." },
                { time: "9:00 PM", title: "The conversations get louder.", desc: "Someone always mentions travel." },
                { time: "10:00 PM", title: "Dessert arrives.", desc: "Nobody wants to check the time." },
                { time: "Whenever it ends", title: "People leave slower...", desc: "Than they arrived.", highlight: true }
              ].map((step, idx) => {
                const isLeft = idx % 2 === 0;
                // Add some random horizontal staggering for a wavy organic feel
                const randomOffsets = ["md:-ml-4", "md:ml-8", "md:-ml-12", "md:ml-4", "md:-ml-8"];
                const staggerClass = randomOffsets[idx % randomOffsets.length];

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`relative w-full flex pl-20 md:pl-0 ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}
                  >
                    {/* Timeline Node */}
                    <span className={`absolute left-[13px] md:left-1/2 top-4 -translate-x-1/2 w-8 h-8 rounded-full border-[3px] border-[var(--bg-primary)] flex items-center justify-center ${step.highlight ? 'bg-[var(--accent-primary)]' : 'bg-[var(--text-main)]'} z-10 shadow-sm`}>
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--bg-primary)]" />
                    </span>

                    <div className={`md:w-1/2 ${isLeft ? 'md:pr-24 md:text-right' : 'md:pl-24 text-left'} text-left ${staggerClass}`}>
                      <span className={`font-body text-3xl block ${step.highlight ? 'text-[var(--accent-primary)]' : 'text-[var(--text-main)]'}`}>
                        {step.time}
                      </span>
                      <h3 className="font-logo text-4xl md:text-5xl mt-2 text-[var(--text-main)]">{step.title}</h3>
                      <p className="font-body text-xl text-[var(--text-main)]/75 mt-1">{step.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT TO EXPECT (HOUSE RULES MARQUEES) */}
      <section className="py-28 bg-[var(--bg-secondary)] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl mb-16">
          <div className="text-center">
            <span className="font-body italic text-3xl text-[var(--accent-primary)] block mb-2 font-logo">House Rules</span>
            <h2 className="text-5xl md:text-6xl font-heading text-[var(--text-main)]">What to expect</h2>
          </div>
        </div>

        <div className="flex flex-col w-full relative">
          {[
            "Five curated courses",
            "Eight guests",
            "Shared table",
            "Hosted at home",
            "Vegetarian options available",
            "Come alone or with one friend"
          ].map((item, idx) => {
            const isOdd = idx % 2 === 0; // 0, 2, 4 are 1st, 3rd, 5th
            const bgInitial = isOdd ? 'bg-[var(--bg-secondary)]' : 'bg-[var(--accent-primary)]';
            const textInitial = isOdd ? 'text-[var(--accent-primary)]' : 'text-[var(--bg-secondary)]';
            const bgHover = isOdd ? 'hover:bg-[var(--accent-primary)]' : 'hover:bg-[var(--bg-secondary)]';
            const textHover = isOdd ? 'hover:text-[var(--bg-secondary)]' : 'hover:text-[var(--accent-primary)]';

            return (
              <div
                key={idx}
                className={`group flex items-center w-full py-6 md:py-8 border-y border-[var(--text-main)]/10 -mt-[1px] transition-colors duration-500 cursor-default ${bgInitial} ${textInitial} ${bgHover} ${textHover}`}
              >
                <motion.div
                  animate={{ x: [0, -1000] }}
                  transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 20 + (idx % 3) * 5
                  }}
                  className="flex items-center whitespace-nowrap"
                >
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <span className="font-body text-2xl md:text-3xl lg:text-4xl mx-8 tracking-widest leading-none drop-shadow-sm">
                        {item}
                      </span>
                      <div className="w-12 h-12 flex items-center justify-center -rotate-12 group-hover:rotate-12 transition-transform duration-500">
                        <Sparkles size={32} strokeWidth={2} />
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. WHO'S THIS FOR? */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20">
            <span className="font-body italic text-3xl text-[var(--accent-primary)] block mb-2 font-logo">- Alignment -</span>
            <h2 className="text-5xl md:text-6xl font-heading text-[var(--text-main)]">Who's this for?</h2>
            <p className="font-body text-xl italic text-[var(--text-main)]/60 mt-4">
              Not everyone. And that's okay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { text: "People who enjoy trying new food.", img: "/people/11.png" },
              { text: "People who love travelling.", img: "/people/12.png" },
              { text: "People who ask questions.", img: "/people/13.png" },
              { text: "People who stay for one more conversation.", img: "/people/14.png" },
              { text: "People who believe strangers have stories worth hearing.", img: "/people/15.png" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-full aspect-square mb-6 relative flex items-center justify-center">
                  <img src={item.img} alt={`Guest ${idx + 1}`} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] scale-[1.3] group-hover:scale-[1.4]" />
                </div>
                <span className="font-heading text-xl text-[var(--accent-primary)] mb-3">0{idx + 1}.</span>
                <p className="font-body text-xl md:text-2xl text-[var(--text-main)]/85 leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GOOD TO KNOW */}
      <section className="py-28 bg-[var(--bg-secondary)] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-heading text-[var(--text-main)]">Good to know</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: <MapPin size={22} />, label: "Location", value: "Visakhapatnam", note: "Shared after booking.", doodle: "/d1alt.png" },
              { icon: <Clock size={22} />, label: "Time", value: "7:30 PM onwards", note: "Be on time.", doodle: "/d2alt.png" },
              { icon: <Users size={22} />, label: "Seats", value: "Only eight.", note: "Highly intimate.", doodle: "/1.png" },
              { icon: <CreditCard size={22} />, label: "Bookings", value: "Confirmed after payment.", note: "Non-refundable lock.", doodle: "/2.png" },
              { icon: <Info size={22} />, label: "Dietary requests", value: "Tell us beforehand.", note: "We'll always try our best.", doodle: "/3.png" }
            ].map((item, idx) => (
              <div
                key={idx}
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 93%, 0 100%)' }}
                className="relative pt-12 p-6 bg-[var(--bg-primary)] border border-t-0 border-[var(--text-main)]/10 shadow-sm flex flex-col justify-between h-[320px] hover:-translate-y-2 transition-transform duration-300 group"
              >
                {/* Decorative Doodle Pin */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-10 opacity-70 group-hover:opacity-100 transition-opacity">
                  <img src={item.doodle} alt="pin" className="w-full h-full object-contain drop-shadow-sm" />
                </div>

                <div className="flex justify-center items-center text-[var(--accent-primary)] mb-6 mt-4">
                  {item.icon}
                </div>
                <div className="text-center flex-1 flex flex-col justify-center">
                  <span className="block font-body text-xs uppercase tracking-widest text-[var(--text-main)]/50 mb-2">{item.label}</span>
                  <span className="font-heading text-3xl text-[var(--text-main)] block leading-tight">{item.value}</span>
                  <p className="font-body text-sm text-[var(--text-main)]/60 mt-3 italic">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-32 relative overflow-hidden bg-[var(--bg-primary)] border-t border-[var(--text-main)]/10">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <span className="font-body italic text-3xl text-[var(--accent-primary)] block mb-2 font-logo">Questions</span>
            <h2 className="text-5xl font-heading text-[var(--text-main)]">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--text-main)]/10 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center font-body text-2xl text-[var(--text-main)] hover:text-[var(--accent-primary)] transition-colors focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <span className="text-xl font-body ml-4 select-none">
                    {openFaq === idx ? '−' : '+'}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-[var(--text-main)]/5 font-body text-lg text-[var(--text-main)]/85 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. THE TABLE IS ALMOST READY (SCROLL SEQUENCE) */}
      <DinnerSequence />

      {/* Shared Booking Modal Flow */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        dinner={CURRENT_DINNER}
        onBookingComplete={() => {
          // Dynamic completion check, could optionally lock Option C
          setOptionState('C');
        }}
      />
    </div>
  );
}
