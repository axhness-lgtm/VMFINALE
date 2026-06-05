import React, { useState, useRef, useEffect } from 'react';
import YinYangLedger from '../components/YinYangLedger';
import CommandDeckHero from '../components/CommandDeckHero';
import Footer from '../components/Footer';
import './Community.css';

// ─── CARD IMAGE SEQUENCES ──────────────────────────────────────────────────
// Each orbit has 8 unique slots; we loop them twice to get 16 cards.
// Index in this array → which crop file to load (1-based).
const CURATOR_CARD_SEQ  = [1, 2, 3, 4, 5, 6, 7, 8]; // NODE_01 … NODE_08
const COLLECTION_CARD_SEQ = [1, 2, 3, 4, 5, 6, 7, 8]; // VOL_01 … VOL_08

// ─── GALLERY DATA (shown in center panel when a slot is active) ────────────
const GALLERY_DATA = [
  {
    id: 1,
    curator: { name: "John Maeda", role: "President, RSD", nodeId: "NODE_001" },
    collection: {
      name: "Abstractions",
      curatedBy: "JOHN MAEDA",
      description: "A collection of next-gen figurative images that evolve through form, color, and composition.",
      piecesCount: "26 Pieces",
      volId: "VOL_001"
    }
  },
  {
    id: 2,
    curator: { name: "Kenya Hara", role: "Designer, Muji", nodeId: "NODE_002" },
    collection: {
      name: "Emptiness",
      curatedBy: "KENYA HARA",
      description: "A study on white spaces, void, and potentiality in everyday object representation.",
      piecesCount: "14 Pieces",
      volId: "VOL_002"
    }
  },
  {
    id: 3,
    curator: { name: "Paola Antonelli", role: "Curator, MoMA", nodeId: "NODE_003" },
    collection: {
      name: "Synthetic Life",
      curatedBy: "PAOLA ANTONELLI",
      description: "Exploring the boundary between organic systems and computational design artifacts.",
      piecesCount: "32 Pieces",
      volId: "VOL_003"
    }
  },
  {
    id: 4,
    curator: { name: "Es Devlin", role: "Stage Designer", nodeId: "NODE_004" },
    collection: {
      name: "Kinetic Light",
      curatedBy: "ES DEVLIN",
      description: "Sculptural forms that interact with shifting colored rays, defining temporary spaces.",
      piecesCount: "19 Pieces",
      volId: "VOL_004"
    }
  },
  {
    id: 5,
    curator: { name: "Dieter Rams", role: "Industrial Icon", nodeId: "NODE_005" },
    collection: {
      name: "Pure Utility",
      curatedBy: "DIETER RAMS",
      description: "Ten principles materialized. Honest, unobtrusive designs that prioritize function.",
      piecesCount: "40 Pieces",
      volId: "VOL_005"
    }
  },
  {
    id: 6,
    curator: { name: "Zaha Hadid", role: "Architect", nodeId: "NODE_006" },
    collection: {
      name: "Parametric Curves",
      curatedBy: "ZAHA HADID",
      description: "Fluid structures that challenge gravity and geometry, creating seamless landscapes.",
      piecesCount: "22 Pieces",
      volId: "VOL_006"
    }
  },
  {
    id: 7,
    curator: { name: "Stefan Sagmeister", role: "Graphic Artist", nodeId: "NODE_007" },
    collection: {
      name: "Beautiful Chaos",
      curatedBy: "STEFAN SAGMEISTER",
      description: "Typographical experiments that test human perception, emotion, and visual overload.",
      piecesCount: "15 Pieces",
      volId: "VOL_007"
    }
  },
  {
    id: 8,
    curator: { name: "Neri Oxman", role: "Biomimeticist, MIT", nodeId: "NODE_008" },
    collection: {
      name: "Material Ecology",
      curatedBy: "NERI OXMAN",
      description: "Structures grown by silkworms and synthesized from chitin, mapping sustainable futures.",
      piecesCount: "28 Pieces",
      volId: "VOL_008"
    }
  }
];

