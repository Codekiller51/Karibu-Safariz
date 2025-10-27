import { useEffect, useState, useCallback } from 'react';

interface ParallaxConfig {
  speed?: number;
  direction?: 'vertical' | 'horizontal';
  enableOn3D?: boolean;
}

export const useParallax = (config: ParallaxConfig = {}) => {
  const { speed = 0.5, direction = 'vertical', enableOn3D = true } = config;
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    requestAnimationFrame(() => {
      setOffset({
        x: direction === 'horizontal' ? scrollX * speed : 0,
        y: direction === 'vertical' ? scrollY * speed : 0,
      });
    });
  }, [speed, direction]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const getTransform = (depth: number = 0) => {
    if (enableOn3D && depth !== 0) {
      return {
        transform: `translate3d(${offset.x}px, ${offset.y}px, ${depth}px)`,
        willChange: 'transform',
      };
    }
    return {
      transform: `translate(${offset.x}px, ${offset.y}px)`,
      willChange: 'transform',
    };
  };

  return { offset, getTransform };
};

interface IntersectionConfig {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useIntersectionObserver = (config: IntersectionConfig = {}) => {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = config;
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;

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
      { threshold, rootMargin }
    );

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, rootMargin, triggerOnce]);

  return { isVisible, ref: setRef };
};

export const useMouseParallax = (intensity: number = 20) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * intensity;
      const y = (e.clientY / window.innerHeight - 0.5) * intensity;

      requestAnimationFrame(() => {
        setMousePosition({ x, y });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [intensity]);

  return mousePosition;
};
