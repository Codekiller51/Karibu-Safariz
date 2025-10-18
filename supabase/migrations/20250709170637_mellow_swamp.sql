/*
  # Create travel information system

  1. New Tables
    - `travel_info`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `category` (enum)
      - `content` (text)
      - `excerpt` (text)
      - `featured_image` (text)
      - `tags` (text array)
      - `quick_facts` (jsonb)
      - `checklist_items` (text array)
      - `featured` (boolean)
      - `active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `travel_info` table
    - Add policy for public read access to active travel info
*/

-- Create travel info category enum
CREATE TYPE travel_info_category AS ENUM ('tips', 'packing', 'visa', 'best-time', 'health-safety', 'currency', 'weather');

-- Create travel_info table
CREATE TABLE IF NOT EXISTS travel_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category travel_info_category NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  featured_image text NOT NULL,
  tags text[] DEFAULT '{}',
  quick_facts jsonb DEFAULT '[]',
  checklist_items text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE travel_info ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to active travel info
CREATE POLICY "Public can read active travel info"
  ON travel_info
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_travel_info_category ON travel_info(category);
CREATE INDEX IF NOT EXISTS idx_travel_info_featured ON travel_info(featured);
CREATE INDEX IF NOT EXISTS idx_travel_info_active ON travel_info(active);
CREATE INDEX IF NOT EXISTS idx_travel_info_slug ON travel_info(slug);
CREATE INDEX IF NOT EXISTS idx_travel_info_created_at ON travel_info(created_at);

