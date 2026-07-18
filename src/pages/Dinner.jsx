import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Check, Info, Clock, Users, MapPin, CreditCard, Sparkles } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import InterestModal from '../components/InterestModal';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../supabase';
import EdgeDivider from '../components/EdgeDivider';

const CURRENT_DINNER = {
  id: 'vietnam-dinner-01',
  title: 'A night in Vietnam',
  price_inr: 260000, // ₹2,600
  event_date: '2026-07-25',
  status: 'collecting_interests',
  dietary_type: 'non_veg',
};

const menuItems = [
  { course: "Starter", title: "Moroccan Mezze Platter", desc: "Warm, flaky m'semen & dips", dish: "MOROCCAN MEZZE PLATTER — Smoky Zaalouk, tangy Matbucha, and earthy Bissara served with warm, flaky m'semen for scooping and sharing.", img: "/fo1.png" },
  { course: "Small Plates", title: "Seafood Briouats", desc: "Crisp golden spiced cigars", dish: "SEAFOOD BRIOUATS — Crisp golden Cigars filled with spiced fish and shrimp, paired with creamy garlic Toum for a bold, savoury bite.", img: "/fo2.png" },
  { course: "Main Course", title: "Charmoula Chicken Tajine", desc: "Slow-cooked infused tajine", dish: "CHARMOULA CHICKEN TAJINE — Slow-cooked chicken infused with fragrant Ras el Hanout, seasonal vegetables, and olives, served with soft Khobz.", img: "/a10.png" },
  { course: "Dessert", title: "Shhh... Yalla Helwa!", desc: "Quietly decadent & soul of Morocco", dish: "SHHH... YALLA HELWA! — This one prefers not to be explained. Crunchy, creamy, and quietly decadent, with the unmistakable soul of Morocco.", img: "/fo3.png" },
  { course: "Drinks", title: "Moroccan Mint Tea", desc: "Fresh mint brewed with OG green tea", dish: "MOROCCAN MINT TEA — Aka 'Atay' is fresh mint brewed with the OG Gunpowder green tea, gently sweetened and poured warm.", img: "/fo5.png" },
  { course: "Drinks", title: "Cucumber Cooler", desc: "Light, refreshing balance", dish: "CUCUMBER COOLER — A light, refreshing balance to the warm spices of the table.", img: "/fo4.png" }
];

const faqs = [
  {
    q: "Can I come alone?",
    a: "Yes! In fact, most of our guests sign up alone. The table is designed for strangers to meet and leave as friends."
  },
  {
    q: "What does the contribution include?",
    a: "The contribution is ₹2,600 per guest. This includes the full five-course curated tasting menu, custom mocktails, and the entire table experience."
  },
  {
    q: "What is the cancellation/refund policy?",
    a: "Because we only have eight seats, all bookings are final and non-refundable. However, you can transfer your seat to a friend if you cannot make it, or contact the host directly for any help with cancellation or emergencies."
  },
  {
    q: "Is the menu vegetarian-friendly?",
    a: "Yes, we accommodate vegetarian requests. Please let us know your dietary preferences during the checkout details screen. Also note that we host dedicated 100% vegetarian dinners separately, so keep an eye out for those!"
  },
  {
    q: "How is the secret location shared?",
    a: "The exact home address in Visakhapatnam will be sent via email and WhatsApp exactly 24 hours prior to the dinner."
  }
];



