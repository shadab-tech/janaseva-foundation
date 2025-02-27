import { FC, ReactNode } from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children?: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  dot?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Badge: FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  dot = false,
  className = '',
  onClick,
}) => {
  const baseStyles = 'inline-flex items-center font-medium';

  const variantStyles: Record<BadgeVariant, string> = {
    primary: 'bg-red-100 text-red-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  const dotSizeStyles: Record<BadgeSize, string> = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-2.5 w-2.5',
  };

  const dotStyles = dot
    ? `mr-1.5 relative flex-shrink-0 rounded-full ${dotSizeStyles[size]}`
    : '';

  const dotColorStyles: Record<BadgeVariant, string> = {
    primary: 'bg-red-400',
    secondary: 'bg-gray-400',
    success: 'bg-green-400',
    danger: 'bg-red-400',
    warning: 'bg-yellow-400',
    info: 'bg-blue-400',
  };

  return (
    <span
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${rounded ? 'rounded-full' : 'rounded'}
        ${onClick ? 'cursor-pointer hover:bg-opacity-75' : ''}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {dot && (
        <span
          className={`${dotStyles} ${dotColorStyles[variant]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

// Status Badge Component
interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'error';
  size?: BadgeSize;
  className?: string;
}

export const StatusBadge: FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const statusConfig: Record<StatusBadgeProps['status'], { variant: BadgeVariant; label: string }> = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'secondary', label: 'Inactive' },
    pending: { variant: 'warning', label: 'Pending' },
    completed: { variant: 'success', label: 'Completed' },
    cancelled: { variant: 'danger', label: 'Cancelled' },
    error: { variant: 'danger', label: 'Error' },
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      size={size}
      dot
      rounded
      className={className}
    >
      {config.label}
    </Badge>
  );
};

// Count Badge Component
interface CountBadgeProps {
  count: number;
  max?: number;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

export const CountBadge: FC<CountBadgeProps> = ({
  count,
  max = 99,
  variant = 'primary',
  size = 'sm',
  className = '',
}) => {
  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge
      variant={variant}
      size={size}
      rounded
      className={`min-w-[1.5em] justify-center ${className}`}
    >
      {displayCount}
    </Badge>
  );
};

// Notification Badge Component
interface NotificationBadgeProps {
  count?: number;
  dot?: boolean;
  max?: number;
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
}

export const NotificationBadge: FC<NotificationBadgeProps> = ({
  count,
  dot = false,
  max = 99,
  variant = 'danger',
  className = '',
  children,
}) => {
  return (
    <div className="relative inline-flex">
      {children}
      {dot ? (
        <Badge
          variant={variant}
          size="sm"
          className="absolute -top-1 -right-1 h-2 w-2 p-0"
        >
          <span className="sr-only">Notification indicator</span>
        </Badge>
      ) : count ? (
        <CountBadge
          count={count}
          max={max}
          variant={variant}
          size="sm"
          className={`absolute -top-1 -right-1 ${className}`}
        />
      ) : null}
    </div>
  );
};

// Dot Badge Component
interface DotBadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  pulse?: boolean;
}

export const DotBadge: FC<DotBadgeProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  pulse = false,
}) => {
  return (
    <Badge
      variant={variant}
      size={size}
      className={`
        p-0 flex-shrink-0 rounded-full
        ${pulse ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      <span className="sr-only">Status indicator</span>
    </Badge>
  );
};

export default Badge;
