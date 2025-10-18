/*
  # Create destinations table and related functionality

  1. New Tables
    - `destinations`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `description` (text)
      - `short_description` (text)
      - `featured_image` (text)
      - `images` (text array)
      - `category` (enum: mountain, park, cultural, coastal, adventure)
      - `location` (jsonb with latitude, longitude, region, district)
      - `best_time_to_visit` (text)
      - `activities` (text array)
      - `highlights` (text array)
      - `difficulty_level` (enum: easy, moderate, challenging, extreme)
      - `duration_recommended` (text)
      - `entry_requirements` (text array)
      - `accommodation_options` (text array)
      - `transportation` (text array)
      - `featured` (boolean)
      - `active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `destinations` table
    - Add policy for public read access to active destinations
*/

-- Create destination category enum
CREATE TYPE destination_category AS ENUM ('mountain', 'park', 'cultural', 'coastal', 'adventure');

-- Create difficulty level enum (reuse existing if available)
DO $$ BEGIN
    CREATE TYPE difficulty_level AS ENUM ('easy', 'moderate', 'challenging', 'extreme');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  short_description text NOT NULL,
  featured_image text NOT NULL,
  images text[] DEFAULT '{}',
  category destination_category NOT NULL,
  location jsonb NOT NULL DEFAULT '{}',
  best_time_to_visit text DEFAULT '',
  activities text[] DEFAULT '{}',
  highlights text[] DEFAULT '{}',
  difficulty_level difficulty_level NOT NULL DEFAULT 'moderate',
  duration_recommended text DEFAULT '',
  entry_requirements text[] DEFAULT '{}',
  accommodation_options text[] DEFAULT '{}',
  transportation text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to active destinations
CREATE POLICY "Public can read active destinations"
  ON destinations
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_destinations_category ON destinations(category);
CREATE INDEX IF NOT EXISTS idx_destinations_featured ON destinations(featured);
CREATE INDEX IF NOT EXISTS idx_destinations_active ON destinations(active);
CREATE INDEX IF NOT EXISTS idx_destinations_slug ON destinations(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_created_at ON destinations(created_at);

-- Insert sample destinations data
INSERT INTO destinations (name, slug, description, short_description, featured_image, images, category, location, best_time_to_visit, activities, highlights, difficulty_level, duration_recommended, entry_requirements, accommodation_options, transportation, featured) VALUES
(
  'Mount Kilimanjaro',
  'mount-kilimanjaro',
  'Mount Kilimanjaro, standing at 5,895 meters (19,341 feet), is not only Africa''s highest peak but also the world''s tallest free-standing mountain. This majestic stratovolcano consists of three volcanic cones: Kibo, Mawenzi, and Shira.',
  'Africa''s highest peak and the world''s tallest free-standing mountain',
  'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800'],
  'mountain',
  '{"latitude": -3.0674, "longitude": 37.3556, "region": "Kilimanjaro", "district": "Moshi"}',
  'January-March and June-October offer the best weather conditions',
  ARRAY['Mountain Climbing', 'Photography', 'Wildlife Viewing'],
  ARRAY['Uhuru Peak (5,895m)', 'Glaciers', 'Multiple Climate Zones', 'Sunrise Views'],
  'challenging',
  '5-9 days',
  ARRAY['Valid passport', 'Tanzania visa', 'Yellow fever vaccination', 'Travel insurance'],
  ARRAY['Mountain Huts', 'Camping', 'Luxury Hotels in Moshi'],
  ARRAY['Kilimanjaro International Airport', 'Road transfer from Arusha'],
  true
),
(
  'Serengeti National Park',
  'serengeti-national-park',
  'The Serengeti National Park is a large national park in northern Tanzania that stretches over 14,750 square kilometers. It is famous for its annual migration of over 1.5 million white-bearded wildebeest and 250,000 zebra.',
  'Home to the Great Migration and endless plains teeming with wildlife',
  'https://images.pexels.com/photos/631292/pexels-photo-631292.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/631292/pexels-photo-631292.jpeg?auto=compress&cs=tinysrgb&w=800'],
  'park',
  '{"latitude": -2.3333, "longitude": 34.8333, "region": "Mara", "district": "Serengeti"}',
  'June to October for the Great Migration, December to March for calving season',
  ARRAY['Game Drives', 'Photography', 'Balloon Safaris'],
  ARRAY['Great Migration', 'Big Five', 'Endless Plains', 'Hot Air Balloons'],
  'easy',
  '3-7 days',
  ARRAY['Valid passport', 'Tanzania visa', 'Park fees'],
  ARRAY['Safari Lodges', 'Tented Camps', 'Mobile Camps'],
  ARRAY['Seronera Airstrip', 'Road from Arusha'],
  true
),
(
  'Ngorongoro Crater',
  'ngorongoro-crater',
  'The Ngorongoro Conservation Area is a protected area and a World Heritage Site located in the Crater Highlands area of Tanzania. The main feature is the Ngorongoro Crater, the world''s largest inactive, intact, and unfilled volcanic caldera.',
  'The world''s largest inactive volcanic caldera, a natural wildlife sanctuary',
  'https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&w=800'],
  'park',
  '{"latitude": -3.2, "longitude": 35.5, "region": "Arusha", "district": "Ngorongoro"}',
  'Year-round destination with dry season (June-October) being optimal',
  ARRAY['Game Drives', 'Cultural Tours', 'Photography'],
  ARRAY['Crater Floor', 'Black Rhinos', 'Flamingo Lakes', 'Maasai Culture'],
  'easy',
  '1-2 days',
  ARRAY['Valid passport', 'Tanzania visa', 'Conservation fees'],
  ARRAY['Crater Lodge', 'Safari Camps', 'Budget Lodges'],
  ARRAY['Road from Arusha', 'Charter flights'],
  true
),
(
  'Stone Town, Zanzibar',
  'stone-town-zanzibar',
  'Stone Town is the old part of Zanzibar City, the main city of Zanzibar, in Tanzania. The town was the center of trade on the East African coast between Asia and Africa before the colonization of the mainland.',
  'UNESCO World Heritage site with rich Swahili culture and architecture',
  'https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg?auto=compress&cs=tinysrgb&w=800'],
  'cultural',
  '{"latitude": -6.1659, "longitude": 39.1917, "region": "Zanzibar", "district": "Stone Town"}',
  'June to October and December to February for best weather',
  ARRAY['Walking Tours', 'Spice Tours', 'Cultural Experiences'],
  ARRAY['Historic Architecture', 'Spice Markets', 'Sunset Dhow Cruises', 'Cultural Museums'],
  'easy',
  '2-3 days',
  ARRAY['Valid passport', 'Tanzania visa or permit'],
  ARRAY['Historic Hotels', 'Boutique Guesthouses', 'Budget Hostels'],
  ARRAY['Zanzibar Airport', 'Ferry from Dar es Salaam'],
  true
);