import { FC } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingScreenProps {
  text?: string;
  fullScreen?: boolean;
  transparent?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingScreen: FC<LoadingScreenProps> = ({
  text = 'Loading...',
  fullScreen = true,
  transparent = false,
  size = 'lg',
}) => {
  const containerClasses = `
    flex items-center justify-center
    ${fullScreen ? 'fixed inset-0' : 'min-h-[400px]'}
    ${transparent ? 'bg-transparent' : 'bg-white bg-opacity-90'}
    ${fullScreen ? 'z-50' : ''}
  `;

  const content = (
    <div className="text-center">
      <LoadingSpinner text={text} size={size} />
    </div>
  );

  if (fullScreen) {
    return (
      <div className={containerClasses}>
        <div className="max-w-sm mx-auto px-4">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {content}
    </div>
  );
};

// Variants for specific use cases
export const FullScreenLoader: FC<{ text?: string }> = ({ text }) => (
  <LoadingScreen text={text} fullScreen size="lg" />
);

export const ContentLoader: FC<{ text?: string }> = ({ text }) => (
  <LoadingScreen text={text} fullScreen={false} size="md" />
);

export const TransparentLoader: FC<{ text?: string }> = ({ text }) => (
  <LoadingScreen text={text} transparent size="lg" />
);

export const InlineLoader: FC<{ text?: string; className?: string }> = ({
  text,
  className = '',
}) => (
  <div className={`flex items-center justify-center p-4 ${className}`}>
    <LoadingSpinner text={text} size="sm" />
  </div>
);

// Overlay loader with backdrop
export const OverlayLoader: FC<{ text?: string; onCancel?: () => void }> = ({
  text,
  onCancel,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onCancel} />
    <div className="relative bg-white rounded-lg p-6 shadow-xl max-w-sm mx-4">
      <LoadingSpinner text={text} size="lg" />
      {onCancel && (
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Cancel"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  </div>
);

// Loading states with custom animations
export const PulseLoader: FC = () => (
  <div className="flex space-x-2 justify-center items-center">
    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-75" />
    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-150" />
  </div>
);

export const CircleLoader: FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={`${sizes[size]} border-2 border-gray-200 border-t-red-500 rounded-full animate-spin`}
    />
  );
};

export const ProgressLoader: FC<{ progress: number }> = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div
      className="bg-red-500 h-2.5 rounded-full transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);

export default LoadingScreen;
