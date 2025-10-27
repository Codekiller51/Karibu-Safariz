import React, { useEffect, useRef, useState } from 'react';

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down';
  backgroundImage?: string;
  overlay?: boolean;
  overlayOpacity?: number;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className = '',
  speed = 0.5,
  direction = 'up',
  backgroundImage,
  overlay = true,
  overlayOpacity = 0.5,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      const elementTop = rect.top + scrolled;
      const viewportHeight = window.innerHeight;

      if (rect.top < viewportHeight && rect.bottom > 0) {
        const speedMultiplier = direction === 'up' ? -speed : speed;
        const parallaxOffset = (scrolled - elementTop + viewportHeight) * speedMultiplier;

        requestAnimationFrame(() => {
          setOffset(parallaxOffset);
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed, direction]);

  return (
    <div
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
      style={{ perspective: '1000px' }}
    >
      {backgroundImage && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `translate3d(0, ${offset}px, 0)`,
            willChange: 'transform',
          }}
        >
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
            style={{ minHeight: '120%' }}
          />
          {overlay && (
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: overlayOpacity }}
            />
          )}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default ParallaxSection;
