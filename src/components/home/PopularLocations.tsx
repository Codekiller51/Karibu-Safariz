import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DestinationCard from './DestinationCard';
import AnimatedSection from '../common/AnimatedSection';
import { db } from '../../lib/supabase';

const PopularLocations: React.FC = () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data, error } = await db.getDestinations();
        if (error) throw error;
        setDestinations((data || []).slice(0, 4));
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setDestinations([
          {
            id: '1',
            name: 'Singapore',
            slug: 'singapore',
            category: 'City',
            featured_image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
          },
          {
            id: '2',
            name: 'Australia',
            slug: 'australia',
            category: 'Beach',
            featured_image: 'https://images.pexels.com/photos/3573351/pexels-photo-3573351.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
          },
          {
            id: '3',
            name: 'Thailand',
            slug: 'thailand',
            category: 'Culture',
            featured_image: 'https://images.pexels.com/photos/2356059/pexels-photo-2356059.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
          },
          {
            id: '4',
            name: 'Japan',
            slug: 'japan',
            category: 'Adventure',
            featured_image: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="slide-up" className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore All Popular Locations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most sought-after destinations and plan your next adventure
          </p>
        </AnimatedSection>

        {!loading && destinations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {destinations.map((dest, index) => (
              <AnimatedSection
                key={dest.id}
                animation="slide-up"
                delay={index * 100}
              >
                <DestinationCard
                  id={dest.slug}
                  name={dest.name}
                  image={dest.featured_image}
                  category={dest.category || 'Destination'}
                  featured={index < 2}
                />
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularLocations;
