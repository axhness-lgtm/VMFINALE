import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import './Journal.css';

// ── FADE-IN WRAPPER ───────────────────────────────────────────────────

const FadeIn = ({ children, delay = 0, y = 30, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 2, delay, ease: [0.23, 1, 0.32, 1] }}
  >
    {children}
  </motion.div>
);

// ── AMBIENT ORB ───────────────────────────────────────────────────────

const GlowOrb = ({ x, y, size = 250, color = 'rgba(196,98,10,0.07)', dur = 16, ox = '15px', oy = '-10px', ox2 = '-10px', oy2 = '8px' }) => (
  <div
    className="j-glow-orb"
    style={{ left: x, top: y, width: size, height: size, background: color, '--od': `${dur}s`, '--ox': ox, '--oy': oy, '--ox2': ox2, '--oy2': oy2 }}
  />
);

// ── HERO ──────────────────────────────────────────────────────────────

const JournalHero = () => {
  const microcopy = [
    { text: 'Found somewhere between dessert and midnight.', x: '52%', y: '20%', r: '-1.5deg', d: '13s', dy: '-8px' },
    { text: 'Some stories needed a second life.',            x: '58%', y: '42%', r:  '2deg',   d: '11s', dy: '-6px' },
    { text: 'Documented before they disappeared.',          x: '55%', y: '62%', r: '-1deg',   d: '16s', dy: '-10px' },
    { text: 'Things overheard at the table.',               x: '62%', y: '78%', r:  '1.5deg', d: '9s',  dy: '-7px' },
    { text: 'Nobody planned to remember this much.',        x: '48%', y: '88%', r: '-2deg',   d: '14s', dy: '-9px' },
  ];

  return (
    <section className="j-hero j-section">
      {/* Ambient warmth */}
      <GlowOrb x="60%" y="30%" size={350} color="rgba(196,98,10,0.07)" dur={18} ox="20px" oy="-15px" ox2="-15px" oy2="10px" />
      <GlowOrb x="5%"  y="60%" size={250} color="rgba(196,98,10,0.05)" dur={12} ox="12px" oy="-8px"  ox2="-8px"  oy2="12px" />

      {/* Floating microcopy */}
      {microcopy.map((m, i) => (
        <span
          key={i}
          className="j-microcopy"
          style={{ left: m.x, top: m.y, '--r': m.r, '--d': m.d, '--dy': m.dy }}
        >
          {m.text}
        </span>
      ))}

      {/* Tape mark decorations */}
      <div className="tape-mark" style={{ width: '4rem', height: '1.2rem', top: '12%', left: '48%', '--tr': '-3deg' }} />
      <div className="tape-mark" style={{ width: '3rem', height: '1rem', bottom: '25%', right: '35%', '--tr': '2deg' }} />

      <div style={{ maxWidth: '52rem', position: 'relative', zIndex: 2 }}>
        <motion.span
          className="j-hero-eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
        >
          Vantammayilu Journal
        </motion.span>

        <motion.h1
          className="j-hero-headline"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.2, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
          FRAGMENTS<br />THAT STAYED<br />BEHIND.
        </motion.h1>

        <motion.p
          className="j-hero-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.8 }}
        >
          {"Recipes.\nDinner memories.\nPlaces we keep thinking about.\nConversations nobody expected to have.\nMusic that lingered after guests left.\n\nSome evenings end slowly.\n\nSome never fully leave."}
        </motion.p>
      </div>
    </section>
  );
};

// ── FEATURED STORY ────────────────────────────────────────────────────

const FeaturedStory = () => (
  <section className="j-featured j-section">
    <GlowOrb x="70%" y="20%" size={300} color="rgba(196,98,10,0.08)" dur={14} ox="-18px" oy="12px" ox2="14px" oy2="-9px" />

    <FadeIn className="j-featured-inner">
      {/* Image */}
      <div className="j-featured-img-wrap">
        <img
          src="https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=900"
          className="j-featured-img"
          alt=""
        />
        <div className="j-featured-overlay" />
        <span className="j-featured-annotation">"People speak more softly after dessert."</span>
      </div>

      {/* Text */}
      <div>
        <span className="j-featured-label">/ Featured Fragment</span>
        <h2 className="j-featured-headline">
          WHY EVERYBODY<br />OPENS UP<br />DURING DESSERT.
        </h2>
        <p className="j-featured-body">
          {"Somewhere around the final course, the room changes.\n\nPeople stop introducing themselves carefully.\nConversations lose their edges.\nCities get mentioned more softly.\n\nMaybe sweetness lowers defenses.\n\nOr maybe people just feel less alone by then."}
        </p>
        <button className="j-read-btn">Read Story →</button>
      </div>
    </FadeIn>
  </section>
);

