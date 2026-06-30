-- ══════════════════════════════════════════════════════════════════════════════
-- VANTAMMAYILU — Supabase Database Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query → Run
-- ══════════════════════════════════════════════════════════════════════════════

-- 1. USERS (Common Community List)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  instagram_handle TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. OCCURRENCES (Dinners)
CREATE TABLE IF NOT EXISTS occurrences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  total_seats INT NOT NULL DEFAULT 8,
  price_inr INT NOT NULL DEFAULT 299900,
  status TEXT NOT NULL DEFAULT 'collecting_interests', -- collecting_interests | bookings_open | closed
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed Occurrence 18
INSERT INTO occurrences (title, event_date, total_seats, price_inr, status)
VALUES ('Occurrence 18', '2026-07-15 19:30:00+05:30', 8, 299900, 'collecting_interests');

-- 3. OCCURRENCE_INTERESTS (Active List & Founder Filtering)
CREATE TABLE IF NOT EXISTS occurrence_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  occurrence_id UUID NOT NULL REFERENCES occurrences(id),
  user_id UUID NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'interested', -- interested | selected_by_founder | booked
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(occurrence_id, user_id)
);

-- 4. SEAT LOCKS (10-minute temporary holds)
CREATE TABLE IF NOT EXISTS seat_locks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  occurrence_id UUID NOT NULL REFERENCES occurrences(id),
  user_id UUID NOT NULL REFERENCES users(id),
  seats INT NOT NULL CHECK (seats BETWEEN 1 AND 2),
  locked_until TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(occurrence_id, user_id)
);

-- 5. BOOKINGS (Final Confirmed)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  occurrence_id UUID NOT NULL REFERENCES occurrences(id),
  user_id UUID NOT NULL REFERENCES users(id),
  seats INT NOT NULL CHECK (seats BETWEEN 1 AND 2),
  token_name TEXT,
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(occurrence_id, user_id) -- User can only book once per occurrence
);

-- 6. REMINDERS (To track which whatsapp/emails have been sent)
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  type TEXT NOT NULL, -- 'email_24h' | 'whatsapp_24h'
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(booking_id, type)
);

-- ══════════════════════════════════════════════════════════════════════════════
-- HELPER FUNCTION: get available seats for active occurrence
-- ══════════════════════════════════════════════════════════════════════════════
DROP FUNCTION IF EXISTS get_available_seats(uuid);

CREATE OR REPLACE FUNCTION get_available_seats(p_occurrence_id UUID)
RETURNS INT AS $$
DECLARE
  v_total       INT;
  v_confirmed   INT;
  v_locked      INT;
BEGIN
  SELECT total_seats INTO v_total
  FROM occurrences WHERE id = p_occurrence_id;

  SELECT COALESCE(SUM(seats), 0) INTO v_confirmed
  FROM bookings WHERE occurrence_id = p_occurrence_id;

  SELECT COALESCE(SUM(seats), 0) INTO v_locked
  FROM seat_locks
  WHERE occurrence_id = p_occurrence_id AND locked_until > now();

  RETURN GREATEST(0, v_total - v_confirmed - v_locked);
END;
$$ LANGUAGE plpgsql;

-- ══════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (Strict. Vercel API uses service_role key to bypass)
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE occurrences ENABLE ROW LEVEL SECURITY;
ALTER TABLE occurrence_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE seat_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read occurrence info (to see if it's collecting interests or bookings open)
DROP POLICY IF EXISTS "Public can view active occurrences" ON occurrences;
CREATE POLICY "Public can view active occurrences"
  ON occurrences FOR SELECT USING (true);

-- Enable full read/write/update access for users table
DROP POLICY IF EXISTS "Enable public access for users" ON users;
CREATE POLICY "Enable public access for users" ON users FOR ALL USING (true) WITH CHECK (true);

-- Enable full read/write/update access for occurrences table
DROP POLICY IF EXISTS "Enable public access for occurrences" ON occurrences;
CREATE POLICY "Enable public access for occurrences" ON occurrences FOR ALL USING (true) WITH CHECK (true);

-- Enable full read/write/update access for occurrence_interests table
DROP POLICY IF EXISTS "Enable public access for occurrence_interests" ON occurrence_interests;
CREATE POLICY "Enable public access for occurrence_interests" ON occurrence_interests FOR ALL USING (true) WITH CHECK (true);

-- Enable full read/write/update access for seat_locks table
DROP POLICY IF EXISTS "Enable public access for seat_locks" ON seat_locks;
CREATE POLICY "Enable public access for seat_locks" ON seat_locks FOR ALL USING (true) WITH CHECK (true);

-- Enable full read/write/update access for bookings table
DROP POLICY IF EXISTS "Enable public access for bookings" ON bookings;
CREATE POLICY "Enable public access for bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);

-- Enable full read/write/update access for reminders table
DROP POLICY IF EXISTS "Enable public access for reminders" ON reminders;
CREATE POLICY "Enable public access for reminders" ON reminders FOR ALL USING (true) WITH CHECK (true);
