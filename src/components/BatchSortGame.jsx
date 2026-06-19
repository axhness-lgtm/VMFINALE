import React, { useState, useEffect, useRef } from 'react';
import './BatchSortGame.css';

// ─── MINIMALIST VECTOR ICONS FOR 12 FOOD ITEMS ──────────────────────────────
const FoodIcon = ({ type }) => {
  const strokeColor = "#002fa7";
  const strokeWidth = "2.5";

  switch (type) {
    case 'biryani':
      return (
        <svg viewBox="0 0 100 100" className="food-svg-icon" fill="none">
          <path d="M 22 55 L 78 55 A 4 4 0 0 1 82 59 L 80 78 A 8 8 0 0 1 72 86 L 28 86 A 8 8 0 0 1 20 78 L 18 59 A 4 4 0 0 1 22 55 Z" stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M 14 55 L 86 55" stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M 30 55 C 30 35, 70 35, 70 55" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="50" cy="35" r="4" fill={strokeColor} />
          <line x1="38" y1="70" x2="62" y2="70" stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      );
    case 'naan':
      return (
        <svg viewBox="0 0 100 100" className="food-svg-icon" fill="none">
          <ellipse cx="50" cy="50" rx="35" ry="25" stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M 30 45 Q 40 40 50 45 T 70 45" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray="3 3" />
          <path d="M 35 55 Q 50 50 65 55" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray="4 2" />
          <circle cx="40" cy="48" r="2" fill={strokeColor} />
          <circle cx="58" cy="42" r="2" fill={strokeColor} />
          <circle cx="48" cy="56" r="2" fill={strokeColor} />
        </svg>
      );
    case 'butter_chicken':
      return (
        <svg viewBox="0 0 100 100" className="food-svg-icon" fill="none">
          <ellipse cx="50" cy="65" rx="38" ry="14" stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M 12 65 Q 12 35 50 28 Q 88 35 88 65" stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M 35 50 Q 50 40 65 50" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="32" cy="58" r="3" fill={strokeColor} />
          <circle cx="68" cy="58" r="3" fill={strokeColor} />
          <circle cx="50" cy="52" r="4" fill={strokeColor} />
        </svg>
      );
    case 'ice_cream':
      return (
        <svg viewBox="0 0 100 100" className="food-svg-icon" fill="none">
          <polygon points="50,90 32,50 68,50" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="50" cy="40" r="18" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="38" cy="45" r="12" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="62" cy="45" r="12" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="32" y1="50" x2="68" y2="50" stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      );
    case 'gulab_jamun':
      return (
        <svg viewBox="0 0 100 100" className="food-svg-icon" fill="none">
          <ellipse cx="50" cy="70" rx="36" ry="12" stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M 14 70 Q 14 42 50 38 Q 86 42 86 70" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="38" cy="58" r="10" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="62" cy="58" r="10" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="50" cy="48" r="10" stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      );
    case 'kulfi':
      return (
        <svg viewBox="0 0 100 100" className="food-svg-icon" fill="none">
          <rect x="36" y="20" width="28" height="50" rx="14" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="50" y1="70" x2="50" y2="90" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="42" y1="40" x2="58" y2="40" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="42" y1="52" x2="58" y2="52" stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      );
    case 'cocktail':
      return (
        <svg viewBox="0 0 100 100" className="food-svg-icon" fill="none">
          <polygon points="18,20 82,20 50,60" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="50" y1="60" x2="50" y2="85" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="28" y1="85" x2="72" y2="85" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="45" cy="38" r="4" fill={strokeColor} />
          <line x1="45" y1="38" x2="68" y2="14" stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    case 'mango_lassi':
      return (
        <svg viewBox="0 0 100 100" className="food-svg-icon" fill="none">
          <path d="M 28 20 L 34 80 Q 36 86 42 86 L 58 86 Q 64 86 66 80 L 72 20 Z" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="28" y1="28" x2="72" y2="28" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="42" y1="86" x2="30" y2="10" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="58" cy="45" r="5" fill={strokeColor} />
        </svg>
      );
    case 'mojito':
      return (
        <svg viewBox="0 0 100 100" className="food-svg-icon" fill="none">
          <path d="M 30 20 L 35 80 A 4 4 0 0 0 39 84 L 61 84 A 4 4 0 0 0 65 80 L 70 20 Z" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="42" cy="36" r="4" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="58" cy="48" r="4" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="48" cy="62" r="5" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="38" y1="20" x2="52" y2="12" stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      );
    case 'samosa':
      return (
        <svg viewBox="0 0 100 100" className="food-svg-icon" fill="none">
          <polygon points="50,18 15,82 85,82" stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M 40 50 Q 50 40 60 50" stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M 30 70 Q 50 62 70 70" stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      );
    case 'spring_rolls':
      return (
        <svg viewBox="0 0 100 100" className="food-svg-icon" fill="none">
          <rect x="20" y="32" width="60" height="15" rx="4" transform="rotate(-15 50 40)" stroke={strokeColor} strokeWidth={strokeWidth} />
          <rect x="20" y="55" width="60" height="15" rx="4" transform="rotate(-15 50 62)" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="35" y1="36" x2="35" y2="44" stroke={strokeColor} strokeWidth="1.5" />
          <line x1="65" y1="28" x2="65" y2="36" stroke={strokeColor} strokeWidth="1.5" />
          <line x1="35" y1="59" x2="35" y2="67" stroke={strokeColor} strokeWidth="1.5" />
          <line x1="65" y1="51" x2="65" y2="59" stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    case 'paneer_tikka':
      return (
        <svg viewBox="0 0 100 100" className="food-svg-icon" fill="none">
          <line x1="15" y1="85" x2="85" y2="15" stroke={strokeColor} strokeWidth={strokeWidth} />
          <rect x="30" y="54" width="16" height="16" transform="rotate(45 38 62)" stroke={strokeColor} strokeWidth={strokeWidth} fill="#efe9e1" />
          <rect x="46" y="38" width="16" height="16" transform="rotate(45 54 46)" stroke={strokeColor} strokeWidth={strokeWidth} fill="#efe9e1" />
          <rect x="62" y="22" width="16" height="16" transform="rotate(45 70 30)" stroke={strokeColor} strokeWidth={strokeWidth} fill="#efe9e1" />
        </svg>
      );
    default:
      return null;
  }
};

const ALL_GAME_ITEMS = [
  { id: 'item_01', name: 'SAMOSA', category: 'STARTERS', iconType: 'samosa' },
  { id: 'item_02', name: 'SPRING ROLLS', category: 'STARTERS', iconType: 'spring_rolls' },
  { id: 'item_03', name: 'PANEER TIKKA', category: 'STARTERS', iconType: 'paneer_tikka' },
  { id: 'item_04', name: 'BIRYANI', category: 'MAIN_COURSE', iconType: 'biryani' },
  { id: 'item_05', name: 'BUTTER CHICKEN', category: 'MAIN_COURSE', iconType: 'butter_chicken' },
  { id: 'item_06', name: 'GARLIC NAAN', category: 'MAIN_COURSE', iconType: 'naan' },
  { id: 'item_07', name: 'COCKTAIL GLASS', category: 'DRINKS', iconType: 'cocktail' },
  { id: 'item_08', name: 'MANGO LASSI', category: 'DRINKS', iconType: 'mango_lassi' },
  { id: 'item_09', name: 'MINT MOJITO', category: 'DRINKS', iconType: 'mojito' },
  { id: 'item_10', name: 'ICE CREAM', category: 'DESSERT', iconType: 'ice_cream' },
  { id: 'item_11', name: 'GULAB JAMUN', category: 'DESSERT', iconType: 'gulab_jamun' },
  { id: 'item_12', name: 'KULFI', category: 'DESSERT', iconType: 'kulfi' }
];

const BINS_DATA = [
  { index: 0, label: 'MAIN_COURSE', cx: 450, cy: 430 },
  { index: 1, label: 'DESSERT', cx: 570, cy: 370 },
  { index: 2, label: 'DRINKS', cx: 690, cy: 310 },
  { index: 3, label: 'STARTERS', cx: 810, cy: 250 }
];

// Conveyor Belt coordinates
const BELT_START_X = 20;
const BELT_START_Y = 110;
const BELT_END_X = 530;
const BELT_END_Y = 365;

const BatchSortGame = () => {
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'playing' | 'complete'
  const [activePackets, setActivePackets] = useState([]);
  const [spawnQueue, setSpawnQueue] = useState([]);
  const [processedItems, setProcessedItems] = useState([]);
  const [errorCount, setErrorCount] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  
  // Drag engine state
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [grabberPos, setGrabberPos] = useState({ x: 420, y: 150 });
  const [isHoveredId, setIsHoveredId] = useState(null);

  // Interface animation triggers
  const [activeBinPulse, setActiveBinPulse] = useState(null); // index
  const [screenFlash, setScreenFlash] = useState(null); // 'orange'
  
  // Tag feedback sprout details
  const [feedbackTag, setFeedbackTag] = useState({ visible: false, text: '', x: 0, y: 0, color: 'blue' });

  // Sidebar controls
  const [activeTab, setActiveTab] = useState('logs'); // 'close' | 'tools' | 'logs' | 'charts' | 'settings'
  const [ribbonToggles, setRibbonToggles] = useState({
    ribbon1: true,
    toggles: true,
    toggle: false,
    ribbon2: true
  });

  // Mismatch trajectory state
  const [mismatchedPacket, setMismatchedPacket] = useState(null);

  const svgRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Initialize and start game
  const startGame = () => {
    // Shuffle the items
    const shuffled = [...ALL_GAME_ITEMS].sort(() => Math.random() - 0.5);
    setSpawnQueue(shuffled.slice(1));
    const firstItem = {
      ...shuffled[0],
      progress: 0,
      x: BELT_START_X,
      y: BELT_START_Y,
      isGrabbed: false
    };
    setActivePackets([firstItem]);
    setProcessedItems([]);
    setErrorCount(0);
    setProcessedCount(0);
    setMismatchedPacket(null);
    setGameState('playing');
    setFeedbackTag({ visible: false, text: '', x: 0, y: 0, color: 'blue' });
  };

  const getSVGCoords = (e) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    if (clientX === undefined || clientY === undefined) return null;
    
    const x = ((clientX - rect.left) / rect.width) * 1000;
    const y = ((clientY - rect.top) / rect.height) * 500;
    return { x, y };
  };

  const handlePointerDown = (itemId, e) => {
    if (gameState !== 'playing') return;
    e.preventDefault();
    const coords = getSVGCoords(e);
    if (!coords) return;
    
    setDraggedItemId(itemId);
    setGrabberPos(coords);
    setActivePackets(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, isGrabbed: true, x: coords.x, y: coords.y };
      }
      return item;
    }));
  };

  const handlePointerMove = (e) => {
    if (gameState !== 'playing') return;
    const coords = getSVGCoords(e);
    if (!coords) return;

    setGrabberPos(coords);

    if (draggedItemId) {
      setActivePackets(prev => prev.map(item => {
        if (item.id === draggedItemId) {
          return { ...item, x: coords.x, y: coords.y };
        }
        return item;
      }));
    }
  };

  const handlePointerUp = () => {
    if (gameState !== 'playing' || !draggedItemId) return;

    const item = activePackets.find(p => p.id === draggedItemId);
    if (!item) {
      setDraggedItemId(null);
      return;
    }

    let matchedBin = null;
    BINS_DATA.forEach(bin => {
      const dist = Math.sqrt((item.x - bin.cx) ** 2 + (item.y - bin.cy) ** 2);
      if (dist < 90) {
        matchedBin = bin;
      }
    });

    if (matchedBin) {
      const isCorrect = item.category === matchedBin.label;

      if (isCorrect) {
        // Success mechanics
        setActiveBinPulse(matchedBin.index);
        setTimeout(() => setActiveBinPulse(null), 800);

        setFeedbackTag({
          visible: true,
          text: '[ SYSTEM_VERIFIED ]',
          x: matchedBin.cx,
          y: matchedBin.cy - 70,
          color: 'blue'
        });

        setProcessedItems(prev => [
          {
            ...item,
            binLabel: matchedBin.label,
            status: 'verified'
          },
          ...prev
        ]);
        setProcessedCount(prev => prev + 1);
        setActivePackets(prev => prev.filter(p => p.id !== draggedItemId));
      } else {
        // Mismatch mechanics
        setScreenFlash('orange');
        setTimeout(() => setScreenFlash(null), 400);

        // Spawn a mismatched floating item block visually sitting on the floor
        const targetFloorX = item.x - 70;
        const targetFloorY = item.y + 60;
        setMismatchedPacket({
          ...item,
          startX: item.x,
          startY: item.y,
          x: targetFloorX,
          y: targetFloorY
        });

        setFeedbackTag({
          visible: true,
          text: '[ DATA_MISMATCH ]',
          x: targetFloorX,
          y: targetFloorY + 20,
          color: 'orange'
        });

        setProcessedItems(prev => [
          {
            ...item,
            binLabel: matchedBin.label,
            status: 'mismatch'
          },
          ...prev
        ]);
        setErrorCount(prev => prev + 1);

        // Recycle item to belt start
        setActivePackets(prev => prev.map(p => {
          if (p.id === draggedItemId) {
            return {
              ...p,
              isGrabbed: false,
              progress: 0,
              x: BELT_START_X,
              y: BELT_START_Y
            };
          }
          return p;
        }));

        // Clear mismatched item highlight after 1.5s
        setTimeout(() => {
          setMismatchedPacket(null);
        }, 1500);
      }
    } else {
      // Release drop back on belt
      setActivePackets(prev => prev.map(p => {
        if (p.id === draggedItemId) {
          const bx = BELT_START_X + (BELT_END_X - BELT_START_X) * p.progress / 100;
          const by = BELT_START_Y + (BELT_END_Y - BELT_START_Y) * p.progress / 100;
          return {
            ...p,
            isGrabbed: false,
            x: bx,
            y: by
          };
        }
        return p;
      }));
    }

    setDraggedItemId(null);
  };

  // Main animation frame loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const tick = () => {
      setActivePackets(prev => {
        let updated = prev.map(item => {
          if (item.isGrabbed) return item;
          
          const nextProgress = item.progress + 0.12;
          
          if (nextProgress >= 100) {
            // Drop-off error
            setScreenFlash('orange');
            setTimeout(() => setScreenFlash(null), 400);

            // Mismatch packet dropped to ground at end of belt
            const targetFloorX = BELT_END_X - 60;
            const targetFloorY = BELT_END_Y + 40;
            setMismatchedPacket({
              ...item,
              startX: BELT_END_X,
              startY: BELT_END_Y,
              x: targetFloorX,
              y: targetFloorY
            });

            setFeedbackTag({
              visible: true,
              text: '[ DATA_MISMATCH ]',
              x: targetFloorX,
              y: targetFloorY + 20,
              color: 'orange'
            });

            setErrorCount(ec => ec + 1);
            setProcessedItems(p => [
              {
                ...item,
                binLabel: 'BELT_END',
                status: 'mismatch'
              },
              ...p
            ]);

            setTimeout(() => setMismatchedPacket(null), 1500);

            return {
              ...item,
              progress: 0,
              x: BELT_START_X,
              y: BELT_START_Y
            };
          }

          const x = BELT_START_X + (BELT_END_X - BELT_START_X) * nextProgress / 100;
          const y = BELT_START_Y + (BELT_END_Y - BELT_START_Y) * nextProgress / 100;

          return { ...item, progress: nextProgress, x, y };
        });

        return updated;
      });

      // Spawn next from queue
      setSpawnQueue(queue => {
        if (queue.length === 0) return queue;

        setActivePackets(packets => {
          const canSpawn = packets.length === 0 || packets.every(p => p.progress > 28 || p.isGrabbed);
          if (canSpawn) {
            const nextItem = {
              ...queue[0],
              progress: 0,
              x: BELT_START_X,
              y: BELT_START_Y,
              isGrabbed: false
            };
            setTimeout(() => {
              setActivePackets(prev => {
                if (prev.some(p => p.id === nextItem.id)) return prev;
                return [...prev, nextItem];
              });
            }, 50);
            return queue.slice(1);
          }
          return queue;
        });

        return queue;
      });

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [gameState]);

  // Win condition check
  useEffect(() => {
    if (gameState === 'playing' && processedCount === 12 && activePackets.length === 0) {
      setGameState('complete');
    }
  }, [processedCount, activePackets, gameState]);

  useEffect(() => {
    if (feedbackTag.visible) {
      const t = setTimeout(() => {
        setFeedbackTag(prev => ({ ...prev, visible: false }));
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [feedbackTag.visible]);

  const accuracyPercent = processedCount + errorCount > 0 
    ? Math.round((processedCount / (processedCount + errorCount)) * 100) 
    : 100;

  return (
    <section className={`batch-sort-ledger-run-section ${screenFlash ? 'flash-' + screenFlash : ''}`}>
      
      {/* SECTION HEADER */}
      <div className="game-section-header">
        <span className="game-mono-prefix">[ MINI_GAME // BATCH_CALIBRATION ]</span>
        <h2 className="game-section-title">BATCH SORT LEDGER-RUN</h2>
        <p className="game-section-desc">Drag food packets into their correct bins to calibrate the supper club registry.</p>
      </div>

      <div className="game-layout-split max-w-screen-xl mx-auto">
        
        {/* LEFT COLUMN: ISOMETRIC BLUEPRINT SVG BOARD */}
        <div className="game-canvas-container">
          
          <div className="canvas-grid-blueprint" />
          
          <svg
            ref={svgRef}
            viewBox="0 0 1000 500"
            className="game-blueprint-svg"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <defs>
              {/* Conveyor Belt Diagonal Stripes Pattern */}
              <pattern id="conveyor-stripes" width="20" height="20" patternUnits="userSpaceOnUse">
                <line x1="0" y1="20" x2="20" y2="0" stroke="#002fa7" strokeWidth="6" opacity="0.15" />
              </pattern>
            </defs>

            {/* Decorative Blueprint coordinate axis markings */}
            <g className="blueprint-axis-markers" opacity="0.3" stroke="#002fa7" strokeWidth="0.5" style={{ shapeRendering: 'crispEdges' }}>
              <line x1="100" y1="40" x2="900" y2="40" />
              <line x1="100" y1="40" x2="100" y2="45" />
              <line x1="200" y1="40" x2="200" y2="45" />
              <line x1="300" y1="40" x2="300" y2="45" />
              <line x1="400" y1="40" x2="400" y2="45" />
              <line x1="500" y1="40" x2="500" y2="45" />
              <line x1="600" y1="40" x2="600" y2="45" />
              <line x1="700" y1="40" x2="700" y2="45" />
              <line x1="800" y1="40" x2="800" y2="45" />
              <line x1="900" y1="40" x2="900" y2="45" />
            </g>

            {/* Scattered asterisks/compass markings from image */}
            <g className="blueprint-compass-marks" stroke="#002fa7" strokeWidth="0.8" opacity="0.4" fill="none" style={{ shapeRendering: 'crispEdges' }}>
              {/* Starburst top middle */}
              <path d="M 350,150 L 350,170 M 340,160 L 360,160 M 343,153 L 357,167 M 343,167 L 357,153" />
              {/* Starburst center right */}
              <path d="M 500,280 L 500,300 M 490,290 L 510,290 M 493,283 L 507,297 M 493,297 L 507,283" />
              {/* Starburst bottom right */}
              <path d="M 680,420 L 680,440 M 670,430 L 690,430 M 673,423 L 687,437 M 673,437 L 687,423" />
              {/* Starburst left middle */}
              <path d="M 160,280 L 160,300 M 150,290 L 170,290 M 153,283 L 167,297 M 153,297 L 167,283" />
            </g>

            {/* Conveyor Belt group */}
            <g className="conveyor-belt-group" style={{ shapeRendering: 'crispEdges' }}>
              <polygon points="10,123 530,383 540,363 20,103" fill="#002fa7" opacity="0.15" />
              {/* The main belt tracking */}
              <polygon points="20,125 530,380 540,365 30,110" fill="#efe9e1" stroke="#002fa7" strokeWidth="3" />
              <polygon points="20,125 530,380 540,365 30,110" fill="url(#conveyor-stripes)" />
              
              {/* Roller wheels */}
              {Array.from({ length: 12 }).map((_, idx) => {
                const ratio = idx / 11;
                const rx = Math.round(BELT_START_X + (BELT_END_X - BELT_START_X) * ratio);
                const ry = Math.round(BELT_START_Y + (BELT_END_Y - BELT_START_Y) * ratio + 15);
                return (
                  <circle key={`roller-${idx}`} cx={rx} cy={ry} r="5" stroke="#002fa7" strokeWidth="2.5" fill="#efe9e1" />
                );
              })}
            </g>

            {/* Concrete Bins */}
            {BINS_DATA.map((bin) => {
              const isPulsing = activeBinPulse === bin.index;
              const bx = bin.cx;
              const by = bin.cy;
              return (
                <g key={`bin-${bin.index}`} className={`brutalist-bin ${isPulsing ? 'pulse-verified' : ''}`} style={{ shapeRendering: 'crispEdges' }}>
                  {/* Heavy concrete base drop shadow */}
                  <polygon points={`${bx - 55},${by + 5} ${bx + 5},${by - 25} ${bx + 55},${by + 5} ${bx - 55},${by + 35}`} fill="rgba(0, 47, 167, 0.15)" />

                  {/* Left concrete face */}
                  <polygon points={`${bx - 50},${by} ${bx},${by + 25} ${bx},${by + 95} ${bx - 50},${by + 70}`} fill="#cdc7be" stroke="#002fa7" strokeWidth="3" />
                  
                  {/* Right concrete face */}
                  <polygon points={`${bx},${by + 25} ${bx + 50},${by} ${bx + 50},${by + 70} ${bx},${by + 95}`} fill="#e4dfd7" stroke="#002fa7" strokeWidth="3" />
                  
                  {/* Concrete block top rim */}
                  <polygon points={`${bx},${by - 25} ${bx + 50},${by} ${bx},${by + 25} ${bx - 50},${by}`} fill="#efe9e1" stroke="#002fa7" strokeWidth="3" />
                  
                  {/* Hollow inside container viewport */}
                  <polygon points={`${bx},${by - 15} ${bx + 35},${by} ${bx},${by + 15} ${bx - 35},${by}`} fill="#050518" stroke="#002fa7" strokeWidth="2" />

                  {/* Text embossed skewed label */}
                  <text
                    x="-18"
                    y="56"
                    transform={`translate(${bx}, ${by}) skewY(26.5)`}
                    className="bin-face-label"
                  >
                    [ {bin.label} ]
                  </text>
                </g>
              );
            })}

            {/* Conveyor Belt Items */}
            {activePackets.map((item) => {
              const isDragged = item.id === draggedItemId;
              const isHovered = isHoveredId === item.id;
              const px = Math.round(item.x);
              const py = Math.round(item.y);
              return (
                <g
                  key={item.id}
                  className={`food-packet ${isDragged ? 'is-dragged' : ''} ${isHovered ? 'is-hovered' : ''}`}
                  onPointerDown={(e) => handlePointerDown(item.id, e)}
                  onMouseEnter={() => setIsHoveredId(item.id)}
                  onMouseLeave={() => setIsHoveredId(null)}
                  style={{ cursor: draggedItemId ? 'grabbing' : 'grab' }}
                >
                  {(isDragged || isHovered) && (
                    <polygon
                      points={`${px - 35},${py + 25} ${px + 5},${py + 5} ${px + 35},${py + 25} ${px - 5},${py + 45}`}
                      fill="rgba(228, 90, 11, 0.2)"
                    />
                  )}

                  <g transform={isDragged || isHovered ? "translate(0, -15)" : "translate(0, 0)"} style={{ transition: 'transform 0.15s ease' }}>
                    <polygon points={`${px - 30},${py} ${px},${py + 15} ${px},${py + 25} ${px - 30},${py + 10}`} fill="#cdc7be" stroke={isDragged ? "#e86321" : "#002fa7"} strokeWidth="2" />
                    <polygon points={`${px},${py + 15} ${px + 30},${py} ${px + 30},${py + 10} ${px},${py + 25}`} fill="#e4dfd7" stroke={isDragged ? "#e86321" : "#002fa7"} strokeWidth="2" />
                    <polygon points={`${px},${py - 15} ${px + 30},${py} ${px},${py + 15} ${px - 30},${py}`} fill={isDragged ? "#e86321" : "#efe9e1"} stroke={isDragged ? "#e86321" : "#002fa7"} strokeWidth="2" />

                    <g transform={`translate(${px}, ${py - 1}) scale(0.48, 0.28) rotate(-45)`} className={isDragged ? 'icon-dragged-active' : ''}>
                      <FoodIcon type={item.iconType} />
                    </g>
                  </g>
                </g>
              );
            })}

            {/* Drag Mechanical Grabber Claw */}
            {draggedItemId && (
              <g className="grabber-claw-group" style={{ pointerEvents: 'none', shapeRendering: 'crispEdges' }}>
                <line x1={Math.round(grabberPos.x)} y1="0" x2={Math.round(grabberPos.x)} y2={Math.round(grabberPos.y - 35)} stroke="#002fa7" strokeWidth="2" strokeDasharray="4 2" />
                <rect x={Math.round(grabberPos.x - 8)} y={Math.round(grabberPos.y - 45)} width="16" height="12" rx="1" fill="#efe9e1" stroke="#002fa7" strokeWidth="2" />
                <circle cx={Math.round(grabberPos.x)} cy={Math.round(grabberPos.y - 39)} r="3" fill="#e86321" />
                <path d={`M ${Math.round(grabberPos.x - 6)} ${Math.round(grabberPos.y - 35)} Q ${Math.round(grabberPos.x - 18)} ${Math.round(grabberPos.y - 25)} ${Math.round(grabberPos.x - 12)} ${Math.round(grabberPos.y - 12)}`} fill="none" stroke="#002fa7" strokeWidth="2.5" strokeLinecap="round" />
                <path d={`M ${Math.round(grabberPos.x + 6)} ${Math.round(grabberPos.y - 35)} Q ${Math.round(grabberPos.x + 18)} ${Math.round(grabberPos.y - 25)} ${Math.round(grabberPos.x + 12)} ${Math.round(grabberPos.y - 12)}`} fill="none" stroke="#002fa7" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            )}

            {/* Mismatched Packet Rejected Flow Animation */}
            {mismatchedPacket && (
              <g className="mismatched-rejection-flow" style={{ shapeRendering: 'crispEdges' }}>
                {/* Orange trajectory line */}
                <path
                  d={`M ${Math.round(mismatchedPacket.startX)} ${Math.round(mismatchedPacket.startY)} Q ${Math.round((mismatchedPacket.startX + mismatchedPacket.x) / 2)} ${Math.round(mismatchedPacket.startY - 30)} ${Math.round(mismatchedPacket.x)} ${Math.round(mismatchedPacket.y)}`}
                  fill="none"
                  stroke="#e86321"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  className="rejection-trajectory-line"
                />
                
                {/* Orange Red X above rejected item */}
                <g transform={`translate(${Math.round(mismatchedPacket.x)}, ${Math.round(mismatchedPacket.y - 35)})`} stroke="#e86321" strokeWidth="3" strokeLinecap="round">
                  <line x1="-8" y1="-8" x2="8" y2="8" />
                  <line x1="8" y1="-8" x2="-8" y2="8" />
                </g>

                {/* Packet falling on floor */}
                <g transform={`translate(${Math.round(mismatchedPacket.x)}, ${Math.round(mismatchedPacket.y)})`}>
                  <polygon points="-30,0 0,15 0,25 -30,10" fill="#cdc7be" stroke="#e86321" strokeWidth="2" />
                  <polygon points="0,15 30,0 30,10 0,25" fill="#e4dfd7" stroke="#e86321" strokeWidth="2" />
                  <polygon points="0,-15 30,0 0,15 -30,0" fill="#efe9e1" stroke="#e86321" strokeWidth="2" />
                  <g transform="translate(0, -1) scale(0.48, 0.28) rotate(-45)">
                    <FoodIcon type={mismatchedPacket.iconType} />
                  </g>
                </g>
              </g>
            )}

            {/* Dynamic Sprout Feedback Tags (Verified / Mismatch) */}
            {feedbackTag.visible && (
              <g transform={`translate(${Math.round(feedbackTag.x)}, ${Math.round(feedbackTag.y)})`} className={`sprout-animation-${feedbackTag.color}`} style={{ pointerEvents: 'none', shapeRendering: 'crispEdges' }}>
                {/* Thin geometric wireframe structure connecting sprout to target */}
                <path d="M 0,0 L 0,-30 L -15,-40 L 15,-40 Z" fill="none" stroke={feedbackTag.color === 'orange' ? '#e86321' : '#002fa7'} strokeWidth="1" />
                <line x1="0" y1="-40" x2="0" y2="-60" stroke={feedbackTag.color === 'orange' ? '#e86321' : '#002fa7'} strokeWidth="2" />
                
                <g transform="translate(0, -60) rotate(-15)">
                  <rect x="-85" y="-14" width="170" height="28" fill="#efe9e1" stroke={feedbackTag.color === 'orange' ? '#e86321' : '#002fa7'} strokeWidth="2.5" />
                  <text x="0" y="4" className={`feedback-tag-text font-mono text-center fill-${feedbackTag.color}`} textAnchor="middle">
                    {feedbackTag.text}
                  </text>
                </g>
              </g>
            )}
          </svg>

          {/* Start Screen Game Overlay */}
          {gameState === 'idle' && (
            <div className="canvas-idle-overlay">
              <div className="idle-card">
                <div className="blink-cursor-block" />
                <h3 className="idle-title">CALIBRATE REGISTRY SYSTEM</h3>
                <p className="idle-desc">Unlatch the data sorting interface. Categorize all 12 dish packets to secure the seating log manifest.</p>
                <button className="game-start-btn" onClick={startGame}>
                  [ INITIALIZE LEDGER-RUN ]
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DETAILED HUD LEDGER SIDEBAR */}
        <div className="game-ledger-sidebar-wrapper">
          
          {/* Vertical icon control tab strip on the left */}
          <div className="sidebar-tab-strip">
            <button className={`tab-strip-btn ${activeTab === 'close' ? 'active' : ''}`} onClick={() => setActiveTab('close')}>
              <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/></svg>
            </button>
            <button className={`tab-strip-btn ${activeTab === 'tools' ? 'active' : ''}`} onClick={() => setActiveTab('tools')}>
              <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.3C.5 6.7.9 9.8 2.9 11.8c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.4-2.4c.4-.4.4-1 0-1.4z" fill="currentColor"/></svg>
            </button>
            <button className={`tab-strip-btn ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>
              <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/></svg>
            </button>
            <button className={`tab-strip-btn ${activeTab === 'charts' ? 'active' : ''}`} onClick={() => setActiveTab('charts')}>
              <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="currentColor"/></svg>
            </button>
            <button className={`tab-strip-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor"/></svg>
            </button>
          </div>

          {/* Main ledger widgets column */}
          <div className="sidebar-main-column">
            
            <div className="ledger-hud-header">
              <span className="ledger-hud-title">[ DATA_LEDGER // SYS_LOG ]</span>
            </div>

            <div className="ledger-overall-counters font-mono">
              [ ITEMS_PROCESSED: {processedCount} // ERRORS: {errorCount} ]
            </div>

            {/* Custom interactive dashboard toggles */}
            <div className="ledger-toggles-section">
              <label className="toggle-row">
                <span className="toggle-label font-mono">DATA_RIBBON</span>
                <input
                  type="checkbox"
                  checked={ribbonToggles.ribbon1}
                  onChange={(e) => setRibbonToggles({ ...ribbonToggles, ribbon1: e.target.checked })}
                  className="hud-toggle-input"
                />
                <span className="toggle-slider"></span>
              </label>
              <label className="toggle-row">
                <span className="toggle-label font-mono">DATA_TOGGLES</span>
                <input
                  type="checkbox"
                  checked={ribbonToggles.toggles}
                  onChange={(e) => setRibbonToggles({ ...ribbonToggles, toggles: e.target.checked })}
                  className="hud-toggle-input"
                />
                <span className="toggle-slider"></span>
              </label>
              <label className="toggle-row">
                <span className="toggle-label font-mono">DATA_TOGGLE</span>
                <input
                  type="checkbox"
                  checked={ribbonToggles.toggle}
                  onChange={(e) => setRibbonToggles({ ...ribbonToggles, toggle: e.target.checked })}
                  className="hud-toggle-input"
                />
                <span className="toggle-slider"></span>
              </label>
              <label className="toggle-row">
                <span className="toggle-label font-mono">DATA_RIBBON</span>
                <input
                  type="checkbox"
                  checked={ribbonToggles.ribbon2}
                  onChange={(e) => setRibbonToggles({ ...ribbonToggles, ribbon2: e.target.checked })}
                  className="hud-toggle-input"
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {/* Logs events stream matching layout */}
            <div className="ledger-event-log-container">
              <div className="event-log-title">[ CALIBRATION_STREAM_LOG ]</div>
              <div className="event-log-list">
                {processedItems.length === 0 ? (
                  <div className="empty-log-msg">&gt;_ Awaiting packet inputs...</div>
                ) : (
                  processedItems.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className={`event-log-row status-${item.status}`}>
                      <div className="log-icon-mini">
                        <FoodIcon type={item.iconType} />
                      </div>
                      <span className="log-item-name">{item.name}</span>
                      <span className="log-item-category">[{item.category.slice(0, 5)}]</span>
                      <span className="log-status-badge">
                        {item.status === 'verified' ? '✓' : '✗'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Static manifest card layout matching image */}
            <div className="sidebar-manifest-card font-mono">
              <div className="manifest-header-bar">
                <span>[ DATA_LEDGER ]</span>
                <span>-</span>
              </div>
              <div className="manifest-body-print">
                <div className="manifest-print-title">manifest</div>
                
                <div className="print-sec-header">ACCURACY</div>
                <div className="print-row">
                  <span>ITEMS_PROCESSED:</span>
                  <span className="val">12 //</span>
                </div>
                <div className="print-row">
                  <span>ERRORS:</span>
                  <span className="val">{accuracyPercent}%</span>
                </div>

                <div className="print-sec-header">SESSION</div>
                <div className="print-row">
                  <span>[ MAIN_COURSE ]</span>
                  <span className="val">{processedItems.filter(i => i.category === 'MAIN_COURSE').length}</span>
                </div>
                <div className="print-row">
                  <span>[ DESSERT ]</span>
                  <span className="val">{processedItems.filter(i => i.category === 'DESSERT').length}</span>
                </div>
                <div className="print-row">
                  <span>[ DRINKS ]</span>
                  <span className="val">{processedItems.filter(i => i.category === 'DRINKS').length}</span>
                </div>
                <div className="print-row">
                  <span>[ STARTERS ]</span>
                  <span className="val">{processedItems.filter(i => i.category === 'STARTERS').length}</span>
                </div>
                <div className="print-row-total border-t border-dashed border-[#002fa7] mt-1 pt-1 font-bold">
                  <span>TOTAL:</span>
                  <span className="val">{(processedCount * 8.18).toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* FINAL CALIBRATION COMPLETION MANIFEST POPUP */}
      {gameState === 'complete' && (
        <div className="final-manifest-overlay">
          <div className="manifest-box">
            <div className="manifest-header">
              <span className="manifest-title">SYSTEM MANIFEST</span>
              <span className="manifest-close" onClick={() => setGameState('idle')}>[ CLOSE ]</span>
            </div>
            
            <div className="manifest-body font-mono">
              <h3 className="manifest-headline">CALIBRATION SUCCESSFULLY VERIFIED</h3>
              <p className="manifest-desc">The sorting cycle has finished. Registry logs are committed to permanent storage.</p>
              
              <div className="manifest-table">
                <div className="manifest-row">
                  <span className="lbl">TOTAL_PACKETS_PROCESSED:</span>
                  <span className="val">12</span>
                </div>
                <div className="manifest-row">
                  <span className="lbl">TOTAL_ERRORS_ENCOUNTERED:</span>
                  <span className="val">{errorCount}</span>
                </div>
                <div className="manifest-row highlight">
                  <span className="lbl">ACCURACY_INDEX:</span>
                  <span className="val">{accuracyPercent}%</span>
                </div>
                <div className="manifest-row">
                  <span className="lbl">COMMUNITY_INDEX:</span>
                  <span className="val">VERIFIED // SYS_401</span>
                </div>
              </div>

              <div className="manifest-action">
                <button className="manifest-btn" onClick={startGame}>
                  [ RUN CALIBRATION AGAIN ]
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BatchSortGame;
