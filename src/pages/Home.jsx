import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page noise-bg">
      <div className="texture-overlay" />
      <div className="paper-texture" />

      {/* Background crawling tide blueprint grid */}
      <div className="ocean-grid-tide" />
      
      {/* Crawling map coordinates marquee */}
      <div className="coordinates-tide">
        <span>
          17.7060° N, 83.2185° E // STORIES BY THE SEA // PLATTER_LOG_2026 // 17.7060° N, 83.2185° E // STORIES BY THE SEA // PLATTER_LOG_2026 // 17.7060° N, 83.2185° E // STORIES BY THE SEA // PLATTER_LOG_2026
        </span>
      </div>

      {/* Hand-drawn Left Border SVG Wavy Line */}
      <div className="absolute left-0 top-0 h-full w-12 pointer-events-none z-40 opacity-40 text-[#002fa7]">
        <svg viewBox="0 0 100 1000" className="w-full h-full" preserveAspectRatio="none">
          <path d="M 30 0 Q 60 100 30 200 T 30 400 T 50 600 T 20 800 T 40 1000" fill="none" stroke="currentColor" strokeWidth="4" />
        </svg>
      </div>

      {/* Hand-drawn Right Border SVG Wavy Line */}
      <div className="absolute right-0 top-0 h-full w-12 pointer-events-none z-40 opacity-40 text-[#002fa7]">
        <svg viewBox="0 0 100 1000" className="w-full h-full" preserveAspectRatio="none">
          <path d="M 70 0 Q 40 100 70 200 T 70 400 T 50 600 T 80 800 T 60 1000" fill="none" stroke="currentColor" strokeWidth="4" />
        </svg>
      </div>

      {/* Main Collage Workspace */}
      <section className="scrapbook-hero-container">
        
        {/* LEFT COLUMN: The Human Narrative (Communal Polaroid) */}
        <motion.div 
          className="home-left-narrative interactive-paper"
          initial={{ opacity: 0, x: -60, rotate: -7 }}
          animate={{ opacity: 1, x: 0, rotate: -3 }}
          transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.1 }}
        >
          <Link to="/dinner" className="polaroid-link-wrapper">
            <div className="home-polaroid-container">
              <div className="home-polaroid-photo">
                <img src="/assets/hero_dinner.png" alt="Communal dinner table gathering" className="select-none" draggable={false} />
              </div>
              
              <div className="handwritten-caption-container">
                {/* Scrap of washi tape anchoring the caption */}
                <div 
                  className="washi-tape"
                  style={{
                    top: '-6px',
                    left: '25%',
                    width: '65px',
                    height: '14px',
                    transform: 'rotate(-4deg)',
                    opacity: 0.8,
                    zIndex: 10
                  }}
                />
                <span className="handwritten-note">"The lingering warmth, Vizag Coastline."</span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* CENTER COLUMN: The Main Event (Wordmark & Slogans) */}
        <motion.div 
          className="home-center-main"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className="charcoal-brush-stroke" />
          <img src="/assets/hero_wordmark.png" alt="Vantammayilu Bubbly Wordmark" className="home-puffy-logo select-none" draggable={false} />
          
          <div className="home-center-slogan">
            STORIES. SUPPERS. CONNECTIONS.
          </div>
          <div className="home-center-subtext">
            WE DON'T JUST HOST DINNERS. WE PRESERVE MEMORIES.
          </div>
        </motion.div>

        {/* RIGHT COLUMN: The System Data (Typewriter Ticket Pass) */}
        <motion.div 
          className="home-right-data interactive-paper"
          initial={{ opacity: 0, x: 60, rotate: 7 }}
          animate={{ opacity: 1, x: 0, rotate: 3 }}
          transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.15 }}
        >
          <Link to="/dinner" className="ticket-link-wrapper">
            <div className="home-ticket-stub">
              {/* Washi tape pinning the ticket to the page */}
              <div 
                className="washi-tape"
                style={{
                  top: '-10px',
                  right: '20%',
                  width: '70px',
                  height: '15px',
                  transform: 'rotate(5deg)',
                  opacity: 0.85,
                  zIndex: 10
                }}
              />
              
              <div className="ticket-header">
                <span className="ticket-tag">[ PASSPORT // PLATTER_LOG_2026 ]</span>
              </div>
              
              <div className="ticket-divider-dash" />
              
              <div className="ticket-body">
                <div className="ticket-ledger-title">UPCOMING PLATTERS</div>
                
                <div className="ticket-ledger-entries">
                  <div className="ticket-ledger-row">
                    <span className="entry-date">JUNE 12</span>
                    <span className="entry-sep">//</span>
                    <span className="entry-loc">VIZAG BEACHFRONT</span>
                  </div>
                  <div className="ticket-ledger-row">
                    <span className="entry-date">JUNE 19</span>
                    <span className="entry-sep">//</span>
                    <span className="entry-loc">COCONUT GROVE</span>
                  </div>
                  <div className="ticket-ledger-row">
                    <span className="entry-date">JUNE 26</span>
                    <span className="entry-sep">//</span>
                    <span className="entry-loc">HARBOR LIGHTS</span>
                  </div>
                </div>
              </div>
              
              <div className="ticket-footer">
                <div className="ticket-barcode">
                  <div className="barcode-line w-[2px]" />
                  <div className="barcode-line w-[4px]" />
                  <div className="barcode-line w-[1px]" />
                  <div className="barcode-line w-[3px]" />
                  <div className="barcode-line w-[1px]" />
                  <div className="barcode-line w-[5px]" />
                  <div className="barcode-line w-[2px]" />
                  <div className="barcode-line w-[1px]" />
                  <div className="barcode-line w-[3px]" />
                </div>
                <div className="ticket-cta">[ SECURE A SEAT ]</div>
              </div>
            </div>
          </Link>
        </motion.div>

      </section>
      
      <Footer />
    </div>
  );
};

export default Home;
