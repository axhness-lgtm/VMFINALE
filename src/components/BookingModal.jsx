import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabase';
import './BookingModal.css';

const SUPABASE_FN = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
  : '';
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

// Is this a real Razorpay key? (not the placeholder)
const IS_DEV_MODE = !RAZORPAY_KEY || RAZORPAY_KEY === 'rzp_test_XXXXXXXXXXXXXXX';
const IS_TEST_KEY = RAZORPAY_KEY.startsWith('rzp_test_');

const callFn = async (name, body) => {
  try {
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
  } catch (err) {
    if (IS_DEV_MODE) {
      console.warn(`[DEV MODE] Edge function '${name}' failed/unreachable. Using mock data.`, err);
      if (name === 'send-otp') {
        return { success: true, message: 'Simulated OTP sent' };
      }
      if (name === 'verify-otp') {
        return { success: true };
      }
      if (name === 'lock-seats') {
        // line 38
        return { locked_until: new Date(Date.now() + 15 * 1000).toISOString() };
      }
      if (name === 'release-lock') {
        return { success: true };
      }
      if (name === 'create-order') {
        return { id: `order_mock_${Date.now()}`, amount: (body.amount || 2999) * 100 };
      }
      if (name === 'verify-payment') {
        return { success: true, booking_id: `booking_mock_${Date.now()}` };
      }
      if (name === 'send-confirmation') {
        return { success: true };
      }
      if (name === 'join-waitlist') {
        return { success: true };
      }
    }
    throw err;
  }
};

// Steps: identify → seats → otp → lock → payment → details → confirmed
const STEPS = ['identify', 'seats', 'otp', 'lock', 'payment', 'details', 'confirmed'];

