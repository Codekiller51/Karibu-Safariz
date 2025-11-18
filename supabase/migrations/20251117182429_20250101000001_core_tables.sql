/*
  # Core Tables Schema

  ## Overview
  This migration creates the core database tables for Karibu Tours & Safariz application,
  including user profiles, tour packages, bookings, and reviews.

  ## Tables Created

  ### 1. profiles
  User profile information linked to authentication
  - `id` (uuid, primary key) - References auth.users
  - `full_name` (text) - User's full name
  - `email` (text, unique) - User's email address
  - `avatar_url` (text, optional) - Profile picture URL
  - `phone` (text, optional) - Contact phone number
  - `nationality` (text, optional) - User's nationality
  - `created_at` (timestamp) - Profile creation timestamp
  - `updated_at` (timestamp) - Last update timestamp

  ### 2. tour_packages
  Tour package offerings with pricing and details
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Tour package name
  - `description` (text) - Detailed description
  - `short_description` (text) - Brief summary
  - `category` (enum) - mountain-climbing, safari, day-trips
  - `duration` (integer) - Duration in days
  - `difficulty` (enum) - easy, moderate, challenging, extreme
  - `price_usd` (numeric) - Price in USD
  - `price_tzs` (numeric) - Price in Tanzanian Shillings
  - `max_participants` (integer) - Maximum group size
  - `min_participants` (integer) - Minimum group size
  - `images` (text[]) - Array of image URLs
  - `itinerary` (jsonb) - Day-by-day itinerary details
  - `includes` (text[]) - What's included in the package
  - `excludes` (text[]) - What's not included
  - `requirements` (text[]) - Prerequisites for participants
  - `best_time` (text) - Optimal time for the tour
  - `featured` (boolean) - Featured tour flag
  - `active` (boolean) - Active/inactive status
  - `created_at` (timestamp) - Creation timestamp
  - `updated_at` (timestamp) - Last update timestamp

  ### 3. bookings
  Customer booking records
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid) - References profiles
  - `tour_id` (uuid) - References tour_packages
  - `start_date` (date) - Tour start date
  - `participants` (integer) - Number of participants
  - `total_amount` (numeric) - Total booking cost
  - `currency` (enum) - USD or TZS
  - `status` (enum) - pending, confirmed, cancelled, completed
  - `special_requests` (text, optional) - Special requirements
  - `participant_details` (jsonb) - Participant information
  - `payment_status` (enum) - pending, paid, refunded
  - `payment_reference` (text, optional) - Payment transaction reference
  - `created_at` (timestamp) - Booking creation timestamp
  - `updated_at` (timestamp) - Last update timestamp

  ### 4. reviews
  Customer reviews and ratings for tours
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid) - References profiles
  - `tour_id` (uuid) - References tour_packages
  - `booking_id` (uuid, optional) - References bookings
  - `rating` (integer) - Rating from 1-5
  - `title` (text) - Review title
  - `content` (text) - Review content
  - `images` (text[], optional) - Review photos
  - `verified` (boolean) - Verification status
  - `created_at` (timestamp) - Review creation timestamp
  - `updated_at` (timestamp) - Last update timestamp

  ## Security
  Row Level Security (RLS) is enabled on all tables with appropriate policies:
  - Users can manage their own profiles
  - Public read access to active tours and verified reviews
  - Users can create bookings and reviews for their completed tours
  - Secure access control for all operations

  ## Indexes
  Performance indexes are created on frequently queried columns for optimal query performance.
*/

-- Create enum types
CREATE TYPE tour_category AS ENUM ('mountain-climbing', 'safari', 'day-trips');
CREATE TYPE tour_difficulty AS ENUM ('easy', 'moderate', 'challenging', 'extreme');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');
CREATE TYPE currency_type AS ENUM ('USD', 'TZS');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE,
  avatar_url text,
  phone text,
  nationality text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can create own profile during registration"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public can read basic profile info"
  ON profiles
  FOR SELECT
  TO anon
  USING (true);

-- Create tour_packages table
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

CREATE POLICY "Public can read active tours"
  ON tour_packages
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE INDEX IF NOT EXISTS idx_tour_packages_category ON tour_packages(category);
CREATE INDEX IF NOT EXISTS idx_tour_packages_featured ON tour_packages(featured);
CREATE INDEX IF NOT EXISTS idx_tour_packages_active ON tour_packages(active);
CREATE INDEX IF NOT EXISTS idx_tour_packages_created_at ON tour_packages(created_at);

-- Create bookings table
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

CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending');

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tour_id ON bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_bookings_start_date ON bookings(start_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Create reviews table
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

CREATE POLICY "Public can read verified reviews"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (verified = true);

CREATE POLICY "Users can read own reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

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

CREATE POLICY "Users can update own unverified reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND verified = false);

CREATE INDEX IF NOT EXISTS idx_reviews_tour_id ON reviews(tour_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_verified ON reviews(verified);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
