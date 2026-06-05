import React, { useState, useEffect, useRef } from 'react';
import Footer from '../components/Footer';
import './Substack.css';

const TITLES = [
  "THE REMNANTS", "TIMELESS TABLES", "SILENT CONVERSATIONS", "THE ARCHITECTURE",
  "SACRED SPACES", "EMBODIED MEMORIES", "PLATES AND POETRY", "HARVEST ECHOES",
  "UNBROKEN BREAD", "LIQUID SHADOWS", "THE DINNER PROTOCOLS", "SENSORY RESIDUE",
  "CANDLELIT ANNOTATIONS", "THE ORCHESTRA OF PLATES", "SLOW TOMATOES", "COMMUNAL RHYTHMS",
  "ACCIDENTAL CONNECTIONS", "THE DIALOGUE OF WINE", "TACTILE MEMORY", "EDITORIAL FRAGMENTS",
  "GRAIN AND WOOD", "PORTRAITS OF STRANGERS", "THE LAST CRUMB", "BEYOND TRANSACTION",
  "THE COMMONS", "UNFOLDING MAPS", "CURED AND AGED", "THE NIGHT WATCH",
  "RAW MATERIALS", "THE MEMORY TABLE"
];

const SNIPPETS = [
  "A study in what remains when the table is empty and the voices fade.",
  "An architectural investigation into the geometry of shared plates.",
  "Tracking the silent, physical gestures that build community.",
  "Why the design of a space dictates the depth of the dinner.",
  "Reclaiming the dining table as a sanctuary in a hyper-digital world.",
  "The emotional residue left behind on tablecloths and empty glasses.",
  "A poetic inquiry into the relationship between food and text.",
  "Notes on the late autumn harvest and the warmth of woodfire cooking.",
  "On the simple, revolutionary act of tearing bread with strangers.",
  "An exploration of light, shadow, and the amber glow of melted wax.",
  "The informal rules that make a dinner party feel like home.",
  "How smell and taste act as portals to our oldest memories.",
  "Written fragments gathered from napkins and menus after midnight.",
  "The sonic landscape of clinking porcelain and laughter.",
  "A recipe for patience: cooking down heritage tomatoes for six hours.",
  "Aligning our internal clocks with the natural pace of the meal.",
  "How accidental seating arrangements alter the course of lives.",
  "A deep dive into natural winemaking and unfiltered conversations.",
  "The tangible texture of raw linen, unpolished wood, and warm clay.",
  "An aesthetic manifesto on the value of raw, unedited moments.",
  "The story of the trees that became our tables and the hands that built them.",
  "Brief, anonymous character sketches of our supper club guests.",
  "A final look at the crumbs, the spills, and the memory of the feast.",
  "Why we build community tables instead of standard restaurants.",
  "On the reclamation of shared physical spaces in a disconnected era.",
  "Cartography of shared meals and the paths that crossed.",
  "The biology of fermentation, curing, and slowing down time.",
  "Conversations that happen after the fire dies down and embers glow.",
  "An inquiry into sourcing, craftsmanship, and building from the ground up.",
  "A study on the emotional residue of childhood meals and long benches."
];