// ─── POLAROID CARD COMPONENT ───────────────────────────────────────────────
function PolaroidCard({ type, cardNum, isFront, nodeLabel }) {
  const imgSrc = type === 'curator'
    ? `/images/crops/curator_card_${cardNum}.png`
    : `/images/crops/collection_card_${cardNum}.png`;
  return (
    <div className={`polaroid-inner ${isFront ? 'polaroid-front' : ''}`}>
      <div className="polaroid-photo">
        <img src={imgSrc} alt={nodeLabel} draggable={false} />
      </div>
      <div className="polaroid-label">{nodeLabel}</div>
      <div className="polaroid-dot" />
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function Community() {
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [closestIdxState, setClosestIdxState]       = useState(0);
  const [galleryBaseAngle, setGalleryBaseAngle]     = useState(0);
  const [isGalleryAutoPlay, setIsGalleryAutoPlay]   = useState(true);
  const [galleryHovered, setGalleryHovered]         = useState(false);

  const baseAngleRef          = useRef(0);
  const targetBaseAngleRef    = useRef(0);
  const isGalleryAutoPlayRef  = useRef(true);
  const galleryHoveredRef     = useRef(false);
  const resumeTimeoutRef      = useRef(null);

  useEffect(() => { isGalleryAutoPlayRef.current = isGalleryAutoPlay; }, [isGalleryAutoPlay]);
  useEffect(() => { galleryHoveredRef.current = galleryHovered; },      [galleryHovered]);

  const handleGallerySelect = (index) => {
    setIsGalleryAutoPlay(false);
    isGalleryAutoPlayRef.current = false;

    const targetVal    = -index * (2 * Math.PI / 16);
    const diff         = targetVal - baseAngleRef.current;
    const adjustedDiff = Math.atan2(Math.sin(diff), Math.cos(diff));
    targetBaseAngleRef.current = baseAngleRef.current + adjustedDiff;

    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsGalleryAutoPlay(true);
      isGalleryAutoPlayRef.current = true;
    }, 8000);
  };

  useEffect(() => {
    let frameId;
    let lastTime             = performance.now();
    let autoplayAccumulator  = 0;

    const tick = (now) => {
      const delta = (now - lastTime) / 1000;
      lastTime    = now;

      if (isGalleryAutoPlayRef.current && !galleryHoveredRef.current) {
        autoplayAccumulator += delta;
        if (autoplayAccumulator >= 5.0) {
          autoplayAccumulator = 0;
          targetBaseAngleRef.current -= 2 * Math.PI / 16;
        }
      } else {
        autoplayAccumulator = 0;
      }

      const diff = targetBaseAngleRef.current - baseAngleRef.current;
      if (Math.abs(diff) > 0.001) {
        baseAngleRef.current += diff * 5 * delta;
      } else {
        baseAngleRef.current = targetBaseAngleRef.current;
      }
      setGalleryBaseAngle(baseAngleRef.current);

      let closestIdx = 0;
      let maxCos     = -2;
      for (let i = 0; i < 16; i++) {
        const theta = baseAngleRef.current + i * (2 * Math.PI / 16);
        const c     = Math.cos(theta);
        if (c > maxCos) { maxCos = c; closestIdx = i; }
      }
      setClosestIdxState(closestIdx);
      setActiveGalleryIndex(closestIdx % 8);

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frameId);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  const R        = 290;  // orbit radius — scaled for 88vh section
  const isAligned = Math.abs(galleryBaseAngle - targetBaseAngleRef.current) < 0.05;

  // Build 16-slot arrays for each orbit
  const curatorNodes    = Array.from({ length: 16 }, (_, idx) => {
    const theta    = galleryBaseAngle + idx * (2 * Math.PI / 16);
    const isFront  = idx === closestIdxState;
    const cardNum  = CURATOR_CARD_SEQ[idx % 8];
    const nodeLabel= `NODE_0${String(idx % 8 + 1).padStart(1, '0')}`;
    return { idx, theta, isFront, cardNum, nodeLabel,
      opacity : isFront ? 1.0  : 0.70,
      zIndex  : isFront ? 200  : Math.floor(Math.cos(theta) * 100) + 100,
      rotation: isFront ? 0    : theta + Math.PI / 2
    };
  });

  const collectionNodes = Array.from({ length: 16 }, (_, idx) => {
    const theta    = galleryBaseAngle + idx * (2 * Math.PI / 16);
    const isFront  = idx === closestIdxState;
    const cardNum  = COLLECTION_CARD_SEQ[idx % 8];
    const volLabel = `VOL_0${String(idx % 8 + 1).padStart(1, '0')}`;
    return { idx, theta, isFront, cardNum, volLabel,
      opacity : isFront ? 1.0  : 0.70,
      zIndex  : isFront ? 200  : Math.floor(Math.cos(theta) * 100) + 100,
      rotation: isFront ? 0    : theta + Math.PI / 2
    };
  });

  const activeData = GALLERY_DATA[activeGalleryIndex];

  return (
    <main className="community-page noise-bg">
      <div className="texture-overlay" />

      {/* SECTION 1: THE ASSEMBLY HERO */}
      <CommandDeckHero />

      {/* SECTION 2: ARCH CIRCLES GALLERY */}
      <section
        className="art-gallery-section"
        onMouseEnter={() => setGalleryHovered(true)}
        onMouseLeave={() => setGalleryHovered(false)}
      >
        {/* Inner border frame */}
        <div className="gallery-border-inner" />

        {/* ── LOGO ── */}
        <div className="gallery-logo-container animate-fade-in">
          <div className="gallery-logo-arch">arch</div>
          <div className="gallery-logo-circles">CIRCLES<sup>™</sup></div>
          <div className="gallery-logo-sys">ARCH<br />.SYS</div>
        </div>

        {/* ── VERTICAL SIDE LABELS ── */}
        <div className="vertical-label left-label">
          <span className="vlabel-bracket">[</span>
          <span className="vlabel-text">CURATORS</span>
          <span className="vlabel-sep">//</span>
          <span className="vlabel-text">NODE</span>
          <span className="vlabel-bracket">]</span>
        </div>
        <div className="vertical-label right-label">
          <span className="vlabel-bracket">[</span>
          <span className="vlabel-text">COLLECTIONS</span>
          <span className="vlabel-sep">//</span>
          <span className="vlabel-text">NODE</span>
          <span className="vlabel-bracket">]</span>
        </div>

        {/* ── ORBIT 1: CURATORS (left arc) ── */}
        {curatorNodes.map((node) => (
          <div
            key={`curator-${node.idx}`}
            className={`loop-card curator-card ${node.isFront ? 'active' : ''}`}
            style={{
              left     : `calc(50% - 190px - ${R}px + ${R * Math.cos(node.theta)}px)`,
              top      : `calc(52% + ${R * Math.sin(node.theta)}px)`,
              transform: `translate(-50%, -50%) rotate(${node.rotation}rad)`,
              opacity  : node.opacity,
              zIndex   : node.zIndex,
            }}
            onClick={() => handleGallerySelect(node.idx)}
          >
            {/* Cozy Washi Tape overlay */}
            <div 
              className="washi-tape"
              style={{
                top: node.isFront ? '-14px' : '-10px',
                left: '15%',
                width: node.isFront ? '65px' : '45px',
                height: node.isFront ? '16px' : '12px',
                transform: `rotate(${(node.idx % 2 === 0 ? -6 : 8)}deg)`,
                opacity: 0.8,
                zIndex: 210,
              }}
            />
            <PolaroidCard
              type="curator"
              cardNum={node.cardNum}
              isFront={node.isFront}
              nodeLabel={node.nodeLabel}
            />
          </div>
        ))}

        {/* ── CENTER DISPLAY ── */}
        <div className="center-gallery-card">

          {/* LEFT: curator info text */}
          <div className={`center-card-curator-col ${isAligned ? 'aligned' : ''}`}>
            <div className="center-curator-name">{activeData.curator.name}</div>
            <div className="center-curator-role">{activeData.curator.role}</div>
            <div className="center-curator-node">[ {activeData.curator.nodeId} ]</div>
          </div>

          {/* CENTER-LEFT: large curator portrait — use high-res crop for index 0, else card crop */}
          <div className="center-portrait-frame" style={{ position: 'relative' }}>
            <div 
              className="washi-tape" 
              style={{ 
                top: '-12px', 
                left: '20%', 
                width: '75px', 
                height: '18px',
                transform: 'rotate(-4deg)',
                opacity: 0.85,
                zIndex: 210
              }} 
            />
            <img
              src={
                activeGalleryIndex === 0
                  ? '/images/crops/center_john_maeda.png'
                  : `/images/crops/curator_card_${CURATOR_CARD_SEQ[activeGalleryIndex]}.png`
              }
              alt={activeData.curator.name}
              className="center-portrait-img"
            />
          </div>

          {/* CENTER: collection details + button */}
          <div className={`center-card-details-col ${isAligned ? 'aligned' : ''}`}>
            <h3 className="center-collection-name">{activeData.collection.name.toUpperCase()}</h3>
            <div className="center-curated-by">[ CURATED BY: {activeData.collection.curatedBy} ]</div>
            <p className="center-collection-desc">{activeData.collection.description}</p>
            <button className="view-collection-btn">[ VIEW COLLECTION ]</button>
          </div>

          {/* CENTER-RIGHT: large collection artwork — use high-res for index 0 */}
          <div className="center-art-frame" style={{ position: 'relative' }}>
            <div 
              className="washi-tape" 
              style={{ 
                top: '-12px', 
                left: '40%', 
                width: '75px', 
                height: '18px',
                transform: 'rotate(6deg)',
                opacity: 0.85,
                zIndex: 210
              }} 
            />
            <img
              src={
                activeGalleryIndex === 0
                  ? '/images/crops/center_abstractions.png'
                  : `/images/crops/collection_card_${COLLECTION_CARD_SEQ[activeGalleryIndex]}.png`
              }
              alt={activeData.collection.name}
              className="center-art-img"
            />
          </div>

          {/* RIGHT: collection meta text */}
          <div className={`center-card-art-col ${isAligned ? 'aligned' : ''}`}>
            <div className="center-art-name">{activeData.collection.name.toUpperCase()}</div>
            <div className="center-art-pieces">{activeData.collection.piecesCount}</div>
            <div className="center-art-vol">[ {activeData.collection.volId} ]</div>
            <div className="center-art-dot" />
          </div>

        </div>

        {/* ── ORBIT 2: COLLECTIONS (right arc) ── */}
        {collectionNodes.map((node) => (
          <div
            key={`collection-${node.idx}`}
            className={`loop-card collection-card ${node.isFront ? 'active' : ''}`}
            style={{
              right    : `calc(50% - 190px - ${R}px + ${R * Math.cos(node.theta)}px)`,
              top      : `calc(52% + ${R * Math.sin(node.theta)}px)`,
              transform: `translate(50%, -50%) rotate(${node.rotation}rad)`,
              opacity  : node.opacity,
              zIndex   : node.zIndex,
            }}
            onClick={() => handleGallerySelect(node.idx)}
          >
            {/* Cozy Washi Tape overlay */}
            <div 
              className="washi-tape"
              style={{
                top: node.isFront ? '-14px' : '-10px',
                right: '15%',
                width: node.isFront ? '65px' : '45px',
                height: node.isFront ? '16px' : '12px',
                transform: `rotate(${(node.idx % 2 === 0 ? 6 : -8)}deg)`,
                opacity: 0.8,
                zIndex: 210,
              }}
            />
            <PolaroidCard
              type="collection"
              cardNum={node.cardNum}
              isFront={node.isFront}
              nodeLabel={node.volLabel}
            />
          </div>
        ))}

        {/* ── BOTTOM: More Archive Circles ── */}
        <div className="more-circles-container">
          <div className="more-circles-icon">
            {/* compass / directional cross */}
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="3"  x2="12" y2="21" />
              <line x1="3"  y1="12" x2="21" y2="12" />
              <line x1="6.5" y1="6.5"  x2="8" y2="8" />
              <line x1="17.5" y1="6.5" x2="16" y2="8" />
              <line x1="6.5" y1="17.5" x2="8" y2="16" />
              <line x1="17.5" y1="17.5" x2="16" y2="16" />
            </svg>
          </div>
          <div className="more-circles-text">[ MORE ARCHIVE CIRCLES ]</div>
        </div>

        {/* ── BOTTOM ICON BAR ── */}
        <div className="gallery-bottom-actions-container">
          <button className="bottom-icon-btn" aria-label="Like">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
          <button className="bottom-icon-btn" aria-label="Cart">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.06 1.4-2.54h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
          <button className="bottom-icon-btn" aria-label="Settings">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
          </button>
        </div>

      </section>

      {/* SECTION 2.5: YIN-YANG LEDGER */}
      <YinYangLedger />

      {/* SECTION 3: SOCIETY BLOCK GRID & SHADOW WORDMARK */}
      <section className="society-grid-section">
        <div className="dense-grid">
          {[...Array(48)].map((_, i) => (
            <div key={i} className="id-block">
              <span className="font-mono text-[8px] font-bold">ID: 0{i + 100}</span>
              <div className="w-4 h-4 rounded-full bg-blue/20 self-end" />
            </div>
          ))}
        </div>
        <div className="giant-wordmark-container">
          <h1 className="giant-wordmark">VANTAMMAYILU</h1>
        </div>
      </section>

      <Footer />
    </main>
  );
}
