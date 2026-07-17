import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import './BookingModal.css';

const IS_DEV_MODE = !import.meta.env.VITE_RAZORPAY_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY_ID.includes('test_XXX');

export default function BookingModal({ isOpen, onClose, dinner, onBookingComplete }) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [step, setStep] = useState('seats');
  const [seats, setSeats] = useState(1);
  const [availableSeats, setAvailableSeats] = useState(null);
  const [interestedCount, setInterestedCount] = useState(0);

  const [lockExpiry, setLockExpiry] = useState(null);
  const [countdown, setCountdown] = useState(600);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Core booking data — kept simple
  const [bookingId, setBookingId] = useState(null);
  const [guestUserId, setGuestUserId] = useState(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [customerQuery, setCustomerQuery] = useState('');

  // Second person details when 2 seats selected
  const [secondGuestName, setSecondGuestName] = useState('');
  const [secondGuestEmail, setSecondGuestEmail] = useState('');
  const [secondGuestPhone, setSecondGuestPhone] = useState('');

  const getFormattedQuery = () => {
    let q = customerQuery.trim();
    if (seats === 2 && (secondGuestName.trim() || secondGuestEmail.trim() || secondGuestPhone.trim())) {
      const parts = [
        secondGuestName.trim() && `Name: ${secondGuestName.trim()}`,
        secondGuestEmail.trim() && `Email: ${secondGuestEmail.trim()}`,
        secondGuestPhone.trim() && `Phone: ${secondGuestPhone.trim()}`
      ].filter(Boolean).join(', ');
      if (parts) {
        q = (q ? q + '\n\n' : '') + `[Second Guest Details] ${parts}`;
      }
    }
    return q || null;
  };

  // Track how many finalize attempts have been made (for auto-retry)
  const [finalizeAttempts, setFinalizeAttempts] = useState(0);
  const [stepAnim, setStepAnim] = useState(true);

  const lockTimerRef = useRef(null);
  const rzpRef = useRef(null);
  const finalizeCalledRef = useRef(false);

  const goStep = (s) => {
    setStepAnim(false);
    setTimeout(() => { setStep(s); setStepAnim(true); }, 80);
  };

  useEffect(() => {
    if (isOpen && dinner?.id) {
      setStep('seats');
      setError('');
      setCountdown(600);
      setStepAnim(true);
      setFinalizeAttempts(0);
      finalizeCalledRef.current = false;
      fetchStatus();
    }
  }, [isOpen, dinner]);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`/api/bookings/status?occurrence_id=${dinner.id}`);
      const data = await res.json();
      if (res.ok) {
        setAvailableSeats(data.available_seats);
        setInterestedCount(data.interested_count);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Countdown timer while Razorpay modal is open
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

  const handleTimeout = useCallback(async () => {
    clearInterval(lockTimerRef.current);
    if (rzpRef.current) {
      try { rzpRef.current.close(); } catch (e) {}
      rzpRef.current = null;
    }
    goStep('lockout');
  }, []);

  // ── Core finalize function — called once after payment verified ──────────
  const finalizeBooking = async ({ bookingIdVal, guestUserIdVal, guestEmailVal, seatsVal, queryVal }) => {
    if (finalizeCalledRef.current) return; // prevent double-call
    finalizeCalledRef.current = true;

    setLoading(true);
    setError('');

    const timeoutId = setTimeout(() => {
      setLoading(false);
      finalizeCalledRef.current = false; // allow retry
      setError('Request timed out — please click "Confirm Seat" to try again.');
    }, 20000);

    try {
      const body = {
        token,
        user_id: guestUserIdVal,
        booking_id: bookingIdVal || `guest_${Date.now()}`,
        customer_query: queryVal || null,
        occurrence_id: dinner.id,
        seats: seatsVal,
        email: guestEmailVal
      };

      console.log('[BookingModal] Calling finalize with:', body);

      const res = await fetch('/api/bookings/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      clearTimeout(timeoutId);
      console.log('[BookingModal] Finalize response:', data);

      if (!res.ok) {
        throw new Error(data.details || data.error || `Server error (${res.status})`);
      }

      setLoading(false);
      onBookingComplete?.();
      goStep('confirmed');
    } catch (err) {
      clearTimeout(timeoutId);
      finalizeCalledRef.current = false; // allow retry
      setError('Could not confirm seat: ' + err.message);
      setLoading(false);
      setFinalizeAttempts(prev => prev + 1);
    }
  };

  // ── Step 1: Lock seats + open Razorpay ───────────────────────────────────
  const handleSeatsNext = async () => {
    if (!token && (!guestEmail || !guestEmail.includes('@'))) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/bookings/lock-seats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email: guestEmail, phone: guestPhone, seats, occurrence_id: dinner.id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error);

      setLockExpiry(data.locked_until);
      if (data.user_id) setGuestUserId(data.user_id);
      if (data.email) setGuestEmail(data.email);

      const amount = data.amount;
      const orderId = data.order_id;

      if (!IS_DEV_MODE) {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount,
          currency: 'INR',
          name: dinner?.title?.toUpperCase() || 'VANTAMMAYILU',
          description: 'Seat Reservation',
          order_id: orderId,
          prefill: { email: data.email, contact: data.phone },
          theme: { color: '#e86321' },
          modal: {
            escape: false,
            ondismiss: () => {
              setLoading(false);
              rzpRef.current = null;
            }
          },
          handler: async (response) => {
            // Payment success — immediately confirm in backend
            try {
              const verifyRes = await fetch('/api/bookings/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...response,
                  token,
                  seats,
                  occurrence_id: dinner.id,
                  user_id: guestUserId,
                  email: guestEmail,
                  phone: guestPhone,
                  customer_query: getFormattedQuery()
                })
              });
              const verifyData = await verifyRes.json();
              if (!verifyRes.ok) throw new Error(verifyData.details || verifyData.error);

              setBookingId(verifyData.booking_id);
              clearInterval(lockTimerRef.current);
              setLoading(false);
              onBookingComplete?.();
              goStep('details');
            } catch (err) {
              setError('Payment verified by Razorpay but confirmation failed: ' + err.message);
              setLoading(false);
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzpRef.current = rzp;
        rzp.on('payment.failed', () => {
          setError('Payment failed. Please try again within the time limit.');
          setLoading(false);
        });
        goStep('lock');
        rzp.open();
      } else {
        // Dev mode — immediately confirm in backend
        console.warn('DEV MODE: Simulating payment success');
        goStep('lock');
        setTimeout(async () => {
          try {
            const mockOrderId = orderId || `dev_order_${Date.now()}`;
            const verifyRes = await fetch('/api/bookings/confirm', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: `dev_pay_${Date.now()}`,
                razorpay_order_id: mockOrderId,
                token,
                seats,
                occurrence_id: dinner.id,
                user_id: guestUserId,
                email: guestEmail,
                phone: guestPhone,
                customer_query: getFormattedQuery()
              })
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.details || verifyData.error);

            setBookingId(verifyData.booking_id || mockOrderId);
            clearInterval(lockTimerRef.current);
            setLoading(false);
            onBookingComplete?.();
            goStep('details');
          } catch (err) {
            console.error('Dev mode confirm error:', err);
            setError('Dev confirmation failed: ' + err.message);
            setLoading(false);
          }
        }, 1500);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const price = (dinner?.price_inr ?? 260000) * seats / 100;

  if (!isOpen) return null;

  return (
    <div className="bm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bm-modal" data-lenis-prevent="true">
        {step !== 'confirmed' && (
          <button className="bm-close" onClick={onClose} aria-label="Close">✕</button>
        )}

        <div className={`bm-step-wrapper ${stepAnim ? 'step-in' : 'step-out'}`}>

          {/* ── STEP 1: Seats ── */}
          {step === 'seats' && (
            <div className="bm-step">
              <div className="bm-step-tag font-body italicwritten">Booking — Step 1</div>
              <h2 className="bm-title">Reserve your seat</h2>

              <div className="mb-6 p-4 bg-[var(--accent-primary)]/10 rounded-lg border border-[var(--accent-primary)]/20 text-center flex flex-col gap-3">
                <div className="pb-3 border-b border-[var(--accent-primary)]/20 flex flex-col gap-2 items-center justify-center">
                  {dinner?.event_date && (
                    <div className="uppercase tracking-[0.14em] text-[var(--accent-primary)] flex items-center justify-center gap-2 font-bold" style={{ fontFamily: 'Hibernate, sans-serif', fontSize: '18px', lineHeight: '1.4', fontWeight: 800, textShadow: '0.5px 0.5px 0px var(--accent-primary)' }}>
                      <span className="font-extrabold text-xl">DATE:</span>
                      <span className="font-bold">{new Date(dinner.event_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(dinner.event_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-center pt-1">
                    {dinner?.dietary_type === 'veg' ? (
                      <div className="inline-flex items-center gap-2.5 bg-green-50 border-2 border-green-700 px-4 py-1.5 rounded-md text-green-900 text-[15px] font-bold uppercase tracking-wider shadow-md" style={{ fontFamily: 'Hibernate, sans-serif', letterSpacing: '0.12em', lineHeight: '1.4', fontWeight: 800, textShadow: '0.4px 0.4px 0px currentColor' }}>
                        <span className="inline-flex items-center justify-center w-4 h-4 border-2 border-green-700 rounded-sm p-[2px] shrink-0" title="100% Vegetarian">
                          <span className="w-2 h-2 rounded-full bg-green-700 block"></span>
                        </span>
                        <span>100% Vegetarian Occurrence</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2.5 bg-red-50 border-2 border-red-700 px-4 py-1.5 rounded-md text-red-900 text-[15px] font-bold uppercase tracking-wider shadow-md" style={{ fontFamily: 'Hibernate, sans-serif', letterSpacing: '0.12em', lineHeight: '1.4', fontWeight: 800, textShadow: '0.4px 0.4px 0px currentColor' }}>
                        <span className="inline-flex items-center justify-center w-4 h-4 border-2 border-red-700 rounded-sm p-[2px] shrink-0" title="Non-Vegetarian">
                          <span className="w-2 h-2 rounded-full bg-red-700 block"></span>
                        </span>
                        <span>Non-Vegetarian Occurrence</span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="font-body text-[var(--accent-primary)] font-bold text-lg mb-1">
                  {interestedCount} people expressed interest for this dinner.
                </p>
                <p className="font-body text-[var(--text-main)]/80">
                  Seats remaining: <strong>{availableSeats !== null ? availableSeats : '...'}</strong>
                </p>
              </div>

              {!token && (
                <div className="space-y-3 mb-4 text-left">
                  <p className="text-xs text-[var(--accent-primary)] font-bold uppercase tracking-wider">Your Details</p>
                  <div className="bm-field-group">
                    <label className="bm-label">Email Address</label>
                    <input
                      type="email"
                      className="bm-input font-body text-sm"
                      placeholder="you@example.com"
                      value={guestEmail}
                      onChange={e => setGuestEmail(e.target.value)}
                    />
                  </div>
                  <div className="bm-field-group">
                    <label className="bm-label">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      className="bm-input font-body text-sm"
                      placeholder="+91 9876543210"
                      value={guestPhone}
                      onChange={e => setGuestPhone(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="bm-field-group" style={{ marginBottom: seats === 2 ? '12px' : '24px' }}>
                <label className="bm-label">Select Seats (Max 2)</label>
                <select
                  className="bm-input bm-select font-mono"
                  value={seats}
                  onChange={e => setSeats(parseInt(e.target.value))}
                  disabled={availableSeats < 1}
                >
                  <option value="1" disabled={availableSeats < 1}>1 seat — ₹{((dinner?.price_inr ?? 260000) / 100).toLocaleString('en-IN')}</option>
                  <option value="2" disabled={availableSeats < 2}>2 seats — ₹{(((dinner?.price_inr ?? 260000) * 2) / 100).toLocaleString('en-IN')}</option>
                </select>
              </div>

              {seats === 2 && (
                <div className="mb-6 p-4 bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/20 rounded-xl text-left space-y-3">
                  <div className="flex items-center justify-between border-b border-[var(--accent-primary)]/15 pb-2">
                    <span className="text-xs text-[var(--accent-primary)] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <span>👥</span> Second Person's Details (Optional)
                    </span>
                    <span className="text-[10px] text-[var(--text-main)]/60">Can also fill after payment</span>
                  </div>
                  <div className="bm-field-group">
                    <label className="bm-label">Second Person's Name</label>
                    <input
                      type="text"
                      className="bm-input font-body text-sm"
                      placeholder="Partner or Friend's Name"
                      value={secondGuestName}
                      onChange={e => setSecondGuestName(e.target.value)}
                    />
                  </div>
                  <div className="bm-field-group">
                    <label className="bm-label">Second Person's Email</label>
                    <input
                      type="email"
                      className="bm-input font-body text-sm"
                      placeholder="friend@example.com"
                      value={secondGuestEmail}
                      onChange={e => setSecondGuestEmail(e.target.value)}
                    />
                  </div>
                  <div className="bm-field-group">
                    <label className="bm-label">Second Person's Phone</label>
                    <input
                      type="tel"
                      className="bm-input font-body text-sm"
                      placeholder="+91 9876543210"
                      value={secondGuestPhone}
                      onChange={e => setSecondGuestPhone(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="bm-field-group mb-6 text-left">
                <label className="bm-label flex items-center justify-between">
                  <span>Dietary Restrictions / Special Queries</span>
                  <span className="text-[10px] text-[var(--accent-primary)] font-normal">Taken before payment</span>
                </label>
                <textarea
                  className="bm-input font-body text-sm"
                  rows="2"
                  placeholder="e.g., Vegetarian, allergic to nuts, non-alcoholic preference..."
                  value={customerQuery}
                  onChange={e => setCustomerQuery(e.target.value)}
                />
              </div>

              {error && <div className="bm-error">{error}</div>}

              <button
                className="bm-btn-primary"
                onClick={handleSeatsNext}
                disabled={loading || availableSeats < 1}
              >
                {loading ? 'Processing...' : 'Continue to Payment →'}
              </button>
            </div>
          )}

          {/* ── STEP 2: Lock / Payment ── */}
          {step === 'lock' && (
            <div className="bm-step bm-center">
              <div className="bm-step-tag font-body italicwritten text-center mx-auto">Booking — Step 2</div>
              <h2 className="bm-title text-center">Seats held.</h2>
              <div className="bm-timer font-mono text-center" style={{ fontSize: '2rem', margin: '20px 0' }}>
                {fmtTime(countdown)}
              </div>
              <p className="font-body text-[var(--text-main)]/70 text-center mx-auto max-w-[280px]">
                {loading ? 'Finalizing your booking, please wait...' : 'Complete your payment in the secure popup. Do not refresh this page.'}
              </p>
              {error && <div className="bm-error mt-6">{error}</div>}
            </div>
          )}

          {/* ── STEP 3: Dietary notes — dead simple, no personas ── */}
          {step === 'details' && (
            <div className="bm-step text-left">
              <div className="bm-step-tag font-body italicwritten">Booking — Step 3</div>
              <h2 className="bm-title">Payment Successful!</h2>
              <p className="font-body text-[var(--text-main)]/80 mb-6 text-sm leading-relaxed">
                <span className="font-bold text-[var(--accent-primary)]">Your seat is instantly confirmed!</span> Any dietary requirements or guest details? Let us know below.
              </p>

              {seats === 2 && (
                <div className="mb-6 p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl space-y-3">
                  <span className="text-xs text-[var(--accent-primary)] font-bold uppercase tracking-wider block mb-1">
                    👥 Second Guest Details
                  </span>
                  <div className="bm-field-group">
                    <label className="bm-label">Second Person's Name</label>
                    <input
                      type="text"
                      className="bm-input font-body text-sm"
                      placeholder="Partner or Friend's Name"
                      value={secondGuestName}
                      onChange={e => setSecondGuestName(e.target.value)}
                    />
                  </div>
                  <div className="bm-field-group">
                    <label className="bm-label">Second Person's Email</label>
                    <input
                      type="email"
                      className="bm-input font-body text-sm"
                      placeholder="friend@example.com"
                      value={secondGuestEmail}
                      onChange={e => setSecondGuestEmail(e.target.value)}
                    />
                  </div>
                  <div className="bm-field-group">
                    <label className="bm-label">Second Person's Phone</label>
                    <input
                      type="tel"
                      className="bm-input font-body text-sm"
                      placeholder="+91 9876543210"
                      value={secondGuestPhone}
                      onChange={e => setSecondGuestPhone(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="bm-field-group mb-6">
                <label className="bm-label">Dietary Restrictions / Queries (Optional)</label>
                <textarea
                  className="bm-input font-body text-sm"
                  rows="3"
                  placeholder="e.g. Vegetarian, allergic to nuts, etc."
                  value={customerQuery}
                  onChange={e => setCustomerQuery(e.target.value)}
                />
              </div>

              {error && (
                <div className="bm-error mb-4">
                  {error}
                  {finalizeAttempts > 0 && (
                    <p className="text-xs mt-1 opacity-80">Tap the button below to retry.</p>
                  )}
                </div>
              )}

              <button
                className="bm-btn-primary"
                disabled={loading}
                onClick={() => {
                  finalizeCalledRef.current = false; // allow fresh call
                  finalizeBooking({
                    bookingIdVal: bookingId,
                    guestUserIdVal: guestUserId,
                    guestEmailVal: guestEmail,
                    seatsVal: seats,
                    queryVal: getFormattedQuery()
                  });
                }}
              >
                {loading ? 'Saving...' : finalizeAttempts > 0 ? 'Retry Saving Notes →' : 'Save Dietary Notes & Finish →'}
              </button>
            </div>
          )}

          {/* ── LOCKOUT ── */}
          {step === 'lockout' && (
            <div className="bm-step bm-lockout-step">
              <div className="bm-step-tag font-body italicwritten">System — Lockout</div>
              <div className="bm-lockout-icon">✕</div>
              <h2 className="bm-title">Seat Released.</h2>
              <p className="bm-subtitle">
                Payment was not completed in time. Your seat has been released to the next person.
              </p>
              <button className="bm-btn-ghost mt-6" onClick={onClose}>Close</button>
            </div>
          )}

          {/* ── CONFIRMED ── */}
          {step === 'confirmed' && (
            <div className="bm-step bm-center" style={{ textAlign: 'center' }}>
              <div className="w-16 h-16 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="bm-title text-center">See you at the table.</h2>
              <p className="font-body text-[var(--text-main)]/80 text-center mx-auto leading-relaxed mt-4">
                Your payment was successful and your seat is confirmed.<br /><br />
                <strong>Your ticket will arrive to your email shortly.</strong>
              </p>
              <button className="bm-btn-primary" style={{ marginTop: '32px' }} onClick={onClose}>
                Close
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