const CONTENTS = [
  "Why do we spend our lives building walls just to spend our evenings looking over them? In our latest journal entry, we explore why sitting at a long table with seven people you've never met is the quickest way to remember what makes us human. We cooked down tomatoes until they were essentially jam, passed around bottles of natural wine, and nobody checked their phone for four hours. It was a complete rejection of the speed of modern life. We ate slowly. We talked about things that mattered. We remembered how to be people again.",
  "The geometry of the table dictates the depth of the conversation. A round table places everyone at an equal distance, but the long table forces a linear, staggered proximity. You are in conversation with the three people directly opposite and adjacent to you, but the collective energy flows along the central axis. We examine how simple wooden planks, supported by raw metal trestles, become spaces of profound human vulnerability.",
  "Trust is not built in the declarations we make; it is established in the shared rhythm of passing the bread, pouring the water, and adjusting to the shared physical plane. Before we speak, our bodies negotiate space. This article is a study of the subtle choreography of communal dining: the tilted head, the shared glance across a candle's flame, and the silent agreement to be present.",
  "Design is not about how things look, but how they make us behave. The height of a chair, the width of a tabletop, the distance between candles—these are not aesthetic details, they are social engineering. When we design spaces for eating, we are designing the interactions that occur within them. A lower table encourages leaning in; a higher table maintains a technical distance. We build to lean in.",
  "We live in a world where attention is a commodity. Our screens pull us out of our immediate physical reality. The dinner table is one of the last remaining sanctuaries where we are forced to look at one another, to listen to the cadence of a voice, and to share the same physical air. It is a slow, quiet revolution. We put away the phones, light the candles, and let the outside world fade away.",
  "When the guests leave, the room remains charged. The tablecloth is stained with wine, crumbs are scattered like tiny monuments, and the candles have melted into erratic pools. This is not clutter; it is a physical map of a shared experience. It is the emotional residue of connection. In this entry, we document the quiet beauty of the post-dinner landscape.",
  "Food is a language, but it requires translation. Every dish tells a story of weather, soil, history, and human labor. When we serve a meal, we are presenting a thesis. The task of the writer is to capture this fleeting narrative before it is consumed. We trace the lineage of our heritage grains and the stories of the hands that milled them.",
  "The woodfire oven is a living entity. It requires attention, respect, and a deep understanding of temperature. Cooking with fire is not a science; it is a conversation with the elements. We explore how cooking over open flame forces us to slow down, to watch the embers, and to accept the unpredictable variations of heat.",
  "Tearing bread is an ancient gesture. It is a pre-verbal agreement to share sustenance. When we sit with strangers and pass a warm, sourdough loaf, we are participating in a ritual that spans millennia. It is a simple, direct reminder of our shared biology and our common need for nourishment and community.",
  "As night falls, the shadows grow long. The yellow glow of candlelight softens the hard edges of the room and the defenses of the guests. We study the optics of the dining room: how low-frequency light encourages intimate confessions, and how the absence of harsh blue light allows our nervous systems to settle into a state of rest.",
  "There are no written rules at Vantammayilu, yet everyone understands the protocol. You do not pour your own wine; you pour for your neighbor. You do not start eating until the table is served. You pass the heavy bowls. These simple acts of mutual service create an invisible network of care that binds the table together.",
  "Smell is the only sense with a direct pathway to the amygdala. A single whiff of toasted fennel seeds or simmering stock can transport us back decades. We investigate the neurobiology of hospitality, showing how carefully curated aromas can trigger deep feelings of safety, warmth, and belonging before the first course arrives.",
  "The best conversations are the ones we cannot fully recall, only their texture. We gathered the notes scribbled on the backs of receipts, menus, and napkins at the end of the evening. They are raw, fragmented, and beautiful: reflections on love, loss, and the absolute necessity of eating together under the stars.",
  "Communal dining has a unique acoustic signature. It starts with a quiet hum—the sound of strangers politely introducing themselves. As the wine flows, the pitch rises. The clatter of forks, the ringing of glasses, the bursts of laughter, and the deep, resonant drone of multiple simultaneous stories. It is a beautiful, chaotic symphony.",
  "We spent six hours cooking down local tomatoes with garlic, olive oil, and fresh basil. There was no shortcut. The water had to evaporate slowly, concentrating the sugars until the mixture became a dark, rich jam. In a world obsessed with efficiency, this slow sauce is a monument to the value of wasted time.",
  "Our bodies have their own rhythms, which are often overridden by the frantic pace of modern life. A communal dinner is a template for resetting these clocks. We design the flow of courses to match the natural deceleration of the evening, guiding our guests from initial high-energy anticipation to a deep, peaceful calm.",
  "Who you sit next to is a matter of chance, but the consequences can be permanent. We share stories of connections made at our tables: business partnerships formed, friendships forged, and romantic sparks ignited, all because of an accidental seating arrangement and a shared plate of handmade pasta.",
  "Wine is not just a beverage; it is a time capsule. A bottle of natural wine contains the weather, the soil, and the specific decisions of a winemaker in a single year. When we share a bottle, we are tasting history. We discuss the philosophy of low-intervention wine and why it belongs at the center of the communal table.",
  "The tactile elements of a dining room are the first line of engagement. The rough surface of raw linen, the cool weight of hand-thrown ceramic plates, the solid grain of oak tables. These textures ground us in our bodies, pulling us out of our minds and into the immediate, physical present.",
  "We reject the polished, the perfect, and the curated. True hospitality is raw. It is the accidental spill, the slightly burnt crust, the unscripted joke, and the willing vulnerability of both host and guest. We write about the beauty of the unedited moment and why perfection is the enemy of connection.",
  "We traced the history of the massive cedar logs that we milled to build our signature long table. We share the story of the artisans who worked the wood, preserving its natural splits and knots, and how this table has become the central monument around which our community gathers.",
  "We present a series of anonymous portraits—written in prose—of the diverse characters who have graced our long table: the nervous traveler, the local craftsman, the quiet intellectual, and the expressive storyteller. They represent the rich tapestry of humanity that makes every dinner unique.",
  "When the plates are cleared, a different kind of hunger remains. We look at the final moments of the supper club: the lingering guests who refuse to leave, the staff sharing a glass in the kitchen, and the quiet satisfaction of having created a temporary home for thirty souls.",
  "We did not build Vantammayilu to be a restaurant. We built it to be an antidote. In our simple act of gathering around a table, we resist a hyper-connected, yet deeply disconnected culture, finding peace in the presence of others.",
  "The reclamation of shared physical spaces is an essential act of survival in a hyper-digitized age. We study the history of meeting houses, commons, and neighborhood halls to understand how architecture can design intimacy.",
  "A map is not just geographical; it can track emotional states, flavors, and moments of human transition. We chart the trajectories of our dinner guests, tracing the invisible paths that intersect at the long table.",
  "Fermentation is a collaboration with invisible life. In this essay, we look at the biological process of wild fermentation, showing how micro-organisms slow down time and preserve the essence of a season in jars of kraut and wheels of cheese.",
  "When the fire in the hearth dies down, the conversation changes key. The shadows deepen, the voices drop to a whisper, and we speak of things we would never mention in the harsh light of day. We log these nocturnal table-side reflections.",
  "True craft begins with respect for the raw material. Whether it is cedar for a table or heritage wheat for bread, we honor the integrity of the source. We outline our sourcing guidelines and interview the local millers who keep our heritage alive.",
  "The memory of a childhood kitchen is a permanent imprint. In our final article of the volume, we analyze the sensory details that remain with us—the squeak of a floorboard, the scent of roasting spices—and how we rebuild those safe havens at every dinner."
];

