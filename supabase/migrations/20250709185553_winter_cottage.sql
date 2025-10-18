/*
  # Reviews and Rating System

  1. New Tables
    - Updates to existing `reviews` table to support the new review system
    - Adds booking_id reference for verified reviews
    - Adds verified status and images support
    
  2. Security
    - Enable RLS on reviews table
    - Add policies for creating, reading, and updating reviews
    - Users can only create reviews for their completed bookings
    - Public can read verified reviews
    
  3. Indexes
    - Add indexes for better performance on common queries
*/

-- Update reviews table structure if needed
DO $$ 
BEGIN
    -- Add booking_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reviews' AND column_name = 'booking_id'
    ) THEN
        ALTER TABLE reviews ADD COLUMN booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL;
    END IF;
    
    -- Add verified column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reviews' AND column_name = 'verified'
    ) THEN
        ALTER TABLE reviews ADD COLUMN verified boolean DEFAULT false;
    END IF;
    
    -- Add images column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reviews' AND column_name = 'images'
    ) THEN
        ALTER TABLE reviews ADD COLUMN images text[] DEFAULT '{}';
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reviews' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE reviews ADD COLUMN updated_at timestamptz DEFAULT now();
    END IF;
END $$;

-- Update existing policies
DROP POLICY IF EXISTS "Public can read verified reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews for completed bookings" ON reviews;
DROP POLICY IF EXISTS "Users can read own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own unverified reviews" ON reviews;

-- Create comprehensive policies for the review system
CREATE POLICY "Public can read verified reviews"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (verified = true);

CREATE POLICY "Users can create reviews for completed bookings"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    (
      booking_id IS NULL OR
      EXISTS (
        SELECT 1 FROM bookings 
        WHERE bookings.id = reviews.booking_id 
        AND bookings.user_id = auth.uid() 
        AND bookings.status = 'completed'
      )
    )
  );

CREATE POLICY "Users can read own reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own unverified reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND verified = false)
  WITH CHECK (auth.uid() = user_id AND verified = false);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_verified_created ON reviews(verified, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_tour_verified ON reviews(tour_id, verified);

-- Create a function to automatically verify reviews from completed bookings
CREATE OR REPLACE FUNCTION verify_booking_review()
RETURNS TRIGGER AS $$
BEGIN
  -- If the review has a booking_id, mark it as verified
  IF NEW.booking_id IS NOT NULL THEN
    NEW.verified = true;
  END IF;
  
  -- Set updated_at timestamp
  NEW.updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic review verification
DROP TRIGGER IF EXISTS trigger_verify_booking_review ON reviews;
CREATE TRIGGER trigger_verify_booking_review
  BEFORE INSERT OR UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION verify_booking_review();

-- Insert some sample reviews for testing (optional)
INSERT INTO reviews (user_id, tour_id, rating, title, content, verified, created_at) VALUES
(
  (SELECT id FROM profiles LIMIT 1),
  (SELECT id FROM tour_packages WHERE category = 'mountain-climbing' LIMIT 1),
  5,
  'Amazing Kilimanjaro Experience!',
  'This was truly the adventure of a lifetime! The guides were incredibly knowledgeable and supportive throughout the entire climb. The views from the summit were absolutely breathtaking. I would highly recommend this tour to anyone looking for a challenging but rewarding experience.',
  true,
  now() - interval '30 days'
),
(
  (SELECT id FROM profiles LIMIT 1),
  (SELECT id FROM tour_packages WHERE category = 'safari' LIMIT 1),
  4,
  'Great Safari Adventure',
  'We saw all the Big Five and the guide was very knowledgeable about the wildlife. The accommodation was comfortable and the food was excellent. Only minor issue was some long drives between parks, but overall a fantastic experience.',
  true,
  now() - interval '15 days'
),
(
  (SELECT id FROM profiles LIMIT 1),
  (SELECT id FROM tour_packages WHERE category = 'day-trips' LIMIT 1),
  5,
  'Perfect Day Trip',
  'Excellent day trip with beautiful scenery and great cultural insights. Our guide was friendly and spoke excellent English. Perfect for families and those with limited time. Highly recommended!',
  true,
  now() - interval '7 days'
)
ON CONFLICT DO NOTHING;