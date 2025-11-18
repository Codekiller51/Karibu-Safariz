import React, { useState, useEffect } from 'react';
import SpecialTripCard from './SpecialTripCard';
import AnimatedSection from '../common/AnimatedSection';
import { TourPackage } from '../../types';
import { db } from '../../lib/supabase';

const SpecialTrips: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data, error } = await db.getTourPackages();
        if (error) throw error;

        const formattedTrips = (data || []).slice(0, 6).map((tour: TourPackage, index: number) => ({
          id: tour.id,
          title: tour.title,
          subtitle: tour.category === 'mountain-climbing' ? 'Peak Adventure' :
                   tour.category === 'safari' ? 'Wildlife Safari' :
                   'Unique Experience',
          image: tour.images?.[0] || 'https://images.pexels.com/photos/1470332/pexels-photo-1470332.jpeg',
          size: index === 0 ? 'large' : index < 2 ? 'medium' : 'small'
        }));

        setTrips(formattedTrips);
      } catch (error) {
        console.error('Error fetching special trips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading || trips.length === 0) return null;

  return (
    <div className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="slide-up" className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Seasonal Trips
          </h2>
          <p className="text-lg text-gray-600">
            Experience unforgettable seasonal adventures
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trips.map((trip, index) => (
            <AnimatedSection
              key={trip.id}
              animation="slide-up"
              delay={index * 100}
            >
              <SpecialTripCard {...trip} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialTrips;
