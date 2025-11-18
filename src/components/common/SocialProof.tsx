import React, { useState, useEffect } from 'react';
import { Star, Users } from 'lucide-react';

interface ReviewProof {
  author: string;
  rating: number;
  text: string;
  source: string;
}

const SocialProof: React.FC = () => {
  const [reviews] = useState<ReviewProof[]>([
    {
      author: 'Sarah M.',
      rating: 5,
      text: 'Best safari experience ever! The guides were incredibly knowledgeable.',
      source: 'Verified Traveler'
    },
    {
      author: 'John D.',
      rating: 5,
      text: 'Mount Kilimanjaro climb was unforgettable. Highly recommended!',
      source: 'Verified Traveler'
    },
    {
      author: 'Emma W.',
      rating: 5,
      text: 'Professional service from start to finish. Worth every penny!',
      source: 'Verified Traveler'
    }
  ]);

  const stats = [
    { number: '2,500+', label: 'Happy Customers' },
    { number: '4.9★', label: 'Average Rating' },
    { number: '50+', label: 'Tours Available' },
    { number: '20+', label: 'Years Experience' }
  ];

  return (
    <div className="py-8 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                {stat.number}
              </div>
              <div className="text-xs md:text-sm text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Trusted by travelers worldwide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{review.source}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  "{review.text}"
                </p>
                <p className="text-xs font-medium text-gray-900">
                  {review.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProof;
