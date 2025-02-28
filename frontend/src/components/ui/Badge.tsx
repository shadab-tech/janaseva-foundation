import { FC, ReactNode, MouseEvent } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  variant?: 'solid' | 'outline' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

export const Badge: FC<BadgeProps> = ({
  children,
  color = 'primary',
  variant = 'solid',
  size = 'md',
  rounded = 'full',
  className = '',
  icon,
  iconPosition = 'left',
  onClick,
  disabled = false,
}) => {
  const colorClasses = {
    primary: {
      solid: 'bg-blue-500 text-white',
      outline: 'border border-blue-500 text-blue-500',
      subtle: 'bg-blue-100 text-blue-800',
    },
    secondary: {
      solid: 'bg-gray-500 text-white',
      outline: 'border border-gray-500 text-gray-500',
      subtle: 'bg-gray-100 text-gray-800',
    },
    success: {
      solid: 'bg-green-500 text-white',
      outline: 'border border-green-500 text-green-500',
      subtle: 'bg-green-100 text-green-800',
    },
    warning: {
      solid: 'bg-yellow-500 text-white',
      outline: 'border border-yellow-500 text-yellow-500',
      subtle: 'bg-yellow-100 text-yellow-800',
    },
    error: {
      solid: 'bg-red-500 text-white',
      outline: 'border border-red-500 text-red-500',
      subtle: 'bg-red-100 text-red-800',
    },
    info: {
      solid: 'bg-blue-500 text-white',
      outline: 'border border-blue-500 text-blue-500',
      subtle: 'bg-blue-100 text-blue-800',
    },
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  return (
    <div
      className={`
        inline-flex items-center font-medium
        ${colorClasses[color][variant]}
        ${sizeClasses[size]}
        ${roundedClasses[rounded]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-1.5">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-1.5">{icon}</span>
      )}
    </div>
  );
};

export default Badge;
