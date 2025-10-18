import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, Clock, Users, Star } from 'lucide-react';
import TourCard from '../components/common/TourCard';
import { TourPackage } from '../types';
import { db } from '../lib/supabase';

const Tours: React.FC = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [filteredTours, setFilteredTours] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [priceRange, setPriceRange] = useState('');

  // Initialize search from URL parameters
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlDate = searchParams.get('date');
    
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
    
    // You can add date filtering logic here if needed
    // For now, we'll just log it
    if (urlDate) {
      console.log('Search date:', urlDate);
    }
  }, [searchParams]);

  const categories = {
    'mountain-climbing': 'Mountain Climbing',
    'safari': 'Safari Tours',
    'day-trips': 'Day Trips',
  };

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const { data, error } = await db.getTourPackages(category);
        
        if (error) {
          console.error('Error fetching tours:', error);
          setTours([]);
        } else {
          setTours(data);
          setFilteredTours(data);
        }
      } catch (error) {
        console.error('Error fetching tours:', error);
        setTours([]);
        setFilteredTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [category]);

  useEffect(() => {
    let filtered = tours;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(tour =>
        tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Difficulty filter
    if (selectedDifficulty) {
      filtered = filtered.filter(tour => tour.difficulty === selectedDifficulty);
    }

    // Duration filter
    if (selectedDuration) {
      const [min, max] = selectedDuration.split('-').map(Number);
      filtered = filtered.filter(tour => {
        if (max) {
          return tour.duration >= min && tour.duration <= max;
        }
        return tour.duration >= min;
      });
    }

    // Price filter
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(tour => {
        if (max) {
          return tour.price_usd >= min && tour.price_usd <= max;
        }
        return tour.price_usd >= min;
      });
    }

    setFilteredTours(filtered);
  }, [tours, searchTerm, selectedDifficulty, selectedDuration, priceRange]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDifficulty('');
    setSelectedDuration('');
    setPriceRange('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center flex flex-col items-center">
            {/* Spinning Lines Loader */}
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 animate-spin">
                <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-gradient-to-b from-blue-500 to-transparent transform -translate-x-1/2 rounded-full"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-8 bg-gradient-to-t from-green-500 to-transparent transform -translate-x-1/2 rounded-full"></div>
                <div className="absolute left-0 top-1/2 h-0.5 w-8 bg-gradient-to-r from-red-500 to-transparent transform -translate-y-1/2 rounded-full"></div>
                <div className="absolute right-0 top-1/2 h-0.5 w-8 bg-gradient-to-l from-purple-500 to-transparent transform -translate-y-1/2 rounded-full"></div>
              </div>
              <div className="absolute inset-1 animate-spin-reverse">
                <div className="absolute top-0 left-1/2 w-0.5 h-6 bg-gradient-to-b from-yellow-500 to-transparent transform -translate-x-1/2 rounded-full"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-6 bg-gradient-to-t from-pink-500 to-transparent transform -translate-x-1/2 rounded-full"></div>
                <div className="absolute left-0 top-1/2 h-0.5 w-6 bg-gradient-to-r from-cyan-500 to-transparent transform -translate-y-1/2 rounded-full"></div>
                <div className="absolute right-0 top-1/2 h-0.5 w-6 bg-gradient-to-l from-indigo-500 to-transparent transform -translate-y-1/2 rounded-full"></div>
              </div>
              <div className="absolute inset-2 animate-spin-fast">
                <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-gradient-to-b from-orange-500 to-transparent transform -translate-x-1/2 rounded-full"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-4 bg-gradient-to-t from-teal-500 to-transparent transform -translate-x-1/2 rounded-full"></div>
                <div className="absolute left-0 top-1/2 h-0.5 w-4 bg-gradient-to-r from-lime-500 to-transparent transform -translate-y-1/2 rounded-full"></div>
                <div className="absolute right-0 top-1/2 h-0.5 w-4 bg-gradient-to-l from-rose-500 to-transparent transform -translate-y-1/2 rounded-full"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="text-orange-600 font-semibold text-lg">Loading tours...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {category ? categories[category as keyof typeof categories] : 'All Tours'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover Tanzania's most incredible adventures with our expertly crafted tour packages
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Difficulty */}
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

            {/* Duration */}
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">All Durations</option>
              <option value="1-1">1 Day</option>
              <option value="2-3">2-3 Days</option>
              <option value="4-7">4-7 Days</option>
              <option value="8">8+ Days</option>
            </select>

            {/* Price Range */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">All Prices</option>
              <option value="0-500">Under $500</option>
              <option value="500-1000">$500 - $1,000</option>
              <option value="1000-2000">$1,000 - $2,000</option>
              <option value="2000">$2,000+</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Category Navigation */}
        {!category && (
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link
              to="/tours"
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              All Tours
            </Link>
            <Link
              to="/tours/mountain-climbing"
              className="bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Mountain Climbing
            </Link>
            <Link
              to="/tours/safari"
              className="bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Safari Tours
            </Link>
            <Link
              to="/tours/day-trips"
              className="bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Day Trips
            </Link>
          </div>
        )}

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredTours.length} of {tours.length} tours
          </p>
        </div>

        {/* Tours Grid */}
        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No tours found matching your criteria.</div>
            <button
              onClick={clearFilters}
              className="mt-4 text-orange-600 hover:text-orange-700"
            >
              Clear filters to see all tours
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tours;