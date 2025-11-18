import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, MapPin } from 'lucide-react';
import LazyImage from './LazyImage';
import { TourPackage } from '../../types';
import { db } from '../../lib/supabase';

interface TourCardProps {
  tour: TourPackage;
  featured?: boolean;
}

const TourCard: React.FC<TourCardProps> = ({ tour, featured = false }) => {
  const [averageRating, setAverageRating] = React.useState(0);
  const [totalReviews, setTotalReviews] = React.useState(0);

  React.useEffect(() => {
    const fetchRating = async () => {
      try {
        const { averageRating: rating, totalReviews: count, error } = await db.getTourAverageRating(tour.id);
        if (error) throw error;
        setAverageRating(rating);
        setTotalReviews(count);
      } catch (error) {
        console.error('Error fetching tour rating:', error);
      }
    };

    fetchRating();
  }, [tour.id]);

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    challenging: 'bg-blue-100 text-blue-800',
    extreme: 'bg-red-100 text-red-800',
  };

  const categoryLabels = {
    'mountain-climbing': 'Mountain Climbing',
    'safari': 'Safari Tours',
    'day-trips': 'Day Trips',
  };

  return (
    <div className={`card-base card-hover h-full flex flex-col ${
      featured ? 'md:col-span-2' : ''
    }`}>
      <div className="relative overflow-hidden">
        <LazyImage
          src={tour.images[0]}
          alt={tour.title}
          className={`w-full object-cover transition-transform duration-500 hover:scale-110 ${featured ? 'h-64' : 'h-48'}`}
          parallaxSpeed={0.1}
        />
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md backdrop-blur-sm">
            {categoryLabels[tour.category]}
          </span>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-md backdrop-blur-sm ${difficultyColors[tour.difficulty]}`}>
            {tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-300">{tour.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{tour.short_description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{tour.duration} days</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>Max {tour.max_participants}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span>{averageRating > 0 ? averageRating.toFixed(1) : 'New'}</span>
            {totalReviews > 0 && <span className="text-xs">({totalReviews})</span>}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-2xl font-bold text-blue-600">${tour.price_usd}</span>
            <span className="text-gray-500 ml-1">per person</span>
          </div>
          <Link
            to={`/tours/${tour.category}/${tour.id}`}
            className="btn-base btn-primary px-6 py-2"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;