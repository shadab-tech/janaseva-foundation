import { FC, ReactNode, MouseEvent } from 'react';

interface ChipProps {
  label: string;
  variant?: 'filled' | 'outlined';
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  avatar?: ReactNode;
  onDelete?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  deleteIcon?: ReactNode;
  selected?: boolean;
  clickable?: boolean;
  loading?: boolean;
  tooltip?: string;
}

export const Chip: FC<ChipProps> = ({
  label,
  variant = 'filled',
  color = 'default',
  size = 'md',
  icon,
  avatar,
  onDelete,
  onClick,
  disabled = false,
  className = '',
  deleteIcon,
  selected = false,
  clickable = false,
  loading = false,
  tooltip,
}) => {
  const baseStyles = 'inline-flex items-center rounded-full font-medium transition-colors';

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const variantStyles = {
    filled: {
      default: `
        bg-gray-100 text-gray-700
        ${selected ? 'bg-gray-200' : ''}
        ${!disabled && (clickable || onClick) ? 'hover:bg-gray-200' : ''}
      `,
      primary: `
        bg-red-100 text-red-700
        ${selected ? 'bg-red-200' : ''}
        ${!disabled && (clickable || onClick) ? 'hover:bg-red-200' : ''}
      `,
      success: `
        bg-green-100 text-green-700
        ${selected ? 'bg-green-200' : ''}
        ${!disabled && (clickable || onClick) ? 'hover:bg-green-200' : ''}
      `,
      warning: `
        bg-yellow-100 text-yellow-700
        ${selected ? 'bg-yellow-200' : ''}
        ${!disabled && (clickable || onClick) ? 'hover:bg-yellow-200' : ''}
      `,
      danger: `
        bg-red-100 text-red-700
        ${selected ? 'bg-red-200' : ''}
        ${!disabled && (clickable || onClick) ? 'hover:bg-red-200' : ''}
      `,
    },
    outlined: {
      default: `
        border border-gray-300 text-gray-700
        ${selected ? 'bg-gray-50' : ''}
        ${!disabled && (clickable || onClick) ? 'hover:bg-gray-50' : ''}
      `,
      primary: `
        border border-red-300 text-red-700
        ${selected ? 'bg-red-50' : ''}
        ${!disabled && (clickable || onClick) ? 'hover:bg-red-50' : ''}
      `,
      success: `
        border border-green-300 text-green-700
        ${selected ? 'bg-green-50' : ''}
        ${!disabled && (clickable || onClick) ? 'hover:bg-green-50' : ''}
      `,
      warning: `
        border border-yellow-300 text-yellow-700
        ${selected ? 'bg-yellow-50' : ''}
        ${!disabled && (clickable || onClick) ? 'hover:bg-yellow-50' : ''}
      `,
      danger: `
        border border-red-300 text-red-700
        ${selected ? 'bg-red-50' : ''}
        ${!disabled && (clickable || onClick) ? 'hover:bg-red-50' : ''}
      `,
    },
  };

  const iconSizeStyles = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const avatarSizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    if (!disabled && !loading && onDelete) {
      onDelete();
    }
  };

  const DefaultDeleteIcon = () => (
    <svg
      className={`${iconSizeStyles[size]} ml-1`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  const LoadingSpinner = () => (
    <svg
      className={`${iconSizeStyles[size]} animate-spin ml-1`}
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

  return (
    <div
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant][color]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${!disabled && (clickable || onClick) ? 'cursor-pointer' : ''}
        ${loading ? 'opacity-75' : ''}
        ${className}
      `}
      onClick={handleClick}
      role={onClick || clickable ? 'button' : undefined}
      title={tooltip}
    >
      {avatar && (
        <span className={`-ml-1 mr-2 ${avatarSizeStyles[size]}`}>
          {avatar}
        </span>
      )}
      {icon && !avatar && (
        <span className={`-ml-0.5 mr-1.5 ${iconSizeStyles[size]}`}>
          {icon}
        </span>
      )}
      {label}
      {loading && <LoadingSpinner />}
      {onDelete && !disabled && !loading && (
        <button
          type="button"
          onClick={handleDelete}
          className={`
            -mr-1 ml-1 p-0.5 hover:bg-black/10 rounded-full
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
          `}
          aria-label="Remove"
        >
          {deleteIcon || <DefaultDeleteIcon />}
        </button>
      )}
    </div>
  );
};

// Helper components for common chip variants
export const FilterChip: FC<Omit<ChipProps, 'variant' | 'selected' | 'clickable'>> = (props) => (
  <Chip {...props} variant="outlined" clickable selected={props.onClick !== undefined} />
);

export const InputChip: FC<Omit<ChipProps, 'variant' | 'clickable'>> = (props) => (
  <Chip {...props} variant="outlined" onDelete={props.onDelete} />
);

export const ActionChip: FC<Omit<ChipProps, 'variant' | 'clickable'>> = (props) => (
  <Chip {...props} variant="filled" clickable />
);

export const StatusChip: FC<Omit<ChipProps, 'variant' | 'clickable' | 'color'> & {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'error';
}> = ({ status, ...props }) => {
  const statusConfig = {
    active: { color: 'success' as const, icon: '●' },
    inactive: { color: 'default' as const, icon: '○' },
    pending: { color: 'warning' as const, icon: '◐' },
    completed: { color: 'success' as const, icon: '✓' },
    error: { color: 'danger' as const, icon: '✕' },
  };

  return (
    <Chip
      {...props}
      variant="filled"
      color={statusConfig[status].color}
      icon={statusConfig[status].icon}
    />
  );
};

export default Chip;
