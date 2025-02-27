import { FC, useRef, useState, useEffect } from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  marks?: { value: number; label: string }[];
  tooltip?: boolean;
  className?: string;
  error?: string;
}

export const Slider: FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = false,
  valuePrefix = '',
  valueSuffix = '',
  disabled = false,
  size = 'md',
  variant = 'primary',
  marks = [],
  tooltip = true,
  className = '',
  error,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const sizeStyles = {
    sm: {
      track: 'h-1',
      thumb: 'w-3 h-3',
      label: 'text-sm',
    },
    md: {
      track: 'h-2',
      thumb: 'w-4 h-4',
      label: 'text-base',
    },
    lg: {
      track: 'h-3',
      thumb: 'w-6 h-6',
      label: 'text-lg',
    },
  };

  const variantStyles = {
    primary: {
      track: 'bg-red-500',
      thumb: 'bg-red-600',
      focus: 'focus:ring-red-500',
    },
    secondary: {
      track: 'bg-gray-500',
      thumb: 'bg-gray-600',
      focus: 'focus:ring-gray-500',
    },
    success: {
      track: 'bg-green-500',
      thumb: 'bg-green-600',
      focus: 'focus:ring-green-500',
    },
    warning: {
      track: 'bg-yellow-500',
      thumb: 'bg-yellow-600',
      focus: 'focus:ring-yellow-500',
    },
    danger: {
      track: 'bg-red-500',
      thumb: 'bg-red-600',
      focus: 'focus:ring-red-500',
    },
  };

  const percentage = ((value - min) / (max - min)) * 100;

  const updateValue = (clientX: number) => {
    if (!sliderRef.current || disabled) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const position = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, position / rect.width));
    const newValue = Math.round((percentage * (max - min) + min) / step) * step;

    onChange(newValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    updateValue(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (thumbRef.current) {
      const thumbRect = thumbRef.current.getBoundingClientRect();
      setTooltipPosition(thumbRect.width / 2);
    }
  }, [value]);

  const formatValue = () => {
    return `${valuePrefix}${value}${valueSuffix}`;
  };

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between mb-2">
          {label && (
            <label className={`font-medium ${sizeStyles[size].label} ${disabled ? 'opacity-50' : ''}`}>
              {label}
            </label>
          )}
          {showValue && (
            <span className={`${sizeStyles[size].label} text-gray-600 ${disabled ? 'opacity-50' : ''}`}>
              {formatValue()}
            </span>
          )}
        </div>
      )}

      <div
        ref={sliderRef}
        className={`
          relative w-full ${sizeStyles[size].track} bg-gray-200 rounded-full
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={handleMouseDown}
      >
        {/* Track fill */}
        <div
          className={`absolute h-full rounded-full ${variantStyles[variant].track}`}
          style={{ width: `${percentage}%` }}
        />

        {/* Thumb */}
        <div
          ref={thumbRef}
          className={`
            absolute top-1/2 -translate-y-1/2
            ${sizeStyles[size].thumb}
            ${variantStyles[variant].thumb}
            rounded-full shadow
            transform -translate-x-1/2
            ${disabled ? '' : 'cursor-grab active:cursor-grabbing'}
            ${variantStyles[variant].focus}
            focus:outline-none focus:ring-2 focus:ring-offset-2
          `}
          style={{ left: `${percentage}%` }}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          tabIndex={disabled ? -1 : 0}
          onMouseDown={handleMouseDown}
        >
          {tooltip && !disabled && (
            <div
              className={`
                absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
                px-2 py-1 text-xs font-medium text-white
                bg-gray-900 rounded shadow-sm
                transition-opacity duration-200
                ${isDragging ? 'opacity-100' : 'opacity-0'}
              `}
              style={{ marginLeft: -tooltipPosition }}
            >
              {formatValue()}
            </div>
          )}
        </div>

        {/* Marks */}
        {marks.map((mark) => {
          const markPercentage = ((mark.value - min) / (max - min)) * 100;
          return (
            <div
              key={mark.value}
              className="absolute top-full mt-2 transform -translate-x-1/2"
              style={{ left: `${markPercentage}%` }}
            >
              <div className="text-xs text-gray-600">{mark.label}</div>
            </div>
          );
        })}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Range Slider Component
interface RangeSliderProps extends Omit<SliderProps, 'value' | 'onChange'> {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export const RangeSlider: FC<RangeSliderProps> = ({
  value: [minValue, maxValue],
  onChange,
  ...props
}) => {
  const handleMinChange = (newMin: number) => {
    onChange([Math.min(newMin, maxValue), maxValue]);
  };

  const handleMaxChange = (newMax: number) => {
    onChange([minValue, Math.max(minValue, newMax)]);
  };

  return (
    <div className="relative">
      <Slider
        {...props}
        value={minValue}
        onChange={handleMinChange}
        tooltip={false}
      />
      <div className="mt-4">
        <Slider
          {...props}
          value={maxValue}
          onChange={handleMaxChange}
          tooltip={false}
        />
      </div>
    </div>
  );
};

export default Slider;
