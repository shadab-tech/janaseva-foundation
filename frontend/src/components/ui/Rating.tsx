import { FC, useState } from 'react';

interface RatingProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'star' | 'heart' | 'circle';
  precision?: 0.5 | 1;
  readonly?: boolean;
  disabled?: boolean;
  showValue?: boolean;
  label?: string;
  className?: string;
  error?: string;
  emptyColor?: string;
  filledColor?: string;
  tooltips?: string[];
  showCount?: boolean;
  count?: number;
}

export const Rating: FC<RatingProps> = ({
  value = 0,
  onChange,
  max = 5,
  size = 'md',
  variant = 'star',
  precision = 1,
  readonly = false,
  disabled = false,
  showValue = false,
  label,
  className = '',
  error,
  emptyColor = 'text-gray-300',
  filledColor = 'text-yellow-400',
  tooltips = [],
  showCount = false,
  count,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const icons = {
    star: {
      filled: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      empty: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
    },
    heart: {
      filled: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      ),
      empty: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    circle: {
      filled: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" />
        </svg>
      ),
      empty: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" strokeWidth={2} />
        </svg>
      ),
    },
  };

  const getRatingValue = (index: number) => {
    const itemValue = index + 1;
    if (precision === 0.5) {
      const fraction = isHovering ? 
        (hoverValue || value) - Math.floor(hoverValue || value) : 
        value - Math.floor(value);
      if (fraction >= 0.5 && itemValue === Math.ceil(isHovering ? (hoverValue || value) : value)) {
        return 0.5;
      }
    }
    return itemValue <= (isHovering ? (hoverValue || value) : value) ? 1 : 0;
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (readonly || disabled) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const itemWidth = rect.width;
    const position = event.clientX - rect.left;

    if (precision === 0.5) {
      const fraction = position / itemWidth;
      const currentValue = Number(event.currentTarget.getAttribute('data-value'));
      setHoverValue(currentValue - (fraction <= 0.5 ? 0.5 : 0));
    } else {
      const currentValue = Number(event.currentTarget.getAttribute('data-value'));
      setHoverValue(currentValue);
    }
  };

  const handleClick = (newValue: number) => {
    if (readonly || disabled || !onChange) return;
    onChange(newValue);
  };

  const renderTooltip = (index: number) => {
    if (!tooltips[index]) return null;
    
    return (
      <div className="
        absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1
        px-2 py-1 text-xs bg-gray-900 text-white rounded
        opacity-0 group-hover:opacity-100 transition-opacity
        whitespace-nowrap
      ">
        {tooltips[index]}
      </div>
    );
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="flex items-center">
        <div
          className={`inline-flex items-center ${
            readonly || disabled ? 'cursor-default' : 'cursor-pointer'
          }`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            setHoverValue(null);
          }}
        >
          <div className="flex">
            {[...Array(max)].map((_, index) => (
              <div
                key={index}
                data-value={index + 1}
                className={`
                  ${sizeStyles[size]}
                  ${readonly || disabled ? '' : 'cursor-pointer'}
                  group relative
                `}
                onClick={() => handleClick(index + 1)}
                onMouseMove={handleMouseMove}
              >
                {renderTooltip(index)}
                <div className="relative">
                  <div className={emptyColor}>
                    {icons[variant].empty}
                  </div>
                  <div
                    className={`absolute inset-0 overflow-hidden ${filledColor}`}
                    style={{
                      width: `${getRatingValue(index) * 100}%`,
                    }}
                  >
                    {icons[variant].filled}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {showValue && (
            <span className="ml-2 text-sm text-gray-600">
              {hoverValue || value}
            </span>
          )}
          {showCount && count !== undefined && (
            <span className="ml-2 text-sm text-gray-500">
              ({count})
            </span>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Read-only rating display
export const RatingDisplay: FC<Omit<RatingProps, 'onChange' | 'precision'>> = (props) => (
  <Rating {...props} readonly precision={1} />
);

export default Rating;
