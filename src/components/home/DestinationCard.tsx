import React from 'react';
import { Link } from 'react-router-dom';

interface DestinationCardProps {
  id: string;
  name: string;
  image: string;
  featured?: boolean;
  category?: string;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  id,
  name,
  image,
  featured = false,
  category
}) => {
  return (
    <Link
      to={`/destinations/${id}`}
      className={`relative overflow-hidden rounded-xl group cursor-pointer ${
        featured ? 'md:col-span-2 md:row-span-2' : ''
      } h-64 md:h-72`}
    >
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 opacity-70 group-hover:opacity-80 transition-opacity" />
      <div className="absolute inset-0 flex items-end p-4 md:p-6">
        <div>
          <p className="text-yellow-400 text-sm font-semibold mb-2">{category}</p>
          <h3 className="text-white text-2xl md:text-3xl font-bold">{name}</h3>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;
