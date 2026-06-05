import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import BookingModal from '../components/BookingModal';
import { supabase } from '../supabase';
import './Dinner.css';
import './DinnerTrial.css';

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

// ─── CHABUDAI PILLOWS METADATA (8 SEATS ALONG LENGTH SIDES) ───────────────────
const CHABUDAI_PILLOWS = [
  { id: 1, gx: 280, gy: 160, label: "CHAIR_01 // KITA-1" },
  { id: 2, gx: 360, gy: 160, label: "CHAIR_02 // KITA-2" },
  { id: 3, gx: 440, gy: 160, label: "CHAIR_03 // KITA-3" },
  { id: 4, gx: 520, gy: 160, label: "CHAIR_04 // KITA-4" },
  { id: 5, gx: 280, gy: 440, label: "CHAIR_05 // MINAMI-1" },
  { id: 6, gx: 360, gy: 440, label: "CHAIR_06 // MINAMI-2" },
  { id: 7, gx: 440, gy: 440, label: "CHAIR_07 // MINAMI-3" },
  { id: 8, gx: 520, gy: 440, label: "CHAIR_08 // MINAMI-4" }
];

const TypewriterText = ({ text, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let index = 0;
    setDisplayText('');
    setIsDone(false);
    setStarted(false);

    let timeoutId;
    const type = () => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
        const speed = 40 + Math.random() * 40;
        timeoutId = setTimeout(type, speed);
      } else {
        setIsDone(true);
      }
    };

    const startTimer = setTimeout(() => {
      setStarted(true);
      type();
    }, delay);

    return () => { clearTimeout(timeoutId); clearTimeout(startTimer); };
  }, [text, delay]);

  return (
    <>
      {displayText}
      {!isDone && started && <span className="typewriter-cursor ml-1">█</span>}
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
export default function DinnerTrial() {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const requestRef = useRef(null);

  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, dist: 0 });
  const rotX = useRef({ val: 0, vel: 0 });
  const rotY = useRef({ val: 0, vel: 0 });

  const maxTilt = 18; // maximum degree of tilt
  const stiffness = 0.02; // spring stiffness
  const damping = 0.82; // spring damping

  useEffect(() => {
    const handleMouseMoveGlobal = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      // Calculate mouse position relative to center of container
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Check if mouse is outside the bounds of the container
      const isOutside = (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      );

      if (isOutside) {
        mouse.current.targetX = 0;
        mouse.current.targetY = 0;
        mouse.current.dist = 0;
      } else {
        const distance = Math.sqrt(x * x + y * y);
        const maxRadius = Math.sqrt((rect.width / 2) ** 2 + (rect.height / 2) ** 2) || 1;
        const dNorm = Math.min(distance / maxRadius, 1.0);

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

  // Main animation frame loop for physics
  useEffect(() => {
    const updatePhysics = (time) => {
      if (!containerRef.current || !imageRef.current) {
        requestRef.current = requestAnimationFrame(updatePhysics);
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const W = rect.width || 920;
      const H = rect.height || 600;

      const tiltScale = Math.min(mouse.current.dist, 1.0);
      // rotateX uses Y-offset, rotateY uses X-offset
      const targetRotX = - (mouse.current.targetY / (H / 2)) * maxTilt * tiltScale;
      const targetRotY = (mouse.current.targetX / (W / 2)) * maxTilt * tiltScale;

      // Update spring physics
      const updateSpring = (spring, target) => {
        const force = (target - spring.val) * stiffness;
        spring.vel = (spring.vel + force) * damping;
        spring.val += spring.vel;
      };

      updateSpring(rotX.current, targetRotX);
      updateSpring(rotY.current, targetRotY);

      if (imageRef.current) {
        imageRef.current.style.transform = `perspective(1000px) rotateX(${rotX.current.val}deg) rotateY(${rotY.current.val}deg) translate(-20px, -40px)`;
      }

      requestRef.current = requestAnimationFrame(updatePhysics);
    };

    requestRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const [selectedSeats, setSelectedSeats] = useState([1]);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [pulses, setPulses] = useState([]);

  // ── Booking modal state ───────────────────────────────────────────────────
  const [bookingOpen, setBookingOpen] = useState(false);
  const [dinner, setDinner] = useState(null);
  const [availableSeats, setAvailableSeats] = useState(8);

  // Fetch active dinner + subscribe to real-time seat count changes
  useEffect(() => {
    let channel;
    let pollInterval;

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

    // Real-time: update whenever dinners row changes (booking confirmed = confirmed_seats increases)
    channel = supabase
      .channel('dinner-seats-live')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'dinners' }, (payload) => {
        const d = payload.new;
        if (d && d.is_active) {
          setDinner(d);
          setAvailableSeats(d.total_seats - d.confirmed_seats);
        }
      })
      .subscribe();

    // Polling fallback every 30s — catches any missed real-time events
    pollInterval = setInterval(load, 30000);

    return () => {
      if (channel) supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
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

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    try {
      await callFn('join-waitlist', {
        dinner_id: dinner?.id,
        email: waitlistEmail,
      });
    } catch (err) {
      console.warn('Waitlist submit:', err.message);
    } finally {
      setWaitlistSubmitted(true);
    }
  };

  // Table Legs and Tethers Rendering Helpers
  const renderLeg = (lx, ly) => (
    <g key={`leg-${lx}-${ly}`} style={{ shapeRendering: 'crispEdges' }}>
      <polygon
        points={`${projectPoint(lx, ly, 15).x},${projectPoint(lx, ly, 15).y} ${projectPoint(lx, ly, 55).x},${projectPoint(lx, ly, 55).y} ${projectPoint(lx, ly + 16, 55).x},${projectPoint(lx, ly + 16, 55).y} ${projectPoint(lx, ly + 16, 15).x},${projectPoint(lx, ly + 16, 15).y}`}
        className="table-leg-face left"
      />
      <polygon
        points={`${projectPoint(lx, ly + 16, 15).x},${projectPoint(lx, ly + 16, 15).y} ${projectPoint(lx, ly + 16, 55).x},${projectPoint(lx, ly + 16, 55).y} ${projectPoint(lx + 16, ly + 16, 55).x},${projectPoint(lx + 16, ly + 16, 55).y} ${projectPoint(lx + 16, ly + 16, 15).x},${projectPoint(lx + 16, ly + 16, 15).y}`}
        className="table-leg-face right"
      />
    </g>
  );

  const renderLegTether = (lx, ly) => (
    <line
      key={`tether-${lx}-${ly}`}
      x1={projectPoint(lx + 8, ly + 8, 15).x}
      y1={projectPoint(lx + 8, ly + 8, 15).y}
      x2={projectPoint(lx + 8, ly + 8, 0).x}
      y2={projectPoint(lx + 8, ly + 8, 0).y}
      className="table-leg-tether"
      style={{ shapeRendering: 'crispEdges' }}
    />
  );

  return (
    <main className="dinner-page dinner-trial-page noise-bg">

      {/* ─── CUSTOM TOP HEADER NAVIGATION ───────────────────────────────────── */}
      <header className="trial-header-nav fade-in-ui">
        <div className="trial-nav-left">
          <Link to="/" className="trial-nav-capsule" style={{ marginRight: '60px' }}>Home</Link>
          <Link to="/dinner" className="trial-nav-capsule" style={{ marginLeft: '10px' }}>Dinner</Link>
        </div>

        <div className="trial-logo-container">
          <img src="/assets/mistrully_logo.png" alt="Vantammayilu Logo" className="trial-logo-img" />
        </div>

        <div className="trial-nav-right">
          <Link to="/community" className="trial-nav-capsule" style={{ marginRight: '30px' }}>Community</Link>
          <Link to="/founder" className="trial-nav-capsule" style={{ marginLeft: '45px' }}>About</Link>
        </div>
      </header>

      {/* ─── LEFT FLOATING CONTENT PANEL ────────────────────────────────────── */}
      <div className="trial-left-floater">
        <h1 className="font-league-gothic text-black leading-[0.85] m-0">
          <TypewriterText text="SUNDAY" delay={1200} />
        </h1>
        <p className="font-handwritten text-[#e45d0b] mt-2 mb-6">
          <TypewriterText text="6:30 p.m. onwards" delay={1800} />
        </p>
        <div className="fade-in-ui">
          <button
            onClick={() => setBookingOpen(true)}
            className="trial-book-btn"
          >
            Book a Seat
          </button>
        </div>
      </div>

      {/* ─── RIGHT FLOATING CONTENT PANEL ───────────────────────────────────── */}
      <div className="trial-right-floater">
        <span className="font-handwritten text-[#e45d0b] leading-none seats-remaining-title">
          <TypewriterText text={`${availableSeats} / 8`} delay={2200} /> <span className="text-black ml-2 font-handwritten seats-remaining-label"><TypewriterText text="remaining" delay={2600} /></span>
        </span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 4: THE CHABUDAI FLOOR MATRIX (Japanese Seating Mat & Two Tables)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="chabudai-matrix-section relative" style={{ marginTop: '100px' }}>
        {!capacityZero ? (
          <div className="matrix-viewport-container" ref={containerRef}>
            {/* MASTER ARCHITECTURAL CANVAS SHEETS */}
            <div className="isometric-projection-stage flex justify-center items-center pointer-events-none ink-reveal">
              <img
                ref={imageRef}
                src="/assets/dintablepho2.png"
                alt="Dinner Table Layout"
                className="w-full h-auto object-contain mx-auto"
                style={{ maxWidth: '920px', transform: 'translate(-20px, -40px)' }}
              />
            </div>
          </div>
        ) : (
          /* Closed waitlist porch */
          <div className="absolute inset-0 bg-[#002fa7] flex items-center justify-center z-30 p-6">
            <div className="bg-[#efe9e1] border-4 border-[#002fa7] shadow-[12px_12px_0px_0px_#e45a0b] w-full max-w-lg p-10 md:p-14 flex flex-col gap-8">
              <h2 className="font-serif font-black uppercase text-[#002fa7] tracking-tighter leading-none"
                style={{ fontSize: 'clamp(3rem, 7vw, 5rem)' }}>
                Table<br />Full.
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

      {/* ─── BOTTOM RIGHT MOROCCO STAMP ──────────────────────────────────────── */}
      <div className="trial-travel-card fade-in-ui">
        <div className="travel-flag-container">
          <svg viewBox="0 0 120 80" className="travel-flag-svg">
            <path
              d="M 6 10 C 15 12, 22 7, 35 11 C 48 8, 62 12, 75 9 C 88 12, 98 6, 112 10 C 114 22, 110 38, 114 50 C 111 62, 115 70, 110 74 C 98 72, 85 75, 72 71 C 60 74, 48 71, 35 73 C 22 70, 15 74, 8 72 C 10 60, 6 48, 10 35 C 7 22, 11 12, 6 10 Z"
              fill="#c1272d"
            />
            <polygon
              points="60,24 65,39 79,39 68,48 72,62 60,53 48,62 52,48 41,39 55,39"
              fill="none"
              stroke="#006233"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="travel-label">Travelling</span>
      </div>

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        dinner={dinner}
        initialSeats={Math.min(selectedSeats.length, 2)}
        onBookingComplete={async () => {
          // Immediately re-fetch seat count after a booking is confirmed
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
        }}
      />

    </main>
  );
}