export default function BookingModal({ isOpen, onClose, dinner, initialSeats = 1, onBookingComplete }) {
  const [step, setStep] = useState('identify');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [seats, setSeats] = useState(initialSeats);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [lockExpiry, setLockExpiry] = useState(null);
  const [countdown, setCountdown] = useState(300);
  const [lockoutMins, setLockoutMins] = useState(0);
  const [bookingId, setBookingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [name, setName] = useState('');
  const [dietary, setDietary] = useState('none');
  const [allergies, setAllergies] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestDietary, setGuestDietary] = useState('none');
  const [guestAllergies, setGuestAllergies] = useState('');
  const [stepAnim, setStepAnim] = useState(true);

  const otpRefs = useRef([]);
  const lockTimerRef = useRef(null);
  const rzpRef = useRef(null);

  // Animate step change
  const goStep = (s) => {
    setStepAnim(false);
    setTimeout(() => { setStep(s); setStepAnim(true); }, 80);
  };

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep('identify');
      setError('');
      setOtp(['', '', '', '', '', '']);
      setCountdown(300);
      setStepAnim(true);
      setSeats(initialSeats || 1);
    }
  }, [isOpen, initialSeats]);

  // Countdown ticker for lock step
  useEffect(() => {
    if (step !== 'lock' || !lockExpiry) return;
    const tick = () => {
      const remaining = Math.max(0, Math.floor((new Date(lockExpiry) - Date.now()) / 1000));
      setCountdown(remaining);
      if (remaining === 0) handleTimeout();
    };
    tick();
    lockTimerRef.current = setInterval(tick, 1000);
    return () => clearInterval(lockTimerRef.current);
  }, [step, lockExpiry]);

  // Resend OTP cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleTimeout = useCallback(async () => {
    clearInterval(lockTimerRef.current);
    if (rzpRef.current) {
      try {
        rzpRef.current.close();
      } catch (err) {
        console.warn('Failed to close Razorpay checkout:', err);
      }
      rzpRef.current = null;
    }
    try { await callFn('release-lock', { phone, reason: 'timeout' }); } catch { }
    setLockoutMins(10);
    goStep('lockout');
  }, [phone]);
  // ── STEP 1: Identify ──────────────────────────────────────────────────────
  const handleIdentify = async (e) => {
    e.preventDefault();
    setError('');
    // Normalize phone — add +91 if bare 10-digit Indian number
    let normalizedPhone = phone.replace(/\s/g, '');
    if (/^[6-9]\d{9}$/.test(normalizedPhone)) normalizedPhone = '+91' + normalizedPhone;
    if (!/^\+?[0-9]{10,15}$/.test(normalizedPhone)) {
      setError('Enter a valid phone number (e.g. 9876543210 or +91 98765 43210)');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    setPhone(normalizedPhone);
    goStep('seats');
  };

  // ── STEP 2: Seats ─────────────────────────────────────────────────────────
  const handleSeatsNext = () => {
    setError('');
    sendOtp();
  };

  // ── STEP 3: OTP ───────────────────────────────────────────────────────────
  const sendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await callFn('send-otp', { phone, email });
      goStep('otp');
      setResendCooldown(60);
      if (res.devMode && res.code) {
        console.warn(`[DEV MODE] Simulated SMS sent. Verification code: ${res.code}`);
        setOtp(res.code.split(''));
      }
      setTimeout(() => otpRefs.current[0]?.focus(), 200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (val, idx) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
    if (!val && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) setOtp(paste.split(''));
    e.preventDefault();
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) { setError('Enter the 6-digit code'); return; }
    setLoading(true);
    setError('');
    try {
      await callFn('verify-otp', { phone, code });
      // Lock seats immediately after OTP verified
      const { locked_until } = await callFn('lock-seats', {
        phone, email, seats, dinner_id: dinner?.id
      });
      setLockExpiry(locked_until);
      goStep('lock');
    } catch (err) {
      if (err.message.startsWith('LOCKED_OUT:')) {
        setLockoutMins(parseInt(err.message.split(':')[1]));
        goStep('lockout');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 4→5: Payment ─────────────────────────────────────────────────────
  const handleProceedToPayment = async () => {
    setLoading(true);
    setError('');

    // DEV MODE: simulated payment when no real Razorpay key is set
    if (IS_DEV_MODE) {
      try {
        let bookingIdVal = `DEV_BOOK_${Date.now()}`;
        try {
          // Create a fake booking record for testing
          const { data: booking, error: dbErr } = await supabase
            .from('bookings')
            .insert({
              phone, email,
              dinner_id: dinner?.id || null,
              seats,
              dinner_title: dinner?.title ?? 'Vantammayilu Dinner',
              status: 'confirmed',
              razorpay_order_id: `DEV_ORDER_${Date.now()}`,
              razorpay_payment_id: `DEV_PAY_${Date.now()}`,
              is_repeat_guest: false,
            })
            .select()
            .single();
          if (dbErr) throw dbErr;
          if (booking) {
            bookingIdVal = booking.id;
          }
          await supabase.from('seat_locks').delete().eq('phone', phone).catch(() => { });
        } catch (dbErr) {
          console.warn('[DEV MODE] Database booking insert failed, using mock booking ID.', dbErr);
        }
        clearInterval(lockTimerRef.current);
        setBookingId(bookingIdVal);
        goStep('details');
      } catch (err) {
        setError('Dev mode error: ' + err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    // REAL PAYMENT via Razorpay
    try {
      const amount = (dinner?.price_inr ?? 299900) * seats;
      const order = await callFn('create-order', {
        amount: amount / 100, // edge fn expects rupees
        phone, email, seats,
        name: name || email,
        dinner_title: dinner?.title ?? 'Vantammayilu Dinner',
        dinner_id: dinner?.id,
        event_date: dinner?.event_date,
      });

      // Detect if edge function returned a mock order (Razorpay keys missing in Supabase)
      if (order.id && (order.id.startsWith('MOCK_') || order.id.toLowerCase().includes('mock'))) {
        console.warn('[BookingModal] Edge function returned a mock order. Bypassing Razorpay checkout and simulating payment.');
        const res = await callFn('verify-payment', {
          razorpay_payment_id: `MOCK_PAY_${Date.now()}`,
          razorpay_order_id: order.id,
          razorpay_signature: 'mock_signature',
          phone, email, seats, dinner_id: dinner?.id
        });
        setBookingId(res.booking_id);
        clearInterval(lockTimerRef.current);
        goStep('details');
        if (onBookingComplete) onBookingComplete();
        setLoading(false);
        return;
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: 'INR',
        name: 'Vantammayilu',
        description: dinner?.title ?? 'Dinner reservation',
        order_id: order.id,
        prefill: { name: name || '', email, contact: phone },
        theme: { color: '#002fa7' },
        modal: {
          escape: false,
          ondismiss: () => {
            setLoading(false);
            rzpRef.current = null;
          }
        },
        handler: async (response) => {
          try {
            const res = await callFn('verify-payment', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              phone, email, seats, dinner_id: dinner?.id
            });
            setBookingId(res.booking_id);
            clearInterval(lockTimerRef.current);
            goStep('details');
          } catch (err) {
            setError('Payment verification failed: ' + err.message);
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzpRef.current = rzp;
      rzp.on('payment.failed', () => {
        setError('Payment failed. Your seat lock is still active — try again.');
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSimulatePayment = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('[BookingModal] Simulating payment via verify-payment edge function...');
      const res = await callFn('verify-payment', {
        razorpay_payment_id: `MOCK_PAY_${Date.now()}`,
        razorpay_order_id: `MOCK_ORDER_${Date.now()}`,
        razorpay_signature: 'mock_signature',
        phone, email, seats, dinner_id: dinner?.id
      });
      
      clearInterval(lockTimerRef.current);
      setBookingId(res.booking_id);
      goStep('details');
      if (onBookingComplete) onBookingComplete();
    } catch (err) {
      console.warn('[BookingModal] Edge function verify-payment failed, falling back to client-side insert.', err);
      let bookingIdVal = `DEV_BOOK_${Date.now()}`;
      try {
        const { data: booking, error: dbErr } = await supabase
          .from('bookings')
          .insert({
            phone, email,
            dinner_id: dinner?.id || null,
            seats,
            dinner_title: dinner?.title ?? 'Vantammayilu Dinner',
            status: 'confirmed',
            razorpay_order_id: `DEV_ORDER_${Date.now()}`,
            razorpay_payment_id: `DEV_PAY_${Date.now()}`,
            is_repeat_guest: false,
          })
          .select()
          .single();
        if (dbErr) throw dbErr;
        if (booking) {
          bookingIdVal = booking.id;
        }
        await supabase.from('seat_locks').delete().eq('phone', phone).catch(() => { });
      } catch (dbErr2) {
        console.warn('[DEV MODE] Client-side insert fallback failed, using mock booking ID.', dbErr2);
      }
      clearInterval(lockTimerRef.current);
      setBookingId(bookingIdVal);
      goStep('details');
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 6: Post-payment details ──────────────────────────────────────────
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Please enter your name'); return; }
    setLoading(true);
    setError('');
    try {
      try {
        const { error: dbErr } = await supabase.from('contacts').insert({
          booking_id: bookingId,
          primary_name: name,
          dietary,
          allergies: allergies || null,
          guest_name: seats === 2 ? guestName : null,
          guest_dietary: seats === 2 ? guestDietary : null,
          guest_allergies: seats === 2 ? guestAllergies : null,
        });
        if (dbErr) throw dbErr;
      } catch (dbErr) {
        if (IS_DEV_MODE) {
          console.warn('[DEV MODE] Database contacts insert failed, continuing to success screen.', dbErr);
        } else {
          throw dbErr;
        }
      }

      // Fire send-confirmation (fire-and-forget)
      callFn('send-confirmation', {
        booking_id: bookingId,
        phone, email, name,
        seats,
        dinner_title: dinner?.title ?? 'Vantammayilu Dinner',
        event_date: dinner?.event_date ?? null,
      }).catch(() => { });

      goStep('confirmed');
      if (onBookingComplete) onBookingComplete();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const price = (dinner?.price_inr ?? 299900) * seats / 100;

  if (!isOpen) return null;

  return (
    <div className="bm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bm-modal">
        {/* Close */}
        {step !== 'confirmed' && (
          <button className="bm-close" onClick={onClose} aria-label="Close">✕</button>
        )}

        {/* DEV MODE banner */}
        {IS_DEV_MODE && !['lockout', 'confirmed'].includes(step) && (
          <div className="bm-dev-banner font-typewriter">
            [ DEV MODE — offline simulator active // payment & verification will be simulated ]
          </div>
        )}

        {/* Progress bar */}
        {!['lockout', 'confirmed'].includes(step) && (
          <div className="bm-progress">
            {['identify', 'seats', 'otp', 'lock', 'payment', 'details'].map((s, i) => (
              <div
                key={s}
                className={`bm-progress-dot ${STEPS.indexOf(step) >= i ? 'done' : ''}`}
              />
            ))}
          </div>
        )}

        <div className={`bm-step-wrapper ${stepAnim ? 'step-in' : 'step-out'}`}>

          {/* ── STEP 1: Identify ── */}
          {step === 'identify' && (
            <form className="bm-step" onSubmit={handleIdentify}>
              <div className="bm-step-tag font-handwritten">Step 01 — Identify</div>
              <h2 className="bm-title">Who's coming?</h2>
              <p className="bm-subtitle">We'll check if you've dined with us before.</p>
              <div className="bm-field-group">
                <label className="bm-label">Phone number</label>
                <input
                  className="bm-input"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="bm-field-group">
                <label className="bm-label">Email address</label>
                <input
                  className="bm-input"
                  type="email"
                  placeholder="name@server.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              {error && <div className="bm-error">{error}</div>}
              <button className="bm-btn-primary" type="submit">
                Continue →
              </button>
            </form>
          )}

          {/* ── STEP 2: Seats ── */}
          {step === 'seats' && (
            <div className="bm-step">
              <div className="bm-step-tag font-handwritten">Step 02 — Select seats</div>
              <h2 className="bm-title">How many seats?</h2>
              <p className="bm-subtitle">Maximum 2 seats per booking.</p>

              {/* Show confirmed contact info */}
              <div className="bm-info-summary">
                <div className="bm-info-block">
                  <span className="bm-label">Booking for</span>
                  <span className="bm-info-value">{phone}</span>
                  <span className="bm-info-value" style={{ fontSize: '18px', opacity: 0.7 }}>{email}</span>
                </div>
              </div>

              <div className="bm-field-group" style={{ marginBottom: '24px' }}>
                <label className="bm-label">Number of seats</label>
                <select
                  className="bm-input bm-select font-mono"
                  style={{ width: '100%', cursor: 'pointer' }}
                  value={seats}
                  onChange={e => setSeats(parseInt(e.target.value))}
                >
                  <option value="1">1 seat — ₹{((dinner?.price_inr ?? 299900) / 100).toLocaleString('en-IN')}</option>
                  <option value="2">2 seats — ₹{(((dinner?.price_inr ?? 299900) * 2) / 100).toLocaleString('en-IN')}</option>
                </select>
              </div>
              <div className="bm-info-summary" style={{ marginBottom: '8px' }}>
                <div className="bm-info-block">
                  <span className="bm-label">Total amount</span>
                  <span className="bm-info-value large orange">₹{price.toLocaleString('en-IN')}</span>
                </div>
              </div>
              {error && <div className="bm-error">{error}</div>}
              <button className="bm-btn-primary" onClick={handleSeatsNext} disabled={loading}>
                {loading ? 'Sending code...' : 'Continue to verify →'}
              </button>
              <button className="bm-btn-ghost" onClick={() => goStep('identify')}>← Back</button>
            </div>
          )}

          {/* ── STEP 3: OTP ── */}
          {step === 'otp' && (
            <div className="bm-step">
              <div className="bm-step-tag font-handwritten">Step 03 — Verify phone</div>
              <h2 className="bm-title">Enter code</h2>
              <div className="bm-info-summary">
                <div className="bm-info-block">
                  <span className="bm-label">Verification</span>
                  <span className="bm-info-value" style={{ fontSize: '18px' }}>{phone}</span>
                </div>
              </div>
              {otp.join('').length === 6 && (
                <div style={{ fontFamily: 'Mistrully, cursive', fontSize: '14px', color: '#e45a0b', opacity: 0.85, marginBottom: '4px' }}>
                  Code auto-filled — click verify to continue
                </div>
              )}
              <div className="bm-otp-row" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    className="bm-otp-box"
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(e.target.value, i)}
                    onKeyDown={e => {
                      if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
                    }}
                  />
                ))}
              </div>
              {error && <div className="bm-error">{error}</div>}
              <button className="bm-btn-primary" onClick={handleVerifyOtp} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & lock seat →'}
              </button>
              <button
                className="bm-btn-ghost"
                onClick={sendOtp}
                disabled={resendCooldown > 0 || loading}
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
              </button>
            </div>
          )}

          {/* ── STEP 4: Lock (countdown + pay CTA) ── */}
          {step === 'lock' && (
            <div className="bm-step bm-lock-step">
              <div className="bm-step-tag font-handwritten">Step 04 — Seat locked</div>
              <div className={`bm-countdown ${countdown < 60 ? 'urgent' : ''}`}>
                {fmtTime(countdown)}
              </div>
              <p className="bm-lock-label">Your seat is held</p>
              <p className="bm-subtitle">
                Complete payment before the timer runs out.<br />
                After timeout, your slot is released and your phone is locked out for 10 minutes.
              </p>
              {/* Key booking summary in League Gothic */}
              <div className="bm-info-summary" style={{ width: '100%', marginBottom: '8px' }}>
                <div className="bm-info-block">
                  <span className="bm-label">Seats</span>
                  <span className="bm-info-value">{seats} seat{seats > 1 ? 's' : ''}</span>
                </div>
                <div className="bm-info-block">
                  <span className="bm-label">Total amount</span>
                  <span className="bm-info-value large orange">₹{price.toLocaleString('en-IN')}</span>
                </div>
                <div className="bm-info-block">
                  <span className="bm-label">Phone</span>
                  <span className="bm-info-value" style={{ fontSize: '20px' }}>{phone}</span>
                </div>
              </div>
              {error && <div className="bm-error">{error}</div>}

              <button className="bm-btn-primary bm-btn-orange" onClick={handleProceedToPayment} disabled={loading}>
                {loading
                  ? 'Opening gateway...'
                  : IS_DEV_MODE
                    ? 'Simulate payment (dev mode)'
                    : 'Pay now — secure your seat'
                }
              </button>

              {IS_TEST_KEY && !IS_DEV_MODE && (
                <button
                  type="button"
                  className="bm-btn-ghost"
                  style={{ marginTop: '12px', color: '#e45a0b', borderColor: '#e45a0b' }}
                  onClick={handleSimulatePayment}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : '[ Simulating / Bypass Payment ]'}
                </button>
              )}
            </div>
          )}

          {/* ── LOCKOUT screen ── */}
          {step === 'lockout' && (
            <div className="bm-step bm-lockout-step">
              <div className="bm-step-tag font-handwritten">System — Lockout</div>
              <div className="bm-lockout-icon">✕</div>
              <h2 className="bm-title">Seat Released.</h2>
              <p className="bm-subtitle">
                Payment was not completed in time. Your seat has been released
                and your phone is locked out for <strong>{lockoutMins} minutes</strong>.
              </p>
              <p className="bm-subtitle" style={{ opacity: 0.6 }}>
                This prevents system abuse and keeps allocations fair.
              </p>
              <button className="bm-btn-ghost" onClick={onClose}>Close</button>
            </div>
          )}

          {/* ── STEP 5: Post-payment details ── */}
          {step === 'details' && (
            <form className="bm-step" onSubmit={handleDetailsSubmit}>
              <div className="bm-step-tag font-handwritten">Step 05 — Guest details</div>
              <h2 className="bm-title">Almost there.</h2>
              <p className="bm-subtitle">A few quick details for a smooth experience.</p>

              <div className="bm-field-group">
                <label className="bm-label">Your name</label>
                <input
                  className="bm-input"
                  placeholder="Full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="bm-field-group">
                <label className="bm-label">Dietary preference</label>
                <select className="bm-input bm-select" value={dietary} onChange={e => setDietary(e.target.value)}>
                  <option value="none">No restrictions</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="halal">Halal</option>
                  <option value="jain">Jain</option>
                </select>
              </div>
              <div className="bm-field-group">
                <label className="bm-label">Allergies (optional)</label>
                <input
                  className="bm-input"
                  placeholder="Nuts, shellfish, gluten..."
                  value={allergies}
                  onChange={e => setAllergies(e.target.value)}
                />
              </div>

              {seats === 2 && (
                <>
                  <div className="bm-divider">Guest 2 details</div>
                  <div className="bm-field-group">
                    <label className="bm-label">Guest name</label>
                    <input
                      className="bm-input"
                      placeholder="Guest's full name"
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                    />
                  </div>
                  <div className="bm-field-group">
                    <label className="bm-label">Guest dietary preference</label>
                    <select className="bm-input bm-select" value={guestDietary} onChange={e => setGuestDietary(e.target.value)}>
                      <option value="none">No restrictions</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="halal">Halal</option>
                      <option value="jain">Jain</option>
                    </select>
                  </div>
                  <div className="bm-field-group">
                    <label className="bm-label">Guest allergies (optional)</label>
                    <input
                      className="bm-input"
                      placeholder="Nuts, shellfish, gluten..."
                      value={guestAllergies}
                      onChange={e => setGuestAllergies(e.target.value)}
                    />
                  </div>
                </>
              )}

              {error && <div className="bm-error">{error}</div>}
              <button className="bm-btn-primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Finalise booking →'}
              </button>
            </form>
          )}

          {/* ── STEP 7: Confirmed ── */}
          {step === 'confirmed' && (
            <div className="bm-step bm-confirmed-step">
              <div className="bm-confirmed-stamp distressed-stamp stamp-slam-active">
                [ SEAT SECURED ]
              </div>
              <div className="bm-step-tag font-handwritten">Booking — Confirmed</div>
              <h2 className="bm-title">Seat secured.</h2>
              <p className="bm-subtitle">
                Check your email{IS_DEV_MODE ? '' : ' and WhatsApp'} for confirmation.<br />
                We'll send reminders 48hrs and 12hrs before the dinner.
              </p>
              <div className="bm-info-summary" style={{ width: '100%', textAlign: 'left', marginBottom: '16px' }}>
                <div className="bm-info-block">
                  <span className="bm-label">Dinner</span>
                  <span className="bm-info-value" style={{ fontSize: '20px' }}>{dinner?.title ?? 'Vantammayilu Dinner'}</span>
                </div>
                <div className="bm-info-block">
                  <span className="bm-label">Seats</span>
                  <span className="bm-info-value">{seats} seat{seats > 1 ? 's' : ''}</span>
                </div>
                <div className="bm-info-block">
                  <span className="bm-label">Amount paid</span>
                  <span className="bm-info-value large orange">₹{price.toLocaleString('en-IN')}</span>
                </div>
                <div className="bm-info-block">
                  <span className="bm-label">Booking ref</span>
                  <span className="bm-info-value" style={{ fontSize: '22px', letterSpacing: '0.1em' }}>{bookingId?.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="bm-info-block">
                  <span className="bm-label">Location</span>
                  <span className="bm-info-value" style={{ fontSize: '18px', opacity: 0.75 }}>Shared 24hrs before event</span>
                </div>
              </div>
              <p className="bm-confirmed-note">
                Phones off. Conversations on.<br />
                Doors close at exactly 7:30 PM.
              </p>
              <button className="bm-btn-primary" onClick={onClose}>Close</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
