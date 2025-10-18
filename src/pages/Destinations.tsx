import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Clock, Star, Camera, Mountain, TreePine, Users, Compass, Filter, Search } from 'lucide-react';

const Destinations: React.FC = () => {
  const { category } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  const categories = [
    { id: 'all', name: 'All Destinations', icon: Compass },
    { id: 'mountain', name: 'Mountains', icon: Mountain },
    { id: 'park', name: 'National Parks', icon: TreePine },
    { id: 'cultural', name: 'Cultural Sites', icon: Users },
    { id: 'coastal', name: 'Coastal Areas', icon: Camera },
    { id: 'adventure', name: 'Adventure Spots', icon: Star },
  ];

  // Mock destinations data - in real app, this would come from your database
  const destinations = [
    {
      id: '1',
      name: 'Mount Kilimanjaro',
      slug: 'mount-kilimanjaro',
      category: 'mountain',
      short_description: 'Africa\'s highest peak and the world\'s tallest free-standing mountain',
      featured_image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: { region: 'Kilimanjaro', district: 'Moshi' },
      difficulty_level: 'challenging',
      duration_recommended: '5-9 days',
      highlights: ['Uhuru Peak (5,895m)', 'Glaciers', 'Multiple Climate Zones', 'Sunrise Views'],
      activities: ['Mountain Climbing', 'Photography', 'Wildlife Viewing'],
      featured: true
    },
    {
      id: '2',
      name: 'Serengeti National Park',
      slug: 'serengeti-national-park',
      category: 'park',
      short_description: 'Home to the Great Migration and endless plains teeming with wildlife',
      featured_image: 'https://images.pexels.com/photos/631292/pexels-photo-631292.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: { region: 'Mara', district: 'Serengeti' },
      difficulty_level: 'easy',
      duration_recommended: '3-7 days',
      highlights: ['Great Migration', 'Big Five', 'Endless Plains', 'Hot Air Balloons'],
      activities: ['Game Drives', 'Photography', 'Balloon Safaris'],
      featured: true
    },
    {
      id: '3',
      name: 'Ngorongoro Crater',
      slug: 'ngorongoro-crater',
      category: 'park',
      short_description: 'The world\'s largest inactive volcanic caldera, a natural wildlife sanctuary',
      featured_image: 'https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: { region: 'Arusha', district: 'Ngorongoro' },
      difficulty_level: 'easy',
      duration_recommended: '1-2 days',
      highlights: ['Crater Floor', 'Black Rhinos', 'Flamingo Lakes', 'Maasai Culture'],
      activities: ['Game Drives', 'Cultural Tours', 'Photography'],
      featured: true
    },
    {
      id: '4',
      name: 'Stone Town, Zanzibar',
      slug: 'stone-town-zanzibar',
      category: 'cultural',
      short_description: 'UNESCO World Heritage site with rich Swahili culture and architecture',
      featured_image: 'https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: { region: 'Zanzibar', district: 'Stone Town' },
      difficulty_level: 'easy',
      duration_recommended: '2-3 days',
      highlights: ['Historic Architecture', 'Spice Markets', 'Sunset Dhow Cruises', 'Cultural Museums'],
      activities: ['Walking Tours', 'Spice Tours', 'Cultural Experiences'],
      featured: true
    },
    {
      id: '5',
      name: 'Tarangire National Park',
      slug: 'tarangire-national-park',
      category: 'park',
      short_description: 'Famous for its large elephant herds and iconic baobab trees',
      featured_image: 'https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: { region: 'Manyara', district: 'Tarangire' },
      difficulty_level: 'easy',
      duration_recommended: '1-3 days',
      highlights: ['Elephant Herds', 'Baobab Trees', 'Tarangire River', 'Bird Watching'],
      activities: ['Game Drives', 'Walking Safaris', 'Photography'],
      featured: false
    },
    {
      id: '6',
      name: 'Mount Meru',
      slug: 'mount-meru',
      category: 'mountain',
      short_description: 'Tanzania\'s second highest peak, perfect for Kilimanjaro acclimatization',
      featured_image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: { region: 'Arusha', district: 'Arusha' },
      difficulty_level: 'moderate',
      duration_recommended: '3-4 days',
      highlights: ['Socialist Peak (4,566m)', 'Ash Cone', 'Wildlife', 'Kilimanjaro Views'],
      activities: ['Mountain Climbing', 'Wildlife Viewing', 'Photography'],
      featured: false
    },
    {
      id: '7',
      name: 'Maasai Villages',
      slug: 'maasai-villages',
      category: 'cultural',
      short_description: 'Experience authentic Maasai culture and traditional way of life',
      featured_image: 'https://images.pexels.com/photos/1821644/pexels-photo-1821644.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: { region: 'Arusha', district: 'Various' },
      difficulty_level: 'easy',
      duration_recommended: '1-2 days',
      highlights: ['Traditional Bomas', 'Cultural Ceremonies', 'Handicrafts', 'Storytelling'],
      activities: ['Cultural Tours', 'Traditional Dancing', 'Craft Making'],
      featured: false
    },
    {
      id: '8',
      name: 'Pemba Island',
      slug: 'pemba-island',
      category: 'coastal',
      short_description: 'The green island with pristine beaches and world-class diving',
      featured_image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: { region: 'Zanzibar', district: 'Pemba' },
      difficulty_level: 'easy',
      duration_recommended: '3-5 days',
      highlights: ['Coral Reefs', 'Pristine Beaches', 'Spice Plantations', 'Traditional Dhows'],
      activities: ['Diving', 'Snorkeling', 'Beach Relaxation', 'Spice Tours'],
      featured: false
    }
  ];

  const filteredDestinations = destinations.filter(destination => {
    const matchesCategory = selectedCategory === 'all' || destination.category === selectedCategory;
    const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.short_description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !selectedDifficulty || destination.difficulty_level === selectedDifficulty;
    
    return matchesCategory && matchesSearch && matchesDifficulty;
  });

  const featuredDestinations = destinations.filter(dest => dest.featured);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-orange-100 text-orange-800';
      case 'extreme': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.id === category);
    return categoryData ? categoryData.icon : Compass;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tanzania Destinations
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Discover the incredible diversity of Tanzania's landscapes, from snow-capped mountains to pristine beaches, 
            vast savannas to rich cultural heritage sites.
          </p>
        </div>

        {/* Featured Destinations */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Destinations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our most popular and iconic destinations that showcase the best of Tanzania
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredDestinations.map((destination) => {
              const IconComponent = getCategoryIcon(destination.category);
              return (
                <Link
                  key={destination.id}
                  to={`/destinations/${destination.slug}`}
                  className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="relative">
                    <img
                      src={destination.featured_image}
                      alt={destination.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-white bg-opacity-90 rounded-full p-2">
                        <IconComponent className="h-5 w-5 text-orange-600" />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(destination.difficulty_level)}`}>
                        {destination.difficulty_level}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {destination.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {destination.short_description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{destination.location.region}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{destination.duration_recommended}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
              <option value="extreme">Extreme</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedDifficulty('');
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
            Showing {filteredDestinations.length} destinations
          </p>
        </div>

        {/* Destinations Grid */}
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination) => {
              const IconComponent = getCategoryIcon(destination.category);
              return (
                <Link
                  key={destination.id}
                  to={`/destinations/${destination.slug}`}
                  className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={destination.featured_image}
                      alt={destination.name}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-white bg-opacity-90 rounded-full p-2">
                        <IconComponent className="h-5 w-5 text-orange-600" />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(destination.difficulty_level)}`}>
                        {destination.difficulty_level}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {destination.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {destination.short_description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{destination.location.region}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{destination.duration_recommended}</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {destination.highlights.slice(0, 3).map((highlight, index) => (
                          <span
                            key={index}
                            className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs"
                          >
                            {highlight}
                          </span>
                        ))}
                        {destination.highlights.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{destination.highlights.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-orange-600 font-semibold group-hover:text-orange-700">
                        Explore Destination
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
            <div className="text-gray-500 text-lg">No destinations found matching your criteria.</div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedDifficulty('');
              }}
              className="mt-4 text-orange-600 hover:text-orange-700"
            >
              Clear filters to see all destinations
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-orange-600 to-orange-800 rounded-2xl text-white p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Explore Tanzania?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let our expert guides show you the hidden gems and iconic landmarks that make Tanzania truly special.
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
              Plan Custom Trip
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Destinations;