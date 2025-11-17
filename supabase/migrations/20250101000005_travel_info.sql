-- Create travel_info table and RLS policies

CREATE TABLE IF NOT EXISTS travel_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  featured_image text NOT NULL,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  quick_facts jsonb DEFAULT '[]',
  checklist_items text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE travel_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active travel info"
  ON travel_info
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins can manage travel info"
  ON travel_info
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND COALESCE(p.is_admin, false) = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND COALESCE(p.is_admin, false) = true));

CREATE INDEX IF NOT EXISTS idx_travel_info_slug ON travel_info(slug);
CREATE INDEX IF NOT EXISTS idx_travel_info_category ON travel_info(category);
CREATE INDEX IF NOT EXISTS idx_travel_info_featured ON travel_info(featured);
CREATE INDEX IF NOT EXISTS idx_travel_info_active ON travel_info(active);
CREATE INDEX IF NOT EXISTS idx_travel_info_created_at ON travel_info(created_at);