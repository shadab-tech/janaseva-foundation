import { FC, useEffect, useState, useRef } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from './Dropdown';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  className?: string;
  required?: boolean;
  name?: string;
}

export const Select: FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
  searchable = false,
  clearable = false,
  className = '',
  required = false,
  name,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectedOption = options.find(option => option.value === value);

  // Filter options based on search query
  const filteredOptions = searchable && searchQuery
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleSelect = (option: Option) => {
    if (option.disabled) return;
    onChange?.(option.value);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.('');
    setSearchQuery('');
  };

  const trigger = (
    <div
      className={`
        relative w-full cursor-default rounded-md border bg-white py-2 pl-3 pr-10
        text-left shadow-sm focus:border-red-500 focus:outline-none focus:ring-1
        focus:ring-red-500 sm:text-sm
        ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
        ${error ? 'border-red-500' : 'border-gray-300'}
        ${className}
      `}
    >
      <span className="block truncate">
        {selectedOption ? selectedOption.label : placeholder}
      </span>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        {clearable && value && !disabled ? (
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-5 w-5"
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
        ) : (
          <svg
            className="h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>
    </div>
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Dropdown
        trigger={trigger}
        width="trigger"
        closeOnClick={false}
        className={disabled ? 'pointer-events-none' : ''}
      >
        <DropdownMenu className="max-h-60 overflow-auto">
          {searchable && (
            <div className="sticky top-0 p-2 bg-white border-b">
              <input
                ref={searchInputRef}
                type="text"
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              No options found
            </div>
          ) : (
            filteredOptions.map((option) => (
              <DropdownItem
                key={option.value}
                onClick={() => handleSelect(option)}
                disabled={option.disabled}
                className={
                  option.value === value ? 'bg-red-50 text-red-600' : ''
                }
              >
                {option.label}
              </DropdownItem>
            ))
          )}
        </DropdownMenu>
      </Dropdown>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {name && (
        <input
          type="hidden"
          name={name}
          value={value || ''}
        />
      )}
    </div>
  );
};

export default Select;
