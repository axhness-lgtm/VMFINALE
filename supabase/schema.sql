-- ══════════════════════════════════════════════════════════════════════════════
-- VANTAMMAYILU — Supabase Database Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query → Run
-- ══════════════════════════════════════════════════════════════════════════════

-- 1. DINNERS — one row per event
CREATE TABLE IF NOT EXISTS dinners (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  event_date    TIMESTAMPTZ NOT NULL,
  location      TEXT NOT NULL DEFAULT 'Kirlampudi, Visakhapatnam',
  total_seats   INT NOT NULL DEFAULT 8,
  confirmed_seats INT NOT NULL DEFAULT 0,
  price_inr     INT NOT NULL DEFAULT 299900,   -- in paise (₹2999)
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed the current dinner
INSERT INTO dinners (title, event_date, price_inr, is_active)
VALUES ('Postcards from Oaxaca — Chapter 04', '2026-05-30 19:30:00+05:30', 299900, true)
ON CONFLICT DO NOTHING;

-- 2. OTPs — 6-digit codes, 10-min TTL, one per phone
CREATE TABLE IF NOT EXISTS otps (
  phone       TEXT PRIMARY KEY,
  code        TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. SEAT LOCKS — 5-minute temporary holds
CREATE TABLE IF NOT EXISTS seat_locks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone       TEXT NOT NULL UNIQUE,
  email       TEXT NOT NULL,
  dinner_id   UUID NOT NULL REFERENCES dinners(id),
  seats       INT NOT NULL CHECK (seats BETWEEN 1 AND 2),
  locked_until TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. LOCKOUTS — 1-hour ban after payment timeout
CREATE TABLE IF NOT EXISTS lockouts (
  phone         TEXT PRIMARY KEY,
  blocked_until TIMESTAMPTZ NOT NULL,
  reason        TEXT NOT NULL DEFAULT 'payment_timeout',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. BOOKINGS — confirmed paid bookings
CREATE TABLE IF NOT EXISTS bookings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone               TEXT NOT NULL,
  email               TEXT NOT NULL,
  dinner_id           UUID REFERENCES dinners(id),
  seats               INT NOT NULL CHECK (seats BETWEEN 1 AND 2),
  dinner_title        TEXT,
  status              TEXT NOT NULL DEFAULT 'confirmed',  -- confirmed | cancelled | refunded
  razorpay_order_id   TEXT UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  paypal_order_id     TEXT UNIQUE,
  paypal_payment_id   TEXT UNIQUE,
  is_repeat_guest     BOOLEAN NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. CONTACTS — post-payment guest details form
CREATE TABLE IF NOT EXISTS contacts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id        UUID NOT NULL REFERENCES bookings(id),
  primary_name      TEXT NOT NULL,
  dietary           TEXT,           -- vegetarian, vegan, halal, none
  allergies         TEXT,
  guest_name        TEXT,           -- only if seats = 2
  guest_dietary     TEXT,
  guest_allergies   TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. WAITLIST — users who joined when dinner was full
CREATE TABLE IF NOT EXISTS waitlist (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dinner_id   UUID NOT NULL REFERENCES dinners(id),
  phone       TEXT,
  email       TEXT NOT NULL,
  name        TEXT,
  notified_at TIMESTAMPTZ,           -- when we sent them the "seat opened" message
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(dinner_id, email)
);

-- ══════════════════════════════════════════════════════════════════════════════
-- HELPER FUNCTION: get available seats for active dinner
-- ══════════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION get_available_seats(p_dinner_id UUID)
RETURNS INT AS $$
DECLARE
  v_total       INT;
  v_confirmed   INT;
  v_locked      INT;
BEGIN
  SELECT total_seats, confirmed_seats INTO v_total, v_confirmed
  FROM dinners WHERE id = p_dinner_id;

  SELECT COALESCE(SUM(seats), 0) INTO v_locked
  FROM seat_locks
  WHERE dinner_id = p_dinner_id AND locked_until > now();

  RETURN GREATEST(0, v_total - v_confirmed - v_locked);
END;
$$ LANGUAGE plpgsql;

-- ══════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (enable, then open anon reads for seat count)
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE dinners    ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist   ENABLE ROW LEVEL SECURITY;
ALTER TABLE otps       ENABLE ROW LEVEL SECURITY;
ALTER TABLE seat_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lockouts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts   ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read dinner info (seat count, date, price)
DROP POLICY IF EXISTS "Public can view active dinners" ON dinners;
CREATE POLICY "Public can view active dinners"
  ON dinners FOR SELECT USING (is_active = true);

-- Allow anyone to read confirmed_seats count (for live counter)
-- All writes go through service-role edge functions only

-- ══════════════════════════════════════════════════════════════════════════════
-- RPC: increment confirmed_seats atomically (called by verify-payment function)
-- ══════════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION increment_confirmed_seats(p_dinner_id UUID, p_seats INT)
RETURNS VOID AS $$
BEGIN
  UPDATE dinners
  SET confirmed_seats = confirmed_seats + p_seats
  WHERE id = p_dinner_id;
END;
$$ LANGUAGE plpgsql;

-- ══════════════════════════════════════════════════════════════════════════════
-- 8. REMINDERS — scheduled 48hr and 12hr notifications (optional)
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS reminders (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID NOT NULL REFERENCES bookings(id),
  phone       TEXT,
  email       TEXT NOT NULL,
  send_at     TIMESTAMPTZ NOT NULL,
  type        TEXT NOT NULL,  -- '48hr' | '12hr'
  sent        BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(booking_id, type)
);

ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
-- Service role only (edge functions use service role key)
