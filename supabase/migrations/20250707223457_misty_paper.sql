/*
  # Create reviews table

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `tour_id` (uuid, references tour_packages)
      - `booking_id` (uuid, references bookings, optional)
      - `rating` (integer, 1-5)
      - `title` (text)
      - `content` (text)
      - `images` (text array, optional)
      - `verified` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `reviews` table
    - Add policy for public read access to verified reviews
    - Add policy for users to create reviews for their completed bookings
    - Add policy for users to read/update their own reviews
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tour_id uuid NOT NULL REFERENCES tour_packages(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  content text NOT NULL,
  images text[] DEFAULT '{}',
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tour_id, booking_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public can read verified reviews
CREATE POLICY "Public can read verified reviews"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (verified = true);

-- Users can read their own reviews
CREATE POLICY "Users can read own reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create reviews for their completed bookings
CREATE POLICY "Users can create reviews for completed bookings"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = booking_id 
      AND bookings.user_id = auth.uid() 
      AND bookings.status = 'completed'
    )
  );

-- Users can update their own unverified reviews
CREATE POLICY "Users can update own unverified reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND verified = false);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_tour_id ON reviews(tour_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_verified ON reviews(verified);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);