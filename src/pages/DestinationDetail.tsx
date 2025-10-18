import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Star, Camera, Users, Calendar, Thermometer, Compass, CheckCircle, AlertTriangle } from 'lucide-react';

const DestinationDetail: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock destination data - in real app, this would come from your database
  const destination = {
    id: '1',
    name: 'Mount Kilimanjaro',
    slug: 'mount-kilimanjaro',
    description: `Mount Kilimanjaro, standing at 5,895 meters (19,341 feet), is not only Africa's highest peak but also the world's tallest free-standing mountain. This majestic stratovolcano consists of three volcanic cones: Kibo, Mawenzi, and Shira. Located in northeastern Tanzania, near the border with Kenya, Kilimanjaro is a UNESCO World Heritage Site and one of the most iconic mountains in the world.

The mountain offers a unique climbing experience as it passes through five distinct climate zones, from tropical rainforest at the base to arctic conditions at the summit. This diversity makes it possible to experience multiple ecosystems in a single journey, encountering everything from lush vegetation and wildlife to glaciers and snow-capped peaks.

What makes Kilimanjaro particularly special is that it requires no technical climbing skills, making it accessible to determined hikers with good physical fitness. However, the altitude and changing weather conditions present significant challenges that require proper preparation, acclimatization, and experienced guides.`,
    short_description: 'Africa\'s highest peak and the world\'s tallest free-standing mountain',
    category: 'mountain',
    featured_image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=1200',
    images: [
      'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    location: {
      latitude: -3.0674,
      longitude: 37.3556,
      region: 'Kilimanjaro',
      district: 'Moshi'
    },
    difficulty_level: 'challenging',
    duration_recommended: '5-9 days',
    best_time_to_visit: 'January-March and June-October offer the best weather conditions with clear skies and minimal rainfall. Avoid April-May (long rains) and November (short rains).',
    activities: [
      'Mountain Climbing',
      'Photography',
      'Wildlife Viewing',
      'Cultural Tours',
      'Day Hikes',
      'Crater Camping'
    ],
    highlights: [
      'Uhuru Peak (5,895m) - Highest point in Africa',
      'Glaciers and Ice Fields',
      'Five Climate Zones',
      'Sunrise from Summit',
      'Barranco Wall',
      'Stella Point',
      'Gilman\'s Point',
      'Mawenzi Peak Views'
    ],
    entry_requirements: [
      'Valid passport with 6+ months validity',
      'Tanzania visa (available on arrival)',
      'Yellow fever vaccination certificate',
      'Travel insurance (mandatory)',
      'Climbing permit (arranged by tour operator)',
      'Park fees payment'
    ],
    accommodation_options: [
      'Mountain Huts (Marangu Route)',
      'Camping (All other routes)',
      'Luxury Hotels in Moshi/Arusha',
      'Budget Guesthouses',
      'Safari Lodges',
      'Eco-lodges'
    ],
    transportation: [
      'Kilimanjaro International Airport (JRO)',
      'Road transfer from Arusha (1.5 hours)',
      'Road transfer from Moshi (45 minutes)',
      'Private vehicle transfers',
      'Shuttle services',
      'Domestic flights'
    ],
    climate_zones: [
      {
        name: 'Cultivation Zone',
        elevation: '800-1,800m',
        description: 'Farmland and villages with banana and coffee plantations',
        temperature: '20-30°C'
      },
      {
        name: 'Rainforest Zone',
        elevation: '1,800-2,800m',
        description: 'Dense tropical rainforest with high humidity and diverse wildlife',
        temperature: '12-20°C'
      },
      {
        name: 'Heather/Moorland Zone',
        elevation: '2,800-4,000m',
        description: 'Heather and moorland with giant groundsels and lobelias',
        temperature: '5-15°C'
      },
      {
        name: 'Alpine Desert Zone',
        elevation: '4,000-5,000m',
        description: 'Harsh desert conditions with extreme temperature variations',
        temperature: '-5 to 15°C'
      },
      {
        name: 'Arctic Zone',
        elevation: '5,000m+',
        description: 'Glaciers, ice fields, and arctic conditions at the summit',
        temperature: '-20 to 5°C'
      }
    ],
    routes: [
      {
        name: 'Machame Route',
        duration: '6-7 days',
        difficulty: 'Moderate to Challenging',
        success_rate: '85%',
        description: 'Most popular route with scenic views and good acclimatization'
      },
      {
        name: 'Marangu Route',
        duration: '5-6 days',
        difficulty: 'Moderate',
        success_rate: '65%',
        description: 'Only route with hut accommodation, known as the "Coca-Cola" route'
      },
      {
        name: 'Lemosho Route',
        duration: '7-8 days',
        difficulty: 'Moderate to Challenging',
        success_rate: '90%',
        description: 'Scenic route with excellent acclimatization and high success rate'
      },
      {
        name: 'Rongai Route',
        duration: '6-7 days',
        difficulty: 'Moderate',
        success_rate: '80%',
        description: 'Approaches from the north, less crowded with good wildlife viewing'
      }
    ],
    safety_tips: [
      'Proper acclimatization is crucial - don\'t rush',
      'Stay hydrated and maintain electrolyte balance',
      'Listen to your guide and follow their advice',
      'Recognize altitude sickness symptoms',
      'Pack appropriate gear for all weather conditions',
      'Physical fitness preparation is essential',
      'Travel insurance with evacuation coverage required'
    ],
    related_tours: [
      { id: '1', name: 'Kilimanjaro Machame Route 7-Days', price: 2800 },
      { id: '2', name: 'Kilimanjaro Marangu Route 6-Days', price: 2400 },
      { id: '3', name: 'Kilimanjaro Lemosho Route 8-Days', price: 3200 }
    ]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-orange-100 text-orange-800';
      case 'extreme': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Destinations</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="relative">
                <img
                  src={destination.images[selectedImage]}
                  alt={destination.name}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(destination.difficulty_level)}`}>
                    {destination.difficulty_level}
                  </span>
                </div>
              </div>
              {destination.images.length > 1 && (
                <div className="flex space-x-2 p-4">
                  {destination.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-orange-600' : 'border-gray-300'
                      }`}
                    >
                      <img src={image} alt={`${destination.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Destination Details */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{destination.name}</h1>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>{destination.location.region}, {destination.location.district}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span>{destination.duration_recommended}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Compass className="h-5 w-5 text-gray-500" />
                  <span className="capitalize">{destination.category}</span>
                </div>
              </div>

              <div className="prose max-w-none mb-8">
                {destination.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-600 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Highlights */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {destination.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-orange-600" />
                      <span className="text-gray-600">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Activities</h3>
                <div className="flex flex-wrap gap-2">
                  {destination.activities.map((activity, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Climate Zones */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Climate Zones</h3>
                <div className="space-y-4">
                  {destination.climate_zones.map((zone, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{zone.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{zone.elevation}</span>
                          <div className="flex items-center space-x-1">
                            <Thermometer className="h-4 w-4" />
                            <span>{zone.temperature}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600">{zone.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Routes */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Climbing Routes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {destination.routes.map((route, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{route.name}</h4>
                      <div className="space-y-2 text-sm text-gray-600 mb-3">
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>{route.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Difficulty:</span>
                          <span>{route.difficulty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Success Rate:</span>
                          <span className="text-green-600 font-medium">{route.success_rate}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{route.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Tips */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Safety & Preparation</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    <h4 className="text-lg font-semibold text-yellow-800">Important Safety Information</h4>
                  </div>
                  <ul className="space-y-2">
                    {destination.safety_tips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span className="text-yellow-800">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Best Time to Visit */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Best Time to Visit</h3>
                <p className="text-blue-800">{destination.best_time_to_visit}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Plan Your Visit</h3>

              {/* Quick Info */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="capitalize font-medium">{destination.difficulty_level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{destination.duration_recommended}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{destination.location.region}</span>
                </div>
              </div>

              {/* Related Tours */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Related Tours</h4>
                <div className="space-y-3">
                  {destination.related_tours.map((tour) => (
                    <Link
                      key={tour.id}
                      to={`/tours/mountain-climbing/${tour.id}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900 text-sm mb-1">{tour.name}</div>
                      <div className="text-orange-600 font-semibold">${tour.price}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Link
                  to="/tours/mountain-climbing"
                  className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold text-center block"
                >
                  View All Tours
                </Link>
                <Link
                  to="/contact"
                  className="w-full border border-orange-600 text-orange-600 py-3 rounded-lg hover:bg-orange-50 transition-colors font-semibold text-center block"
                >
                  Plan Custom Trip
                </Link>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Contact our destination experts for personalized advice.
                </p>
                <div className="text-sm text-gray-600">
                  <div>📞 +255 123 456 789</div>
                  <div>✉️ info@kilimanjarogates.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;