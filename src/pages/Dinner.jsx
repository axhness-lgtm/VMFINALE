import React, { useState, useRef, useEffect } from 'react';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import { supabase } from '../supabase';
import './Dinner.css';

const SUPABASE_FN = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
  : '';
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const callFn = async (name, body) => {
  const res = await fetch(`${SUPABASE_FN}/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

// ─── INLINE SVG ASSETS ───────────────────────────────────────────────────────

// Section 1 Hero: Agave plant over charcoal hearth flame
const AgaveHearth = () => (
  <svg viewBox="0 0 320 360" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hearth flame base */}
    <ellipse cx="160" cy="310" rx="72" ry="18" stroke="#002fa7" strokeWidth="2.5" />
    <path d="M118 310 Q100 280 112 250 Q120 230 110 208 Q125 235 122 255 Q135 230 130 200 Q148 232 140 258 Q152 228 150 195 Q165 230 158 260 Q170 228 168 195 Q182 230 175 258 Q186 232 185 205 Q195 230 188 255 Q197 235 205 210 Q196 232 202 252 Q214 232 202 310 Z"
          stroke="#002fa7" strokeWidth="2" fill="none" strokeLinejoin="round"/>
    {/* Agave central stalk */}
    <line x1="160" y1="260" x2="160" y2="80" stroke="#002fa7" strokeWidth="3"/>
    {/* Agave leaves - left spreading */}
    <path d="M160 180 Q110 150 70 170 Q100 155 160 180" stroke="#002fa7" strokeWidth="2.5" fill="none"/>
    <path d="M160 200 Q105 185 58 215 Q95 195 160 200" stroke="#002fa7" strokeWidth="2.5" fill="none"/>
    <path d="M160 160 Q120 120 100 90 Q120 125 160 160" stroke="#002fa7" strokeWidth="2.5" fill="none"/>
    {/* Agave leaves - right spreading */}
    <path d="M160 180 Q210 150 250 170 Q220 155 160 180" stroke="#002fa7" strokeWidth="2.5" fill="none"/>
    <path d="M160 200 Q215 185 262 215 Q225 195 160 200" stroke="#002fa7" strokeWidth="2.5" fill="none"/>
    <path d="M160 160 Q200 120 220 90 Q200 125 160 160" stroke="#002fa7" strokeWidth="2.5" fill="none"/>
    {/* Agave tip spikes */}
    <circle cx="68" cy="172" r="3" fill="#002fa7"/>
    <circle cx="57" cy="216" r="3" fill="#002fa7"/>
    <circle cx="97" cy="87" r="3" fill="#002fa7"/>
    <circle cx="252" cy="172" r="3" fill="#002fa7"/>
    <circle cx="263" cy="216" r="3" fill="#002fa7"/>
    <circle cx="223" cy="87" r="3" fill="#002fa7"/>
    <circle cx="160" cy="78" r="4" fill="#002fa7"/>
  </svg>
);

// Section 3 Platter Components
const MoleBowl = () => (
  <svg viewBox="0 0 100 80" fill="none" className="w-full h-full">
    <ellipse cx="50" cy="55" rx="42" ry="14" stroke="#002fa7" strokeWidth="2"/>
    <path d="M8 55 Q8 25 50 18 Q92 25 92 55" stroke="#002fa7" strokeWidth="2" fill="none"/>
    <ellipse cx="50" cy="55" rx="28" ry="8" stroke="#002fa7" strokeWidth="1.5" strokeDasharray="3 2"/>
    <path d="M38 45 Q50 35 62 45" stroke="#002fa7" strokeWidth="1.5" fill="none"/>
  </svg>
);

const FoldedMasa = () => (
  <svg viewBox="0 0 100 70" fill="none" className="w-full h-full">
    <path d="M10 55 Q10 20 50 15 Q90 20 90 55 Q70 65 50 62 Q30 65 10 55Z" stroke="#002fa7" strokeWidth="2" fill="none"/>
    <path d="M10 55 Q50 48 90 55" stroke="#002fa7" strokeWidth="1.5" strokeDasharray="4 2"/>
    <path d="M28 35 Q50 28 72 35" stroke="#002fa7" strokeWidth="1.5" fill="none"/>
    <circle cx="50" cy="40" r="4" stroke="#002fa7" strokeWidth="1.5"/>
  </svg>
);

const RoastedPepper = () => (
  <svg viewBox="0 0 70 100" fill="none" className="w-full h-full">
    <path d="M35 8 Q38 5 42 8 L44 20 Q52 22 56 35 Q62 55 52 70 Q45 82 35 84 Q25 82 18 70 Q8 55 14 35 Q18 22 26 20 Z" stroke="#002fa7" strokeWidth="2" fill="none"/>
    <path d="M35 8 Q32 5 28 8" stroke="#002fa7" strokeWidth="1.5" fill="none"/>
    <path d="M24 50 Q35 45 46 50 Q35 58 24 50Z" stroke="#002fa7" strokeWidth="1.5" fill="none"/>
    <circle cx="42" cy="10" r="2" fill="#002fa7"/>
  </svg>
);

const IngredientPouch = () => (
  <svg viewBox="0 0 90 90" fill="none" className="w-full h-full">
    <rect x="15" y="25" width="60" height="52" rx="2" stroke="#002fa7" strokeWidth="2"/>
    <path d="M25 25 Q35 10 45 8 Q55 10 65 25" stroke="#002fa7" strokeWidth="2" fill="none"/>
    <path d="M15 42 L75 42" stroke="#002fa7" strokeWidth="1.5"/>
    <line x1="35" y1="55" x2="35" y2="67" stroke="#002fa7" strokeWidth="1.5"/>
    <line x1="45" y1="55" x2="45" y2="67" stroke="#002fa7" strokeWidth="1.5"/>
    <line x1="55" y1="55" x2="55" y2="67" stroke="#002fa7" strokeWidth="1.5"/>
  </svg>
);

// Arrow pointing right-down, drawn in blue
const HandArrow = () => (
  <svg viewBox="0 0 80 80" fill="none" className="w-12 h-12">
    <path d="M10 20 Q40 10 60 50 L48 46 L60 50 L56 38" stroke="#efe9e1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── PLATTER DISH DATA ───────────────────────────────────────────────────────
const PLATTER_ITEMS = [
  {
    id: 'mole',
    label: 'ITEM A',
    detail: '72-HOUR SMOKE // CHOCOLATE & HEIRLOOM CHILI',
    // position inside the SVG-ring platter area (% from platter container)
    top: '18%', left: '12%',
    svg: <MoleBowl />,
  },
  {
    id: 'masa',
    label: 'ITEM B',
    detail: 'HARVEST CORN // STONE METATE GROUND',
    top: '14%', left: '58%',
    svg: <FoldedMasa />,
  },
  {
    id: 'pepper',
    label: 'ITEM C',
    detail: 'COASTAL CHILE // SLOW-CHAR & SMOKED OIL',
    top: '62%', left: '68%',
    svg: <RoastedPepper />,
  },
  {
    id: 'pouch',
    label: 'ITEM D',
    detail: 'SEASONAL SPICE ARCHIVE // HAND-WRAPPED',
    top: '62%', left: '8%',
    svg: <IngredientPouch />,
  },
];

// ─── SECTION 2 ACCORDION ROWS ────────────────────────────────────────────────
const LOGISTICS_ROWS = [
  {
    id: 'atm',
    index: '01',
    label: 'The Atmosphere',
    value: '5 Seasonal Courses. 8 Strangers. 1 Long Table.',
    expanded: 'Built on the premise that intimacy is a dish best served without ceremony. Every seat faces every seat.',
    coords: null,
  },
  {
    id: 'loc',
    index: '02',
    label: 'The Location',
    value: 'A quiet, coastal terrace in Kirlampudi, Visakhapatnam.',
    expanded: '17.7142° N, 83.3232° E — An unmarked coastal address shared only with confirmed guests.',
    coords: '17.7142° N, 83.3232° E',
  },
  {
    id: 'clk',
    index: '03',
    label: 'The Clock',
    value: 'Saturday, May 30th | Doors close at exactly 7:30 PM.',
    expanded: 'The table is set at 19:30 hrs sharp. Latecomer protocol: the seat becomes the archive.',
    coords: null,
  },
  {
    id: 'bnd',
    index: '04',
    label: 'The Boundary',
    value: 'Phones off. Conversations on. We leave when the candles go cold.',
    expanded: 'The Vantammayilu Porch Protocol — all devices stay pocketed. Voice is the only interface.',
    coords: null,
  },
];

const PLATTER_TAGS = [
  { key: 'sweet_start', label: 'SWEET_START', subLabel: '[ DESSERT_POP ]', tx: 35, ty: 250, dx: 175, dy: 300, color: 'orange' },
  { key: 'crunch_layer', label: 'CRUNCH_LAYER', subLabel: '[ FRY_STACK ]', tx: 300, ty: 120, dx: 340, dy: 290, color: 'orange' },
  { key: 'greens', label: 'GREENS', subLabel: '[ CELERY ]', tx: 470, ty: 120, dx: 475, dy: 280, color: 'blue' },
  { key: 'heat_zone', label: 'HEAT_ZONE', subLabel: '[ WINGS ]', tx: 570, ty: 120, dx: 570, dy: 280, color: 'orange', hot: true },
  { key: 'protein_unit', label: 'PROTEIN_UNIT', subLabel: '[ BONELESS ]', tx: 690, ty: 120, dx: 690, dy: 280, color: 'blue' },
  { key: 'coolant', label: 'COOLANT', subLabel: '[ DIP_RANCH ]', tx: 790, ty: 120, dx: 790, dy: 280, color: 'orange' },
  { key: 'bread_stack', label: 'BREAD_STACK', subLabel: '[ NAAN_CUT ]', tx: 890, ty: 120, dx: 890, dy: 280, color: 'orange' },
  { key: 'dip_node_01', label: 'DIP_NODE_01', subLabel: '[ HUMMUS ]', tx: 210, ty: 450, dx: 370, dy: 520, color: 'blue' },
  { key: 'dip_node_02', label: 'DIP_NODE_02', subLabel: '[ CHEESE_SAUCE ]', tx: 220, ty: 755, dx: 290, dy: 600, color: 'orange' },
  { key: 'dip_node_03', label: 'DIP_NODE_03', subLabel: '[ YOGURT_DILL ]', tx: 380, ty: 825, dx: 450, dy: 600, color: 'blue' },
  { key: 'dip_node_04', label: 'DIP_NODE_04', subLabel: '[ SALSA_VERDE ]', tx: 570, ty: 755, dx: 370, dy: 680, color: 'orange' },
  { key: 'dip_node_05', label: 'DIP_NODE_05', subLabel: '[ SALSA_ROJA ]', tx: 590, ty: 505, dx: 430, dy: 590, color: 'orange' },
  { key: 'sweet_block', label: 'SWEET_BLOCK', subLabel: '[ MARSHMALLOW ]', tx: 660, ty: 450, dx: 660, dy: 550, color: 'orange' },
  { key: 'heat_core', label: 'HEAT_CORE', subLabel: '[ TOASTED ]', tx: 760, ty: 450, dx: 750, dy: 560, color: 'orange', hot: true },
  { key: 'fruit_unit', label: 'FRUIT_UNIT', subLabel: '[ STRAWBERRY ]', tx: 870, ty: 450, dx: 860, dy: 560, color: 'orange' },
  { key: 'spread_node', label: 'SPREAD_NODE', subLabel: '[ CHOCOLATE ]', tx: 955, ty: 370, dx: 870, dy: 600, color: 'blue' },
  { key: 'crunch_unit', label: 'CRUNCH_UNIT', subLabel: '[ GRAHAM_CRACKER ]', tx: 665, ty: 760, dx: 660, dy: 640, color: 'blue' },
  { key: 'dark_layer', label: 'DARK_LAYER', subLabel: '[ COOKIE_STACK ]', tx: 775, ty: 760, dx: 750, dy: 640, color: 'orange' },
  { key: 'sweet_bar', label: 'SWEET_BAR', subLabel: '[ CHOCOLATE_BAR ]', tx: 885, ty: 760, dx: 840, dy: 640, color: 'orange' }
];

// ─── CHABUDAI PILLOWS METADATA ───────────────────────────────────────────────
const CHABUDAI_PILLOWS = [
  { id: 1, gx: 240, gy: 300, label: "CHAIR_01 // NISHI" },
  { id: 2, gx: 510, gy: 185, label: "CHAIR_02 // HIGASHI-KITA" },
  { id: 3, gx: 560, gy: 300, label: "CHAIR_03 // HIGASHI" },
  { id: 4, gx: 510, gy: 415, label: "CHAIR_04 // HIGASHI-MINAMI" },
  { id: 5, gx: 400, gy: 460, label: "CHAIR_05 // MINAMI" },
  { id: 6, gx: 290, gy: 415, label: "CHAIR_06 // NISHI-MINAMI" },
  { id: 7, gx: 400, gy: 140, label: "CHAIR_07 // KITA" },
  { id: 8, gx: 290, gy: 185, label: "CHAIR_08 // NISHI-KITA" }
];

const TypewriterText = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let index = 0;
    setDisplayText('');
    setIsDone(false);

    let timeoutId;
    const type = () => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
        const delay = 40 + Math.random() * 40;
        timeoutId = setTimeout(type, delay);
      } else {
        setIsDone(true);
      }
    };

    type();
    return () => clearTimeout(timeoutId);
  }, [text]);

  return (
    <>
      {displayText}
      <tspan className="typewriter-cursor">█</tspan>
    </>
  );
};

const projectPoint = (x, y, h = 0) => {
  const cx = 400;
  const cy = 300;
  const scale = 1.35;
  const dx = (x - cx) * scale;
  const dy = (y - cy) * scale;
  const px = Math.round(cx + 0.7071 * dx + 0.7071 * dy);
  const py = Math.round(cy - 0.3535 * dx + 0.3535 * dy - (h * scale));
  return { x: px, y: py };
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Dinner() {
  const [openRow, setOpenRow] = useState(null);
  const [hoveredDish, setHoveredDish] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedSeats, setSelectedSeats] = useState([1]);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [ctaHovered, setCtaHovered] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [pulses, setPulses] = useState([]);
  const platterRef = useRef(null);

  // ── Booking modal state ───────────────────────────────────────────────────
  const [bookingOpen, setBookingOpen] = useState(false);
  const [dinner, setDinner]           = useState(null);
  const [availableSeats, setAvailableSeats] = useState(8);

  // Fetch active dinner + subscribe to real-time seat count changes
  useEffect(() => {
    let channel;
    const load = async () => {
      const { data } = await supabase
        .from('dinners')
        .select('*')
        .eq('is_active', true)
        .single()
        .catch(() => ({ data: null }));
      if (data) {
        setDinner(data);
        setAvailableSeats(data.total_seats - data.confirmed_seats);
      }
    };
    load();

    channel = supabase
      .channel('dinner-seats')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'dinners' }, (payload) => {
        const d = payload.new;
        if (d) setAvailableSeats(d.total_seats - d.confirmed_seats);
      })
      .subscribe();

    return () => { if (channel) supabase.removeChannel(channel); };
  }, []);

  const capacityZero = availableSeats <= 0;

  const toggleSeat = (index) => {
    const isAdding = !selectedSeats.includes(index);
    setSelectedSeats((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );

    if (isAdding) {
      const pillow = CHABUDAI_PILLOWS.find(p => p.id === index);
      if (pillow) {
        const proj = projectPoint(pillow.gx, pillow.gy);
        const newPulse = {
          id: Date.now() + Math.random(),
          x: proj.x,
          y: proj.y
        };
        setPulses(prev => [...prev, newPulse]);
        setTimeout(() => {
          setPulses(prev => prev.filter(p => p.id !== newPulse.id));
        }, 1200);
      }
    }
  };


  // Mock data for the microscopic recipe lineage logs
  const platterItems = {
    mole: {
      title: "ITEM A // MOLE NEGRO",
      batch: "BATCH_REF // OAX-074",
      lineage: "72-Hour continuous smoke. Black wild chilhuacle chilis flown from Canada-Oaxaca corridor. Ground on basalt stone metate with 70% dark heirloom cacao, sweet Mexican cinnamon, and slow-rendered raw lard."
    },
    masa: {
      title: "ITEM B // MASA TETELA",
      batch: "BATCH_REF // MILPA-02",
      lineage: "Native organic Tuxpeño white corn, nixtamalized for 16 hours in culinary limestone wood ash water. Ground by hand to variable grain texture hours before service. Hand-pressed over open clay comal hearth flames."
    },
    agave: {
      title: "ITEM C // CHARRED AGAVE",
      batch: "BATCH_REF // ESP-V4",
      lineage: "Mature Agave Espadín hearts cooked for 5 days in a subterranean stone pit over white oak charcoal embers. Sliced into thin structural wedges, caramelized on cast iron sheets, splashed with wild mezcal reduction."
    },
    pepper: {
      title: "ITEM D // ROASTED PEPPER",
      batch: "BATCH_REF // PASILLA-OAX",
      lineage: "Rare, sun-dried Pasilla de Oaxaca chilis, smoke-cured over local hardwood during harvest. Rehydrated in salted spring water, stuffed with crushed wild mountain herbs and un-aged structural fresh cheese curds."
    }
  };

  // State engine to handle active item highlighting and log streaming
  const [activeKey, setActiveKey] = useState(null);

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    try {
      await callFn('join-waitlist', {
        dinner_id: dinner?.id,
        email: waitlistEmail,
      });
    } catch (err) {
      // Ignore duplicate-email errors; still show success to user
      console.warn('Waitlist submit:', err.message);
    } finally {
      setWaitlistSubmitted(true);
    }
  };

  return (
    <main className="dinner-page noise-bg">

      {/* ── MASTER VECTOR LINE (runs full page, center axis) ─────────────── */}
      <div className="master-vector-line" />

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 1: THE CULINARY GRAPHIC POSTER (DASHBOARD FRAMEWORK)
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="dinner-hero-dashboard">
        {/* 4px Outer Blue Framing Rails */}
        <div className="dashboard-rail-container">
          
          {/* HUD Corner Utility Anchors */}
          <div className="hud-anchor top-left">VANTAMMAYILU // VOL. IV</div>
          <div className="hud-anchor top-right font-handwritten">[ ACTIVE SEATS AVAILABLE: {availableSeats} / {dinner?.total_seats ?? 8} ]</div>
          <div className="hud-anchor bottom-left">THEME // POSTCARDS FROM OAXACA</div>
          <div className="hud-anchor bottom-right font-handwritten">[ UNLATCH ENTRY PROTOCOL ↙ ]</div>

          {/* Central Cream Concrete Block Surface */}
          <div className="concrete-center-block">
            
            {/* Left Column: Chapter Identifier */}
            <div className="dashboard-col chapter-id-zone">
              <h1 className="chapter-title">CHAPTER 04.</h1>
              <div className="instruction-box">
                <span className="mono-label font-handwritten">[ INTERACTION_MODE // ACTIVE ]</span>
                <p className="mono-subtext">Hover over the layout elements on the central blueprint platter to stream micro-lineage logs to the ledger system.</p>
              </div>
            </div>

            {/* Center Column: SVG Platter Map Engine */}
            <div className="dashboard-col blueprint-platter-zone">
              <div className="svg-wrapper">
                <svg viewBox="0 0 400 400" className="platter-blueprint-svg">
                  {/* Structural Outer Perimeter Anchor Ring */}
                  <circle cx="200" cy="200" r="180" className="svg-axis-ring" />
                  <circle cx="200" cy="200" r="174" className="svg-axis-ring dashed" />
                  <line x1="200" y1="20" x2="200" y2="380" className="svg-grid-line" />
                  <line x1="20" y1="200" x2="380" y2="200" className="svg-grid-line" />

                  {/* ITEM A: Mole Bowl Silhouette (Top-Left Quadrant) */}
                  <g 
                    className={`interactive-group ${activeKey === 'mole' ? 'active' : ''}`}
                    onMouseEnter={() => setActiveKey('mole')}
                    onMouseLeave={() => setActiveKey(null)}
                  >
                    <circle cx="120" cy="120" r="45" className="platter-item-shape" />
                    <circle cx="120" cy="120" r="35" className="svg-inner-contour" />
                    <text x="120" y="124" className="svg-mono-tag">A</text>
                    <path d="M 120,68 C 153,66 174,88 172,120 C 170,154 148,174 120,172 C 88,170 66,148 68,120 C 70,88 92,66 118,68 C 122,68 124,70 126,71" className="scribble-circle-path" />
                  </g>

                  {/* ITEM B: Masa Tetela Triangle (Top-Right Quadrant) */}
                  <g 
                    className={`interactive-group ${activeKey === 'masa' ? 'active' : ''}`}
                    onMouseEnter={() => setActiveKey('masa')}
                    onMouseLeave={() => setActiveKey(null)}
                  >
                    <polygon points="280,75 325,150 235,150" className="platter-item-shape" />
                    <text x="280" y="130" className="svg-mono-tag">B</text>
                    <path d="M 280,70 C 313,68 334,92 332,125 C 330,159 308,179 280,177 C 248,175 226,153 228,125 C 230,93 252,70 278,72 C 282,72 284,74 286,75" className="scribble-circle-path" />
                  </g>

                  {/* ITEM C: Charred Agave Wedge (Bottom-Left Quadrant) */}
                  <g 
                    className={`interactive-group ${activeKey === 'agave' ? 'active' : ''}`}
                    onMouseEnter={() => setActiveKey('agave')}
                    onMouseLeave={() => setActiveKey(null)}
                  >
                    <path d="M75,240 Q130,240 150,310 Q90,290 75,240 Z" className="platter-item-shape" />
                    <text x="110" y="275" className="svg-mono-tag">C</text>
                    <path d="M 112,222 C 145,220 166,242 164,275 Q 162,315 112,327 Q 62,315 64,275 C 66,242 84,220 110,222 C 114,222 116,224 118,225" className="scribble-circle-path" />
                  </g>

                  {/* ITEM D: Roasted Pepper Wedge (Bottom-Right Quadrant) */}
                  <g 
                    className={`interactive-group ${activeKey === 'pepper' ? 'active' : ''}`}
                    onMouseEnter={() => setActiveKey('pepper')}
                    onMouseLeave={() => setActiveKey(null)}
                  >
                    <rect x="240" y="240" width="75" height="45" rx="0" className="platter-item-shape" transform="rotate(15 277 262)" />
                    <text x="275" y="268" className="svg-mono-tag">D</text>
                    <path d="M 277,212 C 310,210 331,232 329,262 C 327,296 305,316 277,314 C 245,312 223,290 225,262 C 227,230 249,210 275,212 C 279,212 281,214 283,215" className="scribble-circle-path" />
                  </g>
                </svg>
              </div>
            </div>

            {/* Right Column: Microscopic Recipe Lineage Logs Sidebar */}
            <div className="dashboard-col lineage-ledger-sidebar">
              <div className="ledger-header-panel">
                <span className="ledger-title font-handwritten">[ SYSTEM_LOG // METADATA_STREAM ]</span>
              </div>
              
              <div className="ledger-dynamic-content relative">
                {activeKey ? (
                  <div className="log-entry animation-flash">
                    <div className="log-row item-headline">{platterItems[activeKey].title}</div>
                    <div className="log-row item-batch-code font-typewriter">{platterItems[activeKey].batch}</div>
                    <div className="log-row-divider"></div>
                    <p className="log-body-text font-typewriter">{platterItems[activeKey].lineage}</p>
                    {/* Distressed Stamp Overlay */}
                    <div className="absolute right-4 bottom-4 distressed-stamp stamp-slam-active font-handwritten" style={{ pointerEvents: 'none' }}>
                      [ RECIPE_SECURED ]
                    </div>
                  </div>
                ) : (
                  <div className="log-placeholder">
                    <div className="blink-cursor-block"></div>
                    <p className="placeholder-text font-handwritten">AWAITING DATA PACKET INPUT... SCAN PLATTER BLUEPRINT QUADRANTS TO ACCESS SPECIMEN FILES.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 2: THE LOGISTICS GRID
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#efe9e1] w-full">
        {/* Horizontal rule from master line */}
        <div className="w-full h-[2px] bg-[#002fa7]" />

        <div className="max-w-screen-xl mx-auto">
          {LOGISTICS_ROWS.map((row, i) => (
            <div key={row.id}>
              <button
                onClick={() => setOpenRow(openRow === row.id ? null : row.id)}
                className="group w-full text-left flex items-start gap-6 px-6 md:px-16 py-6 md:py-8 hover:-translate-y-1 transition-transform duration-200 relative"
                style={{ boxShadow: 'none' }}
              >
                {/* Hover shadow reveal */}
                <div className="absolute bottom-0 left-0 w-full h-[4px] bg-[#002fa7] translate-y-full opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200" />

                <span className="font-mono text-[10px] md:text-xs font-bold text-[#002fa7]/50 uppercase tracking-widest mt-1 shrink-0 w-8">
                  {row.index}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-6">
                    <span className="font-serif text-xl md:text-2xl font-black uppercase text-[#002fa7] tracking-tight shrink-0">
                      {row.label}
                    </span>
                    <span className="hidden md:block flex-1 h-[1px] bg-[#002fa7]/20 self-center" />
                    <span className="font-mono text-xs md:text-sm font-bold uppercase text-[#002fa7]/70 tracking-wide">
                      {row.value}
                    </span>
                  </div>

                  {/* Expanded drawer */}
                  <div className={`overflow-hidden transition-all duration-300 ${openRow === row.id ? 'max-h-40 mt-5' : 'max-h-0'}`}>
                    <div className="border-l-2 border-[#002fa7] pl-5 py-2">
                      {row.coords && (
                        <p className="font-mono text-sm font-black text-[#002fa7] tracking-widest mb-2 uppercase">
                          {row.coords}
                        </p>
                      )}
                      <p className="font-mono text-xs text-[#002fa7]/80 uppercase leading-relaxed">
                        {row.expanded}
                      </p>
                    </div>
                  </div>
                </div>

                <span className="font-mono text-xs font-bold text-[#002fa7]/40 mt-1 shrink-0">
                  {openRow === row.id ? '[ − ]' : '[ + ]'}
                </span>
              </button>
              {/* Divider rule */}
              <div className="w-full h-[2px] bg-[#002fa7]" />
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 4: THE CHABUDAI FLOOR MATRIX (Japanese Short Leg Table & Pillows)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="chabudai-matrix-section relative">
        {!capacityZero ? (
          <>
            <div className="matrix-header-block">
              <span className="matrix-brand-label">Vantammayilu</span>
            </div>

            <div className="matrix-viewport-container">
              {/* MASTER ARCHITECTURAL CANVAS SHEETS */}
              <div className="isometric-projection-stage">
                <svg viewBox="0 0 800 600" className="blueprint-svg-canvas">
                  <defs>
                    <radialGradient id="thermal-glow-hot" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#e45a0b" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#e45a0b" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="thermal-glow-cold" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#002fa7" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#002fa7" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* ==========================================================================
                     THE ISOMETRIC GROUND FLOOR MAP LAYER
                     ========================================================================== */}
                  {/* 1. Large blueprint grid mat rotated on the floor */}
                  <g style={{ shapeRendering: 'crispEdges' }}>
                    <polygon
                      points={`${projectPoint(200, 100).x},${projectPoint(200, 100).y} ${projectPoint(600, 100).x},${projectPoint(600, 100).y} ${projectPoint(600, 500).x},${projectPoint(600, 500).y} ${projectPoint(200, 500).x},${projectPoint(200, 500).y}`}
                      className="blueprint-mat-bg"
                    />
                    {/* Mat grid lines */}
                    {Array.from({ length: 9 }).map((_, i) => {
                      const x = 200 + i * 50;
                      const pStart = projectPoint(x, 100);
                      const pEnd = projectPoint(x, 500);
                      return (
                        <line
                          key={`grid-x-${i}`}
                          x1={pStart.x}
                          y1={pStart.y}
                          x2={pEnd.x}
                          y2={pEnd.y}
                          className="blueprint-mat-grid-line"
                        />
                      );
                    })}
                    {Array.from({ length: 9 }).map((_, i) => {
                      const y = 100 + i * 50;
                      const pStart = projectPoint(200, y);
                      const pEnd = projectPoint(600, y);
                      return (
                        <line
                          key={`grid-y-${i}`}
                          x1={pStart.x}
                          y1={pStart.y}
                          x2={pEnd.x}
                          y2={pEnd.y}
                          className="blueprint-mat-grid-line"
                        />
                      );
                    })}
                  </g>

                  {/* Thermal Layer (placed underneath shadows and pillows) */}
                  <g className="thermal-layer" style={{ pointerEvents: 'none' }}>
                    {/* Floor thermal glow nodes */}
                    {CHABUDAI_PILLOWS.map((pillow) => {
                      const isSelected = selectedSeats.includes(pillow.id);
                      const proj = projectPoint(pillow.gx, pillow.gy);
                      return (
                        <ellipse
                          key={`thermal-glow-${pillow.id}`}
                          cx={proj.x}
                          cy={proj.y}
                          rx={50 * 1.35}
                          ry={25 * 1.35}
                          fill={isSelected ? "url(#thermal-glow-hot)" : "url(#thermal-glow-cold)"}
                          style={{ transition: 'fill 0.4s ease' }}
                        />
                      );
                    })}

                    {/* Concentric pulsing energy ripples */}
                    {pulses.map((pulse) => (
                      <g key={pulse.id} transform={`translate(${pulse.x}, ${pulse.y})`}>
                        <ellipse
                          cx="0"
                          cy="0"
                          rx="100"
                          ry="50"
                          className="thermal-pulse-circle ripple-1"
                        />
                        <ellipse
                          cx="0"
                          cy="0"
                          rx="100"
                          ry="50"
                          className="thermal-pulse-circle ripple-2"
                          style={{ animationDelay: '0.2s' }}
                        />
                      </g>
                    ))}
                  </g>

                  {/* 2. Table shadow footprint (on floor) */}
                  <g style={{ shapeRendering: 'crispEdges' }}>
                    <polygon
                      points={`${projectPoint(330, 230).x},${projectPoint(330, 230).y} ${projectPoint(470, 230).x},${projectPoint(470, 230).y} ${projectPoint(470, 370).x},${projectPoint(470, 370).y} ${projectPoint(330, 370).x},${projectPoint(330, 370).y}`}
                      className="table-footprint"
                    />

                    {/* 3. Pillow ground footprint shadows */}
                    {CHABUDAI_PILLOWS.map((pillow) => {
                      const isSelected = selectedSeats.includes(pillow.id);
                      const proj = projectPoint(pillow.gx, pillow.gy);
                      const w_shadow = (isSelected ? 17 : 20) * 1.35;
                      const sx = 1.414 * w_shadow;
                      const sy = 0.7071 * w_shadow;
                      return (
                        <polygon
                          key={`shadow-${pillow.id}`}
                          points={`${proj.x - sx},${proj.y} ${proj.x},${proj.y - sy} ${proj.x + sx},${proj.y} ${proj.x},${proj.y + sy}`}
                          className={`pillow-ground-shadow ${isSelected ? 'selected' : ''}`}
                        />
                      );
                    })}
                  </g>

                  {/* 4. Back Pillows (projected ground Y < 300) */}
                  {CHABUDAI_PILLOWS.filter(pillow => {
                    const proj = projectPoint(pillow.gx, pillow.gy);
                    return proj.y < 300;
                  }).map((pillow) => {
                    const isHovered = hoveredSeat === pillow.id;
                    const isSelected = selectedSeats.includes(pillow.id);
                    const proj = projectPoint(pillow.gx, pillow.gy);
                    const pillowClass = isSelected ? 'locked' : 'pillow-floating';
                    return (
                      <g
                        key={`pillow-node-${pillow.id}`}
                        className="tatami-pillow-node-wrapper"
                        onMouseEnter={() => setHoveredSeat(pillow.id)}
                        onMouseLeave={() => setHoveredSeat(null)}
                        onClick={() => toggleSeat(pillow.id)}
                        style={{
                          cursor: 'pointer',
                          transform: `translate(${proj.x}px, ${proj.y}px)`
                        }}
                      >
                        {/* Dynamic clipPath for this pillow's conduit growth */}
                        <clipPath id={`conduit-clip-${pillow.id}`}>
                          <rect
                            x="-20"
                            y="0"
                            width="40"
                            height={isHovered && !isSelected ? 45 : 0}
                            style={{ transition: 'height 0.25s cubic-bezier(0.1, 0.8, 0.3, 1)' }}
                          />
                        </clipPath>

                        <g
                          className={`tatami-pillow-group ${pillowClass} ${isHovered ? 'hovered' : ''}`}
                          style={{
                            animationDelay: `${pillow.id * 0.3}s`
                          }}
                        >
                          {/* Neon-Blue Anchor Tether Wire Line */}
                          {isHovered && !isSelected && (
                            <line
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                              className="pillow-tether-wire"
                              style={{
                                animationDelay: `${pillow.id * 0.3}s`,
                                clipPath: `url(#conduit-clip-${pillow.id})`
                              }}
                            />
                          )}

                          {/* Puffy tatami pillow elements scaled 1.35x inside transform group */}
                          <g transform="scale(1.35)">
                            {/* Pillow Top Face (Puffy) */}
                            <path
                              d="M -33.94,-6 Q -18,-18 0,-22.97 Q 18,-18 33.94,-6 Q 18,6 0,10.97 Q -18,6 -33.94,-6"
                              className="pillow-top-face"
                            />

                            {/* Pillow Side Lip (Front-Left) */}
                            <path
                              d="M -33.94,-6 Q -18,6 0,10.97 L 0,16.97 Q -18,12 -33.94,0 Z"
                              className="pillow-side-lip left"
                            />

                            {/* Pillow Side Lip (Front-Right) */}
                            <path
                              d="M 0,10.97 Q 18,6 33.94,-6 L 33.94,0 Q 18,12 0,16.97 Z"
                              className="pillow-side-lip right"
                            />
                          </g>

                          {/* Sprout Tag Group */}
                          {isSelected && (
                            <g className="sprout-tag-group" style={{ pointerEvents: 'none' }}>
                              <line x1="0" y1="-8" x2="0" y2="-60" stroke="#002fa7" strokeWidth="1.5" />
                              <g transform="translate(0, -60) rotate(-26.565)">
                                <text x="5" y="4" className="sprout-tag-text" textAnchor="start">
                                  <TypewriterText text={`[ WELCOME GUEST_0${pillow.id} ]`} />
                                </text>
                              </g>
                            </g>
                          )}
                        </g>
                      </g>
                    );
                  })}

                  {/* 5. Traditional Chabudai Low Table (3D Extrusion) */}
                  <g className="chabudai-low-table" style={{ shapeRendering: 'crispEdges' }}>
                    {/* Table Leg Projection/Tether Lines */}
                    <line
                      x1={projectPoint(328, 228, 15).x}
                      y1={projectPoint(328, 228, 15).y}
                      x2={projectPoint(328, 228, 0).x}
                      y2={projectPoint(328, 228, 0).y}
                      className="table-leg-tether"
                    />
                    <line
                      x1={projectPoint(472, 228, 15).x}
                      y1={projectPoint(472, 228, 15).y}
                      x2={projectPoint(472, 228, 0).x}
                      y2={projectPoint(472, 228, 0).y}
                      className="table-leg-tether"
                    />
                    <line
                      x1={projectPoint(472, 372, 15).x}
                      y1={projectPoint(472, 372, 15).y}
                      x2={projectPoint(472, 372, 0).x}
                      y2={projectPoint(472, 372, 0).y}
                      className="table-leg-tether"
                    />
                    <line
                      x1={projectPoint(328, 372, 15).x}
                      y1={projectPoint(328, 372, 15).y}
                      x2={projectPoint(328, 372, 0).x}
                      y2={projectPoint(328, 372, 0).y}
                      className="table-leg-tether"
                    />

                    {/* Leg 1: West/Left leg (x: 320-336, y: 220-236) */}
                    <polygon
                      points={`${projectPoint(320, 220, 15).x},${projectPoint(320, 220, 15).y} ${projectPoint(320, 220, 55).x},${projectPoint(320, 220, 55).y} ${projectPoint(320, 236, 55).x},${projectPoint(320, 236, 55).y} ${projectPoint(320, 236, 15).x},${projectPoint(320, 236, 15).y}`}
                      className="table-leg-face left"
                    />
                    <polygon
                      points={`${projectPoint(320, 236, 15).x},${projectPoint(320, 236, 15).y} ${projectPoint(320, 236, 55).x},${projectPoint(320, 236, 55).y} ${projectPoint(336, 236, 55).x},${projectPoint(336, 236, 55).y} ${projectPoint(336, 236, 15).x},${projectPoint(336, 236, 15).y}`}
                      className="table-leg-face right"
                    />

                    {/* Leg 2: North/Top leg (x: 464-480, y: 220-236) */}
                    <polygon
                      points={`${projectPoint(464, 220, 15).x},${projectPoint(464, 220, 15).y} ${projectPoint(464, 220, 55).x},${projectPoint(464, 220, 55).y} ${projectPoint(464, 236, 55).x},${projectPoint(464, 236, 55).y} ${projectPoint(464, 236, 15).x},${projectPoint(464, 236, 15).y}`}
                      className="table-leg-face left"
                    />
                    <polygon
                      points={`${projectPoint(464, 236, 15).x},${projectPoint(464, 236, 15).y} ${projectPoint(464, 236, 55).x},${projectPoint(464, 236, 55).y} ${projectPoint(480, 236, 55).x},${projectPoint(480, 236, 55).y} ${projectPoint(480, 236, 15).x},${projectPoint(480, 236, 15).y}`}
                      className="table-leg-face right"
                    />

                    {/* Leg 3: East/Right leg (x: 464-480, y: 364-380) */}
                    <polygon
                      points={`${projectPoint(464, 364, 15).x},${projectPoint(464, 364, 15).y} ${projectPoint(464, 364, 55).x},${projectPoint(464, 364, 55).y} ${projectPoint(464, 380, 55).x},${projectPoint(464, 380, 55).y} ${projectPoint(464, 380, 15).x},${projectPoint(464, 380, 15).y}`}
                      className="table-leg-face left"
                    />
                    <polygon
                      points={`${projectPoint(464, 380, 15).x},${projectPoint(464, 380, 15).y} ${projectPoint(464, 380, 55).x},${projectPoint(464, 380, 55).y} ${projectPoint(480, 380, 55).x},${projectPoint(480, 380, 55).y} ${projectPoint(480, 380, 15).x},${projectPoint(480, 380, 15).y}`}
                      className="table-leg-face right"
                    />

                    {/* Leg 4: South/Bottom leg (x: 320-336, y: 364-380) */}
                    <polygon
                      points={`${projectPoint(320, 364, 15).x},${projectPoint(320, 364, 15).y} ${projectPoint(320, 364, 55).x},${projectPoint(320, 364, 55).y} ${projectPoint(320, 380, 55).x},${projectPoint(320, 380, 55).y} ${projectPoint(320, 380, 15).x},${projectPoint(320, 380, 15).y}`}
                      className="table-leg-face left"
                    />
                    <polygon
                      points={`${projectPoint(320, 380, 15).x},${projectPoint(320, 380, 15).y} ${projectPoint(320, 380, 55).x},${projectPoint(320, 380, 55).y} ${projectPoint(336, 380, 55).x},${projectPoint(336, 380, 55).y} ${projectPoint(336, 380, 15).x},${projectPoint(336, 380, 15).y}`}
                      className="table-leg-face right"
                    />

                    {/* 3D Apron Rim (Front-Left) */}
                    <polygon
                      points={`${projectPoint(320, 220, 55).x},${projectPoint(320, 220, 55).y} ${projectPoint(320, 220, 65).x},${projectPoint(320, 220, 65).y} ${projectPoint(320, 380, 65).x},${projectPoint(320, 380, 65).y} ${projectPoint(320, 380, 55).x},${projectPoint(320, 380, 55).y}`}
                      className="table-apron-face left"
                    />

                    {/* 3D Apron Rim (Front-Right) */}
                    <polygon
                      points={`${projectPoint(320, 380, 55).x},${projectPoint(320, 380, 55).y} ${projectPoint(320, 380, 65).x},${projectPoint(320, 380, 65).y} ${projectPoint(480, 380, 65).x},${projectPoint(480, 380, 65).y} ${projectPoint(480, 380, 55).x},${projectPoint(480, 380, 55).y}`}
                      className="table-apron-face right"
                    />

                    {/* Elevated Table Top Slab */}
                    <polygon
                      points={`${projectPoint(320, 220, 65).x},${projectPoint(320, 220, 65).y} ${projectPoint(480, 220, 65).x},${projectPoint(480, 220, 65).y} ${projectPoint(480, 380, 65).x},${projectPoint(480, 380, 65).y} ${projectPoint(320, 380, 65).x},${projectPoint(320, 380, 65).y}`}
                      className="table-top-surface"
                    />
                  </g>

                  {/* 6. Front Pillows (projected ground Y >= 300) */}
                  {CHABUDAI_PILLOWS.filter(pillow => {
                    const proj = projectPoint(pillow.gx, pillow.gy);
                    return proj.y >= 300;
                  }).map((pillow) => {
                    const isHovered = hoveredSeat === pillow.id;
                    const isSelected = selectedSeats.includes(pillow.id);
                    const proj = projectPoint(pillow.gx, pillow.gy);
                    const pillowClass = isSelected ? 'locked' : 'pillow-floating';
                    return (
                      <g
                        key={`pillow-node-${pillow.id}`}
                        className="tatami-pillow-node-wrapper"
                        onMouseEnter={() => setHoveredSeat(pillow.id)}
                        onMouseLeave={() => setHoveredSeat(null)}
                        onClick={() => toggleSeat(pillow.id)}
                        style={{
                          cursor: 'pointer',
                          transform: `translate(${proj.x}px, ${proj.y}px)`
                        }}
                      >
                        {/* Dynamic clipPath for this pillow's conduit growth */}
                        <clipPath id={`conduit-clip-${pillow.id}`}>
                          <rect
                            x="-20"
                            y="0"
                            width="40"
                            height={isHovered && !isSelected ? 45 : 0}
                            style={{ transition: 'height 0.25s cubic-bezier(0.1, 0.8, 0.3, 1)' }}
                          />
                        </clipPath>

                        <g
                          className={`tatami-pillow-group ${pillowClass} ${isHovered ? 'hovered' : ''}`}
                          style={{
                            animationDelay: `${pillow.id * 0.3}s`
                          }}
                        >
                          {/* Neon-Blue Anchor Tether Wire Line */}
                          {isHovered && !isSelected && (
                            <line
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                              className="pillow-tether-wire"
                              style={{
                                animationDelay: `${pillow.id * 0.3}s`,
                                clipPath: `url(#conduit-clip-${pillow.id})`
                              }}
                            />
                          )}

                          {/* Puffy tatami pillow elements scaled 1.35x inside transform group */}
                          <g transform="scale(1.35)">
                            {/* Pillow Top Face (Puffy) */}
                            <path
                              d="M -33.94,-6 Q -18,-18 0,-22.97 Q 18,-18 33.94,-6 Q 18,6 0,10.97 Q -18,6 -33.94,-6"
                              className="pillow-top-face"
                            />

                            {/* Pillow Side Lip (Front-Left) */}
                            <path
                              d="M -33.94,-6 Q -18,6 0,10.97 L 0,16.97 Q -18,12 -33.94,0 Z"
                              className="pillow-side-lip left"
                            />

                            {/* Pillow Side Lip (Front-Right) */}
                            <path
                              d="M 0,10.97 Q 18,6 33.94,-6 L 33.94,0 Q 18,12 0,16.97 Z"
                              className="pillow-side-lip right"
                            />
                          </g>

                          {/* Sprout Tag Group */}
                          {isSelected && (
                            <g className="sprout-tag-group" style={{ pointerEvents: 'none' }}>
                              <line x1="0" y1="-8" x2="0" y2="-60" stroke="#002fa7" strokeWidth="1.5" />
                              <g transform="translate(0, -60) rotate(-26.565)">
                                <text x="5" y="4" className="sprout-tag-text" textAnchor="start">
                                  <TypewriterText text={`[ WELCOME GUEST_0${pillow.id} ]`} />
                                </text>
                              </g>
                            </g>
                          )}
                        </g>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* ==========================================================================
                 CONVERSION CHECKOUT ACTION BUTTON CONSOLE AREA
                 ========================================================================== */}
              <div className="matrix-action-drawer">
                <button 
                  disabled={selectedSeats.length === 0}
                  onClick={() => setBookingOpen(true)}
                  className={`matrix-checkout-cta ${selectedSeats.length > 0 ? 'active-ready font-handwritten' : 'idle-disabled font-handwritten'}`}
                >
                  {selectedSeats.length === 0 
                    ? "[ SELECT A PILLOW FROM THE MAT ABOVE ]" 
                    : `[ COMMIT TO ${selectedSeats.length} COVERS AT THE CHABUDAI // RAZORPAY SECURE GATEWAY ]`
                  }
                </button>
                <div className="matrix-footer-ticker">
                  <span className="ticker-caps font-handwritten">
                    {`// 0${8 - selectedSeats.length} COVERS VACANT // CHAPTER 04 // OAXACA MAT ARRANGEMENT`}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ── SECTION 5: CLOSED PORCH FLAG / WAITLIST ──────────────── */
          <div className="absolute inset-0 bg-[#002fa7] flex items-center justify-center z-30 p-6">
            <div className="bg-[#efe9e1] border-4 border-[#002fa7] shadow-[12px_12px_0px_0px_#e45a0b] w-full max-w-lg p-10 md:p-14 flex flex-col gap-8">
              <h2 className="font-serif font-black uppercase text-[#002fa7] tracking-tighter leading-none"
                  style={{ fontSize: 'clamp(3rem, 7vw, 5rem)' }}>
                Table<br/>Full.
              </h2>
              <p className="font-handwritten text-xs font-bold uppercase tracking-widest text-[#002fa7]">
                [ SUBMIT TO THE WAITING ROOM ARCHIVE ]
              </p>
              {waitlistSubmitted ? (
                <div className="border-2 border-[#002fa7] bg-[#002fa7] text-[#efe9e1] p-4 font-handwritten text-xs font-bold uppercase text-center tracking-widest">
                  [ ARCHIVED // WE'LL REACH OUT FIRST ]
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="flex flex-col gap-4">
                  <input
                    type="email"
                    required
                    placeholder="name@server.com"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    className="w-full bg-[#efe9e1] border-2 border-[#002fa7] font-mono text-sm p-4 outline-none focus:bg-[#002fa7]/5 text-[#002fa7]"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#e45a0b] text-[#efe9e1] border-2 border-[#002fa7] font-mono text-xs md:text-sm font-black uppercase tracking-widest py-4 px-6 shadow-[6px_6px_0px_0px_#002fa7] hover:bg-[#efe9e1] hover:text-[#002fa7] hover:translate-x-[6px] hover:translate-y-[6px] hover:shadow-none transition-all duration-150 cursor-pointer"
                  >
                    [ KEEP A SEAT WARM FOR ME ]
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ── BOOKING MODAL ─────────────────────────────────────────────── */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        dinner={dinner}
        initialSeats={Math.min(selectedSeats.length, 2)}
      />

      <Footer />
    </main>
  );
}
