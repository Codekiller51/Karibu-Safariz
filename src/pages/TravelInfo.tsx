import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Compass, 
  Backpack, 
  FileText, 
  Calendar, 
  Shield, 
  DollarSign, 
  Cloud,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  Clock,
  MapPin
} from 'lucide-react';

const TravelInfo: React.FC = () => {
  const { category } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Information', icon: Compass, color: 'bg-blue-500' },
    { id: 'tips', name: 'Travel Tips', icon: Compass, color: 'bg-green-500' },
    { id: 'packing', name: 'What to Pack', icon: Backpack, color: 'bg-purple-500' },
    { id: 'visa', name: 'Visa & Entry', icon: FileText, color: 'bg-red-500' },
    { id: 'best-time', name: 'Best Time to Visit', icon: Calendar, color: 'bg-yellow-500' },
    { id: 'health-safety', name: 'Health & Safety', icon: Shield, color: 'bg-pink-500' },
    { id: 'currency', name: 'Currency & Payments', icon: DollarSign, color: 'bg-indigo-500' },
    { id: 'weather', name: 'Weather Information', icon: Cloud, color: 'bg-cyan-500' }
  ];

  // Mock travel info data - in real app, this would come from your database
  const travelInfoData = [
    {
      id: '1',
      title: 'Essential Travel Tips for Tanzania',
      slug: 'essential-travel-tips-tanzania',
      category: 'tips',
      excerpt: 'Everything you need to know for a successful trip to Tanzania, from cultural etiquette to practical advice.',
      content: `Tanzania is an incredible destination that offers diverse experiences from mountain climbing to wildlife safaris. Here are essential tips to make your journey memorable and smooth.

**Cultural Etiquette:**
- Greet people with "Jambo" (Hello) or "Hujambo" (How are you?)
- Dress modestly, especially in rural areas and Stone Town
- Remove shoes when entering homes or mosques
- Use your right hand for greetings and eating
- Ask permission before photographing people

**General Travel Tips:**
- Learn basic Swahili phrases - locals appreciate the effort
- Carry cash as many places don't accept cards
- Negotiate prices at markets but be respectful
- Tip guides and service staff appropriately
- Stay hydrated and protect yourself from the sun
- Be patient - "pole pole" (slowly slowly) is the Tanzanian way

**Transportation:**
- Book domestic flights in advance for better prices
- Use reputable tour operators for safaris
- Dalla-dallas (local buses) are cheap but crowded
- Taxis should be negotiated beforehand
- Road conditions can be challenging during rainy season`,
      featured_image: 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['Culture', 'Etiquette', 'Transportation', 'Communication'],
      quick_facts: [
        { label: 'Official Languages', value: 'Swahili & English', icon: '🗣️' },
        { label: 'Time Zone', value: 'EAT (UTC+3)', icon: '🕐' },
        { label: 'Electricity', value: '230V, Type G plugs', icon: '🔌' },
        { label: 'Tipping', value: '10-15% recommended', icon: '💰' }
      ],
      featured: true
    },
    {
      id: '2',
      title: 'Complete Packing Guide for Tanzania',
      slug: 'packing-guide-tanzania',
      category: 'packing',
      excerpt: 'Comprehensive packing checklist for different activities and seasons in Tanzania.',
      content: `Packing for Tanzania depends on your activities and the time of year. This comprehensive guide covers everything you need for safaris, mountain climbing, and beach visits.

**Essential Clothing:**
- Lightweight, breathable fabrics in neutral colors
- Long-sleeved shirts and pants for sun protection and insects
- Comfortable walking shoes and sandals
- Hat with wide brim and sunglasses
- Light jacket or fleece for cool evenings
- Rain jacket during wet season

**Safari Specific Items:**
- Binoculars for wildlife viewing
- Camera with extra batteries and memory cards
- Dust-proof bags for electronics
- Comfortable safari clothes in khaki/olive colors
- Avoid bright colors and white (attracts insects)

**Mountain Climbing Gear:**
- Layered clothing system for temperature changes
- Waterproof jacket and pants
- Warm hat and gloves
- Hiking boots (broken in)
- Sleeping bag rated for cold temperatures
- Headlamp with extra batteries

**Health & Safety Items:**
- Sunscreen (SPF 30+) and insect repellent
- First aid kit with basic medications
- Water purification tablets
- Malaria prophylaxis (consult doctor)
- Yellow fever vaccination certificate`,
      featured_image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['Packing', 'Safari', 'Climbing', 'Essentials'],
      quick_facts: [
        { label: 'Luggage Limit', value: '15kg for domestic flights', icon: '🧳' },
        { label: 'Laundry', value: 'Available at most lodges', icon: '👕' },
        { label: 'Shopping', value: 'Buy gear in Arusha/Moshi', icon: '🛒' },
        { label: 'Climate', value: 'Varies by altitude', icon: '🌡️' }
      ],
      checklist_items: [
        'Passport with 6+ months validity',
        'Visa or entry permit',
        'Yellow fever certificate',
        'Travel insurance documents',
        'Malaria prophylaxis',
        'Sunscreen and insect repellent',
        'Comfortable walking shoes',
        'Camera and extra batteries',
        'Binoculars for wildlife',
        'Cash in USD and local currency'
      ],
      featured: true
    },
    {
      id: '3',
      title: 'Tanzania Visa & Entry Requirements',
      slug: 'tanzania-visa-entry-requirements',
      category: 'visa',
      excerpt: 'Complete guide to visa requirements, entry procedures, and documentation for Tanzania.',
      content: `Understanding visa requirements is crucial for a smooth entry into Tanzania. Here's everything you need to know about visas, entry procedures, and required documentation.

**Visa Requirements:**
Most visitors need a visa to enter Tanzania. Options include:
- Tourist Visa: Valid for 90 days, single entry
- Multiple Entry Visa: Valid for 12 months
- Transit Visa: For stays up to 7 days
- East Africa Tourist Visa: Valid for Kenya, Uganda, and Rwanda

**How to Obtain a Visa:**
1. **Online (eVisa):** Apply at https://eservices.immigration.go.tz
2. **On Arrival:** Available at major airports and border crossings
3. **Embassy/Consulate:** Apply in your home country

**Required Documents:**
- Passport valid for at least 6 months
- Completed visa application form
- Recent passport-sized photographs
- Proof of accommodation
- Return/onward ticket
- Yellow fever vaccination certificate
- Sufficient funds proof

**Entry Procedures:**
- Present passport and visa at immigration
- Health screening may be required
- Customs declaration for valuable items
- No restrictions on foreign currency (declare amounts over $10,000)

**Special Considerations:**
- Zanzibar requires separate entry procedures
- Some nationalities are visa-exempt
- Business visas have different requirements
- Overstaying results in fines and complications`,
      featured_image: 'https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['Visa', 'Immigration', 'Documentation', 'Entry'],
      quick_facts: [
        { label: 'Visa Cost', value: '$50-100 USD', icon: '💵' },
        { label: 'Processing Time', value: '3-10 business days', icon: '⏱️' },
        { label: 'Validity', value: '90 days tourist visa', icon: '📅' },
        { label: 'Extensions', value: 'Possible at immigration offices', icon: '📋' }
      ],
      featured: true
    },
    {
      id: '4',
      title: 'Best Time to Visit Tanzania',
      slug: 'best-time-visit-tanzania',
      category: 'best-time',
      excerpt: 'Seasonal guide to help you choose the perfect time for your Tanzania adventure.',
      content: `Tanzania's climate varies significantly by region and altitude, making timing crucial for different activities. Here's a comprehensive guide to help you plan your visit.

**Dry Season (June - October):**
**Advantages:**
- Excellent wildlife viewing as animals gather around water sources
- Clear skies perfect for mountain climbing
- Minimal rainfall and comfortable temperatures
- Best time for photography with great visibility

**Peak Season Considerations:**
- Higher prices for accommodation and tours
- Crowded national parks and popular attractions
- Book well in advance for best availability

**Wet Season (November - May):**
**Short Rains (November - December):**
- Brief afternoon showers
- Lush green landscapes
- Fewer tourists and lower prices
- Good for bird watching

**Long Rains (March - May):**
- Heavy rainfall, especially in April
- Some roads may be impassable
- Many lodges close for maintenance
- Not ideal for camping or mountain climbing

**Activity-Specific Timing:**

**Great Migration:**
- December-March: Calving season in southern Serengeti
- April-June: Migration moves north
- July-October: River crossings in northern Serengeti

**Mountain Climbing:**
- Best: January-March, June-October
- Avoid: April-May (heavy rains)

**Beach/Zanzibar:**
- Year-round destination
- Avoid March-May for heavy rains`,
      featured_image: 'https://images.pexels.com/photos/631292/pexels-photo-631292.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['Seasons', 'Weather', 'Migration', 'Planning'],
      quick_facts: [
        { label: 'Dry Season', value: 'June - October', icon: '☀️' },
        { label: 'Wet Season', value: 'November - May', icon: '🌧️' },
        { label: 'Peak Season', value: 'July - September', icon: '📈' },
        { label: 'Best Value', value: 'November - December', icon: '💰' }
      ],
      featured: true
    },
    {
      id: '5',
      title: 'Health & Safety in Tanzania',
      slug: 'health-safety-tanzania',
      category: 'health-safety',
      excerpt: 'Essential health precautions, safety tips, and medical information for travelers.',
      content: `Staying healthy and safe in Tanzania requires preparation and awareness. Here's comprehensive information about health precautions, safety measures, and medical facilities.

**Required Vaccinations:**
- Yellow Fever: Mandatory (certificate required)
- Hepatitis A & B: Recommended
- Typhoid: Recommended
- Meningitis: Recommended for certain areas
- Routine vaccines: Ensure up-to-date

**Malaria Prevention:**
Tanzania is a malaria-endemic country. Prevention includes:
- Antimalarial medication (consult your doctor)
- Insect repellent with DEET
- Long-sleeved clothing at dawn/dusk
- Sleep under mosquito nets
- Stay in air-conditioned or screened rooms

**Water & Food Safety:**
- Drink bottled or purified water
- Avoid ice in drinks
- Eat well-cooked, hot food
- Avoid raw vegetables and fruits you can't peel
- Be cautious with street food

**Altitude Sickness (Mountain Climbing):**
- Ascend gradually to acclimatize
- Stay hydrated and avoid alcohol
- Recognize symptoms: headache, nausea, fatigue
- Descend immediately if symptoms worsen

**General Safety Tips:**
- Use reputable tour operators
- Don't display valuable items
- Avoid walking alone at night
- Keep copies of important documents
- Register with your embassy
- Have comprehensive travel insurance

**Medical Facilities:**
- Good hospitals in Dar es Salaam and Arusha
- Limited facilities in remote areas
- Medical evacuation insurance recommended
- Bring prescription medications`,
      featured_image: 'https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['Health', 'Safety', 'Malaria', 'Vaccinations'],
      quick_facts: [
        { label: 'Emergency Number', value: '112 or 999', icon: '🚨' },
        { label: 'Medical Facilities', value: 'Good in major cities', icon: '🏥' },
        { label: 'Travel Insurance', value: 'Highly recommended', icon: '🛡️' },
        { label: 'Malaria Risk', value: 'Year-round in most areas', icon: '🦟' }
      ],
      featured: false
    },
    {
      id: '6',
      title: 'Currency & Payment Methods in Tanzania',
      slug: 'currency-payments-tanzania',
      category: 'currency',
      excerpt: 'Guide to Tanzanian currency, exchange rates, payment methods, and money matters.',
      content: `Understanding Tanzania's currency and payment systems will help you manage your finances effectively during your trip.

**Currency:**
- Tanzanian Shilling (TZS) is the official currency
- US Dollars widely accepted for tourism services
- 1 USD ≈ 2,300-2,500 TZS (rates fluctuate)

**Cash vs. Cards:**
- Cash is king in Tanzania
- Credit cards accepted at upscale hotels and lodges
- ATMs available in major cities
- Visa and Mastercard more widely accepted than Amex

**Where to Exchange Money:**
- Banks offer best official rates
- Forex bureaus are faster and competitive
- Hotels have poor exchange rates
- Avoid street money changers

**US Dollar Guidelines:**
- Bring clean, new bills (post-2006)
- $50 and $100 bills get better rates
- Torn or marked bills may be rejected
- Keep some small denominations

**Tipping Culture:**
- Safari guides: $10-15 per day per person
- Restaurant staff: 10-15% of bill
- Hotel staff: $1-2 per service
- Porters: $1-2 per bag

**Budget Planning:**
- Budget travelers: $30-50 per day
- Mid-range: $100-200 per day
- Luxury: $300+ per day
- Safari costs separate

**Banking Services:**
- International banks: Standard Chartered, Barclays
- Local banks: CRDB, NMB
- ATM fees: $3-5 per transaction
- Daily withdrawal limits apply`,
      featured_image: 'https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['Currency', 'Money', 'Banking', 'Tipping'],
      quick_facts: [
        { label: 'Currency', value: 'Tanzanian Shilling (TZS)', icon: '💱' },
        { label: 'USD Rate', value: '~2,400 TZS', icon: '💵' },
        { label: 'ATM Availability', value: 'Major cities only', icon: '🏧' },
        { label: 'Card Acceptance', value: 'Limited outside cities', icon: '💳' }
      ],
      featured: false
    },
    {
      id: '7',
      title: 'Tanzania Weather & Climate Guide',
      slug: 'tanzania-weather-climate',
      category: 'weather',
      excerpt: 'Detailed weather information for different regions and seasons in Tanzania.',
      content: `Tanzania's diverse geography creates varied climate zones, from tropical coastal areas to alpine conditions on Mount Kilimanjaro.

**Climate Zones:**

**Coastal Region (Dar es Salaam, Zanzibar):**
- Tropical climate with high humidity
- Temperature: 25-32°C (77-90°F) year-round
- Two rainy seasons: March-May, November-December
- Sea breezes provide relief from heat

**Northern Highlands (Arusha, Moshi):**
- Temperate climate due to altitude
- Temperature: 15-25°C (59-77°F)
- Dry season: June-October
- Short rains: November-December
- Long rains: March-May

**Central Plateau:**
- Semi-arid with hot days, cool nights
- Temperature: 20-30°C (68-86°F)
- Limited rainfall, mostly December-April

**Southern Highlands:**
- Cooler temperatures due to elevation
- Temperature: 10-25°C (50-77°F)
- Rainy season: November-April

**Mount Kilimanjaro Climate Zones:**
1. **Cultivation Zone (800-1,800m):** 20-30°C
2. **Rainforest Zone (1,800-2,800m):** 12-20°C
3. **Heather Zone (2,800-4,000m):** 5-15°C
4. **Alpine Desert (4,000-5,000m):** -5 to 15°C
5. **Arctic Zone (5,000m+):** -20 to 5°C

**Seasonal Weather Patterns:**

**Dry Season (June-October):**
- Clear skies and minimal rainfall
- Cooler temperatures, especially at night
- Low humidity
- Excellent visibility for photography

**Wet Season (November-May):**
- Higher temperatures and humidity
- Afternoon thunderstorms common
- Lush green landscapes
- Some roads may be difficult

**What to Expect:**
- Equatorial sun is strong year-round
- Temperature variations mainly due to altitude
- Coastal areas remain warm and humid
- Mountain areas can be surprisingly cold`,
      featured_image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['Weather', 'Climate', 'Seasons', 'Temperature'],
      quick_facts: [
        { label: 'Average Temperature', value: '20-30°C (68-86°F)', icon: '🌡️' },
        { label: 'Rainy Seasons', value: 'Mar-May, Nov-Dec', icon: '🌧️' },
        { label: 'Dry Season', value: 'June-October', icon: '☀️' },
        { label: 'UV Index', value: 'Very High year-round', icon: '🌞' }
      ],
      featured: false
    }
  ];

  const filteredInfo = travelInfoData.filter(info => {
    const matchesCategory = selectedCategory === 'all' || info.category === selectedCategory;
    const matchesSearch = info.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         info.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         info.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const featuredInfo = travelInfoData.filter(info => info.featured);

  const getCategoryData = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Travel Information
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Everything you need to know for a successful and safe journey to Tanzania. 
            From visa requirements to packing tips, we've got you covered.
          </p>
        </div>

        {/* Featured Information */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Essential Information</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Must-read guides for first-time visitors to Tanzania
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredInfo.map((info) => {
              const categoryData = getCategoryData(info.category);
              const IconComponent = categoryData.icon;
              return (
                <Link
                  key={info.id}
                  to={`/travel-info/${info.slug}`}
                  className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="relative">
                    <img
                      src={info.featured_image}
                      alt={info.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <div className={`${categoryData.color} rounded-full p-2`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {info.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {info.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {info.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search travel information..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-300'
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredInfo.length} travel guides
          </p>
        </div>

        {/* Information Grid */}
        {filteredInfo.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInfo.map((info) => {
              const categoryData = getCategoryData(info.category);
              const IconComponent = categoryData.icon;
              return (
                <Link
                  key={info.id}
                  to={`/travel-info/${info.slug}`}
                  className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={info.featured_image}
                      alt={info.title}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <div className={`${categoryData.color} rounded-full p-2`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    {info.featured && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>Essential</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {info.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {info.excerpt}
                    </p>
                    
                    {/* Quick Facts */}
                    {info.quick_facts && info.quick_facts.length > 0 && (
                      <div className="mb-4">
                        <div className="grid grid-cols-2 gap-2">
                          {info.quick_facts.slice(0, 2).map((fact, index) => (
                            <div key={index} className="text-xs text-gray-500">
                              <span className="mr-1">{fact.icon}</span>
                              <span className="font-medium">{fact.label}:</span>
                              <div className="text-gray-700">{fact.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {info.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {info.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{info.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-orange-600 font-semibold group-hover:text-orange-700">
                        Read Guide
                      </div>
                      <div className="text-orange-600 group-hover:translate-x-1 transition-transform">
                        →
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No travel information found matching your criteria.</div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="mt-4 text-orange-600 hover:text-orange-700"
            >
              Clear filters to see all guides
            </button>
          </div>
        )}

        {/* Emergency Information */}
        <div className="mt-16 bg-red-50 border border-red-200 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-red-900 mb-4">Emergency Information</h2>
            <p className="text-red-800 max-w-2xl mx-auto">
              Important contact numbers and emergency procedures for travelers in Tanzania
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Emergency Services</h3>
              <div className="text-red-800">
                <div>Police: 999 or 112</div>
                <div>Fire: 999 or 112</div>
                <div>Medical: 999 or 112</div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Info className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Tourist Helpline</h3>
              <div className="text-red-800">
                <div>Tanzania Tourism: +255 22 213 1555</div>
                <div>Tourist Police: +255 22 211 5897</div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Embassy Contacts</h3>
              <div className="text-red-800">
                <div>US Embassy: +255 22 229 4000</div>
                <div>UK Embassy: +255 22 229 0000</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-orange-600 to-orange-800 rounded-2xl text-white p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Plan Your Tanzania Adventure?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Now that you're informed, let our expert team help you create the perfect Tanzania experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/tours"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Browse Tours
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-orange-600 transition-colors font-semibold"
            >
              Get Expert Advice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelInfo;