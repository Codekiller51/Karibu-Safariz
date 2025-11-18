import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ImageGalleryMasonry from './ImageGalleryMasonry';
import AnimatedSection from '../common/AnimatedSection';
import { db } from '../../lib/supabase';

const TourGallery: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await db.getTourPackages();
        if (error) throw error;

        const galleryImages = (data || [])
          .slice(0, 9)
          .flatMap((tour: any) =>
            (tour.images || []).slice(0, 2).map((img: string, idx: number) => ({
              id: `${tour.id}-${idx}`,
              src: img,
              alt: tour.title
            }))
          )
          .slice(0, 9);

        setImages(galleryImages);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        setImages([
          { id: '1', src: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg', alt: 'Mountain' },
          { id: '2', src: 'https://images.pexels.com/photos/631292/pexels-photo-631292.jpeg', alt: 'Safari' },
          { id: '3', src: 'https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg', alt: 'Beach' },
          { id: '4', src: 'https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg', alt: 'Wildlife' },
          { id: '5', src: 'https://images.pexels.com/photos/1821644/pexels-photo-1821644.jpeg', alt: 'Culture' },
          { id: '6', src: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg', alt: 'City' },
          { id: '7', src: 'https://images.pexels.com/photos/3573351/pexels-photo-3573351.jpeg', alt: 'Coast' },
          { id: '8', src: 'https://images.pexels.com/photos/1470332/pexels-photo-1470332.jpeg', alt: 'Landscape' },
          { id: '9', src: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg', alt: 'Adventure' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) return null;

  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12 gap-8">
          <AnimatedSection animation="slide-up">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Tour Packages you'll love
              </h2>
              <p className="text-lg text-gray-600">
                Handpicked experiences and breathtaking destinations
              </p>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection animation="fade">
          <ImageGalleryMasonry images={images} />
        </AnimatedSection>

        <AnimatedSection animation="slide-up" className="mt-12 flex justify-center">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Want to see more places?
            <ArrowRight className="h-5 w-5" />
          </Link>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default TourGallery;
