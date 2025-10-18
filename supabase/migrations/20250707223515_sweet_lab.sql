/*
  # Insert sample data

  1. Sample tour packages
  2. Sample blog posts
  
  This provides initial data for development and testing.
*/

-- Insert sample tour packages
INSERT INTO tour_packages (
  title,
  description,
  short_description,
  category,
  duration,
  difficulty,
  price_usd,
  price_tzs,
  max_participants,
  min_participants,
  images,
  includes,
  excludes,
  requirements,
  best_time,
  featured,
  itinerary
) VALUES 
(
  'Kilimanjaro Machame Route',
  'The Machame route is one of the most popular routes to the summit of Mount Kilimanjaro. Known as the "Whiskey Route," it offers stunning scenery and a high success rate. This challenging trek takes you through diverse ecosystems, from lush rainforest to alpine desert, culminating at Uhuru Peak.',
  'Experience the breathtaking Machame route, known for its stunning scenery and high success rate.',
  'mountain-climbing',
  7,
  'challenging',
  2500.00,
  5800000.00,
  12,
  2,
  ARRAY[
    'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  ARRAY['Professional guide', 'All meals', 'Camping equipment', 'Park fees', 'Rescue fees'],
  ARRAY['International flights', 'Visa fees', 'Personal gear', 'Tips'],
  ARRAY['Good physical fitness', 'Medical certificate', 'Travel insurance'],
  'June - October, December - March',
  true,
  '[
    {
      "day": 1,
      "title": "Machame Gate to Machame Camp",
      "description": "Begin your journey through the lush rainforest",
      "activities": ["Registration", "Forest hike", "Wildlife spotting"],
      "accommodation": "Machame Camp",
      "meals": ["Lunch", "Dinner"],
      "elevation_gain": 1200,
      "distance": 11
    },
    {
      "day": 2,
      "title": "Machame Camp to Shira Camp",
      "description": "Emerge from the forest into moorland",
      "activities": ["Moorland trek", "Acclimatization"],
      "accommodation": "Shira Camp",
      "meals": ["Breakfast", "Lunch", "Dinner"],
      "elevation_gain": 850,
      "distance": 5
    }
  ]'::jsonb
),
(
  'Serengeti Safari Adventure',
  'Experience the world-famous Serengeti National Park, home to the Great Migration and an incredible diversity of wildlife. This safari adventure offers the chance to witness lions, elephants, leopards, buffalo, and rhinos in their natural habitat.',
  'Join us for an unforgettable safari experience in the legendary Serengeti.',
  'safari',
  5,
  'easy',
  1800.00,
  4200000.00,
  8,
  2,
  ARRAY[
    'https://images.pexels.com/photos/631292/pexels-photo-631292.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  ARRAY['4x4 safari vehicle', 'Professional guide', 'All meals', 'Lodge accommodation', 'Park fees'],
  ARRAY['International flights', 'Alcoholic beverages', 'Personal expenses'],
  ARRAY['Valid passport', 'Yellow fever vaccination'],
  'Year-round',
  true,
  '[
    {
      "day": 1,
      "title": "Arrival in Serengeti",
      "description": "Welcome to the Serengeti",
      "activities": ["Airport pickup", "Game drive", "Sunset viewing"],
      "accommodation": "Serengeti Lodge",
      "meals": ["Lunch", "Dinner"]
    }
  ]'::jsonb
),
(
  'Ngorongoro Crater Day Trip',
  'Explore the world''s largest inactive volcanic caldera, often called the "Eighth Wonder of the World." The Ngorongoro Crater is home to an estimated 30,000 large mammals and offers some of the best wildlife viewing in Africa.',
  'Discover the incredible wildlife of the Ngorongoro Crater in a single day.',
  'day-trips',
  1,
  'easy',
  350.00,
  800000.00,
  6,
  2,
  ARRAY[
    'https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1821644/pexels-photo-1821644.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  ARRAY['Transportation', 'Lunch', 'Park fees', 'Professional guide'],
  ARRAY['Personal expenses', 'Tips', 'Drinks'],
  ARRAY['Comfortable walking shoes', 'Sunscreen', 'Camera'],
  'Year-round',
  false,
  '[
    {
      "day": 1,
      "title": "Ngorongoro Crater Exploration",
      "description": "Full day crater tour",
      "activities": ["Game drive", "Picnic lunch", "Wildlife photography"],
      "meals": ["Lunch"]
    }
  ]'::jsonb
),
(
  'Mount Meru Climbing',
  'Mount Meru is Tanzania''s second-highest mountain and offers excellent acclimatization for Kilimanjaro climbers. This beautiful trek provides stunning views and diverse wildlife encounters.',
  'Climb Tanzania''s second-highest peak with stunning views and wildlife.',
  'mountain-climbing',
  4,
  'moderate',
  1200.00,
  2800000.00,
  8,
  2,
  ARRAY[
    'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  ARRAY['Professional guide', 'All meals', 'Hut accommodation', 'Park fees'],
  ARRAY['Personal gear', 'Tips', 'Travel insurance'],
  ARRAY['Good fitness level', 'Hiking experience'],
  'June - February',
  false,
  '[]'::jsonb
),
(
  'Tarangire National Park Safari',
  'Famous for its large elephant herds and iconic baobab trees, Tarangire offers a classic African safari experience with diverse wildlife and beautiful landscapes.',
  'Experience large elephant herds and iconic baobab trees.',
  'safari',
  3,
  'easy',
  950.00,
  2200000.00,
  8,
  2,
  ARRAY[
    'https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  ARRAY['Safari vehicle', 'Professional guide', 'All meals', 'Camp accommodation'],
  ARRAY['Alcoholic drinks', 'Personal expenses'],
  ARRAY['Comfortable clothing', 'Binoculars'],
  'June - October',
  false,
  '[]'::jsonb
);

-- Insert sample blog posts
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  featured_image,
  author,
  category,
  tags,
  published,
  published_at
) VALUES 
(
  'Ultimate Guide to Climbing Mount Kilimanjaro',
  'ultimate-guide-climbing-kilimanjaro',
  'Everything you need to know about climbing Africa''s highest peak, from route selection to gear recommendations.',
  'Mount Kilimanjaro stands as Africa''s highest peak and one of the world''s most accessible high-altitude mountains. This comprehensive guide covers everything you need to know for a successful climb...',
  'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800',
  'John Safari',
  'Mountain Climbing',
  ARRAY['kilimanjaro', 'climbing', 'guide', 'preparation'],
  true,
  now()
),
(
  'Best Time to Visit Serengeti National Park',
  'best-time-visit-serengeti',
  'Discover the optimal times to visit the Serengeti for wildlife viewing and the Great Migration.',
  'The Serengeti National Park offers incredible wildlife viewing year-round, but timing your visit can enhance your experience significantly...',
  'https://images.pexels.com/photos/631292/pexels-photo-631292.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Mary Wildlife',
  'Safari',
  ARRAY['serengeti', 'wildlife', 'migration', 'timing'],
  true,
  now() - interval '1 week'
),
(
  'Packing List for Tanzania Safari',
  'packing-list-tanzania-safari',
  'Essential items to pack for your Tanzania safari adventure, from clothing to photography gear.',
  'Packing for a safari requires careful consideration of climate, activities, and luggage restrictions...',
  'https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg?auto=compress&cs=tinysrgb&w=800',
  'David Explorer',
  'Travel Tips',
  ARRAY['packing', 'safari', 'gear', 'preparation'],
  true,
  now() - interval '2 weeks'
);