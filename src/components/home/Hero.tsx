import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Play, ChevronLeft, ChevronRight, Search, Calendar, MapPin } from 'lucide-react';
import { db } from '../../lib/supabase';
import { TourPackage } from '../../types';

interface HeroSlide {
  id: number;
  category: string;
  title: string;
  description: string;
  image: string;
  price: string;
  tourTitle: string;
  cta: {
    primary: { text: string; link: string };
    secondary: { text: string; action: string };
  };
}

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [searchForm, setSearchForm] = React.useState({
    keyword: '',
    destination: '',
    departureDate: ''
  });
  const [destinations, setDestinations] = React.useState<{ value: string; label: string }[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data, error } = await db.getTourPackages();
        if (error) throw error;
        
        // Extract unique destinations/categories
        const uniqueDestinations = Array.from(new Set(data?.map(tour => tour.category) || []))
          .map(category => ({
            value: category,
            label: category === 'mountain-climbing' ? 'Mount Kilimanjaro' :
                   category === 'safari' ? 'Safari Parks' :
                   category === 'day-trips' ? 'Day Trips' : category
          }));
        
        setDestinations(uniqueDestinations);
      } catch (error) {
        console.error('Error fetching destinations:', error);
        // Fallback destinations
        setDestinations([
          { value: 'mountain-climbing', label: 'Mount Kilimanjaro' },
          { value: 'safari', label: 'Safari Parks' },
          { value: 'day-trips', label: 'Day Trips' }
        ]);
      }
    };

    fetchDestinations();
  }, []);

  const slides: HeroSlide[] = [
    {
      id: 1,
      category: "Zanzibar",
      title: "Visit Zanzibar",
      description: "Zanzibar is one of the most vibrant and diverse part of Tanzania, offering a captivating mix of scenic beauty, beaches, historic castles, and a growing culinary scene.",
      image: "https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      price: "$2500",
      tourTitle: "Zanzibar Island Escape: 5-Days",
      cta: {
        primary: { text: "Book your trip", link: "/tours/zanzibar" },
        secondary: { text: "Discover Zanzibar", action: "discover" }
      }
    },
    {
      id: 2,
      category: "Kilimanjaro",
      title: "Conquer the Roof of Africa",
      description: "Experience the ultimate adventure with Tanzania's premier tour operator. From Kilimanjaro's summit to breathtaking views, we make dreams come true.",
      image: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      price: "$2800",
      tourTitle: "Kilimanjaro Machame Route: 7-Days",
      cta: {
        primary: { text: "Book your trip", link: "/tours/mountain-climbing" },
        secondary: { text: "Discover Kilimanjaro", action: "discover" }
      }
    },
    {
      id: 3,
      category: "Safari",
      title: "Witness the Great Migration",
      description: "Join millions of wildebeest and zebras on their epic journey across the Serengeti. Experience nature's greatest spectacle with expert guides.",
      image: "https://images.pexels.com/photos/631292/pexels-photo-631292.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      price: "$1800",
      tourTitle: "Serengeti Safari Adventure: 5-Days",
      cta: {
        primary: { text: "Book your trip", link: "/tours/safari" },
        secondary: { text: "Discover Serengeti", action: "discover" }
      }
    },
    {
      id: 4,
      category: "Culture",
      title: "Discover Hidden Gems",
      description: "Explore Tanzania's best-kept secrets with our day trips and cultural experiences. From coffee plantations to local villages and traditions.",
      image: "https://images.pexels.com/photos/1821644/pexels-photo-1821644.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      price: "$450",
      tourTitle: "Cultural Village Experience: 2-Days",
      cta: {
        primary: { text: "Book your trip", link: "/tours/day-trips" },
        secondary: { text: "Discover Culture", action: "discover" }
      }
    },
    {
      id: 5,
      category: "Wildlife",
      title: "Experience Wildlife Wonders",
      description: "Get up close with Africa's Big Five in their natural habitat. Professional guides ensure unforgettable wildlife encounters in pristine parks.",
      image: "https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      price: "$2200",
      tourTitle: "Big Five Safari Experience: 6-Days",
      cta: {
        primary: { text: "Book your trip", link: "/tours/safari" },
        secondary: { text: "Discover Wildlife", action: "discover" }
      }
    }
  ];

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      // Build search parameters
      const searchParams = new URLSearchParams();
      
      if (searchForm.keyword) {
        searchParams.set('search', searchForm.keyword);
      }
      
      if (searchForm.destination) {
        searchParams.set('category', searchForm.destination);
      }
      
      if (searchForm.departureDate) {
        searchParams.set('date', searchForm.departureDate);
      }

      // Navigate to tours page with search parameters
      const searchQuery = searchParams.toString();
      if (searchForm.destination) {
        navigate(`/tours/${searchForm.destination}${searchQuery ? `?${searchQuery}` : ''}`);
      } else {
        navigate(`/tours${searchQuery ? `?${searchQuery}` : ''}`);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className={`relative min-h-screen flex flex-col overflow-hidden transition-all duration-300 pt-16 ${
      isScrolled ? 'mt-16' : 'mt-26'
    }`}>
      {/* Background Images with Slide Effect */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out ${
                index === currentSlide 
                  ? 'transform translate-x-0' 
                  : index < currentSlide 
                    ? 'transform -translate-x-full' 
                    : 'transform translate-x-full'
              }`}
            >
              <img 
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={isTransitioning}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 disabled:opacity-50"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 disabled:opacity-50"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
            <div className="mt-8 md:mt-12">
              <div className="mb-4">
                <span className="inline-block bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide">
                  {currentSlideData.category}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                {currentSlideData.title}
              </h1>
              
              <p className="text-lg md:text-xl mb-8 leading-relaxed opacity-90 max-w-2xl">
                {currentSlideData.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={currentSlideData.cta.primary.link}
                  className="bg-orange-600 text-white px-8 py-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2 text-lg font-semibold"
                >
                  <span>{currentSlideData.cta.primary.text}</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-gray-900 transition-colors flex items-center justify-center space-x-2 text-lg font-semibold">
                  <span>{currentSlideData.cta.secondary.text}</span>
                </button>
              </div>
            </div>
            </div>

            {/* Right Content - Tour Card */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-sm w-full transform hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  <img 
                    src={currentSlideData.image}
                    alt={currentSlideData.tourTitle}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {currentSlideData.price}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {currentSlideData.tourTitle}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Adventure, Budget Travels, Family Holidays, Wildlife
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>5 Days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="relative z-10 pb-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mt-8">
            <div className="flex items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-orange-600 mr-4">Find Your Tour</h2>
              <div className="text-sm text-gray-500">
                Search from {destinations.length} destinations
              </div>
            </div>
            
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Keyword Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Keyword"
                  value={searchForm.keyword}
                  onChange={(e) => handleInputChange('keyword', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Destination Select */}
              <div className="relative">
                <select 
                  value={searchForm.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none appearance-none bg-white"
                >
                  <option value="">Select your Destination</option>
                  {destinations.map((dest) => (
                    <option key={dest.value} value={dest.value}>
                      {dest.label}
                    </option>
                  ))}
                </select>
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Departure Date */}
              <div className="relative">
                <input
                  type="date"
                  value={searchForm.departureDate}
                  onChange={(e) => handleInputChange('departureDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Search Button */}
              <button 
                type="submit"
                disabled={isSearching}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="h-5 w-5" />
                <span>{isSearching ? 'Searching...' : 'Search Tours'}</span>
              </button>
            </form>
            
            {/* Quick Search Suggestions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-3">Popular searches:</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSearchForm({ keyword: 'Kilimanjaro', destination: 'mountain-climbing', departureDate: '' });
                  }}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-orange-100 hover:text-orange-700 transition-colors"
                >
                  Kilimanjaro Climbing
                </button>
                <button
                  onClick={() => {
                    setSearchForm({ keyword: 'Safari', destination: 'safari', departureDate: '' });
                  }}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-orange-100 hover:text-orange-700 transition-colors"
                >
                  Serengeti Safari
                </button>
                <button
                  onClick={() => {
                    setSearchForm({ keyword: 'Day trip', destination: 'day-trips', departureDate: '' });
                  }}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-orange-100 hover:text-orange-700 transition-colors"
                >
                  Day Trips
                </button>
                <button
                  onClick={() => {
                    setSearchForm({ keyword: 'Ngorongoro', destination: '', departureDate: '' });
                  }}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-orange-100 hover:text-orange-700 transition-colors"
                >
                  Ngorongoro Crater
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentSlide(index);
                setTimeout(() => setIsTransitioning(false), 500);
              }
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-orange-600 scale-125' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;