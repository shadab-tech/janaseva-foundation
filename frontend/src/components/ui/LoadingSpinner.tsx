import { FC } from 'react';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white';
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  text,
  size = 'md',
  color = 'primary',
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const colors = {
    primary: 'text-red-500',
    white: 'text-white',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`
          inline-block animate-spin rounded-full
          border-2 border-solid border-current
          border-r-transparent align-[-0.125em]
          motion-reduce:animate-[spin_1.5s_linear_infinite]
          ${sizes[size]} ${colors[color]}
        `}
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
      {text && (
        <div className={`mt-2 text-sm ${colors[color]}`}>
          {text}
        </div>
      )}
    </div>
  );
};

export const PageSpinner: FC<{ text?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  text,
  size = 'lg',
}) => (
  <div className="flex min-h-[400px] items-center justify-center">
    <LoadingSpinner text={text} size={size} />
  </div>
);

export const ButtonSpinner: FC = () => (
  <LoadingSpinner size="sm" color="white" />
);

export default LoadingSpinner;
