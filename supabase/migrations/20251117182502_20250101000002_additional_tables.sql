/*
  # Additional Tables Schema

  ## Overview
  This migration creates additional supporting tables for the Karibu Tours & Safariz application,
  including blog posts, contact inquiries, and destination information.

  ## Tables Created

  ### 1. blog_posts
  Blog content management for travel tips and stories
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Blog post title
  - `slug` (text, unique) - URL-friendly identifier
  - `excerpt` (text) - Short preview text
  - `content` (text) - Full blog content
  - `featured_image` (text) - Hero image URL
  - `author` (text) - Author name
  - `category` (text) - Content category
  - `tags` (text[]) - Searchable tags
  - `published` (boolean) - Publication status
  - `published_at` (timestamp, optional) - Publication date
  - `created_at` (timestamp) - Creation timestamp
  - `updated_at` (timestamp) - Last update timestamp

  ### 2. contact_inquiries
  Customer contact form submissions
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Sender's name
  - `email` (text) - Contact email
  - `phone` (text, optional) - Contact phone
  - `subject` (text) - Inquiry subject
  - `message` (text) - Inquiry message
  - `status` (enum) - new, replied, closed
  - `created_at` (timestamp) - Submission timestamp

  ### 3. destinations
  Detailed destination information pages
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text, unique) - Destination name
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - Detailed description
  - `short_description` (text) - Brief summary
  - `featured_image` (text) - Main image URL
  - `images` (text[]) - Gallery images
  - `category` (enum) - mountain, park, cultural, coastal, adventure
  - `location` (jsonb) - Geographic coordinates and address
  - `best_time_to_visit` (text) - Optimal visiting period
  - `activities` (text[]) - Available activities
  - `highlights` (text[]) - Key attractions
  - `difficulty_level` (enum) - easy, moderate, challenging, extreme
  - `duration_recommended` (text) - Suggested visit duration
  - `entry_requirements` (text[]) - Entry prerequisites
  - `accommodation_options` (text[]) - Lodging types
  - `transportation` (text[]) - Access methods
  - `featured` (boolean) - Featured destination flag
  - `active` (boolean) - Active/inactive status
  - `created_at` (timestamp) - Creation timestamp
  - `updated_at` (timestamp) - Last update timestamp

  ## Security
  Row Level Security (RLS) is enabled on all tables:
  - Public read access to published blog posts and active destinations
  - Anyone can submit contact inquiries
  - Admin-only write access (managed through separate policies)

  ## Indexes
  Performance indexes are created on frequently queried columns.
*/

-- Create enum types
CREATE TYPE inquiry_status AS ENUM ('new', 'replied', 'closed');
CREATE TYPE destination_category AS ENUM ('mountain', 'park', 'cultural', 'coastal', 'adventure');

DO $$ BEGIN
    CREATE TYPE difficulty_level AS ENUM ('easy', 'moderate', 'challenging', 'extreme');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  featured_image text NOT NULL,
  author text NOT NULL,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);

-- Create contact_inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  status inquiry_status DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create inquiries"
  ON contact_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at);

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

ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active destinations"
  ON destinations
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE INDEX IF NOT EXISTS idx_destinations_category ON destinations(category);
CREATE INDEX IF NOT EXISTS idx_destinations_featured ON destinations(featured);
CREATE INDEX IF NOT EXISTS idx_destinations_active ON destinations(active);
CREATE INDEX IF NOT EXISTS idx_destinations_slug ON destinations(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_created_at ON destinations(created_at);
