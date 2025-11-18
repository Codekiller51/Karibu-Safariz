import React, { useState, useEffect } from 'react';
import DealCard from './DealCard';
import AnimatedSection from '../common/AnimatedSection';
import { TourPackage } from '../../types';
import { db } from '../../lib/supabase';

const LastMinuteDeals: React.FC = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const { data, error } = await db.getTourPackages();
        if (error) throw error;

        const formattedDeals = (data || []).slice(0, 3).map((tour: TourPackage) => ({
          id: tour.id,
          title: tour.title,
          image: tour.images?.[0] || 'https://images.pexels.com/photos/1470332/pexels-photo-1470332.jpeg?auto=compress&cs=tinysrgb&w=1920',
          location: tour.category === 'mountain-climbing' ? 'Mount Kilimanjaro' :
                   tour.category === 'safari' ? 'Serengeti' :
                   tour.category === 'day-trips' ? 'Local' : 'Tanzania',
          originalPrice: Math.round((tour.price_usd || 2000) * 1.3),
          discountedPrice: tour.price_usd,
          discount: 25,
          duration: tour.duration,
          maxParticipants: tour.max_participants
        }));

        setDeals(formattedDeals);
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  if (loading || deals.length === 0) return null;

  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="slide-up" className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Last minute deals in unique places
          </h2>
          <p className="text-lg text-gray-600">
            Find incredible discounts on amazing travel experiences
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {deals.map((deal, index) => (
            <AnimatedSection
              key={deal.id}
              animation="slide-up"
              delay={index * 100}
            >
              <DealCard {...deal} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LastMinuteDeals;
