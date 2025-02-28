import { FC, useState, useCallback } from 'react';

interface RatingProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  precision?: 0.5 | 1;
  emptyIcon?: React.ReactNode;
  filledIcon?: React.ReactNode;
  className?: string;
  itemClassName?: string;
  color?: string;
  label?: string;
  showValue?: boolean;
}

export const Rating: FC<RatingProps> = ({
  value = 0,
  onChange,
  max = 5,
  size = 'md',
  readonly = false,
  precision = 1,
  emptyIcon,
  filledIcon,
  className = '',
  itemClassName = '',
  color = 'text-yellow-400',
  label,
  showValue = false,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (readonly) return;

    const { left, width } = event.currentTarget.getBoundingClientRect();
    const percent = (event.clientX - left) / width;

    if (precision === 0.5) {
      setHoverValue(index + (percent > 0.5 ? 1 : 0.5));
    } else {
      setHoverValue(index + 1);
    }
  }, [readonly, precision]);

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const handleClick = (newValue: number) => {
    if (!readonly && onChange) {
      onChange(newValue);
    }
  };

  const renderIcon = (index: number) => {
    const filled = (hoverValue ?? value) > index;
    const halfFilled = precision === 0.5 && (hoverValue ?? value) === index + 0.5;

    if (filled && filledIcon) return filledIcon;
    if (!filled && emptyIcon) return emptyIcon;

    return (
      <svg
        className={`${sizeClasses[size]} ${filled ? color : 'text-gray-300'}`}
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {halfFilled ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77V2z"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        )}
      </svg>
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
        <div className="flex space-x-1">
          {Array.from({ length: max }).map((_, index) => (
            <div
              key={index}
              className={`
                cursor-pointer
                ${readonly ? 'cursor-default' : ''}
                ${itemClassName}
              `}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(index + 1)}
            >
              {renderIcon(index)}
            </div>
          ))}
        </div>
        {showValue && (
          <span className="ml-2 text-sm text-gray-600">
            {hoverValue ?? value}
          </span>
        )}
      </div>
    </div>
  );
};

export default Rating;
