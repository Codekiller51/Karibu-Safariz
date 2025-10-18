/*
  # Create bookings table

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `tour_id` (uuid, references tour_packages)
      - `start_date` (date)
      - `participants` (integer)
      - `total_amount` (numeric)
      - `currency` (enum: USD, TZS)
      - `status` (enum: pending, confirmed, cancelled, completed)
      - `special_requests` (text, optional)
      - `participant_details` (jsonb)
      - `payment_status` (enum: pending, paid, refunded)
      - `payment_reference` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `bookings` table
    - Add policy for users to read their own bookings
    - Add policy for users to create bookings
*/

-- Create enum types
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');
CREATE TYPE currency_type AS ENUM ('USD', 'TZS');

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tour_id uuid NOT NULL REFERENCES tour_packages(id) ON DELETE RESTRICT,
  start_date date NOT NULL,
  participants integer NOT NULL CHECK (participants > 0),
  total_amount numeric(12,2) NOT NULL CHECK (total_amount > 0),
  currency currency_type NOT NULL DEFAULT 'USD',
  status booking_status NOT NULL DEFAULT 'pending',
  special_requests text,
  participant_details jsonb DEFAULT '[]',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  payment_reference text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users can read their own bookings
CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create bookings
CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending bookings
CREATE POLICY "Users can update own pending bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tour_id ON bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_bookings_start_date ON bookings(start_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);