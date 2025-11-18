import React from 'react';
import { CheckCircle, Award, Shield, Users } from 'lucide-react';

interface TrustBadge {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const TrustBadges: React.FC = () => {
  const badges: TrustBadge[] = [
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: 'Verified Tours',
      description: 'All tours are verified and tested'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Award Winning',
      description: 'Recognized for excellence in service'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure Booking',
      description: 'Encrypted and protected transactions'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Expert Guides',
      description: 'Professional guides with years of experience'
    }
  ];

  return (
    <div className="py-12 bg-white border-t border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="text-blue-600 mb-3">
                {badge.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {badge.title}
              </h3>
              <p className="text-sm text-gray-600">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;
