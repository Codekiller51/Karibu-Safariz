/*
  # Create customer surveys table for feedback system

  1. New Tables
    - `customer_surveys`
      - `id` (uuid, primary key)
      - `booking_id` (uuid, foreign key to bookings)
      - `user_id` (uuid, foreign key to profiles)
      - `overall_rating` (integer, 1-5 scale)
      - `service_quality_rating` (integer, 1-5 scale)
      - `value_for_money_rating` (integer, 1-5 scale)
      - `guide_performance_rating` (integer, 1-5 scale)
      - `what_went_well` (text, positive feedback)
      - `areas_for_improvement` (text, improvement suggestions)
      - `additional_comments` (text, extra comments)
      - `would_recommend` (boolean, recommendation)
      - `likelihood_to_return` (integer, 1-10 scale)
      - `photos` (text array, photo URLs)
      - `survey_sent_at` (timestamp, when survey was sent)
      - `completed_at` (timestamp, when survey was completed)
      - `response_from_company` (text, company response)
      - `response_at` (timestamp, when company responded)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `customer_surveys` table
    - Add policies for users to manage their own surveys
*/

-- Create customer_surveys table
CREATE TABLE IF NOT EXISTS customer_surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Ratings (1-5 scale)
  overall_rating integer NOT NULL,
  service_quality_rating integer NOT NULL,
  value_for_money_rating integer NOT NULL,
  guide_performance_rating integer NOT NULL,
  
  -- Detailed Feedback
  what_went_well text NOT NULL,
  areas_for_improvement text,
  additional_comments text,
  
  -- Recommendation
  would_recommend boolean NOT NULL DEFAULT true,
  likelihood_to_return integer NOT NULL DEFAULT 5,
  
  -- Media
  photos text[] DEFAULT '{}',
  
  -- Survey Metadata
  survey_sent_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  response_from_company text,
  response_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT customer_surveys_overall_rating_check CHECK (overall_rating >= 1 AND overall_rating <= 5),
  CONSTRAINT customer_surveys_service_quality_rating_check CHECK (service_quality_rating >= 1 AND service_quality_rating <= 5),
  CONSTRAINT customer_surveys_value_for_money_rating_check CHECK (value_for_money_rating >= 1 AND value_for_money_rating <= 5),
  CONSTRAINT customer_surveys_guide_performance_rating_check CHECK (guide_performance_rating >= 1 AND guide_performance_rating <= 5),
  CONSTRAINT customer_surveys_likelihood_to_return_check CHECK (likelihood_to_return >= 1 AND likelihood_to_return <= 10),
  CONSTRAINT customer_surveys_what_went_well_check CHECK (length(what_went_well) >= 10)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customer_surveys_booking_id ON customer_surveys(booking_id);
CREATE INDEX IF NOT EXISTS idx_customer_surveys_user_id ON customer_surveys(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_surveys_overall_rating ON customer_surveys(overall_rating);
CREATE INDEX IF NOT EXISTS idx_customer_surveys_completed_at ON customer_surveys(completed_at);
CREATE INDEX IF NOT EXISTS idx_customer_surveys_created_at ON customer_surveys(created_at);

-- Unique constraint to prevent duplicate surveys per booking
CREATE UNIQUE INDEX IF NOT EXISTS idx_customer_surveys_unique_booking 
  ON customer_surveys(booking_id);

-- Enable Row Level Security
ALTER TABLE customer_surveys ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own surveys"
  ON customer_surveys
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own surveys"
  ON customer_surveys
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own surveys"
  ON customer_surveys
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Service role can manage all surveys
CREATE POLICY "Service role can manage surveys"
  ON customer_surveys
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Public can read completed surveys for display (optional, for testimonials)
CREATE POLICY "Public can read completed surveys for testimonials"
  ON customer_surveys
  FOR SELECT
  TO anon, authenticated
  USING (completed_at IS NOT NULL AND overall_rating >= 4);