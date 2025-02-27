import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              shadow appearance-none border rounded w-full py-2 px-3
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-red-500' : 'border-gray-300'}
              text-gray-700 leading-tight focus:outline-none focus:shadow-outline
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-red-500 text-xs italic mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