-- Insert sample travel info data
INSERT INTO travel_info (title, slug, category, content, excerpt, featured_image, tags, quick_facts, checklist_items, featured) VALUES
(
  'Essential Travel Tips for Tanzania',
  'essential-travel-tips-tanzania',
  'tips',
  'Tanzania is an incredible destination that offers diverse experiences from mountain climbing to wildlife safaris. Here are essential tips to make your journey memorable and smooth.

## Cultural Etiquette
- Greet people with "Jambo" (Hello) or "Hujambo" (How are you?)
- Dress modestly, especially in rural areas and Stone Town
- Remove shoes when entering homes or mosques
- Use your right hand for greetings and eating
- Ask permission before photographing people

## General Travel Tips
- Learn basic Swahili phrases - locals appreciate the effort
- Carry cash as many places don''t accept cards
- Negotiate prices at markets but be respectful
- Tip guides and service staff appropriately
- Stay hydrated and protect yourself from the sun
- Be patient - "pole pole" (slowly slowly) is the Tanzanian way',
  'Everything you need to know for a successful trip to Tanzania, from cultural etiquette to practical advice.',
  'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Culture', 'Etiquette', 'Transportation', 'Communication'],
  '[
    {"label": "Official Languages", "value": "Swahili & English", "icon": "🗣️"},
    {"label": "Time Zone", "value": "EAT (UTC+3)", "icon": "🕐"},
    {"label": "Electricity", "value": "230V, Type G plugs", "icon": "🔌"},
    {"label": "Tipping", "value": "10-15% recommended", "icon": "💰"}
  ]',
  ARRAY['Learn basic Swahili greetings', 'Pack modest clothing', 'Bring cash in USD', 'Respect local customs', 'Use insect repellent'],
  true
),
(
  'Complete Packing Guide for Tanzania',
  'packing-guide-tanzania',
  'packing',
  'Packing for Tanzania depends on your activities and the time of year. This comprehensive guide covers everything you need for safaris, mountain climbing, and beach visits.

## Essential Clothing
- Lightweight, breathable fabrics in neutral colors
- Long-sleeved shirts and pants for sun protection
- Comfortable walking shoes and sandals
- Hat with wide brim and sunglasses
- Light jacket for cool evenings

## Safari Specific Items
- Binoculars for wildlife viewing
- Camera with extra batteries
- Dust-proof bags for electronics
- Comfortable safari clothes in khaki colors
- Avoid bright colors and white

## Health & Safety Items
- Sunscreen (SPF 30+) and insect repellent
- First aid kit with basic medications
- Water purification tablets
- Malaria prophylaxis
- Yellow fever vaccination certificate',
  'Comprehensive packing checklist for different activities and seasons in Tanzania.',
  'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Packing', 'Safari', 'Climbing', 'Essentials'],
  '[
    {"label": "Luggage Limit", "value": "15kg for domestic flights", "icon": "🧳"},
    {"label": "Laundry", "value": "Available at most lodges", "icon": "👕"},
    {"label": "Shopping", "value": "Buy gear in Arusha/Moshi", "icon": "🛒"},
    {"label": "Climate", "value": "Varies by altitude", "icon": "🌡️"}
  ]',
  ARRAY['Passport with 6+ months validity', 'Visa documents', 'Yellow fever certificate', 'Travel insurance', 'Malaria prophylaxis', 'Sunscreen and insect repellent', 'Comfortable shoes', 'Camera and batteries', 'Binoculars', 'Cash in USD'],
  true
),
(
  'Tanzania Visa & Entry Requirements',
  'tanzania-visa-entry-requirements',
  'visa',
  'Understanding visa requirements is crucial for a smooth entry into Tanzania. Here''s everything you need to know about visas, entry procedures, and required documentation.

## Visa Requirements
Most visitors need a visa to enter Tanzania. Options include:
- Tourist Visa: Valid for 90 days, single entry
- Multiple Entry Visa: Valid for 12 months
- Transit Visa: For stays up to 7 days
- East Africa Tourist Visa: Valid for Kenya, Uganda, and Rwanda

## How to Obtain a Visa
1. Online (eVisa): Apply at https://eservices.immigration.go.tz
2. On Arrival: Available at major airports and border crossings
3. Embassy/Consulate: Apply in your home country

## Required Documents
- Passport valid for at least 6 months
- Completed visa application form
- Recent passport-sized photographs
- Proof of accommodation
- Return/onward ticket
- Yellow fever vaccination certificate',
  'Complete guide to visa requirements, entry procedures, and documentation for Tanzania.',
  'https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Visa', 'Immigration', 'Documentation', 'Entry'],
  '[
    {"label": "Visa Cost", "value": "$50-100 USD", "icon": "💵"},
    {"label": "Processing Time", "value": "3-10 business days", "icon": "⏱️"},
    {"label": "Validity", "value": "90 days tourist visa", "icon": "📅"},
    {"label": "Extensions", "value": "Possible at immigration offices", "icon": "📋"}
  ]',
  ARRAY['Valid passport (6+ months)', 'Visa application', 'Passport photos', 'Proof of accommodation', 'Return ticket', 'Yellow fever certificate', 'Sufficient funds proof'],
  true
),
(
  'Best Time to Visit Tanzania',
  'best-time-visit-tanzania',
  'best-time',
  'Tanzania''s climate varies significantly by region and altitude, making timing crucial for different activities.

## Dry Season (June - October)
**Advantages:**
- Excellent wildlife viewing
- Clear skies for mountain climbing
- Minimal rainfall
- Best photography conditions

## Wet Season (November - May)
**Short Rains (November - December):**
- Brief afternoon showers
- Lush green landscapes
- Fewer tourists, lower prices
- Good for bird watching

**Long Rains (March - May):**
- Heavy rainfall, especially April
- Some roads impassable
- Many lodges close
- Not ideal for camping

## Activity-Specific Timing
**Great Migration:**
- December-March: Calving season
- April-June: Migration moves north
- July-October: River crossings

**Mountain Climbing:**
- Best: January-March, June-October
- Avoid: April-May (heavy rains)',
  'Seasonal guide to help you choose the perfect time for your Tanzania adventure.',
  'https://images.pexels.com/photos/631292/pexels-photo-631292.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Seasons', 'Weather', 'Migration', 'Planning'],
  '[
    {"label": "Dry Season", "value": "June - October", "icon": "☀️"},
    {"label": "Wet Season", "value": "November - May", "icon": "🌧️"},
    {"label": "Peak Season", "value": "July - September", "icon": "📈"},
    {"label": "Best Value", "value": "November - December", "icon": "💰"}
  ]',
  ARRAY['Check seasonal weather patterns', 'Book early for dry season', 'Consider migration timing', 'Pack for weather conditions', 'Plan activities by season'],
  true
);