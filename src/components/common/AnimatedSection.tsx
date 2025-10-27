import React, { useEffect, useState, useRef } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'none';
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animation = 'fade',
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: '0px' }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [threshold, triggerOnce]);

  const getAnimationClass = () => {
    if (!isVisible) {
      switch (animation) {
        case 'fade':
          return 'opacity-0';
        case 'slide-up':
          return 'opacity-0 translate-y-12';
        case 'slide-down':
          return 'opacity-0 -translate-y-12';
        case 'slide-left':
          return 'opacity-0 translate-x-12';
        case 'slide-right':
          return 'opacity-0 -translate-x-12';
        case 'scale':
          return 'opacity-0 scale-90';
        default:
          return '';
      }
    }
    return 'opacity-100 translate-x-0 translate-y-0 scale-100';
  };

  return (
    <div
      ref={sectionRef}
      className={`transition-all duration-700 ease-out ${getAnimationClass()} ${className}`}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
