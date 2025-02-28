import { FC, useState, useRef, useEffect } from 'react';
import Calendar from './Calendar';

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  clearable?: boolean;
  showWeekNumbers?: boolean;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  locale?: string;
}

const CalendarIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const ClearButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    className="text-gray-400 hover:text-gray-500"
    onClick={onClick}
  >
    ×
  </button>
);

export const DatePicker: FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date',
  label,
  error,
  disabled = false,
  className = '',
  minDate,
  maxDate,
  clearable = true,
  showWeekNumbers = false,
  weekStartsOn = 1,
  locale = 'en-US',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      setInputValue(formatDate(value));
    } else {
      setInputValue('');
    }
  }, [value]);

  const formatDate = (date: Date): string => {
    try {
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const parseDate = (dateString: string): Date | null => {
    const parts = dateString.split(/[/.-]/);
    if (parts.length === 3) {
      const month = parseInt(parts[0]) - 1;
      const day = parseInt(parts[1]);
      const year = parseInt(parts[2]);
      const date = new Date(year, month, day);
      if (isValidDate(date)) {
        return date;
      }
    }
    return null;
  };

  const isValidDate = (date: Date): boolean => {
    if (!date || isNaN(date.getTime())) return false;
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const date = parseDate(value);
    if (date && isValidDate(date)) {
      onChange?.(date);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleCalendarSelect = (selectedDate: Date | Date[]) => {
    if (selectedDate instanceof Date) {
      onChange?.(selectedDate);
      setIsOpen(false);
      inputRef.current?.focus();
    }
  };

  const handleClear = () => {
    setInputValue('');
    onChange?.(null);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={className} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full rounded-md border-gray-300 shadow-sm
              focus:border-red-500 focus:ring-red-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-red-300' : ''}
              pr-10
            `}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {clearable && inputValue ? (
              <ClearButton onClick={handleClear} />
            ) : (
              <CalendarIcon />
            )}
          </div>
        </div>
        {isOpen && (
          <div
            className="absolute z-10 mt-2 bg-white rounded-md shadow-lg"
            style={{ minWidth: inputRef.current?.offsetWidth }}
          >
            <Calendar
              value={value}
              onChange={handleCalendarSelect}
              minDate={minDate}
              maxDate={maxDate}
              showWeekNumbers={showWeekNumbers}
              weekStartsOn={weekStartsOn}
              locale={locale}
            />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default DatePicker;
