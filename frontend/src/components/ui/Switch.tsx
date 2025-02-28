import { FC, useId } from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
  color?: string;
  labelPosition?: 'left' | 'right';
  description?: string;
}

export const Switch: FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  className = '',
  color = 'bg-red-600',
  labelPosition = 'right',
  description,
}) => {
  const id = useId();

  const sizeClasses = {
    sm: {
      switch: 'w-8 h-4',
      thumb: 'h-3 w-3',
      translate: 'translate-x-4',
      text: 'text-sm',
    },
    md: {
      switch: 'w-11 h-6',
      thumb: 'h-5 w-5',
      translate: 'translate-x-5',
      text: 'text-base',
    },
    lg: {
      switch: 'w-14 h-8',
      thumb: 'h-7 w-7',
      translate: 'translate-x-6',
      text: 'text-lg',
    },
  };

  const labelContent = label && (
    <div>
      <span className={`font-medium text-gray-900 ${sizeClasses[size].text}`}>
        {label}
      </span>
      {description && (
        <p className={`text-gray-500 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {description}
        </p>
      )}
    </div>
  );

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={`
          relative inline-flex items-center gap-3
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
      >
        {labelPosition === 'left' && labelContent}
        
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            className="sr-only peer"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
          />
          <div
            className={`
              ${sizeClasses[size].switch}
              ${checked ? color : 'bg-gray-200'}
              rounded-full
              transition-colors duration-200 ease-in-out
              peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-${color}/20
            `}
          />
          <div
            className={`
              ${sizeClasses[size].thumb}
              absolute left-0.5 top-0.5
              bg-white rounded-full shadow-sm
              transition-transform duration-200 ease-in-out
              ${checked ? sizeClasses[size].translate : 'translate-x-0'}
            `}
          />
        </div>

        {labelPosition === 'right' && labelContent}
      </label>
    </div>
  );
};

export default Switch;