// ── CATEGORY SHELVES ──────────────────────────────────────────────────

const categories = [
  {
    stamp: 'Archive 01',
    title: 'Things People Said',
    desc: 'Small observations, funny lines, accidental philosophy, overheard conversations, beautiful fragments from the table.',
    layout: 'wide',
  },
  {
    stamp: 'Archive 02',
    title: 'Places That Inspired Dinners',
    desc: 'Cities, cafés, train stations, markets, oceans, kitchens, street corners, hotels, films, and memories that eventually became evenings.',
    layout: 'mid',
  },
  {
    stamp: 'Archive 03',
    title: 'Recipes We Keep Returning To',
    desc: 'Not perfect recipes.\n\nThe emotional versions.\n\nThe ones with stains, approximations, substitutions, and stories attached.',
    layout: 'half',
  },
  {
    stamp: 'Archive 04',
    title: 'After The Guests Left',
    desc: 'The strange calm after the evening ends.\n\nHalf-empty glasses.\nMusic still playing.\nThe feeling nobody wants to disturb.',
    layout: 'half',
  },
  {
    stamp: 'Archive 05',
    title: 'Things Left Behind',
    desc: 'Polaroids.\nNotes.\nLighters.\nPoems.\nDrawings.\nForgotten scarves.\n\nTiny evidence that people were here.',
    layout: 'full',
  },
];

