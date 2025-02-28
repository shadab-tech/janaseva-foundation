import { FC, useState, useRef, useEffect, useCallback } from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showValue?: boolean;
  label?: string;
  className?: string;
  marks?: { value: number; label: string }[];
  orientation?: 'horizontal' | 'vertical';
}

export const Slider: FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  size = 'md',
  color = 'bg-red-500',
  showValue = false,
  label,
  className = '',
  marks,
  orientation = 'horizontal',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: {
      track: 'h-1',
      thumb: 'h-3 w-3',
      text: 'text-sm',
    },
    md: {
      track: 'h-2',
      thumb: 'h-4 w-4',
      text: 'text-base',
    },
    lg: {
      track: 'h-3',
      thumb: 'h-5 w-5',
      text: 'text-lg',
    },
  };

  const getValueFromPosition = useCallback((position: number) => {
    if (!sliderRef.current) return value;

    const rect = sliderRef.current.getBoundingClientRect();
    const size = orientation === 'horizontal' ? rect.width : rect.height;
    const offset = orientation === 'horizontal' ? rect.left : rect.bottom;
    const pos = orientation === 'horizontal' ? position - offset : offset - position;
    
    const percentage = Math.max(0, Math.min(1, pos / size));
    const rawValue = min + percentage * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    
    return Math.max(min, Math.min(max, steppedValue));
  }, [min, max, step, value, orientation]);

  const handleMove = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDragging || disabled) return;

    const position = 'touches' in event
      ? orientation === 'horizontal'
        ? event.touches[0].clientX
        : event.touches[0].clientY
      : orientation === 'horizontal'
        ? event.clientX
        : event.clientY;

    const newValue = getValueFromPosition(position);
    onChange(newValue);
  }, [isDragging, disabled, getValueFromPosition, onChange, orientation]);

  const handleStart = useCallback(() => {
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTrackClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      const position = orientation === 'horizontal' ? event.clientX : event.clientY;
      const newValue = getValueFromPosition(position);
      onChange(newValue);
    }
  }, [disabled, orientation, getValueFromPosition, onChange]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={className}>
      {label && (
        <label className={`block font-medium text-gray-700 mb-2 ${sizeClasses[size].text}`}>
          {label}
          {showValue && (
            <span className="ml-2 text-gray-500">
              {value}
            </span>
          )}
        </label>
      )}
      <div
        className={`
          relative
          ${orientation === 'horizontal' ? 'w-full' : 'h-48 w-fit'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div
          ref={sliderRef}
          className={`
            ${orientation === 'horizontal' ? 'w-full' : 'h-full w-2'}
            ${sizeClasses[size].track}
            bg-gray-200 rounded-full
          `}
          onClick={handleTrackClick}
        >
          <div
            className={`
              ${orientation === 'horizontal' ? 'h-full' : `w-full`}
              ${color} rounded-full
            `}
            style={{
              width: orientation === 'horizontal' ? `${percentage}%` : undefined,
              height: orientation === 'vertical' ? `${percentage}%` : undefined,
            }}
          />
        </div>

        <div
          ref={thumbRef}
          className={`
            absolute
            ${sizeClasses[size].thumb}
            ${color} rounded-full shadow
            transform -translate-x-1/2 -translate-y-1/2
            ${disabled ? '' : 'cursor-grab active:cursor-grabbing'}
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
          `}
          style={{
            [orientation === 'horizontal' ? 'left' : 'bottom']: `${percentage}%`,
            [orientation === 'horizontal' ? 'top' : 'left']: '50%',
          }}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          tabIndex={disabled ? -1 : 0}
        />

        {marks && (
          <div className={`absolute ${orientation === 'horizontal' ? 'left-0 right-0 top-6' : 'bottom-0 top-0 left-6'}`}>
            {marks.map((mark) => {
              const markPercentage = ((mark.value - min) / (max - min)) * 100;
              return (
                <div
                  key={mark.value}
                  className={`absolute ${sizeClasses[size].text} transform -translate-x-1/2`}
                  style={{
                    [orientation === 'horizontal' ? 'left' : 'bottom']: `${markPercentage}%`,
                  }}
                >
                  <div className="h-1 w-0.5 bg-gray-300 mb-1" />
                  <span className="text-gray-600">{mark.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Slider;
