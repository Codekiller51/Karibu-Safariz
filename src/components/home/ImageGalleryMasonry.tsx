import React from 'react';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

interface ImageGalleryMasonryProps {
  images: GalleryImage[];
}

const ImageGalleryMasonry: React.FC<ImageGalleryMasonryProps> = ({ images }) => {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {images.map((image, index) => {
        const isLarge = index === 0 || index === 5;
        const colSpan = isLarge ? 'md:col-span-2' : '';
        const rowSpan = isLarge ? 'md:row-span-2' : '';

        return (
          <div
            key={image.id}
            className={`overflow-hidden rounded-lg group cursor-pointer ${colSpan} ${rowSpan} ${
              isLarge ? 'h-48 md:h-96' : 'h-40 md:h-48'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        );
      })}
    </div>
  );
};

export default ImageGalleryMasonry;
