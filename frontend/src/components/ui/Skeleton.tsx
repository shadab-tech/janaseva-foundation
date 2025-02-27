import { FC } from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: number | string;
  height?: number | string;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
  repeat?: number;
  dark?: boolean;
}

export const Skeleton: FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  animation = 'pulse',
  repeat = 1,
  dark = false,
}) => {
  const baseStyles = dark ? 'bg-gray-700' : 'bg-gray-200';
  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%]',
    none: '',
  };

  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  };

  const getDefaultHeight = () => {
    switch (variant) {
      case 'text':
        return '1em';
      case 'circular':
        return width || '2.5rem';
      default:
        return height || '100px';
    }
  };

  const skeletonStyle = {
    width: width || (variant === 'text' ? '100%' : 'auto'),
    height: height || getDefaultHeight(),
  };

  const renderSkeleton = () => (
    <div
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${animationStyles[animation]}
        ${className}
      `}
      style={skeletonStyle}
      role="status"
      aria-label="loading"
    />
  );

  if (repeat === 1) {
    return renderSkeleton();
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: repeat }, (_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};

// Predefined skeleton components
export const TextSkeleton: FC<Omit<SkeletonProps, 'variant'>> = (props) => (
  <Skeleton variant="text" {...props} />
);

export const CircularSkeleton: FC<Omit<SkeletonProps, 'variant'>> = (props) => (
  <Skeleton variant="circular" {...props} />
);

export const RectangularSkeleton: FC<Omit<SkeletonProps, 'variant'>> = (props) => (
  <Skeleton variant="rectangular" {...props} />
);

// Common skeleton layouts
interface CardSkeletonProps {
  imageHeight?: number | string;
  lines?: number;
  className?: string;
  dark?: boolean;
}

export const CardSkeleton: FC<CardSkeletonProps> = ({
  imageHeight = 200,
  lines = 3,
  className = '',
  dark = false,
}) => (
  <div className={`space-y-4 ${className}`}>
    <Skeleton
      variant="rounded"
      height={imageHeight}
      className="w-full"
      dark={dark}
    />
    <div className="space-y-2">
      <Skeleton
        variant="text"
        width="75%"
        height="1.5em"
        dark={dark}
      />
      {Array.from({ length: lines - 1 }, (_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={`${Math.random() * 30 + 70}%`}
          dark={dark}
        />
      ))}
    </div>
  </div>
);

interface ListSkeletonProps {
  rows?: number;
  rowHeight?: number | string;
  className?: string;
  dark?: boolean;
}

export const ListSkeleton: FC<ListSkeletonProps> = ({
  rows = 5,
  rowHeight = '4rem',
  className = '',
  dark = false,
}) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: rows }, (_, index) => (
      <div
        key={index}
        className="flex items-center space-x-4"
        style={{ height: rowHeight }}
      >
        <CircularSkeleton width={40} height={40} dark={dark} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="40%" dark={dark} />
          <Skeleton variant="text" width="60%" dark={dark} />
        </div>
      </div>
    ))}
  </div>
);

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
  headerHeight?: string | number;
  rowHeight?: string | number;
  dark?: boolean;
}

export const TableSkeleton: FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className = '',
  headerHeight = '2.5rem',
  rowHeight = '2rem',
  dark = false,
}) => (
  <div className={`space-y-4 ${className}`}>
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }, (_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          height={headerHeight}
          className="rounded"
          dark={dark}
        />
      ))}
    </div>
    {Array.from({ length: rows }, (_, rowIndex) => (
      <div
        key={rowIndex}
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }, (_, colIndex) => (
          <Skeleton
            key={colIndex}
            variant="text"
            height={rowHeight}
            width={`${Math.random() * 30 + 70}%`}
            dark={dark}
          />
        ))}
      </div>
    ))}
  </div>
);

// Add shimmer animation to tailwind.config.js
// {
//   theme: {
//     extend: {
//       keyframes: {
//         shimmer: {
//           '0%': { backgroundPosition: '-200% 0' },
//           '100%': { backgroundPosition: '200% 0' },
//         },
//       },
//       animation: {
//         shimmer: 'shimmer 1.5s infinite linear',
//       },
//     },
//   },
// }

export default Skeleton;
