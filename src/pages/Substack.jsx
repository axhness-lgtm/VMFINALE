import React, { useEffect, useRef } from 'react';
import Footer from '../components/Footer';
import './Substack.css';

// Base mock images to tile
const BASE_MOCK_CARDS = [
  { title: 'Issue No. 04', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800' },
  { title: 'Issue No. 03', img: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800' },
  { title: 'Issue No. 02', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800' },
  { title: 'Issue No. 01', img: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80&w=800' },
  { title: 'Notes 05', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800' },
  { title: 'Notes 06', img: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&q=80&w=800' },
  { title: 'Notes 07', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800' },
  { title: 'Notes 08', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800' },
];

const CATEGORIES = [
  { name: 'Food', color: '#ffdae9' },
  { name: 'Travel', color: '#e2daff' },
  { name: 'Life', color: '#f8ffda' }
];

const CARDS_PER_CATEGORY = 25; // 3 categories * 25 cards = 75 total

const MOCK_CARDS = Array.from({ length: 75 }).map((_, i) => {
  const base = BASE_MOCK_CARDS[i % BASE_MOCK_CARDS.length];
  const categoryIndex = Math.floor(i / CARDS_PER_CATEGORY);
  const category = CATEGORIES[categoryIndex];
  
  return {
    id: i,
    title: `${category.name} | ${base.title}`,
    img: base.img,
    category: category.name,
    color: category.color,
    date: `2026.0${5 - Math.floor(i/20)}.${(i % 28) + 1}`.replace('.05.',' .05.').trim() // Mock dates
  };
});

export default function Substack() {
  const [selectedBlog, setSelectedBlog] = React.useState(null);
  const containerRef = useRef(null);
  const carouselRef = useRef(null);
  const tiltRef = useRef(null);
  const cardsRef = useRef([]);
  const highlightsRef = useRef(null);
  const floatingThumbRef = useRef(null);

  // DOM refs for updating UI without React re-renders
  const previewImgRef = useRef(null);
  const previewTitleRef = useRef(null);

  // Animation state stored in refs
  const rotationState = useRef({
    current: 0,
    target: 0,
  });

  const scrollTimeout = useRef(null);
  const hoveredIndexRef = useRef(-1);
  const mouseState = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, rawX: 0, rawY: 0 });

  useEffect(() => {
    let animationFrameId;
    let lastActiveIndex = -1;

    // Desktop: Scroll-driven 3D Rotation
    const handleWheel = (e) => {
      if (window.innerWidth < 768) return;
      
      // Allow native scrolling inside the highlights panel
      if (highlightsRef.current && highlightsRef.current.contains(e.target)) {
        return;
      }

      e.preventDefault();

      // Horizontal rotation maps to vertical scroll delta
      // Lower sensitivity for a heavy, physical feel on a massive ring
      const sensitivity = 0.05;
      rotationState.current.target += e.deltaY * sensitivity;

      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        // Snap behavior
        const stepAngle = 360 / MOCK_CARDS.length;
        rotationState.current.target = Math.round(rotationState.current.target / stepAngle) * stepAngle;
      }, 150);
    };

    const handleMouseMove = (e) => {
      if (window.innerWidth < 768) return;
      mouseState.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseState.current.targetY = (e.clientY / window.innerHeight) * 2 - 1;
      mouseState.current.rawX = e.clientX;
      mouseState.current.rawY = e.clientY;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('mousemove', handleMouseMove);
    }

    const animate = () => {
      if (window.innerWidth >= 768) {
        // Lerp rotation
        rotationState.current.current += (rotationState.current.target - rotationState.current.current) * 0.08;

        // Lerp mouse parallax
        mouseState.current.x += (mouseState.current.targetX - mouseState.current.x) * 0.05;
        mouseState.current.y += (mouseState.current.targetY - mouseState.current.y) * 0.05;

        // Apply mouse interactions to tilt wrapper
        if (tiltRef.current) {
          const tiltX = -28 + (mouseState.current.y * 17); // More negative (up) tilts more
          const tiltY = mouseState.current.x * -15; // Repel left/right (turn away)
          const tiltZ = mouseState.current.x * 10; // Airplane banking (tilt towards cursor)
          const scale = 1.0 + (mouseState.current.y * 0.35); // Pronounced zoom when mouse approaches the ring

          // Strictly fixed center position, only rotations and scale
          tiltRef.current.style.transform = `translateY(5%) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${tiltZ}deg) scale(${scale})`;
        }

        if (carouselRef.current) {
          carouselRef.current.style.transform = `rotateY(${-rotationState.current.current}deg)`;
        }

        const stepAngle = 360 / MOCK_CARDS.length;

        // Calculate which card is currently active (facing front)
        let activeIdx = Math.round(rotationState.current.current / stepAngle) % MOCK_CARDS.length;
        if (activeIdx < 0) activeIdx += MOCK_CARDS.length;

        // Dynamic raycast hover detection to fix stuck native hover during 3D scroll
        if (mouseState.current.rawX > 0 || mouseState.current.rawY > 0) {
          const hoveredEl = document.elementFromPoint(mouseState.current.rawX, mouseState.current.rawY);
          let currentHoveredIdx = -1;
          if (hoveredEl) {
            const cardInner = hoveredEl.closest('.carousel-card-inner');
            if (cardInner && cardInner.dataset.index) {
              currentHoveredIdx = parseInt(cardInner.dataset.index, 10);
            }
          }
          
          if (currentHoveredIdx !== hoveredIndexRef.current) {
            if (hoveredIndexRef.current !== -1 && cardsRef.current[hoveredIndexRef.current]) {
              cardsRef.current[hoveredIndexRef.current].classList.remove('hover-active');
            }
            if (currentHoveredIdx !== -1 && cardsRef.current[currentHoveredIdx]) {
              cardsRef.current[currentHoveredIdx].classList.add('hover-active');
            }
            hoveredIndexRef.current = currentHoveredIdx;
          }
        }

        let displayIdx = hoveredIndexRef.current !== -1 ? hoveredIndexRef.current : activeIdx;

        // Update preview UI only when active card changes (avoids expensive re-renders)
        if (displayIdx !== lastActiveIndex) {
          lastActiveIndex = displayIdx;
          if (previewTitleRef.current) previewTitleRef.current.innerText = MOCK_CARDS[displayIdx].title;
          if (previewImgRef.current) previewImgRef.current.style.backgroundColor = MOCK_CARDS[displayIdx].color;
        }

        cardsRef.current.forEach((card) => {
          if (!card) return;
          // Make all cards fully opaque and sharp as requested
          // Removed manual zIndex calculation to allow native 3D stacking,
          // which fixes the bug where back cards couldn't be hovered.
          card.style.opacity = 1;
          card.style.filter = 'blur(0px)';
          card.style.zIndex = 'auto';
        });
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Initial preview setup
    if (previewTitleRef.current) previewTitleRef.current.innerText = MOCK_CARDS[0].title;

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(scrollTimeout.current);
    };
  }, []);

  // Mobile fallback effect
  useEffect(() => {
    let lastActiveIndex = -1;
    const handleMobileScroll = () => {
      if (window.innerWidth >= 768 || !carouselRef.current) return;

      const center = window.innerWidth / 2;
      let minDistance = Infinity;
      let activeIndex = 0;

      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const dist = Math.abs(center - cardCenter);

        if (dist < minDistance) {
          minDistance = dist;
          activeIndex = index;
        }

        const maxDist = window.innerWidth / 2;
        const progress = Math.min(1, dist / maxDist);
        const scale = 1 - progress * 0.15;
        const opacity = 1 - progress * 0.4;

        card.style.transform = `scale(${scale})`;
        card.style.opacity = opacity;
      });

      // Update mobile preview
      if (activeIndex !== lastActiveIndex) {
        lastActiveIndex = activeIndex;
        if (previewTitleRef.current) previewTitleRef.current.innerText = MOCK_CARDS[activeIndex].title;
        if (previewImgRef.current) previewImgRef.current.style.backgroundColor = MOCK_CARDS[activeIndex].color;
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleMobileScroll);
      // Trigger on mount
      setTimeout(handleMobileScroll, 100);
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener('scroll', handleMobileScroll);
      }
    };
  }, []);

  const handleCardClick = (index) => {
    if (window.innerWidth < 768) return;
    const stepAngle = 360 / MOCK_CARDS.length;
    const cardAngle = index * stepAngle;

    let diff = (cardAngle - rotationState.current.current) % 360;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    rotationState.current.target = rotationState.current.current + diff;

    // Direct Lead to Blog
    setTimeout(() => {
      setSelectedBlog(MOCK_CARDS[index]);
      toggleHighlights(true);
    }, 450); // Delay for a smoother physical transition feel
  };

  const handleCategoryClick = (categoryIndex) => {
    // Target the middle card of the category arc
    const targetIndex = categoryIndex * CARDS_PER_CATEGORY + Math.floor(CARDS_PER_CATEGORY / 2);
    
    if (window.innerWidth < 768 && carouselRef.current) {
      // Mobile smooth scrolling logic
      const targetCard = cardsRef.current[targetIndex];
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    } else {
      // Desktop 3D rotation logic
      handleCardClick(targetIndex);
    }
  };

  const toggleHighlights = (open) => {
    if (highlightsRef.current) {
      if (open) {
        highlightsRef.current.classList.add('open');
      } else {
        highlightsRef.current.classList.remove('open');
      }
    }
  };

  const handleTitleMouseMove = (e) => {
    if (!floatingThumbRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    floatingThumbRef.current.style.left = `${x}px`;
    floatingThumbRef.current.style.top = `${y}px`;
  };

  return (
    <main className="substack-container" ref={containerRef}>

      {/* Top Left Preview (Dynamically updates via JS Ref) */}
      <div className="preview-container">
        <div ref={previewImgRef} className="preview-image" style={{ backgroundColor: 'var(--exp-card-bg, #ffffff)' }} />
        <p ref={previewTitleRef} className="preview-title">Loading...</p>
      </div>

      <div className="journal-section-wrapper">
        <h1 className="scroll-text-huge">Journal</h1>
      </div>

      {/* Category Highlights Tab */}
      <div className="category-highlights-tab">
        {CATEGORIES.map((cat, idx) => (
          <div 
            key={cat.name} 
            className="highlight-item"
            onClick={() => handleCategoryClick(idx)}
          >
            <span className="highlight-color" style={{ backgroundColor: cat.color }}></span>
            <span className="highlight-name">{cat.name}</span>
          </div>
        ))}
      </div>

      <div className="watermark">
        <span>Vantammayilu</span>
      </div>

      {/* 3D Carousel System */}
      <div className="carousel-perspective">
        <div className="carousel-tilt" ref={tiltRef}>
          <div className="carousel-system" ref={carouselRef}>
            {MOCK_CARDS.map((card, index) => {
              const stepAngle = 360 / MOCK_CARDS.length;
              const angle = index * stepAngle;

              return (
                <div
                  key={`card-${index}`}
                  className="carousel-card-wrapper"
                  style={{
                    '--angle': `${angle}deg`,
                  }}
                >
                  <div 
                    className="carousel-card-inner"
                    style={{ backgroundColor: card.color }}
                    data-index={index}
                    ref={el => cardsRef.current[index] = el}
                    onClick={() => handleCardClick(index)}
                  >
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trigger Arrow to Open Highlights */}
      <div className="open-highlights-btn" onClick={() => toggleHighlights(true)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--exp-bg, #ff8811)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </div>

      {/* Sliding Highlights Panel (Full Screen Blog) */}
      <div className="highlights-panel" ref={highlightsRef}>
        <div className="reads-back-btn" onClick={() => {
          if (selectedBlog) {
            setSelectedBlog(null);
          } else {
            toggleHighlights(false);
          }
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {selectedBlog ? (
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            ) : (
              <path d="M12 19V5M5 12l7-7 7 7"/>
            )}
          </svg>
        </div>
        
        {selectedBlog ? (
          /* Detailed Blog View */
          <div className="post-detail-view">
            <div className="post-header-section">
              <div className="title-hover-wrapper" onMouseMove={handleTitleMouseMove}>
                <h1 className="post-main-title">{selectedBlog.title}</h1>
                <div className="post-floating-thumb" ref={floatingThumbRef}>
                  <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800" alt="Thumbnail" />
                </div>
              </div>
            </div>

            <div className="post-body-container">
              {/* Left Sidebar Metadata */}
              <aside className="post-metadata-sidebar">
                <div className="meta-group">
                  <div className="meta-label">/ METADATA</div>
                  <div className="meta-item">
                    <span className="meta-key">DATE:</span>
                    <span className="meta-val">{selectedBlog.date}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-key">AUTHOR:</span>
                    <span className="meta-val highlight-box">ALLISON FARRIS</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-key">READING TIME:</span>
                    <span className="meta-val">5 MIN READ</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-key">CATEGORIES:</span>
                    <div className="meta-tags">
                      <span className="tag-box">BEST PRACTICES</span>
                      <span className="tag-box">PAYMENTS</span>
                    </div>
                  </div>
                </div>

                <div className="meta-group">
                  <div className="meta-label">AGENTS:</div>
                  <div className="meta-actions">
                    <button className="meta-btn"><span className="icon">📄</span> Copy for LLM</button>
                    <button className="meta-btn"><span className="icon">⬇️</span> View as Markdown</button>
                  </div>
                </div>

                <div className="meta-group">
                  <div className="meta-label">SHARE:</div>
                  <div className="meta-actions">
                    <button className="meta-btn">Twitter/X</button>
                    <button className="meta-btn">LinkedIn</button>
                  </div>
                </div>
              </aside>

              {/* Right Side Content */}
              <article className="post-content-area">
                <div className="content-label">/ ARTICLE</div>
                <div className="content-body">
                  <p className="intro-text">
                    Imagine your digital business is a complex engine, and every transaction is a vital spark. 
                    Whether you're selling software licenses in London or gourmet spices in Mumbai, 
                    scaling into different markets brings a new set of architectural challenges. 
                    Supporting global customers means handling local payment methods, different currencies, 
                    and varying regulatory landscapes—all while maintaining a seamless, branded experience.
                  </p>
                  <p>
                    For developers looking to build a flexible payment flow, there's an integration pattern 
                    that should be your default starting point. This approach allows you to build a commerce 
                    layer that offloads global complexity to the backend while maintaining full control 
                    over your branded checkout UX.
                  </p>
                  <h3>Understanding our core abstractions</h3>
                  <p>
                    First, let's look at how we organize our data objects. Our architecture is built on two 
                    distinct layers of abstraction that interoperate to manage the entire lifecycle of a read.
                  </p>
                </div>
              </article>
            </div>

            {/* Related Articles Section */}
            <section className="related-articles-section">
              <div className="related-label">/ RELATED ARTICLES</div>
              <div className="related-grid">
                <div className="related-card">
                  <div className="related-window-frame">
                    <div className="window-header">
                      <span className="window-controls">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </span>
                      <span className="window-title">[ FIG. 1 ]</span>
                    </div>
                    <div className="window-content">
                      <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800" alt="Tech" />
                    </div>
                  </div>
                  <div className="related-info">
                    <h4 className="related-title">Building a mental model for Vantammayilu reads ↗</h4>
                    <p className="related-desc">
                      Learn how our technical editorial system works under the hood by understanding the 
                      interaction lifecycle as a state machine—from scroll to discovery...
                    </p>
                    <div className="related-tags">
                      <span className="tag-box">GETTING STARTED</span>
                      <span className="tag-box">BEST PRACTICES</span>
                    </div>
                  </div>
                </div>

                <div className="related-divider"></div>

                <div className="related-card">
                  <div className="related-window-frame">
                    <div className="window-header">
                      <span className="window-controls">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </span>
                      <span className="window-title">[ FIG. 2 ]</span>
                    </div>
                    <div className="window-content">
                      <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800" alt="Hardware" />
                    </div>
                  </div>
                  <div className="related-info">
                    <h4 className="related-title">Because nobody likes a boring interface ↗</h4>
                    <p className="related-desc">
                      In complex, high-volume systems, even minor visual failures—like a dropped 
                      interactive connection—can lead to major headaches...
                    </p>
                    <div className="related-tags">
                      <span className="tag-box">DESIGN</span>
                      <span className="tag-box">DYNAMICS</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* List View */
          <div className="reads-layout">
            <div className="reads-top-bar">
              <h1 className="reads-main-title">READS</h1>
              <span className="reads-count">(95)</span>
            </div>

            <div className="reads-grid-container">
              {/* Sidebar / Filters */}
              <aside className="reads-sidebar">
                <div className="sidebar-section">
                  <div className="sidebar-label">/ FILTERS</div>
                  <div className="sidebar-tree">
                    <div className="tree-node open">
                      <span className="tree-arrow">▼</span>
                      <svg className="custom-folder-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4H9L11 6H20C21.1 6 22 6.9 22 8V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" fill="#FF8811" />
                        <path d="M2 8H22" stroke="white" strokeWidth="1" strokeOpacity="0.2"/>
                      </svg>
                      <span className="tree-text">Topic</span>
                    </div>
                    <ul className="tree-list">
                      <li className="tree-item clickable">Food (24)</li>
                      <li className="tree-item clickable">Travel (38)</li>
                      <li className="tree-item active clickable">Life (16)</li>
                      <li className="tree-item clickable">Founder (12)</li>
                      <li className="tree-item clickable">Community (5)</li>
                    </ul>
                  </div>
                </div>
              </aside>

              {/* Main Content / List */}
              <main className="reads-list-section">
                <div className="list-header">
                  <div className="header-col date">/ DATE</div>
                  <div className="header-col name">/ NAME</div>
                </div>

                <div className="reads-list">
                  {[
                    { date: '2026.05.04', title: 'The Art of the Slow Roast: A Sunday Tradition' },
                    { date: '2026.04.12', title: 'Coastal Whispers: A Journey to the Edge' },
                    { date: '2026.03.28', title: 'The Weaver\'s Paradox: Life in Loops' },
                    { date: '2026.03.15', title: 'Finding Symmetry in Chaos' },
                    { date: '2026.02.19', title: 'A Journey Through the Spice Markets' },
                    { date: '2026.01.05', title: 'Reflections on the First Supper Club' }
                  ].map((post, i) => (
                    <div 
                      key={i} 
                      className="list-row clickable"
                      onClick={() => setSelectedBlog(post)}
                    >
                      <div className="row-date">
                        <span className="row-bullet">■</span>
                        {post.date}
                      </div>
                      <div className="row-name">
                        {post.title}
                      </div>
                      <div className="row-plus">+</div>
                    </div>
                  ))}
                </div>
              </main>
            </div>
          </div>
        )}
        
        {/* Cool Technical Footer */}
        <Footer />
      </div>

      {/* <PaletteExperimenter /> */}
    </main>
  );
}

// Draggable floating palette for live CSS variable injection
function PaletteExperimenter() {
  const COLORS = ['#ccff00', '#7b5cff', '#ff5c9d', '#ff8811', '#a621ff', '#ffffff'];
  const TARGETS = [
    { id: '--exp-bg', label: 'Background' },
    { id: '--exp-text', label: 'Text Colors' },
    { id: '--exp-card-bg', label: 'Cards' },
    { id: '--exp-nav-bg', label: 'Nav Bar' },
    { id: '--exp-nav-border', label: 'Nav Outline' },
    { id: '--exp-nav-text', label: 'Nav Text' }
  ];

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px', backgroundColor: 'rgba(0,0,0,0.85)',
      padding: '15px', borderRadius: '12px', zIndex: 1000, color: 'white',
      fontFamily: 'sans-serif', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)', backdropFilter: 'blur(5px)'
    }}>
      <div style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Palette Lab</div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {COLORS.map(c => (
          <div key={c} draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', c)}
            style={{
              width: '24px', height: '24px', backgroundColor: c, borderRadius: '50%',
              cursor: 'grab', border: '2px solid rgba(255,255,255,0.8)', flexShrink: 0
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {TARGETS.map(t => (
          <div key={t.id} onDragOver={e => e.preventDefault()}
            onDrop={e => document.documentElement.style.setProperty(t.id, e.dataTransfer.getData('text/plain'))}
            style={{
              padding: '6px', border: '1px dashed rgba(255,255,255,0.3)', borderRadius: '4px', textAlign: 'center', cursor: 'crosshair'
            }}
          >
            Drop: {t.label}
          </div>
        ))}
      </div>
      <div 
        onClick={() => TARGETS.forEach(t => document.documentElement.style.removeProperty(t.id))}
        style={{ textAlign: 'center', cursor: 'pointer', opacity: 0.5, marginTop: '4px', textDecoration: 'underline' }}
      >
        Reset All
      </div>
    </div>
  );
}
