import { FC, ReactNode, useState, useEffect, useCallback } from 'react';

interface CarouselProps {
  items: ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  showThumbnails?: boolean;
  infinite?: boolean;
  className?: string;
  slideClassName?: string;
  arrowClassName?: string;
  dotsClassName?: string;
  thumbnailsClassName?: string;
  onChange?: (index: number) => void;
}

export const Carousel: FC<CarouselProps> = ({
  items,
  autoPlay = false,
  interval = 5000,
  showArrows = true,
  showDots = true,
  showThumbnails = false,
  infinite = true,
  className = '',
  slideClassName = '',
  arrowClassName = '',
  dotsClassName = '',
  thumbnailsClassName = '',
  onChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const nextSlide = useCallback(() => {
    if (currentIndex === items.length - 1) {
      if (infinite) {
        setCurrentIndex(0);
      }
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, items.length, infinite]);

  const prevSlide = () => {
    if (currentIndex === 0) {
      if (infinite) {
        setCurrentIndex(items.length - 1);
      }
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    onChange?.(currentIndex);
  }, [currentIndex, onChange]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoPlay && !isHovered) {
      timer = setInterval(() => {
        nextSlide();
      }, interval);
    }
    return () => clearInterval(timer);
  }, [autoPlay, interval, isHovered, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const ArrowButton: FC<{ direction: 'left' | 'right'; onClick: () => void }> = ({
    direction,
    onClick,
  }) => (
    <button
      className={`
        absolute top-1/2 -translate-y-1/2 z-10
        ${direction === 'left' ? 'left-2' : 'right-2'}
        p-2 rounded-full bg-black/30 text-white
        hover:bg-black/50 transition-colors
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
        ${arrowClassName}
      `}
      onClick={onClick}
      aria-label={direction === 'left' ? 'Previous slide' : 'Next slide'}
    >
      {direction === 'left' ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </button>
  );

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={`w-full flex-shrink-0 ${slideClassName}`}
            aria-hidden={index !== currentIndex}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && items.length > 1 && (
        <>
          {(infinite || currentIndex > 0) && (
            <ArrowButton direction="left" onClick={prevSlide} />
          )}
          {(infinite || currentIndex < items.length - 1) && (
            <ArrowButton direction="right" onClick={nextSlide} />
          )}
        </>
      )}

      {/* Navigation Dots */}
      {showDots && items.length > 1 && (
        <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 ${dotsClassName}`}>
          {items.map((_, index) => (
            <button
              key={index}
              className={`
                w-2 h-2 rounded-full transition-all
                ${index === currentIndex
                  ? 'bg-white w-4'
                  : 'bg-white/50 hover:bg-white/75'
                }
              `}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex}
            />
          ))}
        </div>
      )}

      {/* Thumbnails */}
      {showThumbnails && items.length > 1 && (
        <div className={`mt-4 flex justify-center gap-2 ${thumbnailsClassName}`}>
          {items.map((item, index) => (
            <button
              key={index}
              className={`
                w-16 h-16 overflow-hidden rounded
                ${index === currentIndex
                  ? 'ring-2 ring-red-500'
                  : 'opacity-50 hover:opacity-75'
                }
              `}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
