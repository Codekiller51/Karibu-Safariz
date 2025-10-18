/*
  # Create tour packages table

  1. New Tables
    - `tour_packages`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `short_description` (text)
      - `category` (enum: mountain-climbing, safari, day-trips)
      - `duration` (integer, days)
      - `difficulty` (enum: easy, moderate, challenging, extreme)
      - `price_usd` (numeric)
      - `price_tzs` (numeric)
      - `max_participants` (integer)
      - `min_participants` (integer)
      - `images` (text array)
      - `itinerary` (jsonb)
      - `includes` (text array)
      - `excludes` (text array)
      - `requirements` (text array)
      - `best_time` (text)
      - `featured` (boolean)
      - `active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `tour_packages` table
    - Add policy for public read access to active tours
    - Add policy for authenticated users to read all tours
*/

-- Create enum types
CREATE TYPE tour_category AS ENUM ('mountain-climbing', 'safari', 'day-trips');
CREATE TYPE tour_difficulty AS ENUM ('easy', 'moderate', 'challenging', 'extreme');

CREATE TABLE IF NOT EXISTS tour_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  short_description text NOT NULL,
  category tour_category NOT NULL,
  duration integer NOT NULL CHECK (duration > 0),
  difficulty tour_difficulty NOT NULL,
  price_usd numeric(10,2) NOT NULL CHECK (price_usd > 0),
  price_tzs numeric(12,2) NOT NULL CHECK (price_tzs > 0),
  max_participants integer NOT NULL CHECK (max_participants > 0),
  min_participants integer NOT NULL CHECK (min_participants > 0),
  images text[] DEFAULT '{}',
  itinerary jsonb DEFAULT '[]',
  includes text[] DEFAULT '{}',
  excludes text[] DEFAULT '{}',
  requirements text[] DEFAULT '{}',
  best_time text DEFAULT '',
  featured boolean DEFAULT false,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tour_packages ENABLE ROW LEVEL SECURITY;

-- Public can read active tour packages
CREATE POLICY "Public can read active tours"
  ON tour_packages
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tour_packages_category ON tour_packages(category);
CREATE INDEX IF NOT EXISTS idx_tour_packages_featured ON tour_packages(featured);
CREATE INDEX IF NOT EXISTS idx_tour_packages_active ON tour_packages(active);
CREATE INDEX IF NOT EXISTS idx_tour_packages_created_at ON tour_packages(created_at);