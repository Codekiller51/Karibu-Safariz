import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Quote, ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';
import { db } from '../../lib/supabase';
import { Review } from '../../types';

interface ReviewWithDetails extends Review {
  profiles?: {
    full_name: string;
    avatar_url?: string;
    nationality?: string;
  };
  tour_packages?: {
    title: string;
    category: string;
  };
}

const Testimonials: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);
  const [featuredReviews, setFeaturedReviews] = useState<ReviewWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    recommendationRate: 0
  });

  const categories = ['all', 'mountain-climbing', 'safari', 'day-trips'];
  const categoryLabels = {
    'all': 'All Tours',
    'mountain-climbing': 'Kilimanjaro',
    'safari': 'Safari',
    'day-trips': 'Day Trips'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all reviews
        const { data: allReviews, error: reviewsError } = await db.getAllReviews(undefined, undefined, true);
        if (reviewsError) throw reviewsError;
        setReviews(allReviews || []);

        // Fetch featured reviews
        const { data: featured, error: featuredError } = await db.getFeaturedReviews(3);
        if (featuredError) throw featuredError;
        setFeaturedReviews(featured || []);

        // Fetch stats
        const { averageRating, totalReviews, recommendationRate, error: statsError } = await db.getReviewStats();
        if (statsError) throw statsError;
        setStats({ averageRating, totalReviews, recommendationRate });

      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTestimonials = reviews.filter(review => {
    const matchesCategory = selectedCategory === 'all' || review.tour_packages?.category === selectedCategory;
    const matchesSearch = review.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.tour_packages?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % featuredReviews.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + featuredReviews.length) % featuredReviews.length);
  };

  useEffect(() => {
    if (featuredReviews.length === 0) return;
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, [featuredReviews.length]);

  const displayStats = [
    { number: `${stats.averageRating}/5`, label: 'Average Rating' },
    { number: `${stats.totalReviews}+`, label: 'Reviews' },
    { number: `${stats.recommendationRate}%`, label: 'Would Recommend' },
    { number: '100%', label: 'Verified Reviews' }
  ];

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
            <div className="text-orange-600 font-semibold text-lg">Loading testimonials...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          to="/about"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-600 mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to About</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">What Our Travelers Say</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Real stories from real adventurers who have experienced the magic of Tanzania with Karibu Safariz. Every review is verified and comes from actual guests.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {displayStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Featured Testimonial Carousel */}
        {featuredReviews.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Stories</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Highlighted experiences that showcase the transformative power of adventure
              </p>
            </div>

            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-96 md:h-80">
                {featuredReviews.map((review, index) => (
                  <div
                    key={review.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentTestimonial ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="h-full flex items-center">
                      <div className="w-full px-8 md:px-16 py-8">
                        <Quote className="h-12 w-12 text-orange-200 mb-6" />
                        <div className="flex items-center space-x-1 mb-4">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{review.title}</h3>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6 line-clamp-4">
                          "{review.content}"
                        </p>
                        <div className="flex items-center space-x-4">
                          <img
                            src={review.profiles?.avatar_url || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'}
                            alt={review.profiles?.full_name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-semibold text-gray-900">{review.profiles?.full_name}</div>
                            <div className="text-sm text-gray-500">{review.profiles?.nationality || 'Traveler'}</div>
                            <div className="text-sm text-orange-600">{review.tour_packages?.title}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <button
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg"
              >
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {featuredReviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-orange-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filter and Search */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedCategory === category
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
                  }`}
                >
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* All Testimonials Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All Reviews</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse through all our verified guest reviews and experiences
            </p>
          </div>

          {filteredTestimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTestimonials.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      Verified
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-2">{review.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-4">"{review.content}"</p>
                  
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={review.profiles?.avatar_url || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'}
                      alt={review.profiles?.full_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{review.profiles?.full_name}</div>
                      <div className="text-xs text-gray-500">{review.profiles?.nationality || 'Traveler'}</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-orange-600 font-medium">{review.tour_packages?.title}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                {reviews.length === 0 ? 'No reviews available yet.' : 'No reviews found matching your criteria.'}
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="mt-4 text-orange-600 hover:text-orange-700"
              >
                {reviews.length === 0 ? 'Be the first to leave a review!' : 'Clear filters to see all reviews'}
              </button>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-2xl text-white p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Your Own Story?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied travelers and create memories that will last a lifetime. Your Tanzania adventure awaits!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/tours"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Book Your Adventure
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-orange-600 transition-colors font-semibold"
            >
              Ask Questions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;