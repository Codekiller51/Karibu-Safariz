import React from 'react';
import { Link } from 'react-router-dom';

interface SpecialTripCardProps {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  theme?: 'dark' | 'light';
  size?: 'small' | 'medium' | 'large';
  featured?: boolean;
}

const SpecialTripCard: React.FC<SpecialTripCardProps> = ({
  id,
  title,
  subtitle,
  image,
  theme = 'dark',
  size = 'medium',
  featured = false
}) => {
  const sizeClasses = {
    small: 'h-48 md:h-56',
    medium: 'h-56 md:h-64',
    large: 'h-64 md:h-80'
  };

  return (
    <Link
      to={`/tours/${id}`}
      className={`relative overflow-hidden rounded-lg group cursor-pointer ${sizeClasses[size]}`}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className={`absolute inset-0 ${
        theme === 'dark'
          ? 'bg-gradient-to-t from-black/80 via-black/40 to-transparent'
          : 'bg-gradient-to-t from-white/60 via-white/30 to-transparent'
      } opacity-80 group-hover:opacity-90 transition-opacity`} />

      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
        {subtitle && (
          <p className={`text-sm font-semibold mb-2 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}>
            {subtitle}
          </p>
        )}
        <h3 className={`text-xl md:text-2xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default SpecialTripCard;
