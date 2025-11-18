import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users } from 'lucide-react';

interface DealCardProps {
  id: string;
  title: string;
  image: string;
  location: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  startDate?: string;
  duration?: number;
  maxParticipants?: number;
}

const DealCard: React.FC<DealCardProps> = ({
  id,
  title,
  image,
  location,
  originalPrice,
  discountedPrice,
  discount,
  startDate,
  duration,
  maxParticipants
}) => {
  return (
    <Link
      to={`/tours/${id}`}
      className="card-base card-hover group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Save {discount}%
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{location}</span>
        </div>
        <div className="flex gap-2 text-xs text-gray-500 mb-3">
          {duration && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{duration} days</span>
            </div>
          )}
          {maxParticipants && (
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>Max {maxParticipants}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">${discountedPrice}</span>
          <span className="text-sm text-gray-500 line-through">${originalPrice}</span>
        </div>
      </div>
    </Link>
  );
};

export default DealCard;
