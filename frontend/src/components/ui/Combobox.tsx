import { FC, useState, useRef, useEffect } from 'react';
import { Portal } from './Portal';

interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  onInputChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  loading?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  creatable?: boolean;
  onCreate?: (value: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  maxHeight?: number;
  noOptionsMessage?: string;
  loadingMessage?: string;
  createMessage?: string;
}

export const Combobox: FC<ComboboxProps> = ({
  options,
  value,
  onChange,
  onInputChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
  loading = false,
  clearable = true,
  searchable = true,
  creatable = false,
  onCreate,
  className = '',
  size = 'md',
  maxHeight = 300,
  noOptionsMessage = 'No options available',
  loadingMessage = 'Loading...',
  createMessage = 'Create option',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sizeStyles = {
    sm: 'py-1 px-2 text-sm',
    md: 'py-2 px-3 text-base',
    lg: 'py-3 px-4 text-lg',
  };

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    const updateDropdownPosition = () => {
      if (containerRef.current && isOpen) {
        const rect = containerRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    };

    updateDropdownPosition();
    window.addEventListener('scroll', updateDropdownPosition);
    window.addEventListener('resize', updateDropdownPosition);

    return () => {
      window.removeEventListener('scroll', updateDropdownPosition);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !containerRef.current?.contains(event.target as Node) &&
        !dropdownRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onInputChange?.(value);
    if (!isOpen) setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setSelectedIndex(prev =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredOptions.length) {
          const option = filteredOptions[selectedIndex];
          if (!option.disabled) {
            onChange?.(option.value);
            setIsOpen(false);
          }
        } else if (creatable && searchTerm) {
          onCreate?.(searchTerm);
          setIsOpen(false);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;

      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.('');
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const renderOption = (option: ComboboxOption, index: number) => {
    const isSelected = option.value === value;
    const isHighlighted = index === selectedIndex;

    return (
      <div
        key={option.value}
        className={`
          px-3 py-2 cursor-pointer flex items-center
          ${isHighlighted ? 'bg-gray-100' : ''}
          ${isSelected ? 'bg-red-50 text-red-600' : 'text-gray-900'}
          ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
        `}
        onClick={() => {
          if (!option.disabled) {
            onChange?.(option.value);
            setIsOpen(false);
          }
        }}
      >
        {option.label}
      </div>
    );
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div ref={containerRef}>
        <div
          className={`
            relative rounded-md shadow-sm
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
          onClick={() => {
            if (!disabled) {
              setIsOpen(!isOpen);
              if (!isOpen) {
                inputRef.current?.focus();
              }
            }
          }}
        >
          <input
            ref={inputRef}
            type="text"
            className={`
              block w-full rounded-md border-gray-300
              focus:border-red-500 focus:ring-red-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${sizeStyles[size]}
            `}
            value={searchable ? searchTerm : selectedOption?.label || ''}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={!searchable}
          />

          {clearable && value && !disabled && (
            <button
              type="button"
              className="absolute inset-y-0 right-8 flex items-center pr-2"
              onClick={handleClear}
            >
              <svg
                className="h-5 w-5 text-gray-400 hover:text-gray-500"
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
            </button>
          )}

          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform ${
                isOpen ? 'transform rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {isOpen && (
        <Portal containerId="combobox-root">
          <div
            ref={dropdownRef}
            className="z-50 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 absolute"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              maxHeight,
              overflowY: 'auto',
            }}
          >
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                {loadingMessage}
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                {searchTerm && creatable ? (
                  <button
                    className="w-full text-left hover:text-red-600"
                    onClick={() => {
                      onCreate?.(searchTerm);
                      setIsOpen(false);
                    }}
                  >
                    {createMessage}: {searchTerm}
                  </button>
                ) : (
                  noOptionsMessage
                )}
              </div>
            ) : (
              filteredOptions.map((option, index) => renderOption(option, index))
            )}
          </div>
        </Portal>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Combobox;
