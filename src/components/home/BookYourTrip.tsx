import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TourCard from '../common/TourCard';
import AnimatedSection from '../common/AnimatedSection';
import { TourPackage } from '../../types';
import { db } from '../../lib/supabase';

const BookYourTrip: React.FC = () => {
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const { data, error } = await db.getTourPackages();
        if (error) throw error;
        setTours((data || []).slice(0, 3));
      } catch (error) {
        console.error('Error fetching tours:', error);
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) return null;

  return (
    <div className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="slide-up" className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Book your Next Trip
          </h2>
          <p className="text-lg text-gray-600">
            Choose from our curated selection of unforgettable experiences
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {tours.map((tour, index) => (
            <AnimatedSection
              key={tour.id}
              animation="slide-up"
              delay={index * 100}
            >
              <TourCard tour={tour} />
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade" className="text-center">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            View All Trips
            <ArrowRight className="h-5 w-5" />
          </Link>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default BookYourTrip;
