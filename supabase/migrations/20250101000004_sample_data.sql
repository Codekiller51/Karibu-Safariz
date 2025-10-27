/*
  # Sample Data

  ## Overview
  This migration inserts sample data for the Karibu Tours & Safariz application
  to support development, testing, and demonstration purposes.

  ## Data Inserted

  ### 1. Tour Packages (5 records)
  - Kilimanjaro Machame Route (Mountain Climbing)
  - Serengeti Safari Adventure (Safari)
  - Ngorongoro Crater Day Trip (Day Trips)
  - Mount Meru Climbing (Mountain Climbing)
  - Tarangire National Park Safari (Safari)

  ### 2. Blog Posts (3 records)
  - Ultimate Guide to Climbing Mount Kilimanjaro
  - Best Time to Visit Serengeti National Park
  - Packing List for Tanzania Safari

  ### 3. Destinations (4 records)
  - Mount Kilimanjaro
  - Serengeti National Park
  - Ngorongoro Crater
  - Stone Town, Zanzibar

  ## Notes
  - All sample data uses realistic content and pricing
  - Images are sourced from Pexels stock photography
  - Data is for demonstration purposes only
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

-- Insert sample destinations
INSERT INTO destinations (
  name,
  slug,
  description,
  short_description,
  featured_image,
  images,
  category,
  location,
  best_time_to_visit,
  activities,
  highlights,
  difficulty_level,
  duration_recommended,
  entry_requirements,
  accommodation_options,
  transportation,
  featured
) VALUES
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
