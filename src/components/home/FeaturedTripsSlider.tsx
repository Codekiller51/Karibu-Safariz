import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { db } from '../../lib/supabase';
import { TourPackage } from '../../types';

interface Slide {
  id: number;
  type: 'tour' | 'welcome';
  title: string;
  description: string;
  image: string;
  tourLink?: string;
  tourId?: string;
  category?: string;
}

const FeaturedTripsSlider: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedTrips = async () => {
      try {
        const { data, error } = await db.getTourPackages();
        if (error) throw error;

        const tours = (data || []).slice(0, 4);

        const newSlides: Slide[] = [
          {
            id: 0,
            type: 'welcome',
            title: 'Welcome to Karibu Safariz',
            description: 'Experience the magic of Tanzania with expertly guided tours through breathtaking landscapes and unforgettable adventures.',
            image: 'https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
          },
          ...tours.map((tour: TourPackage, index: number) => ({
            id: index + 1,
            type: 'tour' as const,
            title: tour.title,
            description: tour.short_description || tour.description.substring(0, 150),
            image: tour.images?.[0] || 'https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg',
            tourLink: `/tours/${tour.category}/${tour.slug}`,
            tourId: tour.id,
            category: tour.category
          }))
        ];

        setSlides(newSlides.slice(0, 5));
      } catch (error) {
        console.error('Error fetching featured trips:', error);
        setSlides([
          {
            id: 0,
            type: 'welcome',
            title: 'Welcome to Karibu Safariz',
            description: 'Experience the magic of Tanzania with expertly guided tours through breathtaking landscapes and unforgettable adventures.',
            image: 'https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedTrips();
  }, []);

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

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [slides, isTransitioning]);

  if (isLoading || slides.length === 0) {
    return (
      <div className="relative min-h-screen pt-16 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative min-h-screen pt-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={isTransitioning}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 disabled:opacity-50"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 disabled:opacity-50"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Content */}
      <div className="relative z-10 h-screen flex items-center">
        <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="text-white">
              <div className="mb-6">
                <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide">
                  {currentSlideData.type === 'welcome' ? 'Featured' : 'Our Tours'}
                </span>
              </div>

              <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {currentSlideData.title}
              </h1>

              <p className="text-lg md:text-xl mb-8 leading-relaxed opacity-90 max-w-lg">
                {currentSlideData.description}
              </p>

              {currentSlideData.type === 'tour' ? (
                <Link
                  to={currentSlideData.tourLink || '/tours'}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                >
                  <span>Book Now</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <Link
                  to="/tours"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                >
                  <span>Explore Tours</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              )}
            </div>

            {/* Right Content - Image Card */}
            {currentSlideData.type === 'tour' && (
              <div className="flex justify-center lg:justify-end">
                <div className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-sm w-full">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={currentSlideData.image}
                      alt={currentSlideData.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {currentSlideData.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {currentSlideData.description}
                    </p>
                    <Link
                      to={currentSlideData.tourLink || '/tours'}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                    >
                      <span>View Details</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
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
                ? 'bg-blue-600 scale-125'
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedTripsSlider;
