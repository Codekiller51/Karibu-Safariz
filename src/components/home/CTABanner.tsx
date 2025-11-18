import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CTABannerProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  ctaText?: string;
  ctaLink?: string;
}

const CTABanner: React.FC<CTABannerProps> = ({
  title,
  subtitle,
  backgroundImage,
  ctaText = 'Explore Now',
  ctaLink = '/tours'
}) => {
  return (
    <div className="relative h-64 md:h-80 rounded-lg overflow-hidden group">
      <img
        src={backgroundImage}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

      <div className="absolute inset-0 flex flex-col justify-center items-start p-6 md:p-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4 max-w-2xl">
          {title}
        </h2>
        {subtitle && (
          <p className="text-white/90 text-lg mb-6 max-w-xl">{subtitle}</p>
        )}
        <Link
          to={ctaLink}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold transition-colors duration-300"
        >
          {ctaText}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default CTABanner;
