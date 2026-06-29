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
            // Payment success — verify then go straight to dietary notes
            try {
              const verifyRes = await fetch('/api/bookings/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...response, token, seats, occurrence_id: dinner.id })
              });
              const verifyData = await verifyRes.json();
              if (!verifyRes.ok) throw new Error(verifyData.details || verifyData.error);

              setBookingId(verifyData.booking_id);
              clearInterval(lockTimerRef.current);
              setLoading(false);
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
        // Dev mode — skip payment
        console.warn('DEV MODE: Simulating payment success');
        goStep('lock');
        setTimeout(() => {
          clearInterval(lockTimerRef.current);
          setBookingId(`mock_${Date.now()}`);
          setLoading(false);
          goStep('details');
        }, 1500);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const price = (dinner?.price_inr ?? 450000) * seats / 100;

  if (!isOpen) return null;

  return (
    <div className="bm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bm-modal">
        {step !== 'confirmed' && (
          <button className="bm-close" onClick={onClose} aria-label="Close">✕</button>
        )}

        <div className={`bm-step-wrapper ${stepAnim ? 'step-in' : 'step-out'}`}>

          {/* ── STEP 1: Seats ── */}
          {step === 'seats' && (
            <div className="bm-step">
              <div className="bm-step-tag font-body italicwritten">Booking — Step 1</div>
              <h2 className="bm-title">Reserve your seat</h2>

              <div className="mb-6 p-4 bg-[var(--accent-primary)]/10 rounded-lg border border-[var(--accent-primary)]/20 text-center">
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

              <div className="bm-field-group" style={{ marginBottom: '24px' }}>
                <label className="bm-label">Select Seats (Max 2)</label>
                <select
                  className="bm-input bm-select font-mono"
                  value={seats}
                  onChange={e => setSeats(parseInt(e.target.value))}
                  disabled={availableSeats < 1}
                >
                  <option value="1" disabled={availableSeats < 1}>1 seat — ₹{((dinner?.price_inr ?? 450000) / 100).toLocaleString('en-IN')}</option>
                  <option value="2" disabled={availableSeats < 2}>2 seats — ₹{(((dinner?.price_inr ?? 450000) * 2) / 100).toLocaleString('en-IN')}</option>
                </select>
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
                Your payment has been received. Any dietary requirements? Let us know below, then confirm your seat.
              </p>

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
                    queryVal: customerQuery
                  });
                }}
              >
                {loading ? 'Confirming...' : finalizeAttempts > 0 ? 'Retry Confirm Seat →' : 'Confirm My Seat →'}
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