const ReserveSection = ({ onReserveClick, onInterestClick, canReserve, isSoldOut, isTokenExpired, dinner }) => {
  return (
    <section className="relative w-full bg-[var(--bg-primary)] flex flex-col items-center pt-24 pb-0 overflow-hidden no-reveal">
      <div className="relative z-30 flex flex-col items-center w-full mx-auto">

        {/* Center Title and Subtitle */}
        <div className="text-center flex flex-col items-center mb-0 relative z-30 px-6">
          <h2 className="font-logo text-5xl md:text-7xl text-[var(--accent-primary)] mb-1 drop-shadow-sm transform -rotate-2">Reserve a seat</h2>
          <p className="font-body italic text-lg md:text-xl text-[var(--text-main)] mb-4">
            Good food. Warm company.<br />Stories that stay with you.
          </p>
          {dinner && (
            <div className="mb-4">
              {dinner?.dietary_type === 'veg' ? (
                <div className="inline-flex items-center gap-2.5 bg-green-50 border-2 border-green-700 px-4 py-1.5 rounded-md text-green-900 text-[15px] font-bold uppercase tracking-wider shadow-md" style={{ fontFamily: 'Hibernate, sans-serif', letterSpacing: '0.12em', lineHeight: '1.4', fontWeight: 800, textShadow: '0.4px 0.4px 0px currentColor' }}>
                  <span className="inline-flex items-center justify-center w-4 h-4 border-2 border-green-700 rounded-sm p-[2px] shrink-0" title="100% Vegetarian">
                    <span className="w-2 h-2 rounded-full bg-green-700 block"></span>
                  </span>
                  <span>100% Vegetarian Occurrence</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2.5 bg-red-50 border-2 border-red-700 px-4 py-1.5 rounded-md text-red-900 text-[15px] font-bold uppercase tracking-wider shadow-md" style={{ fontFamily: 'Hibernate, sans-serif', letterSpacing: '0.12em', lineHeight: '1.4', fontWeight: 800, textShadow: '0.4px 0.4px 0px currentColor' }}>
                  <span className="inline-flex items-center justify-center w-4 h-4 border-2 border-red-700 rounded-sm p-[2px] shrink-0" title="Non-Vegetarian">
                    <span className="w-2 h-2 rounded-full bg-red-700 block"></span>
                  </span>
                  <span>Non-Vegetarian Occurrence</span>
                </div>
              )}
            </div>
          )}
          <div className="flex flex-col items-center gap-3 relative z-40">
            {isSoldOut ? (
              <>
                <div className="bg-red-500/10 text-red-600 border border-red-500/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                  <span>🔴</span> SOLD OUT — 0 SEATS REMAINING
                </div>
                <button
                  onClick={onInterestClick}
                  className="bg-[var(--accent-primary)] text-white border-2 border-[var(--accent-primary)] font-heading text-sm md:text-base tracking-wider px-8 py-3.5 rounded-md shadow-md hover:bg-[var(--text-main)] hover:text-white hover:border-[var(--text-main)] active:bg-[var(--text-main)] active:text-white hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  Join Waitlist (I'm Interested)
                </button>
                <p className="text-xs text-[var(--text-main)]/70 max-w-md text-center">
                  If seats open up due to payment window expiration or cancellations, selected guests from this active waitlist will be emailed an invitation.
                </p>
              </>
            ) : isTokenExpired ? (
              <div className="flex flex-col items-center gap-3 max-w-lg text-center bg-red-500/10 border border-red-500/30 p-5 rounded-xl shadow-sm">
                <p className="text-red-600 font-bold text-sm md:text-base leading-relaxed">
                  You have crossed the 4 hour time limit to reserve your seat, please register again to get a chance to reserve your seat again.
                </p>
                <button
                  onClick={onInterestClick}
                  className="bg-[var(--accent-primary)] text-white border-2 border-[var(--accent-primary)] font-heading text-sm md:text-base tracking-wider px-6 py-2.5 rounded-md shadow hover:bg-[var(--text-main)] hover:text-white hover:border-[var(--text-main)] active:bg-[var(--text-main)] active:text-white transition-all cursor-pointer"
                >
                  Register Again (I'm Interested)
                </button>
              </div>
            ) : canReserve ? (
              <button
                onClick={onReserveClick}
                className="bg-[var(--accent-primary)] text-white border-2 border-[var(--accent-primary)] font-heading text-sm md:text-base tracking-wider px-8 py-3.5 rounded-md shadow-md hover:bg-[var(--text-main)] hover:text-white hover:border-[var(--text-main)] active:bg-[var(--text-main)] active:text-white hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                Reserve Your Seat
              </button>
            ) : (
              <button
                onClick={onInterestClick}
                className="bg-[var(--accent-primary)] text-white border-2 border-[var(--accent-primary)] font-heading text-sm md:text-base tracking-wider px-8 py-3.5 rounded-md shadow-md hover:bg-[var(--text-main)] hover:text-white hover:border-[var(--text-main)] active:bg-[var(--text-main)] active:text-white hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                I'm Interested
              </button>
            )}
          </div>
        </div>

        {/* Main Illustration immediately below CTA */}
        <div className="w-full relative z-20 pointer-events-none flex justify-center mt-2 md:mt-4 px-4 md:px-0">
          <img
            src="/dinnerlast.png"
            alt="People dining at table"
            loading="lazy"
            decoding="async"
            className="w-full max-w-[950px] max-h-[50vh] object-contain object-bottom"
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

  let isTokenExpired = false;
  if (token) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload && payload.exp && Date.now() >= payload.exp * 1000) {
          isTokenExpired = true;
        }
      }
    } catch (e) {
      // ignore decode error
    }
  }

  const [activeDinner, setActiveDinner] = useState(CURRENT_DINNER);
  // Only users with a valid magic link token can reserve.
  // Occurrence status does NOT globally open booking for everyone.
  const canReserve = Boolean(token) && !isTokenExpired;
  const availableSeats = activeDinner ? (activeDinner.total_seats ?? 8) - (activeDinner.sold_seats ?? 0) : null;
  const isSoldOut = availableSeats !== null && availableSeats <= 0;

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
      <section className="relative min-h-[84vh] flex flex-col justify-center pt-24 md:pt-28 pb-8 px-6 lg:px-16 overflow-hidden bg-[var(--bg-primary)]">
        {/* Soft background glow */}
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-primary)]/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-2 pb-6">

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
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-heading leading-[1.02] text-[#2c2b29] mb-5 tracking-tight">
              Good food.<br />
              <span className="block pl-10 sm:pl-14 md:pl-20 lg:pl-24 italic text-[var(--accent-primary)]">Great company.</span>
            </h1>

            {/* Description */}
            <p className="font-body text-lg md:text-xl text-[var(--text-main)]/85 mb-8 max-w-md leading-relaxed">
              Intimate dinners. Curated menus.<br />
              Conversations that <span className="underline decoration-[var(--accent-primary)] decoration-2 underline-offset-6">travel</span> beyond the table.
            </p>

            {/* Reserve or Interest Button */}
            <div className="flex flex-col items-start gap-2 my-3">
              {isSoldOut ? (
                <>
                  <div className="bg-red-500/10 text-red-600 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                    <span>🔴</span> SOLD OUT — 0 SEATS REMAINING
                  </div>
                  <button
                    onClick={() => setIsInterestOpen(true)}
                    className="bg-[var(--accent-primary)] text-white border border-[var(--accent-primary)] font-body uppercase text-base md:text-lg font-extrabold tracking-widest px-8 py-3.5 rounded-md shadow-xl hover:bg-[var(--text-main)] hover:text-white hover:border-[var(--text-main)] active:bg-[var(--text-main)] active:text-white hover:scale-105 active:scale-95 transition-all duration-300 z-20 cursor-pointer"
                  >
                    JOIN WAITLIST (I'M INTERESTED)
                  </button>
                  <p className="text-xs text-[var(--text-main)]/70 max-w-sm">
                    If seats open up due to payment window closing or cancellations, selected guests from the active waitlist will be emailed an invitation.
                  </p>
                </>
              ) : isTokenExpired ? (
                <div className="flex flex-col items-center gap-3 max-w-lg text-center bg-red-500/10 border border-red-500/30 p-4 rounded-xl shadow-sm z-20">
                  <p className="text-red-600 font-bold text-sm md:text-base leading-relaxed">
                    You have crossed the 4 hour time limit to reserve your seat, please register again to get a chance to reserve your seat again.
                  </p>
                  <button
                    onClick={() => setIsInterestOpen(true)}
                    className="bg-[var(--accent-primary)] text-white border border-[var(--accent-primary)] font-body uppercase text-sm md:text-base font-extrabold tracking-widest px-6 py-2.5 rounded-md shadow hover:bg-[var(--text-main)] hover:text-white hover:border-[var(--text-main)] active:bg-[var(--text-main)] active:text-white transition-all cursor-pointer"
                  >
                    REGISTER AGAIN (I'M INTERESTED)
                  </button>
                </div>
              ) : canReserve ? (
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="bg-[var(--accent-primary)] text-white border border-[var(--accent-primary)] font-body uppercase text-base md:text-lg font-extrabold tracking-widest px-8 py-3.5 rounded-md shadow-xl hover:bg-[var(--text-main)] hover:text-white hover:border-[var(--text-main)] active:bg-[var(--text-main)] active:text-white hover:scale-105 active:scale-95 transition-all duration-300 z-20 cursor-pointer"
                >
                  RESERVE YOUR SEAT
                </button>
              ) : (
                <button
                  onClick={() => setIsInterestOpen(true)}
                  className="bg-[var(--accent-primary)] text-white border border-[var(--accent-primary)] font-body uppercase text-base md:text-lg font-extrabold tracking-widest px-8 py-3.5 rounded-md shadow-xl hover:bg-[var(--text-main)] hover:text-white hover:border-[var(--text-main)] active:bg-[var(--text-main)] active:text-white hover:scale-105 active:scale-95 transition-all duration-300 z-20 cursor-pointer"
                >
                  I'M INTERESTED
                </button>
              )}
            </div>

          </div>

          {/* Right Column: Reference Collage Illustration Area */}
          <div className="lg:col-span-6 relative w-full min-h-[500px] lg:min-h-[620px] flex items-center justify-center mt-12 lg:mt-0 pointer-events-none select-none">
            
            <div className="relative w-full max-w-[620px] lg:max-w-[700px] flex items-center justify-center">
              
              {/* d3.png: Black Crescent Moon - Larger & Prominent */}
              <motion.img
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                src="/d3.png"
                alt="Crescent Moon"
                className="absolute -top-6 left-0 sm:left-4 md:-left-4 lg:-left-8 w-20 sm:w-28 md:w-32 h-auto object-contain z-20 drop-shadow-sm"
              />

              {/* d4.png: Orange Star 1 (Top right of moon) - Larger aiding element */}
              <motion.img
                animate={{ rotate: 360, scale: [1, 1.15, 1] }}
                transition={{ rotate: { repeat: Infinity, duration: 25, ease: "linear" }, scale: { repeat: Infinity, duration: 3 } }}
                src="/d4.png"
                alt="Orange Star"
                className="absolute -top-12 left-28 sm:left-36 md:left-44 w-14 sm:w-16 md:w-20 h-auto object-contain z-20"
              />

              {/* d4.png: Orange Star 2 (Bottom left of moon) - Larger aiding element */}
              <motion.img
                animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                transition={{ rotate: { repeat: Infinity, duration: 30, ease: "linear" }, scale: { repeat: Infinity, duration: 4, delay: 1 } }}
                src="/d4.png"
                alt="Orange Star"
                className="absolute top-36 left-4 sm:left-8 md:left-4 w-12 sm:w-14 md:w-16 h-auto object-contain z-20"
              />

              {/* d4.png: Orange Star 3 (Top right above arch) - Extra aiding element */}
              <motion.img
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ rotate: { repeat: Infinity, duration: 28, ease: "linear" }, scale: { repeat: Infinity, duration: 3.5, delay: 0.5 } }}
                src="/d4.png"
                alt="Orange Star"
                className="absolute -top-8 right-12 sm:right-20 md:right-24 w-12 sm:w-16 md:w-18 h-auto object-contain z-20"
              />

              {/* d1.png: Main Orange Archway & Table Centerpiece - Significantly scaled up */}
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                src="/d1.png"
                alt="Intimate Dinner Archway"
                className="w-full max-w-[540px] sm:max-w-[600px] h-auto object-contain relative z-10 drop-shadow-xl mx-auto"
              />

              {/* d7.png: Left Green Potted Plant - Larger */}
              <motion.img
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                src="/d7.png"
                alt="Potted Plant Left"
                className="absolute -bottom-6 -left-4 sm:-left-8 md:-left-12 lg:-left-16 w-36 sm:w-48 md:w-56 lg:w-64 h-auto object-contain z-20 drop-shadow-md"
              />

              {/* d6.png: Right Tall Palm Plant - Larger */}
              <motion.img
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                src="/d6.png"
                alt="Tall Potted Palm Right"
                className="absolute -bottom-8 -right-2 sm:-right-8 md:-right-12 lg:-right-16 w-40 sm:w-52 md:w-64 lg:w-72 h-auto object-contain z-20 drop-shadow-md"
              />

              {/* d5.png: Vertical Grid Dots */}
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={{ duration: 1.2, delay: 0.6 }}
                src="/d5.png"
                alt="Grid pattern"
                className="absolute bottom-20 -right-4 sm:-right-12 md:-right-20 lg:-right-24 w-10 sm:w-14 md:w-16 h-auto object-contain z-10"
              />

            </div>

          </div>

        </div>
      </section>

      <EdgeDivider src="/edge2.png" />

      {/* 2. WHAT'S ON THE TABLE? (MENU) */}
      <section id="menu" className="py-32 bg-[var(--accent-primary)] text-[#efe8db] relative overflow-hidden">
        <div className="absolute inset-0 paper-texture opacity-20 mix-blend-multiply pointer-events-none z-0" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="font-body italic text-3xl text-[var(--bg-primary)] block mb-2 font-logo">- Culinary -</span>
            <h2 className="text-5xl md:text-6xl font-heading text-white drop-shadow-sm">The menu</h2>
            <p className="font-body text-lg text-white/90 mt-4 italic">
              Instead of revealing the entire menu, we prefer curiosity. Click a card to reveal its dish.
            </p>
          </div>

          <div className="space-y-3.5 flex flex-col items-start w-full">
            {menuItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (!revealedItems[idx]) toggleReveal(idx);
                }}
                className={`relative bg-[var(--bg-primary)] text-[#2c2b29] p-4 md:py-4 md:px-8 rounded-2xl shadow-sm border border-[#2c2b29]/10 overflow-hidden hover:shadow-md ${revealedItems[idx] ? 'w-full' : 'w-full md:w-1/2 lg:w-[40%] cursor-pointer'} transition-[width] duration-600 ease-[cubic-bezier(0.25,1,0.5,1)] origin-left min-h-[140px] md:min-h-[130px] flex items-center`}
              >
                {!revealedItems[idx] && (
                  <motion.div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleReveal(idx);
                    }}
                    className="absolute top-0 right-0 bottom-0 w-24 z-20 cursor-pointer flex items-center justify-end pr-6 bg-gradient-to-l from-[var(--bg-primary)] to-transparent"
                  >
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-[var(--accent-primary)] font-bold text-2xl">→</motion.div>
                  </motion.div>
                )}

                {/* Fixed-width inner container guarantees ZERO text reflowing, wrapping, or squishing as clipping boundary moves */}
                <div className="flex flex-col md:flex-row gap-6 items-center w-full md:min-w-[680px] lg:min-w-[960px] h-full justify-between">

                  {/* Left part (always visible Course Title) */}
                  <div className="flex flex-col justify-center h-full w-full md:w-72 lg:w-80 flex-shrink-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-body text-xs uppercase tracking-widest text-[var(--accent-primary)] font-bold">Course</span>
                      <span className="font-heading text-2xl text-[#2c2b29]">{item.course}</span>
                    </div>
                    <h3 className="font-body text-2xl font-bold text-[#2c2b29]">{item.title}</h3>

                    {!revealedItems[idx] && (
                      <div className="mt-2 font-body text-xs uppercase tracking-widest text-[#2c2b29]/50 flex items-center gap-2">
                        <span>Click to reveal</span>
                      </div>
                    )}
                  </div>

                  {/* Revealed part (always laid out at full desktop width, unmasked/unclipped smoothly) */}
                  <div className={`flex-1 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 w-full h-full transition-opacity duration-500 ${revealedItems[idx] ? 'opacity-100 pointer-events-auto delay-100' : 'opacity-0 pointer-events-none'}`}>
                    {/* Big Hero Image */}
                    {item.img && (
                      <div className="flex items-center justify-center md:border-l border-[#2c2b29]/10 md:px-8 py-1 flex-shrink-0">
                        <img 
                          src={item.img} 
                          alt={item.dish.split('—')[0].trim()} 
                          className="w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105 -my-4" 
                        />
                      </div>
                    )}

                    {/* Supporting Text (Title + Description) */}
                    <div className={`flex-1 flex flex-col justify-center text-center md:text-left ${!item.img ? 'md:border-l border-[#2c2b29]/10 md:pl-8' : ''} pr-2`}>
                      <h4 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-[var(--accent-primary)] leading-tight mb-2">
                        {item.dish.split('—')[0].trim()}
                      </h4>
                      <p className="font-body text-base sm:text-lg text-[#2c2b29]/90 italic font-medium leading-relaxed">
                        {item.dish.split('—')[1]?.trim()}
                      </p>
                      <p className="font-body text-xs sm:text-sm text-[#2c2b29]/60 mt-3 uppercase tracking-widest font-bold">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                </div>
                {/* Background wash on hover */}
                <div className="absolute inset-0 bg-[var(--accent-primary)]/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="font-body text-xs md:text-sm tracking-widest text-[#2c2b29]/70 uppercase font-bold">
              ### MENU CONTAINS EGGPLANT, NUTS, SOY, GLUTEN, DAIRY & SHRIMP
            </p>
          </div>
        </div>
      </section>

      <EdgeDivider src="/edge4.png" />

      {/* 3. THE EVENING, IN ORDER (TIMELINE) */}
      <section className="py-20 md:py-24 relative overflow-hidden">
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

      <EdgeDivider src="/edge5.png" />

      {/* 4. WHO'S THIS FOR? */}
      <section className="py-20 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-heading text-[var(--text-main)]">Who's this for?</h2>
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
                  <img src={item.img} alt={`Guest ${idx + 1}`} loading="lazy" decoding="async" className="w-full h-full object-contain grayscale-0 md:grayscale group-hover:grayscale-0 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] scale-[1.5] group-hover:scale-[1.55]" />
                </div>
                <p className="font-body text-sm md:text-base text-[var(--text-main)]/85 leading-relaxed mt-2">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <EdgeDivider src="/edge2.png" />

      {/* 5. HOUSE RULES & GOOD TO KNOW */}
      <section className="py-20 md:py-24 bg-[var(--accent-primary)] text-[#efe8db] relative overflow-hidden">
        <div className="absolute inset-0 paper-texture opacity-20 mix-blend-multiply pointer-events-none z-0" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10">

          <div className="flex flex-col gap-16">
            <div className="text-center mb-4">
              <h2 className="text-5xl md:text-6xl font-heading text-[var(--bg-primary)] drop-shadow-sm">House Rules</h2>
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
                  className="p-8 bg-[var(--bg-primary)] text-[var(--text-main)] border border-[var(--text-main)]/10 shadow-md rounded-lg flex flex-col justify-between hover:-translate-y-2 hover:rotate-[1deg] hover:border-[var(--accent-primary)]/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 text-[#c14a27] mb-6 border-b border-[var(--text-main)]/10 pb-2">
                    <span className="font-body text-sm uppercase tracking-widest text-[#c14a27] font-bold">{item.label}</span>
                  </div>
                  <div>
                    <span className="font-heading text-3xl text-[var(--text-main)] font-bold block leading-tight mb-2">{item.value}</span>
                    <p className="font-body text-base text-[var(--text-main)]/80 font-medium italic">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <EdgeDivider src="/edge4.png" />

      {/* FAQ SECTION */}
      <section className="py-32 relative overflow-hidden bg-[var(--bg-primary)]">
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

      <EdgeDivider src="/edge6.png" />

      {/* 7. RESERVE A SEAT */}
      <ReserveSection 
        onReserveClick={() => setIsBookingOpen(true)} 
        onInterestClick={() => setIsInterestOpen(true)}
        canReserve={canReserve}
        isSoldOut={isSoldOut}
        isTokenExpired={isTokenExpired}
        dinner={activeDinner}
      />

      <EdgeDivider src="/edge4.png" />

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