const THUMBNAILS = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  title: `ARTICLE ${i + 1 < 10 ? '0' : ''}${i + 1} // ${TITLES[i]}`,
  snippet: SNIPPETS[i],
  content: CONTENTS[i],
  image: `/images/journal_art_${(i % 3) + 1}.png`
}));

const RotaryWheel = ({ onArticleSelect }) => {
  const containerRef = useRef(null);
  const ringRef = useRef(null);
  const requestRef = useRef(null);

  // Explore and active index states
  const [isExploreActive, setIsExploreActive] = useState(false);
  const [activeIndexState, setActiveIndexState] = useState(0);
  const lastActiveIndex = useRef(0);

  // Drag states
  const isDragging = useRef(false);
  const startAngle = useRef(0);
  const startRotation = useRef(0);
  const dragVelocity = useRef(0);
  const lastDragAngle = useRef(0);
  const lastDragTime = useRef(0);

  // Physics simulation refs
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, dist: 1.5 });
  const scale = useRef({ val: 0.6, vel: 0 });
  const rotX = useRef({ val: 0, vel: 0 });
  const rotY = useRef({ val: 0, vel: 0 });
  const rotZ = useRef({ val: 0, vel: 0 });
  const rotationAngle = useRef(0);

  // Config parameters - wider radius to accommodate larger cards
  const R = isExploreActive ? 560 : 360; 
  const scaleMin = 0.68;
  const maxTilt = 42; 
  const maxRoll = 18; 

  // Critically damped spring constants: lower stiffness and significantly reduced damping multiplier
  // to remove the bounce entirely and make it stop in a smooth, elegant glide
  const stiffness = 0.012; 
  const damping = 0.76;    

  useEffect(() => {
    const handleMouseMoveGlobal = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      // Calculate mouse position relative to center of container
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Check if mouse is outside the bounds of the hero section
      const isOutside = (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      );

      if (isOutside) {
        mouse.current.targetX = 0;
        mouse.current.targetY = 0;
        mouse.current.dist = 1.5;
      } else {
        const distance = Math.sqrt(x * x + y * y);
        const halfHeight = rect.height / 2;
        const dNorm = Math.min(distance / halfHeight, 1.5);

        mouse.current.targetX = x;
        mouse.current.targetY = y;
        mouse.current.dist = dNorm;
      }
    };

    window.addEventListener('mousemove', handleMouseMoveGlobal);
    return () => {
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
    };
  }, []);

  // Main animation frame loop
  useEffect(() => {
    let lastTime = performance.now();

    const updatePhysics = (time) => {
      if (!containerRef.current || !ringRef.current) {
        requestRef.current = requestAnimationFrame(updatePhysics);
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const W = rect.width || 700;
      const H = rect.height || 700;

      // Calculate active index based on rotation angle (closest to top center)
      let newActiveIndex = Math.round((-rotationAngle.current) / (360 / N)) % N;
      if (newActiveIndex < 0) newActiveIndex += N;
      if (newActiveIndex !== lastActiveIndex.current) {
        lastActiveIndex.current = newActiveIndex;
        setActiveIndexState(newActiveIndex);
      }

      const scaleMax = 0.82;
      
      let targetScale;
      let targetRotX, targetRotY, targetRotZ;

      if (isExploreActive) {
        targetScale = 1.25;
        targetRotX = 0;
        targetRotY = 0;
        targetRotZ = 0;
      } else {
        const weightRaw = Math.max(0, Math.min(1, (1.0 - mouse.current.dist) / 1.0));
        const weight = Math.pow(weightRaw, 2.5); 
        targetScale = scaleMin + (scaleMax - scaleMin) * weight;

        const tiltScale = Math.min(mouse.current.dist, 1.0);
        targetRotX = - (mouse.current.targetY / (H / 2)) * maxTilt * tiltScale;
        targetRotY = - (mouse.current.targetX / (W / 2)) * maxTilt * tiltScale;
        targetRotZ = - (mouse.current.targetX / (W / 2)) * maxRoll * tiltScale;
      }

      // Update spring physics
      const updateSpring = (spring, target) => {
        const force = (target - spring.val) * stiffness;
        spring.vel = (spring.vel + force) * damping;
        spring.val += spring.vel;
      };

      updateSpring(scale.current, targetScale);
      updateSpring(rotX.current, targetRotX);
      updateSpring(rotY.current, targetRotY);
      updateSpring(rotZ.current, targetRotZ);

      if (isDragging.current) {
        dragVelocity.current *= 0.95;
      } else {
        rotationAngle.current += 0.08 + dragVelocity.current;
        dragVelocity.current *= 0.97;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `perspective(1200px) rotateX(${rotX.current.val}deg) rotateY(${rotY.current.val}deg) rotateZ(${rotZ.current.val + rotationAngle.current}deg) scale(${scale.current.val})`;
      }

      lastTime = time;
      requestRef.current = requestAnimationFrame(updatePhysics);
    };

    requestRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [R, scaleMin, maxTilt, maxRoll, stiffness, damping, isExploreActive]);

  useEffect(() => {
    const handleGlobalWheel = (e) => {
      if (isExploreActive) {
        e.preventDefault();
        dragVelocity.current += e.deltaY * 0.015;
      }
    };

    if (isExploreActive) {
      window.addEventListener('wheel', handleGlobalWheel, { passive: false });
    }
    return () => {
      window.removeEventListener('wheel', handleGlobalWheel);
    };
  }, [isExploreActive]);

  useEffect(() => {
    const handleGlobalTouchMove = (e) => {
      if (isExploreActive) {
        e.preventDefault();
      }
    };

    if (isExploreActive) {
      window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
    }
    return () => {
      window.removeEventListener('touchmove', handleGlobalTouchMove);
    };
  }, [isExploreActive]);

  const getAngle = (clientX, clientY) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left - rect.width / 2;
    const y = clientY - rect.top - rect.height / 2;
    return Math.atan2(y, x) * (180 / Math.PI);
  };

  const handleDragStart = (clientX, clientY) => {
    isDragging.current = true;
    const angle = getAngle(clientX, clientY);
    startAngle.current = angle;
    startRotation.current = rotationAngle.current;
    lastDragAngle.current = angle;
    lastDragTime.current = performance.now();
    dragVelocity.current = 0;
  };

  const handleDragMove = (clientX, clientY) => {
    if (!isDragging.current) return;
    const angle = getAngle(clientX, clientY);
    let diff = angle - startAngle.current;
    
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    
    rotationAngle.current = startRotation.current + diff;

    const now = performance.now();
    const timeDiff = now - lastDragTime.current;
    let angleDiff = angle - lastDragAngle.current;
    if (angleDiff > 180) angleDiff -= 360;
    if (angleDiff < -180) angleDiff += 360;

    if (timeDiff > 0) {
      const instantVel = (angleDiff / timeDiff) * 16.66;
      dragVelocity.current = dragVelocity.current * 0.6 + instantVel * 0.4;
    }

    lastDragAngle.current = angle;
    lastDragTime.current = now;
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    dragVelocity.current = Math.max(-10, Math.min(10, dragVelocity.current));
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.tagName !== 'BUTTON' && e.target.closest('a') === null) {
      e.preventDefault();
      handleDragStart(e.clientX, e.clientY);
    }
  };

  const handleMouseMoveGlobal = (e) => {
    if (isDragging.current) {
      handleDragMove(e.clientX, e.clientY);
    }
  };

  const handleMouseUpGlobal = () => {
    if (isDragging.current) {
      handleDragEnd();
    }
  };

  const handleWheel = (e) => {
    if (!isExploreActive) {
      dragVelocity.current += e.deltaY * 0.015;
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMoveGlobal);
    window.addEventListener('mouseup', handleMouseUpGlobal);
    return () => {
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
      window.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, []);

  const handleExploreClick = (e) => {
    e.stopPropagation();
    setIsExploreActive(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseExplore = () => {
    setIsExploreActive(false);
  };

  const handleScrollToMagazine = () => {
    setIsExploreActive(false);
    setTimeout(() => {
      const el = document.querySelector('.magazine-index-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
  };

  const N = THUMBNAILS.length;
  const activeThumb = THUMBNAILS[activeIndexState];

  return (
    <div
      className={`hero-3d-section select-none ${isExploreActive ? 'explore-active' : ''}`}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      onTouchStart={(e) => {
        if (e.touches.length > 0) {
          handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onTouchMove={(e) => {
        if (e.touches.length > 0) {
          handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onTouchEnd={handleDragEnd}
    >
      {/* Moved Details Container out of shifting ring-3d-container for navbar safety */}
      {isExploreActive && activeThumb && (
        <div className="explore-details-container">
          <div className="explore-col-left">
            <span className="explore-number">VM // {activeThumb.id + 1 < 10 ? `0${activeThumb.id + 1}` : activeThumb.id + 1}</span>
            <p className="explore-snippet">"{activeThumb.snippet}"</p>
          </div>
          <div className="explore-col-right">
            <h2 className="explore-title">{activeThumb.title.split('//')[1].trim()}</h2>
            <button 
              className="explore-read-btn" 
              onClick={() => onArticleSelect(activeThumb)}
            >
              [ READ ARTICLE ] &rarr;
            </button>
          </div>
        </div>
      )}

      <div className="ring-3d-container">
        <div className="ring-3d-inner" ref={ringRef}>
          {THUMBNAILS.map((thumb, i) => {
            const angle = i * (360 / N);
            const isActive = isExploreActive && i === activeIndexState;

            return (
              <div
                key={thumb.id}
                className={`rotary-thumbnail-3d ${isActive ? 'active-card' : ''}`}
                style={{
                  transform: `translate(-50%, -50%) rotateZ(${angle}deg) translateY(-${R}px)`,
                }}
                onClick={() => {
                  if (isExploreActive) {
                    if (isActive) {
                      onArticleSelect(thumb);
                    } else {
                      let diff = activeIndexState - i;
                      if (diff > N / 2) diff -= N;
                      if (diff < -N / 2) diff += N;
                      rotationAngle.current += diff * (360 / N);
                    }
                  } else {
                    onArticleSelect(thumb);
                  }
                }}
              >
                <div className="card-inner-3d">
                  <div className="card-header-3d">
                    <span>VM // {thumb.id + 1 < 10 ? `0${thumb.id + 1}` : thumb.id + 1}</span>
                    <span>[+]</span>
                  </div>
                  <div className="card-image-container-3d">
                    <img
                      src={thumb.image}
                      alt={thumb.title}
                      className="card-image-3d"
                      draggable="false"
                    />
                  </div>
                  <div className="card-footer-3d">
                    <span>{TITLES[i]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!isExploreActive && (
          <div className="center-hub-container">
            <span className="center-hub-label">[ SUBSCRIBER JOURNAL ]</span>
            <button
              className="center-hub-btn-3d"
              onClick={handleExploreClick}
            >
              EXPLORE READS
            </button>
            <span className="center-hub-subtitle">
              A spatial archive of communal supper notes, records, and thoughts.
            </span>
          </div>
        )}
      </div>

      {isExploreActive && (
        <>
          <button className="explore-close-btn" onClick={handleCloseExplore}>
            &larr; BACK
          </button>
          <button className="scroll-down-arrow-btn" onClick={handleScrollToMagazine}>
            <span className="arrow-text">[ SCROLL TO MAGAZINE ]</span>
            <span className="arrow-icon">&darr;</span>
          </button>
        </>
      )}
    </div>
  );
};

const DossierCard = ({ thumb, index, position, onStartDrag, onClick, hasMoved, isHovered, onMouseEnter, onMouseLeave }) => {
  const tabPositionClass = index % 3 === 0 ? 'tab-left' : index % 3 === 1 ? 'tab-center' : 'tab-right';
  
  const style = {
    transform: `translate(-50%, -50%) translate3d(${position.x}px, ${position.y}px, 0)`,
    zIndex: position.zIndex,
  };

  const innerStyle = {
    transform: `rotate(${position.rotation}deg)`,
  };

  const handleRelease = (e) => {
    if (!hasMoved.current) {
      onClick(thumb);
    }
  };

  return (
    <div
      className="dossier-card-wrapper"
      style={style}
      onMouseDown={(e) => onStartDrag(e, thumb.id)}
      onTouchStart={(e) => onStartDrag(e, thumb.id)}
      onClick={handleRelease}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* 3D Washi Tape overlay anchoring the folder tab */}
      <div 
        className="washi-tape" 
        style={{ 
          top: '-20px', 
          left: '25%', 
          width: '80px', 
          height: '18px',
          transform: `rotate(${(index % 2 === 0 ? -4 : 6)}deg)`,
          opacity: 0.85
        }} 
      />

      <div className={`dossier-tab ${tabPositionClass}`}>
        <span>NO. {thumb.id + 1 < 10 ? `0${thumb.id + 1}` : thumb.id + 1}</span>
      </div>
      
      <div className="dossier-card-inner-container" style={innerStyle}>
        <div className="dossier-card">
          <div className="dossier-card-inner">
            <div className="dossier-card-content">
              <div className="dossier-card-left">
                <h3 className="dossier-card-title">
                  {`[NO. ${thumb.id + 1 < 10 ? '0' : ''}${thumb.id + 1}]`}
                  <br />
                  {thumb.title.split('//')[1].trim()}
                </h3>
                <p className="dossier-card-snippet">{thumb.snippet}</p>
              </div>
              <div className="dossier-card-right">
                <div className="dossier-graphic-window">
                  <svg viewBox="0 0 60 60" className="dossier-svg">
                    <rect className="svg-stroke" x="2" y="2" width="56" height="56" strokeWidth="2" />
                    {index % 4 === 0 && (
                      <>
                        <line className="svg-stroke" x1="2" y1="2" x2="58" y2="58" strokeWidth="1.5" />
                        <line className="svg-stroke" x1="58" y1="2" x2="2" y2="58" strokeWidth="1.5" />
                        <circle className="svg-accent" cx="30" cy="30" r="10" strokeWidth="1.5" />
                      </>
                    )}
                    {index % 4 === 1 && (
                      <>
                        <rect className="svg-primary-fill" x="15" y="15" width="30" height="30" />
                        <circle className="svg-accent" cx="30" cy="30" r="8" />
                      </>
                    )}
                    {index % 4 === 2 && (
                      <>
                        <polygon className="svg-stroke" points="30,8 52,48 8,48" strokeWidth="2" />
                        <circle className="svg-accent" cx="30" cy="32" r="6" />
                      </>
                    )}
                    {index % 4 === 3 && (
                      <>
                        <circle className="svg-stroke" cx="30" cy="30" r="18" strokeWidth="2" strokeDasharray="4 4" />
                        <rect className="svg-accent" x="22" y="22" width="16" height="16" strokeWidth="1.5" />
                      </>
                    )}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Substack() {
  const [activeArticle, setActiveArticle] = useState(null);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setSubscribeEmail('');
  };

  // Draggable pile state
  const [positions, setPositions] = useState([]);
  const [activeDragId, setActiveDragId] = useState(null);
  const [maxZIndex, setMaxZIndex] = useState(12);

  const dragStart = useRef({ x: 0, y: 0 });
  const cardStartPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  const resetDesk = () => {
    const initialPositions = THUMBNAILS.slice(0, 12).map((thumb, index) => {
      const rotation = index % 3 === 0 ? -1.5 : index % 3 === 1 ? 2.0 : -1.0;
      // Staggered pile: slightly offset from center
      const xOffset = (index % 4) * 16 - 24;
      const yOffset = Math.floor(index / 3) * 16 - 32;
      return {
        id: thumb.id,
        x: xOffset,
        y: yOffset,
        rotation: rotation + (Math.random() * 1.0 - 0.5),
        zIndex: index + 1
      };
    });
    setPositions(initialPositions);
    setMaxZIndex(12);
  };

  useEffect(() => {
    resetDesk();
  }, []);

  useEffect(() => {
    if (activeDragId === null) return;

    const handleMouseMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const dx = clientX - dragStart.current.x;
      const dy = clientY - dragStart.current.y;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMoved.current = true;
      }

      setPositions(prev => prev.map(p => {
        if (p.id === activeDragId) {
          return {
            ...p,
            x: cardStartPos.current.x + dx,
            y: cardStartPos.current.y + dy
          };
        }
        return p;
      }));
    };

    const handleMouseUp = () => {
      setActiveDragId(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [activeDragId]);

  const handleDragStart = (e, id) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('a') !== null) {
      return;
    }
    const isTouch = e.type.startsWith('touch');
    if (!isTouch && e.button !== 0) return;

    // Bring to front
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    setPositions(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, zIndex: nextZ };
      }
      return p;
    }));

    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    dragStart.current = { x: clientX, y: clientY };
    
    const currentCard = positions.find(p => p.id === id);
    if (!currentCard) return;
    cardStartPos.current = { x: currentCard.x, y: currentCard.y };
    
    setActiveDragId(id);
    hasMoved.current = false;
  };

  if (activeArticle) {
    const titleText = activeArticle.title.split('//')[1].trim();
    
    // Direction 2: The Continuous Textual Scroll (Brutalist Newsprint)
    return (
      <main className="substack-page newsprint-page bg-cream">
        <div className="texture-overlay" />
        
        <button className="newsprint-back-btn" onClick={() => setActiveArticle(null)}>
          &larr; BACK TO JOURNAL
        </button>
        
        <div className="newsprint-master-container">
          {/* THE ENTRY FRAME (HERO) */}
          <header className="newsprint-hero">
            <div className="newsprint-hero-meta-row">
              <span>[ ESSAY {activeArticle.id + 1 < 10 ? `0${activeArticle.id + 1}` : activeArticle.id + 1} // {new Date().toLocaleDateString('en-US', {day:'2-digit', month:'2-digit'})} ]</span>
              <span>[ KITCHEN NOTE {(activeArticle.id % 4) + 1} // 12.04 ]</span>
            </div>
            <div className="newsprint-title-stack">
              <h1 className="newsprint-title-outline">{titleText}</h1>
              <h1 className="newsprint-title-solid">{titleText}</h1>
              <h1 className="newsprint-title-outline">{titleText}</h1>
            </div>
          </header>

          {/* THE READING BODY (THE CASCADING COLUMNS) */}
          <section className="newsprint-body">
            <div className="newsprint-row">
              <div className="newsprint-cols-narrative">
                <p className="newsprint-paragraph">{activeArticle.content}</p>
                <p className="newsprint-paragraph">Every Vantammayilu supper dinner represents a delicate collision of histories. The raw cedar tables, the hand-thrown ceramics, the low-frequency light—they are designed to orchestrate vulnerability. When bread is torn, we are forced to participate in a pre-verbal agreement of shared sustenance.</p>
              </div>
              <div className="newsprint-col-sidebar font-mono">
                <div className="sidebar-stamp">
                  [ REF // 24-HOUR MACERATION TIME ]
                  <span className="sidebar-stamp-sub">Narrating the fermentation cycle. Natural yeast cultivation logs, temperature constant at 18.4°C.</span>
                </div>
                <div className="sidebar-stamp">
                  [ OBS // ACCIDENTAL PROXIMITY ]
                  <span className="sidebar-stamp-sub">Seating configurations calculated via linear staggered spacing to foster intimate dialogue.</span>
                </div>
              </div>
            </div>

            <div className="newsprint-row">
              <div className="newsprint-cols-narrative">
                <p className="newsprint-paragraph">We examine how simple wooden planks supported on heavy trestles become monuments of human connection. The informal protocols that govern Vantammayilu dinners—never pouring your own glass of wine, waiting for all to be served before raising a fork—create an invisible architecture of mutual service.</p>
                <p className="newsprint-paragraph">By turning off our screens, we reclaim the dinner table as a sacred sanctuary. In a hyper-accelerated digital landscape, this slow, deliberate ritual of dining with strangers is a quiet, radical act of resistance.</p>
              </div>
              <div className="newsprint-col-sidebar font-mono">
                <div className="sidebar-stamp">
                  [ SPEC // RAW CEDAR 12% ]
                  <span className="sidebar-stamp-sub">Natural splits preserved along the central axis of the communal long table to acknowledge organic decay.</span>
                </div>
              </div>
            </div>
          </section>

          {/* THE MID-ARTICLE BREAK (100VH ORANGE SPLASH) */}
          <section className="newsprint-mid-break">
            <div className="break-quote-container">
              <span className="quote-icon">&ldquo;</span>
              <blockquote className="newsprint-blockquote">
                {activeArticle.snippet.toUpperCase()}
              </blockquote>
            </div>
          </section>

          {/* THE EXIT MODULE (4-BOX ARCHIVE SYSTEM) */}
          <footer className="newsprint-exit">
            <div className="exit-title-bar">
              4-LBOX TRACKING RELATED ARCHIVES
            </div>
            <div className="exit-grid">
              {Array.from({ length: 4 }).map((_, idx) => {
                const relatedId = (activeArticle.id + idx + 1) % THUMBNAILS.length;
                const relatedItem = THUMBNAILS[relatedId];
                return (
                  <div 
                    key={relatedId} 
                    className="exit-box"
                    onClick={() => {
                      setActiveArticle(relatedItem);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <span className="exit-box-no">NO. {relatedItem.id + 1 < 10 ? `0${relatedItem.id + 1}` : relatedItem.id + 1}</span>
                    <h4 className="exit-box-title">{relatedItem.title.split('//')[1].trim()}</h4>
                  </div>
                );
              })}
            </div>
          </footer>
        </div>
      </main>
    );
  }

  return (
    <main className="substack-page">
      <div className="texture-overlay" />
      <span className="margin-indicator left">[ JOURNAL // ARCHIVE ]</span>

      <RotaryWheel 
        onArticleSelect={setActiveArticle}
      />

      <section className="dossier-desk-section">
        <div className="dossier-desk-header-row">
          <div>
            <h2 className="dossier-desk-title">MAGAZINE INDEX</h2>
            <span className="dossier-desk-subtitle">[ DOSSIER DECK // STACKED EPHEMERA ]</span>
          </div>
          <button className="dossier-reset-btn" onClick={resetDesk}>
            RESET DESK
          </button>
        </div>
        
        <div className="dossier-desk-workspace">
          {positions.map((pos, index) => {
            const thumb = THUMBNAILS.find(t => t.id === pos.id);
            if (!thumb) return null;
            return (
              <DossierCard
                key={thumb.id}
                thumb={thumb}
                index={index}
                position={pos}
                onStartDrag={handleDragStart}
                onClick={setActiveArticle}
                hasMoved={hasMoved}
                isHovered={hoveredCardId === thumb.id}
                onMouseEnter={() => setHoveredCardId(thumb.id)}
                onMouseLeave={() => setHoveredCardId(null)}
              />
            );
          })}
        </div>
      </section>

      {/* SECTION 7: THE INBOX BRIDGE */}
      <section className="section-7-inbox relative bg-cream py-32 px-6 md:px-12 border-t-4 border-[#002fa7] overflow-hidden flex flex-col items-center justify-center">
        <div className="relative w-full max-w-6xl mx-auto py-24 flex items-center justify-center min-h-[450px]">
          {/* Giant Wordmark outline */}
          <div className="w-full overflow-hidden text-center pointer-events-none select-none opacity-20">
            <h2 className="font-serif text-[11vw] font-black uppercase tracking-widest leading-none text-transparent stroke-text">
              VANTAMMAYILU
            </h2>
          </div>

          {/* Subscription Layer Card */}
          <div className="absolute w-full max-w-md px-4 z-10 overlapping-footer-card">
            <div className="bg-cream border-4 border-[#002fa7] p-8 shadow-[12px_12px_0px_0px_#002fa7]">
              <h4 className="font-serif text-2xl font-black text-[#002fa7] uppercase mb-2">
                Letters from the kitchen counter
              </h4>
              <p className="font-mono text-xs text-[#002fa7] mb-6 leading-relaxed">
                Receive notes from the tables, curated scrapbook recipes, and early alerts for upcoming gatherings. Never transaction, always story.
              </p>
              
              <form onSubmit={handleSubscribe} className="space-y-4">
                {subscribed ? (
                  <div className="border-2 border-[#002fa7] p-4 text-center bg-[#e45a0b] text-[#efe9e1] font-mono text-xs font-bold uppercase tracking-wider">
                    [ WELCOME TO THE TABLE. CHECK YOUR INBOX. ]
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <input 
                        type="email" 
                        required
                        placeholder="yourname@email.com"
                        value={subscribeEmail}
                        onChange={(e) => setSubscribeEmail(e.target.value)}
                        className="w-full font-mono text-xs md:text-sm text-[#002fa7] placeholder-[#002fa7]/50 bg-transparent border-2 border-[#002fa7] px-4 py-3 outline-none focus:bg-[#002fa7]/5 transition-colors"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="w-full block text-center font-mono text-xs md:text-sm font-bold uppercase bg-[#e45a0b] text-[#efe9e1] py-4 shadow-[8px_8px_0px_0px_#002fa7] hover:translate-x-2 hover:translate-y-2 hover:shadow-[0px_0px_0px_0px_#002fa7] hover:text-[#002fa7] transition-all duration-150 cursor-pointer translate-x-0 translate-y-0"
                    >
                      GRAB AN INVITE VIA SUBSTACK
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
