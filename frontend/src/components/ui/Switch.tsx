import { FC, InputHTMLAttributes } from 'react';

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  labelPosition?: 'left' | 'right';
  error?: string;
  loading?: boolean;
}

export const Switch: FC<SwitchProps> = ({
  label,
  description,
  size = 'md',
  variant = 'primary',
  labelPosition = 'right',
  error,
  loading = false,
  disabled,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: {
      switch: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
      text: 'text-sm',
    },
    md: {
      switch: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
      text: 'text-base',
    },
    lg: {
      switch: 'w-14 h-8',
      thumb: 'w-7 h-7',
      translate: 'translate-x-6',
      text: 'text-lg',
    },
  };

  const variantStyles = {
    primary: {
      active: 'bg-red-600',
      inactive: 'bg-gray-200',
    },
    secondary: {
      active: 'bg-gray-600',
      inactive: 'bg-gray-200',
    },
    success: {
      active: 'bg-green-600',
      inactive: 'bg-gray-200',
    },
    warning: {
      active: 'bg-yellow-600',
      inactive: 'bg-gray-200',
    },
    danger: {
      active: 'bg-red-600',
      inactive: 'bg-gray-200',
    },
  };

  const isDisabled = disabled || loading;

  const renderSwitch = () => (
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only peer"
        disabled={isDisabled}
        {...props}
      />
      <div
        className={`
          ${sizeStyles[size].switch}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${variantStyles[variant].inactive}
          peer-checked:${variantStyles[variant].active}
          peer-focus:outline-none
          peer-focus:ring-2
          peer-focus:ring-offset-2
          peer-focus:ring-${variant === 'primary' ? 'red' : variant}-500
          rounded-full
          transition-colors
        `}
      >
        <div
          className={`
            ${sizeStyles[size].thumb}
            ${loading ? 'animate-pulse' : ''}
            absolute left-0.5 top-0.5
            bg-white rounded-full
            transition-transform duration-200
            peer-checked:${sizeStyles[size].translate}
          `}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderLabel = () => {
    if (!label && !description) return null;

    return (
      <div className="flex flex-col">
        {label && (
          <span className={`font-medium ${sizeStyles[size].text} ${isDisabled ? 'opacity-50' : ''}`}>
            {label}
          </span>
        )}
        {description && (
          <span className={`text-gray-500 ${sizeStyles[size].text === 'text-sm' ? 'text-xs' : 'text-sm'} ${isDisabled ? 'opacity-50' : ''}`}>
            {description}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      <label className={`inline-flex items-center ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
        {labelPosition === 'left' && (
          <span className="mr-3">{renderLabel()}</span>
        )}
        {renderSwitch()}
        {labelPosition === 'right' && (
          <span className="ml-3">{renderLabel()}</span>
        )}
      </label>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Switch Group Component
interface SwitchGroupProps {
  label?: string;
  children: React.ReactNode;
  error?: string;
  className?: string;
  horizontal?: boolean;
}

export const SwitchGroup: FC<SwitchGroupProps> = ({
  label,
  children,
  error,
  className = '',
  horizontal = false,
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className={`space-${horizontal ? 'x' : 'y'}-4 ${horizontal ? 'flex items-center' : ''}`}>
        {children}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Switch;
