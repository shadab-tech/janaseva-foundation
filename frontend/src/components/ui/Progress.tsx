import { FC } from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  labelPosition?: 'inside' | 'outside';
  striped?: boolean;
  animated?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'error';
  height?: 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export const Progress: FC<ProgressProps> = ({
  value,
  max = 100,
  className = '',
  barClassName = '',
  showLabel = false,
  labelPosition = 'inside',
  striped = false,
  animated = false,
  color = 'primary',
  height = 'md',
  rounded = 'full',
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const colorClasses = {
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  const heightClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`relative ${heightClasses[height]} bg-gray-200 ${roundedClasses[rounded]} overflow-hidden`}>
        <div
          className={`
            h-full transition-all duration-300
            ${striped ? 'bg-striped' : ''}
            ${animated ? 'animate-striped' : ''}
            ${colorClasses[color]}
            ${roundedClasses[rounded]}
            ${barClassName}
          `}
          style={{ width: `${percentage}%` }}
        >
          {showLabel && labelPosition === 'inside' && (
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
              {`${Math.round(percentage)}%`}
            </span>
          )}
        </div>
      </div>
      {showLabel && labelPosition === 'outside' && (
        <div className="mt-1 text-sm text-gray-600">
          {`${Math.round(percentage)}%`}
        </div>
      )}
    </div>
  );
};

export default Progress;
