import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import './Founder.css';

export default function Founder() {
  // --- SECTION 1 TYPEWRITER LOGIC ---
  const statement = "Restaurants are built for turnarounds, bills, and noise. I built Vantammayilu because my favorite human moments didn't happen under commercial spotlights. They happened at 1:00 AM around my own kitchen counter, when the food was gone and the conversation turned entirely real. This is just an expansion of that counter.";
  const [typedText, setTypedText] = useState("");
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(statement.slice(0, index + 1));
      index++;
      if (index >= statement.length) {
        clearInterval(interval);
        setIsTypewriterDone(true);
      }
    }, 15);
    return () => clearInterval(interval);
  }, []);

  // --- SECTION 2 LEDGER ACCORDION LOGIC ---
  const [activeRow, setActiveRow] = useState(null);

  // --- SECTION 3 SCRAPBOOK DECK LOGIC ---
  const [cards, setCards] = useState([
    {
      id: 'sourcing',
      step: 'STEP_01 // SOURCING',
      title: 'The Morning Hunt',
      text: 'Spending unhurried hours talking to local growers, hand-selecting chilis, and sourcing ingredients that carry their own lineage.'
    },
    {
      id: 'setting',
      step: 'STEP_02 // SETTING',
      title: 'The Scale of Amber',
      text: 'Every ceramic plate is set by hand. The candles are measured to cast just the right depth of soft, warm light as the Vizag sun sets.'
    },
    {
      id: 'logging',
      step: 'STEP_03 // LOGGING',
      title: 'The Midnight Archive',
      text: 'Gathering the physical tokens, handwritten poems, and napkin sketches left behind by guests, carefully cataloging them into our permanent registry.'
    }
  ]);
  
  const [swipeOffset, setSwipeOffset] = useState({ x: 0, opacity: 1 });
  const [isAnimating, setIsAnimating] = useState(false);

  const cycleCard = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    // Animate the top card flying off to the right
    setSwipeOffset({ x: 400, opacity: 0 });
    
    setTimeout(() => {
      setCards(prev => {
        const copy = [...prev];
        const top = copy.shift();
        copy.push(top);
        return copy;
      });
      setSwipeOffset({ x: 0, opacity: 1 });
      setIsAnimating(false);
    }, 350);
  };

  return (
    <main className="founder-page">
      <div className="texture-overlay" />
      <span className="margin-indicator left font-handwritten">[ ARCHITECTURE // HOME-KITCHEN ]</span>

      {/* SECTION 1: THE COUNTER MANIFESTO (HERO) */}
      <section className="counter-manifesto-section">
        <div className="manifesto-grid">
          {/* Left Column: Asymmetrical candidate photo frame */}
          <div className="manifesto-photo-container">
            <div className="manifesto-photo-frame">
              <img 
                src="/assets/hands_stove.png" 
                alt="Hyndavi's hands adjusting a pot on the stove" 
                className="manifesto-img"
              />
              <span className="manifesto-photo-tag font-handwritten">[ FIG. 01 // INTERIOR_STOVE ]</span>
            </div>
          </div>

          {/* Right Column: Colossal Display Serif Headline & Typewriter Statement */}
          <div className="manifesto-content">
            <h1 className="manifesto-headline">
              I WANTED A<br />
              <span className="highlight-text">LARGER</span> dining room.
            </h1>
            <div className="living-room-statement-container">
              <p className="living-room-statement font-serif">
                {typedText}
                <span className="typewriter-cursor">█</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE CORE COMPACT */}
      <section className="core-compact-section">
        <div className="core-compact-container">
          
          {/* Row 01 */}
          <div 
            className={`compact-row ${activeRow === 0 ? 'row-active' : ''}`}
            onMouseEnter={() => setActiveRow(0)}
            onMouseLeave={() => setActiveRow(null)}
            onClick={() => setActiveRow(activeRow === 0 ? null : 0)}
          >
            <div className="compact-row-header">
              <div className="compact-row-icon-box">
                {/* Melting Clock */}
                <svg className="compact-row-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 15 3.5 18 5 20C6 21 8 22 10 22C11 22 12 21 13 20C14.5 18.5 15 16 16 15C17.5 13.5 22 13 22 9C22 5.13 17.52 2 12 2Z" />
                  <path d="M12 7V12L14.5 13.5" strokeLinecap="round" />
                  <path d="M6 19.5c0 0-.5 2.5 1 2.5s1-1.5 1-2.5" />
                  <path d="M10 21.5c0 0-.5 1.5 1 1.5s1-1.5 1-2.5" />
                </svg>
              </div>
              <span className="compact-row-title font-handwritten">[ 01 // INTENTIONAL_SLOWNESS ]</span>
            </div>
            <div className="compact-row-body-wrapper">
              <div className="compact-row-body">
                We don’t cycle seats or rush you out. The chair is entirely yours for the night. Breathe. Eat. Stay.
              </div>
            </div>
          </div>

          {/* Row 02 */}
          <div 
            className={`compact-row ${activeRow === 1 ? 'row-active' : ''}`}
            onMouseEnter={() => setActiveRow(1)}
            onMouseLeave={() => setActiveRow(null)}
            onClick={() => setActiveRow(activeRow === 1 ? null : 1)}
          >
            <div className="compact-row-header">
              <div className="compact-row-icon-box">
                {/* Open Hand */}
                <svg className="compact-row-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 14V6a1.5 1.5 0 0 1 3 0v6m0 0V4.5a1.5 1.5 0 0 1 3 0V12m0 0V5.5a1.5 1.5 0 0 1 3 0V13m0 0V8.5a1.5 1.5 0 0 1 3 0V16c0 4-3 7-7 7s-7-3-7-7v-3.5a1.5 1.5 0 0 1 3 0V14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="compact-row-title font-handwritten">[ 02 // UNFILTERED_PRESENCE ]</span>
            </div>
            <div className="compact-row-body-wrapper">
              <div className="compact-row-body">
                No titles allowed. Leave your networking pitches, your algorithms, and your corporate armor at the threshold.
              </div>
            </div>
          </div>

          {/* Row 03 */}
          <div 
            className={`compact-row ${activeRow === 2 ? 'row-active' : ''}`}
            onMouseEnter={() => setActiveRow(2)}
            onMouseLeave={() => setActiveRow(null)}
            onClick={() => setActiveRow(activeRow === 2 ? null : 2)}
          >
            <div className="compact-row-header">
              <div className="compact-row-icon-box">
                {/* Clay Pot */}
                <svg className="compact-row-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 8H20" strokeLinecap="round" />
                  <path d="M10 8V5C10 4.4 10.4 4 11 4H13C13.6 4 14 4.4 14 5V8" strokeLinecap="round" />
                  <path d="M5 8C5 8 3 13 4 16C5 19 8 20 12 20C16 20 19 19 20 16C21 13 19 8 19 8H5Z" strokeLinejoin="round" />
                  <path d="M2 11c0 0 1.5 1 1.5 2.5" />
                  <path d="M22 11c0 0-1.5 1-1.5 2.5" />
                </svg>
              </div>
              <span className="compact-row-title font-handwritten">[ 03 // CULTURAL_LINEAGE ]</span>
            </div>
            <div className="compact-row-body-wrapper">
              <div className="compact-row-body">
                We cook themes to honor ancestral grandmothers and real histories. No shortcuts, no commercial fusion.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: THE SILENT LABOR (HOST'S RITUAL SLIDER) */}
      <section className="silent-labor-section">
        <div className="silent-labor-grid">
          {/* Left Column: Stationary text */}
          <div className="silent-labor-info-column">
            <span className="sys-data-tag font-handwritten">[ ACTIVITY: PRE_DINNER_MANIFOLD ]</span>
            <h2 className="silent-labor-headline font-serif">The things you don't see.</h2>
            <p className="silent-labor-copy font-serif">
              Hospitality isn’t a service code; it’s a physical manifestation of care. Here is how a dinner comes alive before you knock on the door.
            </p>
          </div>

          {/* Right Column: 3D Stacked Deck of Cards */}
          <div className="silent-labor-interactive-column">
            <div className="card-deck-container">
              {cards.map((card, idx) => {
                const isTop = idx === 0;
                
                // Determine styling class based on visual index mapping
                let scaleStyle = 1.0;
                let translateStyle = { x: 0, y: 0 };
                let shadowStyle = "6px 6px 0px 0px #002fa7";
                let zIndexVal = 30;

                if (idx === 1) {
                  scaleStyle = 0.95;
                  translateStyle = { x: 12, y: 12 };
                  shadowStyle = "4px 4px 0px 0px #002fa7";
                  zIndexVal = 20;
                } else if (idx === 2) {
                  scaleStyle = 0.90;
                  translateStyle = { x: 24, y: 24 };
                  shadowStyle = "2px 2px 0px 0px #002fa7";
                  zIndexVal = 10;
                }

                return (
                  <motion.div
                    key={card.id}
                    layoutId={card.id}
                    className={`deck-card ${isTop ? 'top-card' : ''}`}
                    onClick={isTop ? cycleCard : undefined}
                    drag={isTop && !isAnimating}
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    onDragEnd={(e, info) => {
                      if (Math.abs(info.offset.x) > 100) {
                        cycleCard();
                      }
                    }}
                    animate={
                      isTop
                        ? {
                            x: swipeOffset.x,
                            opacity: swipeOffset.opacity,
                            scale: 1,
                            y: 0,
                            zIndex: zIndexVal,
                            boxShadow: shadowStyle
                          }
                        : {
                            x: translateStyle.x,
                            y: translateStyle.y,
                            scale: scaleStyle,
                            zIndex: zIndexVal,
                            boxShadow: shadowStyle,
                            opacity: 1
                          }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      mass: 1
                    }}
                  >
                    <div className="card-top-bar font-mono">
                      <span className="font-handwritten">[{card.step}]</span>
                      {isTop && <span className="click-indicator font-handwritten">[ CLICK OR DRAG TO SWIPE → ]</span>}
                    </div>
                    <div className="card-content">
                      <h3 className="card-title font-serif">{card.title}</h3>
                      <p className="card-text font-mono">{card.text}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE FRAMEWORK TRUTHS */}
      <section className="framework-truths-section">
        <div className="framework-grid">
          {/* Column 1 */}
          <div className="framework-col">
            <h2 className="framework-header font-serif">01. INDEPENDENT.</h2>
            <p className="framework-text font-mono">
              Completely self-funded, home-operated, and free from corporate restaurant agendas.
            </p>
          </div>
          {/* Column 2 */}
          <div className="framework-col">
            <h2 className="framework-header font-serif">02. KIRLAMPUDI.</h2>
            <p className="framework-text font-mono">
              Quietly tucked away in a breezy, peaceful neighborhood corner of Visakhapatnam.
            </p>
          </div>
          {/* Column 3 */}
          <div className="framework-col">
            <h2 className="framework-header font-serif">03. SCALE OF EIGHT.</h2>
            <p className="framework-text font-mono">
              Intentionally capped at eight seats to preserve safety, human volume, and real closeness.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: THE THRESHOLD CROSSING (CTA & COLLOSSAL BASE FOOTER) */}
      <section className="threshold-crossing-section">
        {/* Overlapping Centered Invitation Container */}
        <div className="invitation-container">
          <h2 className="invitation-headline font-serif">
            The stove is warming up.<br />Will you join us?
          </h2>
          <a href="/dinner" className="cta-button-link">
            <button className="cta-mechanical-button font-mono">
              CHOOSE A SEAT AT THE LONG TABLE →
            </button>
          </a>
        </div>

        {/* Colossal hollow background word */}
        <div className="colossal-base-text select-none">
          VANTAMMAYILU
        </div>
      </section>

      <Footer />
    </main>
  );
}
