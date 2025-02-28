import { FC } from 'react';
import { Portal } from './Portal';

interface LoadingScreenProps {
  isLoading: boolean;
  text?: string;
  overlay?: boolean;
  spinnerSize?: 'sm' | 'md' | 'lg';
  spinnerColor?: string;
  className?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: FC<LoadingScreenProps> = ({
  isLoading,
  text = 'Loading...',
  overlay = true,
  spinnerSize = 'md',
  spinnerColor = 'text-red-500',
  className = '',
  fullScreen = true,
}) => {
  if (!isLoading) return null;

  const spinnerSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const LoadingSpinner = () => (
    <div className="inline-flex flex-col items-center">
      <svg
        className={`animate-spin ${spinnerSizeClasses[spinnerSize]} ${spinnerColor}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <span className={`mt-4 text-sm font-medium ${spinnerColor}`}>
          {text}
        </span>
      )}
    </div>
  );

  const content = (
    <div
      className={`
        flex items-center justify-center
        ${fullScreen ? 'fixed inset-0' : 'absolute inset-0'}
        ${overlay ? 'bg-white/80 backdrop-blur-sm' : ''}
        z-50
        ${className}
      `}
    >
      <LoadingSpinner />
    </div>
  );

  return fullScreen ? (
    <Portal containerId="loading-screen-root">
      {content}
    </Portal>
  ) : content;
};

// Simpler version for inline loading states
interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'text-red-500',
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${color} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// Example usage:
// Full screen loading:
// <LoadingScreen isLoading={true} text="Loading data..." />

// Inline loading:
// <LoadingSpinner size="sm" color="text-blue-500" />

// Container loading:
// <div className="relative h-64">
//   <LoadingScreen isLoading={true} fullScreen={false} overlay={true} />
// </div>

export default LoadingScreen;
