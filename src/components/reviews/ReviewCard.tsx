import React, { useState } from 'react';
import { Star, ThumbsUp, Flag, Calendar, Verified, Camera } from 'lucide-react';
import { Review } from '../../types';

interface ReviewCardProps {
  review: Review & {
    profiles?: {
      full_name: string;
      avatar_url?: string;
      nationality?: string;
    };
    tour_packages?: {
      title: string;
      category: string;
    };
  };
  showTourInfo?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, showTourInfo = false }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [helpful, setHelpful] = useState(false);

  const getDefaultAvatar = (name: string) => {
    const initials = name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const colorIndex = name.length % colors.length;
    
    return { initials, colorClass: colors[colorIndex] };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handleHelpful = () => {
    setHelpful(!helpful);
    // In a real app, you would send this to the backend
  };

  const handleReport = () => {
    // In a real app, you would implement reporting functionality
    alert('Thank you for reporting. We will review this content.');
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {review.profiles?.avatar_url ? (
                <img
                  src={review.profiles.avatar_url}
                  alt={review.profiles.full_name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-gray-200 ${getDefaultAvatar(review.profiles?.full_name || 'Anonymous').colorClass}`}>
                  {getDefaultAvatar(review.profiles?.full_name || 'Anonymous').initials}
                </div>
              )}
            </div>

            {/* User Info */}
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900">
                  {review.profiles?.full_name || 'Anonymous'}
                </h4>
                {review.verified && (
                  <Verified className="h-4 w-4 text-blue-500" title="Verified Review" />
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                {review.profiles?.nationality && (
                  <span>{review.profiles.nationality}</span>
                )}
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(review.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleReport}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Report review"
            >
              <Flag className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tour Info (if showing) */}
        {showTourInfo && review.tour_packages && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Review for:</div>
            <div className="font-medium text-gray-900">{review.tour_packages.title}</div>
            <div className="text-xs text-gray-500 capitalize">{review.tour_packages.category.replace('-', ' ')}</div>
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < review.rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {review.rating} out of 5 stars
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-3">{review.title}</h3>

        {/* Content */}
        <div className="text-gray-700 mb-4">
          <p className="leading-relaxed">
            {showFullContent ? review.content : truncateContent(review.content)}
          </p>
          {review.content.length > 200 && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-orange-600 hover:text-orange-700 text-sm font-medium mt-2"
            >
              {showFullContent ? 'Show Less' : 'Read More'}
            </button>
          )}
        </div>

        {/* Images */}
        {review.images && review.images.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-3">
              <Camera className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {review.images.length} photo{review.images.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {review.images.slice(0, 6).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className="relative aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                >
                  <img
                    src={image}
                    alt={`Review photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 5 && review.images!.length > 6 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        +{review.images!.length - 6} more
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={handleHelpful}
            className={`flex items-center space-x-2 text-sm transition-colors ${
              helpful
                ? 'text-orange-600'
                : 'text-gray-500 hover:text-orange-600'
            }`}
          >
            <ThumbsUp className={`h-4 w-4 ${helpful ? 'fill-current' : ''}`} />
            <span>Helpful</span>
          </button>

          <div className="text-xs text-gray-400">
            {review.verified ? 'Verified Purchase' : 'Pending Verification'}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Review photo"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewCard;