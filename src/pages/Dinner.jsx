import React, { useState, useEffect, useRef } from 'react';
import Footer from '../components/Footer';
import { supabase } from '../supabase';
import './Dinner.css';

const DINNER = {
  title: 'Moroccan Supper',
  date: 'Saturday, June 14th',
  time: '8:00 PM',
  location: 'The Loft, Visakhapatnam',
  price: '₹2,500',
  totalSeats: 8,
  availableSeats: 3,
  country: 'Morocco',
  flagCode: 'ma', // ISO 3166-1 alpha-2 code for flagcdn.com
};

const STEPS = [
  'landing', 'identify', 'seat_select', 'otp',
  'locked', 'post_payment', 'confirmed', 'waitlist'
];

const STEP_LABELS = {
  identify: '01 / IDENTIFICATION',
  seat_select: '02 / SEAT SELECTION',
  otp: '03 / VERIFICATION',
  locked: '04 / PAYMENT',
  post_payment: '05 / DETAILS',
  confirmed: '06 / CONFIRMED',
};

export default function Dinner() {
  const [step, setStep] = useState('landing');
  const [prevStep, setPrevStep] = useState(null);
  const [seats, setSeats] = useState(1);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [countdown, setCountdown] = useState(180); // 3 min
  const [locked, setLocked] = useState(false);
  const [dietary, setDietary] = useState('');
  const [guestName, setGuestName] = useState('');
  const [waitPhone, setWaitPhone] = useState('');
  const [waitEmail, setWaitEmail] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const timerRef = useRef(null);
  const otpRefs = useRef([]);

  const isFull = DINNER.availableSeats === 0;

  // Scroll-triggered fade-ins
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.15 }
    );
    document.querySelectorAll('.fade-up-section').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goTo = (nextStep) => {
    setPrevStep(step);
    setStep(nextStep);
    if (nextStep !== 'landing') {
      setPanelOpen(true);
    }
  };

  const closePanel = () => {
    setPanelOpen(false);
    setTimeout(() => setStep('landing'), 600);
  };

  // Countdown timer when seat is locked
  useEffect(() => {
    if (step === 'locked') {
      setCountdown(180);
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setLocked(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [step]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const formatPhone = (val) => {
    const clean = val.replace(/\D/g, '');
    let numbers = clean;
    if (numbers.startsWith('91')) numbers = numbers.substring(2);
    const limited = numbers.substring(0, 10);
    let formatted = '+91 ';
    if (limited.length > 0) formatted += limited.substring(0, 4);
    if (limited.length > 4) formatted += ' ' + limited.substring(4, 7);
    if (limited.length > 7) formatted += ' ' + limited.substring(7, 10);
    return formatted;
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (val && !validateEmail(val)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const checkDuplicateAndSendOtp = async () => {
    setIsCheckingDuplicate(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('phone', phone.replace(/\s/g, ''))
        .eq('dinner_title', DINNER.title)
        .eq('status', 'confirmed');

      if (data && data.length > 0) {
        alert('This phone number has already booked for this event. Duplicate bookings are not allowed.');
        setIsCheckingDuplicate(false);
        return;
      }

      setIsSendingOtp(true);
      const { error: otpError } = await supabase.functions.invoke('send-otp', {
        body: { phone: phone.replace(/\s/g, ''), email }
      });

      if (otpError) throw otpError;

      setIsSendingOtp(false);
      setIsCheckingDuplicate(false);
      goTo('otp');
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to send OTP. Please try again.');
      setIsSendingOtp(false);
      setIsCheckingDuplicate(false);
    }
  };

  const handleOtpChange = (val, idx) => {
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKey = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const verifyOtp = async () => {
    setIsVerifying(true);
    try {
      const otpCode = otp.join('');
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { phone: phone.replace(/\s/g, ''), code: otpCode }
      });

      if (error || !data.success) throw new Error('Invalid OTP');

      setIsVerifying(false);
      goTo('locked');
    } catch (err) {
      alert('Invalid verification code. Please try again.');
      setIsVerifying(false);
    }
  };

  const handlePayment = async () => {
    const amount = parseInt(DINNER.price.replace(/\D/g, '')) * seats;
    
    const { data: orderData, error: orderError } = await supabase.functions.invoke('create-order', {
      body: { amount, phone: phone.replace(/\s/g, ''), email, seats, dinner_title: DINNER.title }
    });

    if (orderError) {
      alert('Failed to initiate payment. Please try again.');
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: "INR",
      name: "Vantammayilu",
      description: `Booking for ${DINNER.title}`,
      order_id: orderData.id,
      handler: async function (response) {
        const { error: verifyError } = await supabase.functions.invoke('verify-payment', {
          body: { 
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature 
          }
        });

        if (verifyError) {
          alert('Payment verification failed. Please contact support.');
          return;
        }

        goTo('post_payment');
      },
      prefill: {
        name: guestName || "",
        email: email,
        contact: phone.replace(/\s/g, '')
      },
      theme: { color: "#FF8811" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const seatsLeft = DINNER.availableSeats;
  const filledSeats = DINNER.totalSeats - seatsLeft;

  return (
    <main className="dinner-page">

      {/* ── COUNTRY BADGE (flag only, fixed below nav) ── */}
      <div className="country-badge-wrap">
        <div className="country-badge">
          <img
            className="badge-flag-img"
            src={`https://flagcdn.com/w160/${DINNER.flagCode}.png`}
            alt={DINNER.country}
          />
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="dinner-hero">
        <div className="hero-text">
          <span className="hero-eyebrow">/ UPCOMING DINNER</span>
          <h1 className="hero-title">{DINNER.title}</h1>
          <div className="hero-meta-row">
            <span>{DINNER.date}</span>
            <span className="meta-sep">—</span>
            <span>{DINNER.time}</span>
            <span className="meta-sep">—</span>
            <span>{DINNER.location}</span>
          </div>

          {/* ── SEAT CIRCLES ── */}
          <div className="seat-circles-section">
            <div className="seat-circles-label">
              {isFull ? 'SOLD OUT' : `${seatsLeft} SEAT${seatsLeft !== 1 ? 'S' : ''} REMAINING`}
            </div>
            <div className="seat-circles-row">
              {Array.from({ length: DINNER.totalSeats }).map((_, i) => (
                <div
                  key={i}
                  className={`seat-circle ${i < filledSeats ? 'filled' : 'empty'}`}
                />
              ))}
            </div>
          </div>

          <div className="hero-price-row">
            <span className="price-tag">{DINNER.price} / seat</span>
          </div>

          {isFull ? (
            <button className="btn-primary" onClick={() => goTo('waitlist')}>Join Waitlist</button>
          ) : (
            <button className="btn-primary" onClick={() => goTo('identify')}>Reserve Your Seat</button>
          )}
        </div>

        <div className="dinner-pillars">
          {[
            { n: '01', label: 'Guests', val: '8 only' },
            { n: '02', label: 'Format', val: 'Communal' },
            { n: '03', label: 'Menu', val: 'Curated' },
            { n: '04', label: 'Duration', val: '3 hours' },
          ].map(p => (
            <div key={p.n} className="pillar">
              <span className="pillar-n">{p.n}</span>
              <span className="pillar-label">{p.label}</span>
              <span className="pillar-val">{p.val}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── RULES ── */}
      <section className="dinner-rules fade-up-section">
        <div className="rules-label">/ HOW IT WORKS</div>
        <div className="rules-grid">
          {[
            { step: '01', title: 'Identify', desc: 'Enter your phone and email. We check if you\'re new or returning.' },
            { step: '02', title: 'Select Seats', desc: 'Choose 1 or 2 seats. Maximum 2 per booking to maintain the format.' },
            { step: '03', title: 'Verify', desc: 'OTP sent to your phone. One verified identity per booking.' },
            { step: '04', title: 'Pay', desc: 'Seats are held for 3 minutes. First to pay confirms the booking.' },
            { step: '05', title: 'Arrive', desc: 'You\'ll get instant confirmation via WhatsApp and email.' },
          ].map(r => (
            <div key={r.step} className="rule-card">
              <span className="rule-step">{r.step}</span>
              <h3 className="rule-title">{r.title}</h3>
              <p className="rule-desc">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── POLICY ── */}
      <section className="policy-strip fade-up-section">
        <div className="policy-label">/ BOOKING POLICY</div>
        <div className="policy-items">
          {[
            'No cancellations or refunds within 48 hours of the event.',
            'Limited to 2 seats per booking to ensure a diverse communal experience.',
            'Seats are locked for 3 minutes during the payment window.',
            'Waitlist does not guarantee a seat but gives priority access.'
          ].map((text, i) => (
            <div key={i} className="policy-item">
              <span className="policy-check">✓</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── SLIDING BOOKING PANEL ── */}
      <div className={`booking-panel ${panelOpen ? 'open' : ''}`}>
        <button
          className="panel-back-btn"
          onClick={() => {
            if (step === 'identify') closePanel();
            else if (step === 'seat_select') goTo('identify');
            else if (step === 'otp') goTo('seat_select');
            else if (step === 'locked' || step === 'post_payment') { /* no back */ }
            else closePanel();
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {step === 'confirmed' || step === 'waitlist'
              ? <path d="M18 6L6 18M6 6l12 12" />
              : <path d="M19 12H5M12 19l-7-7 7-7" />}
          </svg>
        </button>

        {STEP_LABELS[step] && <div className="panel-step-label">{STEP_LABELS[step]}</div>}

        {step === 'identify' && (
          <div className="panel-content">
            <h2 className="panel-title">Who are you?</h2>
            <p className="panel-sub">We use this to check your status and ensure fairness.</p>
            <div className="form-stack">
              <div className="form-field">
                <label>PHONE NUMBER</label>
                <input type="tel" placeholder="+91 0000 000 000" value={phone} onChange={handlePhoneChange} />
              </div>
              <div className="form-field">
                <label>EMAIL</label>
                <input type="email" placeholder="you@example.com" value={email} onChange={handleEmailChange} />
                {emailError && <span className="error-text">{emailError}</span>}
              </div>
              <p className="form-note">Used to verify your identity and ensure fairness across bookings.</p>
              <button className="btn-primary" disabled={!phone || phone.length < 15 || !email || !!emailError} onClick={() => goTo('seat_select')}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 'seat_select' && (
          <div className="panel-content">
            <h2 className="panel-title">Select Seats</h2>
            <p className="panel-sub">Maximum 2 seats per booking. This maintains the intended format.</p>
            <div className="seat-options">
              {[1, 2].map(n => (
                <button
                  key={n}
                  className={`seat-option-btn ${seats === n ? 'selected' : ''}`}
                  onClick={() => setSeats(n)}
                >
                  <span className="seat-num">{n}</span>
                  <span className="seat-word">{n === 1 ? 'Seat' : 'Seats'}</span>
                  <span className="seat-price">{DINNER.price}{n === 2 ? ' × 2' : ''}</span>
                </button>
              ))}
            </div>
            <div className="seat-summary">
              <span>Total</span>
              <span className="total-price">₹{(2500 * seats).toLocaleString()}</span>
            </div>
            <div className="seats-left-note">
              <span className="dot-indicator" />
              {seatsLeft} seats remaining right now
            </div>
            <button className="btn-primary" onClick={checkDuplicateAndSendOtp} disabled={isCheckingDuplicate || isSendingOtp}>
              {isCheckingDuplicate ? 'Checking...' : isSendingOtp ? 'Sending code...' : 'Proceed to Verification →'}
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="panel-content">
            <h2 className="panel-title">Verify Your Number</h2>
            <p className="panel-sub">A 6-digit code was sent to <strong>{phone}</strong></p>
            <div className="otp-row">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => otpRefs.current[i] = el}
                  className="otp-box"
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(e.target.value, i)}
                  onKeyDown={e => handleOtpKey(e, i)}
                />
              ))}
            </div>
            <p className="form-note">Didn't receive it? <span className="link-inline">Resend code</span></p>
            <button className="btn-primary" onClick={verifyOtp} disabled={otp.some(d => !d) || isVerifying}>
              {isVerifying ? 'Verifying...' : 'Verify & Lock Seat →'}
            </button>
          </div>
        )}

        {step === 'locked' && (
          <div className="panel-content center-content">
            {locked ? (
              <>
                <div className="timeout-icon">⏱</div>
                <h2 className="panel-title">Time Expired</h2>
                <p className="panel-sub">Your seat has been released. You are blocked from booking for 1 hour.</p>
                <button className="btn-ghost" onClick={closePanel}>Go Back</button>
              </>
            ) : (
              <>
                <div className="lock-badge">SEAT LOCKED</div>
                <div className="countdown-display">{formatTime(countdown)}</div>
                <p className="panel-sub">Your {seats === 2 ? '2 seats are' : 'seat is'} reserved.<br />Complete payment before time expires.</p>
                <div className="payment-summary-box">
                  <div className="ps-row"><span>Dinner</span><span>{DINNER.title}</span></div>
                  <div className="ps-row"><span>Date</span><span>{DINNER.date}</span></div>
                  <div className="ps-row"><span>Seats</span><span>{seats}</span></div>
                  <div className="ps-row total"><span>Total</span><span>₹{(2500 * seats).toLocaleString()}</span></div>
                </div>
                <button className="btn-primary pay-btn" onClick={handlePayment}>
                  CONFIRM & PAY VIA RAZORPAY →
                </button>
              </>
            )}
          </div>
        )}

        {step === 'post_payment' && (
          <div className="panel-content">
            <h2 className="panel-title">A Few Quick Details</h2>
            <p className="panel-sub">Help us make the evening perfect for you.</p>
            <div className="form-stack">
              <div className="form-field">
                <label>DIETARY RESTRICTIONS</label>
                <input type="text" placeholder="e.g. Vegetarian, Nut allergy…" value={dietary} onChange={e => setDietary(e.target.value)} />
              </div>
              {seats === 2 && (
                <div className="form-field">
                  <label>GUEST NAME</label>
                  <input type="text" placeholder="Full name of your guest" value={guestName} onChange={e => setGuestName(e.target.value)} />
                </div>
              )}
              <p className="form-note">This data is stored securely and used only for event execution.</p>
              <button className="btn-primary" onClick={() => goTo('confirmed')}>Submit & Confirm →</button>
            </div>
          </div>
        )}

        {step === 'confirmed' && (
          <div className="panel-content center-content">
            <div className="confirm-icon">✓</div>
            <h2 className="panel-title">You're In.</h2>
            <p className="panel-sub">Booking confirmed for <strong>{DINNER.date}</strong> at <strong>{DINNER.time}</strong>.</p>
            <div className="confirm-details">
              <div className="cd-row"><span>Reference ID</span><span>#{(Math.random() * 1000000).toFixed(0)}</span></div>
              <div className="cd-row"><span>Guest List</span><span>{seats} {seats === 1 ? 'Person' : 'People'}</span></div>
            </div>
            <p className="confirm-note">A confirmation has been sent to your WhatsApp and Email.</p>
            <div className="reminder-pills">
              <div className="reminder-pill">48H REMINDER</div>
              <div className="reminder-pill">12H REMINDER</div>
            </div>
            <button className="btn-primary" onClick={closePanel}>Done</button>
          </div>
        )}

        {step === 'waitlist' && (
          <div className="panel-content">
            <h2 className="panel-title">Join the Waitlist</h2>
            <p className="panel-sub">This dinner is fully booked. If a seat opens, you'll be notified.</p>
            <div className="form-stack">
              <div className="form-field">
                <label>PHONE NUMBER</label>
                <input type="tel" placeholder="+91 0000 000 000" value={waitPhone} onChange={e => setWaitPhone(formatPhone(e.target.value))} />
              </div>
              <div className="form-field">
                <label>EMAIL</label>
                <input type="email" placeholder="you@example.com" value={waitEmail} onChange={e => setWaitEmail(e.target.value)} />
              </div>
              <button className="btn-primary" onClick={() => goTo('confirmed')}>Join Waitlist →</button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