const CategoryShelves = () => (
  <section className="j-categories j-section">
    <FadeIn>
      <p className="j-cat-headline">
        "Everything is filed, eventually."
      </p>
    </FadeIn>

    <div className="j-cat-grid">
      {categories.map((cat, i) => (
        <motion.div
          key={i}
          className={`j-cat-item ${cat.layout}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.8, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="j-cat-stamp">{cat.stamp}</div>
          <h3 className="j-cat-title">{cat.title}</h3>
          <p className="j-cat-desc" style={{ whiteSpace: 'pre-line' }}>{cat.desc}</p>
          <div className="j-cat-glow" />
        </motion.div>
      ))}
    </div>
  </section>
);

// ── SCATTERED ENTRIES ──────────────────────────────────────────────────

const entries = [
  {
    date: 'March 2026',
    title: 'The Playlist That Lasted Longer Than Dinner',
    preview: 'Nobody asked to change the music once.\n\nThat almost never happens.',
    reveal: '"Still listening to it."',
    col: 'j-entry-col-a',
    rotate: '-0.8deg',
  },
  {
    date: 'February 2026',
    title: 'Some People Only Talk About Travel After Their Second Drink',
    preview: "There's always one city someone almost moved to.",
    reveal: '"Porto. It was always Porto."',
    col: 'j-entry-col-b',
    rotate: '1.2deg',
  },
  {
    date: 'January 2026',
    title: 'The Night Everybody Stayed Until 1:14 AM',
    preview: 'Nobody noticed how late it got until the candles disappeared.',
    reveal: '"We weren\'t ready for it to end."',
    col: 'j-entry-col-c',
    rotate: '-0.5deg',
  },
  {
    date: 'December 2025',
    title: 'How A Vietnamese Dinner Turned Into A Goa Group Trip',
    preview: 'Certain evenings continue by accident.',
    reveal: '"Three weeks later."',
    col: 'j-entry-col-d',
    rotate: '0.8deg',
  },
];

const ScatteredEntries = () => (
  <section className="j-entries j-section">
    <GlowOrb x="80%" y="10%" size={280} color="rgba(196,98,10,0.06)" dur={14} ox="-15px" oy="12px" ox2="12px" oy2="-8px" />

    <FadeIn>
      <p className="j-entries-headline">
        Recent fragments from the archive.
      </p>
    </FadeIn>

    <div className="j-entries-grid">
      {entries.map((entry, i) => (
        <motion.div
          key={i}
          className={`j-entry ${entry.col}`}
          style={{ transform: `rotate(${entry.rotate})` }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.8, delay: i * 0.12, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="j-entry-date">{entry.date}</div>
          <h3 className="j-entry-title">{entry.title}</h3>
          <p className="j-entry-preview" style={{ whiteSpace: 'pre-line' }}>{entry.preview}</p>
          <span className="j-entry-reveal">{entry.reveal}</span>
        </motion.div>
      ))}
    </div>
  </section>
);

// ── ARCHIVAL STRIP ────────────────────────────────────────────────────

const artifacts = [
  { src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400', w: 220, h: 280, caption: "The kitchen at 11:52 PM.", rotate: '-3deg', tape: '-1.5deg' },
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400', w: 280, h: 200, caption: "Steam before the guests arrived.", rotate:  '2deg',  tape:  '2deg'  },
  { src: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=400', w: 200, h: 260, caption: "The last remaining dessert spoon.", rotate: '-1.5deg', tape: '-2.5deg' },
  { src: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400', w: 260, h: 220, caption: "Film photos from the Morocco dinner.", rotate: '1deg', tape: '1.5deg' },
  { src: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&q=80&w=400', w: 180, h: 240, caption: "Someone's unfinished sketch.", rotate: '-2deg', tape: '-1deg' },
  { src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400', w: 240, h: 200, caption: "A recipe with no measurements.", rotate: '2.5deg', tape: '2deg' },
];

const ArchivalStrip = () => (
  <section className="j-archive-strip j-section">
    <FadeIn>
      <h2 className="j-archive-headline">
        SMALL EVIDENCE<br />OF GOOD EVENINGS.
      </h2>
    </FadeIn>

    <div className="j-artifact-row">
      {artifacts.map((art, i) => (
        <motion.div
          key={i}
          className="j-artifact"
          style={{ transform: `rotate(${art.rotate})` }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: i * 0.1 }}
        >
          <div className="j-artifact-tape" style={{ '--tr': art.tape }} />
          <img
            src={art.src}
            className="j-artifact-img"
            width={art.w}
            height={art.h}
            alt=""
          />
          <p className="j-artifact-caption">{art.caption}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

// ── FINAL CLOSE ───────────────────────────────────────────────────────

const JournalFinal = () => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    size: 2 + Math.random() * 3,
    left: `${10 + i * 7}%`,
    top:  `${40 + (i % 3) * 20}%`,
    dur:  `${15 + i * 2}s`,
    delay: `${i * 1.2}s`,
    px: `${(Math.random() - 0.5) * 60}px`,
    py: `${-50 - Math.random() * 60}px`,
  }));

  return (
    <section className="j-final j-section">
      <div className="j-final-glow" />

      {/* Drifting particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="j-particle"
          style={{
            width: p.size, height: p.size,
            left: p.left, top: p.top,
            '--pd': p.dur,
            '--px': p.px, '--py': p.py,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* Drifting city names */}
      {['Hanoi', 'Lisbon', 'Vizag', 'Oaxaca', 'Kyoto'].map((city, i) => (
        <motion.span
          key={i}
          style={{
            position: 'absolute',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '0.75rem',
            color: '#efe9e1',
            opacity: 0,
            left: `${15 + i * 15}%`,
            top: `${25 + (i % 3) * 18}%`,
            letterSpacing: '0.3em',
            pointerEvents: 'none',
          }}
          animate={{ opacity: [0, 0.12, 0], y: [0, -40, -80] }}
          transition={{ duration: 10, delay: i * 2, repeat: Infinity, ease: 'easeOut' }}
        >
          {city}
        </motion.span>
      ))}

      <motion.h2
        className="j-final-headline"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 2.5, ease: [0.23, 1, 0.32, 1] }}
      >
        SOME EVENINGS<br />REFUSE TO END<br />PROPERLY.
      </motion.h2>

      <motion.p
        className="j-final-body"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 0.6 }}
      >
        Maybe that's why we write them down.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 1 }}
      >
        <Link to="/dinner" className="j-final-cta">
          Return to the table
        </Link>
      </motion.div>
    </section>
  );
};

// ── MAIN ──────────────────────────────────────────────────────────────

export default function Journal() {
  return (
    <main className="journal-page">
      <div className="texture-overlay" />
      <div className="candle-flicker" />

      <JournalHero />
      <FeaturedStory />
      <CategoryShelves />
      <ScatteredEntries />
      <ArchivalStrip />
      <JournalFinal />

      <Footer />
    </main>
  );
}
