import { FC, ReactNode } from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'custom';
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
  children?: ReactNode;
  repeat?: number;
}

export const Skeleton: FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  animation = 'pulse',
  children,
  repeat = 1,
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    custom: '',
  };

  const getStyle = () => {
    const style: Record<string, string | number> = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;
    return style;
  };

  const renderSkeleton = () => (
    <div
      className={`
        ${baseClasses}
        ${animationClasses[animation]}
        ${variantClasses[variant]}
        ${className}
      `}
      style={getStyle()}
    >
      {children}
    </div>
  );

  if (repeat > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: repeat }).map((_, index) => (
          <div key={index}>{renderSkeleton()}</div>
        ))}
      </div>
    );
  }

  return renderSkeleton();
};

// Predefined skeleton components for common use cases
export const TextSkeleton: FC<Omit<SkeletonProps, 'variant'>> = (props) => (
  <Skeleton variant="text" height={20} {...props} />
);

export const CircularSkeleton: FC<Omit<SkeletonProps, 'variant'>> = (props) => (
  <Skeleton variant="circular" width={40} height={40} {...props} />
);

export const RectangularSkeleton: FC<Omit<SkeletonProps, 'variant'>> = (props) => (
  <Skeleton variant="rectangular" {...props} />
);

// Common skeleton patterns
interface AvatarWithTextSkeletonProps extends Omit<SkeletonProps, 'variant'> {
  lines?: number;
}

export const AvatarWithTextSkeleton: FC<AvatarWithTextSkeletonProps> = ({
  lines = 2,
  className = '',
  ...props
}) => (
  <div className={`flex items-start space-x-4 ${className}`}>
    <CircularSkeleton {...props} />
    <div className="flex-1 space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <TextSkeleton
          key={index}
          width={index === 0 ? '60%' : '80%'}
          {...props}
        />
      ))}
    </div>
  </div>
);

export const CardSkeleton: FC<SkeletonProps> = ({
  className = '',
  ...props
}) => (
  <div className={`space-y-4 ${className}`}>
    <RectangularSkeleton height={200} {...props} />
    <div className="space-y-2">
      <TextSkeleton width="70%" {...props} />
      <TextSkeleton width="100%" {...props} />
      <TextSkeleton width="40%" {...props} />
    </div>
  </div>
);

export const TableRowSkeleton: FC<SkeletonProps & { columns?: number }> = ({
  columns = 4,
  className = '',
  ...props
}) => (
  <div className={`flex space-x-4 ${className}`}>
    {Array.from({ length: columns }).map((_, index) => (
      <TextSkeleton
        key={index}
        width={`${100 / columns}%`}
        {...props}
      />
    ))}
  </div>
);

// Add shimmer animation to tailwind.config.js:
// module.exports = {
//   theme: {
//     extend: {
//       keyframes: {
//         shimmer: {
//           '0%': { backgroundPosition: '-1000px 0' },
//           '100%': { backgroundPosition: '1000px 0' },
//         },
//       },
//       animation: {
//         shimmer: 'shimmer 2s infinite linear',
//       },
//     },
//   },
// };

export default Skeleton;
