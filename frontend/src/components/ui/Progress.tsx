import { FC, useEffect, useState } from 'react';

interface ProgressProps {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  showValue?: boolean;
  valueFormat?: (value: number, max: number) => string;
  animated?: boolean;
  striped?: boolean;
  className?: string;
  label?: string;
  indeterminate?: boolean;
}

export const Progress: FC<ProgressProps> = ({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  showValue = false,
  valueFormat,
  animated = false,
  striped = false,
  className = '',
  label,
  indeterminate = false,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4',
  };

  const variantStyles = {
    primary: 'bg-red-500',
    secondary: 'bg-gray-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-600',
  };

  const formatValue = () => {
    if (valueFormat) {
      return valueFormat(value, max);
    }
    return `${Math.round(percentage)}%`;
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between mb-1">
          {label && (
            <span className="text-sm font-medium text-gray-700">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm font-medium text-gray-700">
              {formatValue()}
            </span>
          )}
        </div>
      )}
      <div
        className={`
          w-full bg-gray-200 rounded-full overflow-hidden
          ${sizeStyles[size]}
        `}
      >
        <div
          className={`
            ${variantStyles[variant]}
            transition-all duration-300 ease-in-out
            ${striped ? 'bg-stripes' : ''}
            ${animated && striped ? 'animate-progress-stripes' : ''}
            ${indeterminate ? 'animate-indeterminate-progress w-2/5' : ''}
            ${mounted ? '' : 'w-0'}
          `}
          style={{
            width: indeterminate ? undefined : `${percentage}%`,
          }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

// Circular Progress
interface CircularProgressProps extends Omit<ProgressProps, 'size'> {
  size?: number;
  thickness?: number;
  showValue?: boolean;
}

export const CircularProgress: FC<CircularProgressProps> = ({
  value = 0,
  max = 100,
  size = 40,
  thickness = 4,
  variant = 'primary',
  showValue = false,
  valueFormat,
  animated = false,
  className = '',
  indeterminate = false,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const variantStyles = {
    primary: 'stroke-red-500',
    secondary: 'stroke-gray-500',
    success: 'stroke-green-500',
    warning: 'stroke-yellow-500',
    danger: 'stroke-red-600',
  };

  const formatValue = () => {
    if (valueFormat) {
      return valueFormat(value, max);
    }
    return `${Math.round(percentage)}%`;
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      <svg
        className={`transform -rotate-90 ${
          animated && indeterminate ? 'animate-spin' : ''
        }`}
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          className="stroke-gray-200"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={thickness}
        />
        {/* Progress circle */}
        <circle
          className={`
            ${variantStyles[variant]}
            transition-all duration-300 ease-in-out
          `}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={mounted ? offset : circumference}
          strokeLinecap="round"
        />
      </svg>
      {showValue && !indeterminate && (
        <div
          className="absolute inset-0 flex items-center justify-center text-sm font-medium"
        >
          {formatValue()}
        </div>
      )}
    </div>
  );
};

// Loading Bar
export const LoadingBar: FC<{
  className?: string;
  height?: number;
  color?: string;
}> = ({
  className = '',
  height = 2,
  color = 'bg-red-500',
}) => {
  return (
    <div
      className={`w-full overflow-hidden ${className}`}
      style={{ height }}
    >
      <div
        className={`
          w-full h-full ${color}
          animate-loading-bar
          transform translate-x-[-100%]
        `}
      />
    </div>
  );
};

export default Progress;
