import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Check, Info, Clock, Users, MapPin, CreditCard, Sparkles } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import InterestModal from '../components/InterestModal';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../supabase';

const CURRENT_DINNER = {
  id: 'vietnam-dinner-01',
  title: 'A night in Vietnam',
  price_inr: 450000, // ₹4,500
  event_date: '2026-07-25',
};

const menuItems = [
  { course: "Course I", title: "A bright beginning.", desc: "Fresh. Crisp. Unexpected.", dish: "Gỏi Cuốn — Fresh summer rolls with herbs & peanut dipping sauce" },
  { course: "Course II", title: "Comfort in a bowl.", desc: "Fragrant star anise broth.", dish: "Phở Chay — A comforting, slow-simmered herb noodle soup" },
  { course: "Course III", title: "The heart of the evening.", desc: "Bold, rich flavor pairings.", dish: "Bánh Xèo — Sizzling crispy rice pancakes with savory mushroom filling" },
  { course: "Course IV", title: "Made for sharing.", desc: "Smoky claypot eggplant.", dish: "Cà Tím Nướng — Grilled eggplant with scallion oil & garlic soy" },
  { course: "Course V", title: "A sweet ending...", desc: "Banana coconut soup.", dish: "Chè Chuối — Warm banana coconut sweet soup with toasted sesame" }
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



const ReserveSection = ({ onReserveClick, onInterestClick, canReserve }) => {
  return (
    <section className="relative w-full bg-[var(--bg-primary)] flex flex-col items-center pt-24 pb-0 overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src="/texture.png" alt="Background texture" className="w-full h-full object-cover opacity-40 mix-blend-multiply" />
      </div>

      <div className="relative z-30 flex flex-col items-center w-full mx-auto">

        {/* Center Title and Subtitle */}
        <div className="text-center flex flex-col items-center mb-0 relative z-30 px-6">
          <h2 className="font-logo text-7xl md:text-9xl text-[var(--accent-primary)] mb-2 drop-shadow-sm transform -rotate-2">Reserve a seat</h2>
          <p className="font-body italic text-xl md:text-2xl text-[var(--text-main)] mb-6">
            Good food. Warm company.<br />Stories that stay with you.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 relative z-40">
            {canReserve ? (
              <button
                onClick={onReserveClick}
                className="bg-[var(--accent-primary)] text-white font-heading text-lg md:text-xl tracking-wider px-8 py-3 md:px-10 md:py-4 rounded-full shadow-lg hover:bg-[#c14a27] hover:scale-105 transition-all duration-300"
              >
                Reserve Your Seat
              </button>
            ) : (
              <button
                onClick={onInterestClick}
                className="bg-[var(--accent-primary)] text-white font-heading text-lg md:text-xl tracking-wider px-8 py-3 md:px-10 md:py-4 rounded-full shadow-lg hover:bg-[#c14a27] hover:scale-105 transition-all duration-300"
              >
                I'm Interested
              </button>
            )}
          </div>
        </div>

        {/* Main Illustration immediately below CTA */}
        <div className="w-full relative z-20 pointer-events-none flex justify-center -mt-32 md:-mt-64 px-4 md:px-0">
          <img
            src="/reserveseat.png"
            alt="People dining at table"
            className="w-full max-w-[1600px] lg:scale-110 object-contain object-bottom"
          />
        </div>
      </div>
    </section>
  );
};

export default function Dinner() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isInterestOpen, setIsInterestOpen] = useState(false);
  const [optionState, setOptionState] = useState('A');
  const [revealedItems, setRevealedItems] = useState({});
  const [openFaq, setOpenFaq] = useState(null);
  const [clickedSeats, setClickedSeats] = useState({});

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [activeDinner, setActiveDinner] = useState(CURRENT_DINNER);
  const canReserve = Boolean(token || activeDinner?.status === 'bookings_open');

  useEffect(() => {
    // Fetch the latest active occurrence
    const fetchDinner = async () => {
      try {
        const res = await fetch('/api/occurrences');
        const data = await res.json();
        if (data.success && data.occurrences?.length > 0) {
          const latest = data.occurrences[0];
          setActiveDinner({ ...latest, price_inr: latest.price_inr });
        }
      } catch (err) {
        console.error('Error fetching dinner occurrence:', err);
      }
    };
    fetchDinner();
  }, []);

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
      <section className="relative min-h-[92vh] flex flex-col justify-between pt-28 md:pt-36 pb-0 px-6 lg:px-16 overflow-hidden bg-[var(--bg-primary)]">
        {/* Soft background glow */}
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-primary)]/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto pb-16">

          {/* Left Column: Typography & CTA */}
          <div className="lg:col-span-6 flex flex-col justify-center relative z-30 pl-2 lg:pl-6 text-left">
            
            {/* Subtitle */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[var(--accent-primary)] font-body tracking-[0.2em] uppercase text-xs md:text-sm font-bold">
                BOOK YOUR SEAT
              </span>
              <motion.span 
                animate={{ rotate: [-10, 10, -10], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="text-[var(--accent-primary)] inline-block"
              >
                <svg className="w-5 h-5 text-[var(--accent-primary)]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" opacity="0.3"/>
                  <path d="M7 11h10v2H7zM12 7v10h-2V7z"/>
                  {/* Little chair/sparkle silhouette */}
                  <path d="M15 5h3v2h-3zm-9 0h3v2H6zm4.5 12h3v2h-3z"/>
                </svg>
              </motion.span>
              <span className="text-[var(--accent-primary)] text-sm font-bold animate-pulse">✴</span>
            </div>

            {/* Stacked Big Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-heading leading-[0.96] text-[#2c2b29] mb-5 tracking-tight">
              Good<br />
              food.<br />
              Great<br />
              company.
            </h1>

            {/* Description */}
            <p className="font-body text-lg md:text-xl text-[var(--text-main)]/85 mb-8 max-w-md leading-relaxed">
              Intimate dinners. Curated menus.<br />
              Conversations that <span className="underline decoration-[var(--accent-primary)] decoration-2 underline-offset-6">travel</span> beyond the table.
            </p>

            {/* Reserve or Interest Button */}
            <div className="flex flex-wrap items-center gap-3 my-3">
              {canReserve ? (
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="bg-[var(--accent-primary)] text-white font-body uppercase text-base md:text-lg font-extrabold tracking-widest px-8 py-3.5 rounded-xl shadow-xl hover:bg-[#c14a27] hover:scale-105 active:scale-95 border-2 border-[#ffffff]/20 transition-all duration-300 z-20 cursor-pointer"
                >
                  RESERVE YOUR SEAT
                </button>
              ) : (
                <button
                  onClick={() => setIsInterestOpen(true)}
                  className="bg-[var(--accent-primary)] text-white font-body uppercase text-base md:text-lg font-extrabold tracking-widest px-8 py-3.5 rounded-xl shadow-xl hover:bg-[#c14a27] hover:scale-105 active:scale-95 border-2 border-[#ffffff]/20 transition-all duration-300 z-20 cursor-pointer"
                >
                  I'M INTERESTED
                </button>
              )}
            </div>

            {/* Heart & Handwritten Note */}
            <div className="flex items-center gap-2 mt-5 text-[var(--text-main)]">
              <span className="text-xl md:text-2xl text-[var(--accent-primary)]">♡</span>
              <span className="font-logo text-xl md:text-2xl tracking-wide pt-1 text-[#2c2b29]">
                <span className="border-b-[1.5px] border-[var(--accent-primary)] pb-0.5">Pick a dinner.</span> Join the table.
              </span>
            </div>

          </div>

          {/* Right Column: Reference Collage Illustration Area */}
          <div className="lg:col-span-6 relative w-full min-h-[420px] lg:min-h-[500px] flex items-center justify-center mt-6 lg:mt-0 pointer-events-none select-none">
            
            <div className="relative w-full max-w-[440px] flex items-center justify-center">
              
              {/* d3.png: Black Crescent Moon */}
              <motion.img
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                src="/d3.png"
                alt="Crescent Moon"
                className="absolute top-4 left-4 sm:left-6 md:left-2 lg:-left-4 w-10 sm:w-14 md:w-16 h-auto object-contain z-20 drop-shadow-sm"
              />

              {/* d4.png: Orange Star (Top right of moon) */}
              <motion.img
                animate={{ rotate: 360, scale: [1, 1.15, 1] }}
                transition={{ rotate: { repeat: Infinity, duration: 25, ease: "linear" }, scale: { repeat: Infinity, duration: 3 } }}
                src="/d4.png"
                alt="Orange Star"
                className="absolute -top-4 left-20 sm:left-28 md:left-32 w-7 sm:w-9 md:w-10 h-auto object-contain z-20"
              />

              {/* d4.png: Orange Star (Bottom left of moon) */}
              <motion.img
                animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                transition={{ rotate: { repeat: Infinity, duration: 30, ease: "linear" }, scale: { repeat: Infinity, duration: 4, delay: 1 } }}
                src="/d4.png"
                alt="Orange Star"
                className="absolute top-28 left-6 sm:left-10 md:left-6 w-6 sm:w-8 md:w-9 h-auto object-contain z-20"
              />

              {/* d1.png: Main Orange Archway & Table Centerpiece */}
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                src="/d1.png"
                alt="Intimate Dinner Archway"
                className="w-[80%] sm:w-[75%] md:w-[80%] h-auto object-contain relative z-10 drop-shadow-md mx-auto"
              />

              {/* d2.png: Hanging Lamp Glow / Layer overlay */}
              <motion.img
                animate={{ y: [-3, 3, -3] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                src="/d2.png"
                alt="Lamp"
                className="absolute top-[12%] sm:top-[13%] left-1/2 -translate-x-1/2 w-20 sm:w-28 md:w-32 h-auto object-contain z-20 opacity-90 mix-blend-multiply"
              />

              {/* d7.png: Left Green Potted Plant */}
              <motion.img
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                src="/d7.png"
                alt="Potted Plant Left"
                className="absolute -bottom-4 left-0 sm:-left-4 md:-left-8 lg:-left-12 w-28 sm:w-36 md:w-40 lg:w-44 h-auto object-contain z-20 drop-shadow"
              />

              {/* d6.png: Right Tall Palm Plant */}
              <motion.img
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                src="/d6.png"
                alt="Tall Potted Palm Right"
                className="absolute -bottom-6 right-2 sm:-right-4 md:-right-8 lg:-right-12 w-32 sm:w-40 md:w-48 lg:w-52 h-auto object-contain z-20 drop-shadow"
              />

              {/* d5.png: Vertical Grid Dots */}
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={{ duration: 1.2, delay: 0.6 }}
                src="/d5.png"
                alt="Grid pattern"
                className="absolute bottom-16 -right-2 sm:-right-8 md:-right-16 lg:-right-20 w-8 sm:w-12 md:w-14 h-auto object-contain z-10"
              />

            </div>

          </div>

        </div>

        {/* Transition edge bottom border leading into next section: d8.png zoomed end-to-end */}
        <div className="w-full relative z-30 pt-6 pb-0 bg-transparent pointer-events-none flex justify-center overflow-hidden">
          <img 
            src="/d8.png" 
            alt="Section transition decoration" 
            className="w-full h-20 sm:h-28 md:h-36 lg:h-44 object-cover object-center select-none opacity-95 scale-110 transform" 
          />
        </div>
      </section>

      {/* 2. WHAT'S ON THE TABLE? (MENU) */}
      <section id="menu" className="py-32 bg-[var(--bg-secondary)] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="font-body italic text-3xl text-[var(--accent-primary)] block mb-2 font-logo">The Menu</span>
            <h2 className="text-5xl md:text-6xl font-heading text-[var(--text-main)]">The menu</h2>
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
              className="absolute left-6 md:left-1/2 -translate-x-[36px] md:-translate-x-1/2 z-20 w-[80px] h-[80px] flex items-center justify-center bg-[var(--bg-primary)] rounded-full border border-[var(--text-main)]/10 shadow-sm overflow-hidden"
            >
              <img src="/d1alt.png" alt="doodle tracker" className="w-[72px] h-[72px] object-contain drop-shadow-sm" />
            </motion.div>

            <div className="w-full space-y-28 md:space-y-40 z-10 pt-10">
              {[
                { time: "6:45 PM", title: "It starts.", desc: "Guests arrive." },
                { time: "7:00 PM", title: "Take your seats.", desc: "Everyone settles in." },
                { time: "7:15 PM", title: "The first course.", desc: "Little intros, icebreaker questions." },
                { time: "9:30 PM", title: "Five courses later.", desc: "All courses are served, people keep talking." },
                { time: "10:00 PM", title: "Staying late.", desc: "People end up staying till 10pm or even later.", highlight: true }
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

      {/* 4. WHO'S THIS FOR? */}
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
              { label: "The Curious One", text: "People who enjoy trying new food.", img: "/people/11.png" },
              { label: "The Wanderer", text: "People who love travelling.", img: "/people/12.png" },
              { label: "The Inquirer", text: "People who ask questions.", img: "/people/13.png" },
              { label: "The Lingerer", text: "People who stay for one more conversation.", img: "/people/14.png" },
              { label: "The Listener", text: "People who believe strangers have stories worth hearing.", img: "/people/15.png" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="font-logo text-3xl text-[var(--accent-primary)] mb-4 h-12 flex items-end">
                  {item.label}
                </div>
                <div className="w-full aspect-square mb-6 relative flex items-center justify-center">
                  <img src={item.img} alt={`Guest ${idx + 1}`} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] scale-[1.5] group-hover:scale-[1.6]" />
                </div>
                <p className="font-body text-xl md:text-2xl text-[var(--text-main)]/85 leading-relaxed mt-4">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOUSE RULES & GOOD TO KNOW */}
      <section className="py-28 bg-[var(--bg-secondary)] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">

          <div className="flex flex-col gap-16">
            <div className="text-center mb-4">
              <span className="font-body italic text-4xl text-[var(--accent-primary)] block mb-4 font-logo -rotate-2">House Rules & Logistics</span>
              <h2 className="text-5xl md:text-6xl font-heading text-[var(--text-main)]">What to expect</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { label: "Courses", value: "Five curated courses.", note: "Vegetarian options available." },
                { label: "Seats", value: "Only eight.", note: "Highly intimate." },
                { label: "Table", value: "Shared.", note: "Come alone or with a friend." },
                { label: "Location", value: "Visakhapatnam.", note: "Shared after booking." },
                { label: "Time", value: "6:45 PM onwards.", note: "Be on time." },
                { label: "Dietary", value: "Tell us beforehand.", note: "We'll always try our best." }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-8 bg-[#faf8f5] border border-[var(--text-main)]/10 shadow-md rounded-lg flex flex-col justify-between hover:-translate-y-2 hover:rotate-[1deg] hover:border-[var(--accent-primary)]/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 text-[var(--accent-primary)] mb-6 border-b border-[var(--text-main)]/10 pb-2">
                    <span className="font-body text-sm uppercase tracking-widest text-[var(--text-main)]/60 font-bold">{item.label}</span>
                  </div>
                  <div>
                    <span className="font-heading text-3xl text-[var(--text-main)] block leading-tight mb-2">{item.value}</span>
                    <p className="font-body text-base text-[var(--accent-primary)]/80 italic">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
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

      {/* 7. RESERVE A SEAT */}
      <ReserveSection 
        onReserveClick={() => setIsBookingOpen(true)} 
        onInterestClick={() => setIsInterestOpen(true)} 
      />

      {/* Shared Booking Modal Flow (Only accessible with token) */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        dinner={activeDinner}
        onBookingComplete={() => {
          setOptionState('C');
        }}
      />

      {/* Interest Modal (Accessible to public) */}
      <InterestModal
        isOpen={isInterestOpen}
        onClose={() => setIsInterestOpen(false)}
        dinner={activeDinner}
      />
    </div>
  );
}
