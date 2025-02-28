import { FC, useState, useRef, useEffect } from 'react';

interface TimePickerProps {
  value?: string;
  onChange?: (time: string | null) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  format?: '12h' | '24h';
  clearable?: boolean;
  step?: number;
  minTime?: string;
  maxTime?: string;
}

interface TimeOption {
  label: string;
  value: string;
}

export const TimePicker: FC<TimePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select time',
  label,
  error,
  disabled = false,
  className = '',
  format = '24h',
  clearable = true,
  step = 30,
  minTime,
  maxTime,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      setInputValue(formatTime(value));
    } else {
      setInputValue('');
    }
  }, [value, format]);

  const formatTime = (time: string): string => {
    try {
      const [hours, minutes] = time.split(':').map(Number);
      if (format === '12h') {
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
      }
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const parseTime = (timeString: string): string | null => {
    const timeRegex = format === '12h'
      ? /^(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i
      : /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;

    const match = timeString.match(timeRegex);
    if (!match) return null;

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);

    if (format === '12h' && match[3]) {
      const period = match[3].toUpperCase();
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
    }

    const timeValue = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    if (isValidTime(timeValue)) {
      return timeValue;
    }

    return null;
  };

  const isValidTime = (time: string): boolean => {
    if (!time) return false;
    if (minTime && time < minTime) return false;
    if (maxTime && time > maxTime) return false;
    return true;
  };

  const generateTimeOptions = (): TimeOption[] => {
    const options: TimeOption[] = [];
    const totalMinutes = 24 * 60;
    
    for (let i = 0; i < totalMinutes; i += step) {
      const hours = Math.floor(i / 60);
      const minutes = i % 60;
      const timeValue = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      if (!isValidTime(timeValue)) continue;

      options.push({
        value: timeValue,
        label: formatTime(timeValue),
      });
    }

    return options;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const time = parseTime(value);
    if (time) {
      onChange?.(time);
    }
  };

  const handleOptionClick = (option: TimeOption) => {
    setInputValue(option.label);
    onChange?.(option.value);
    setIsOpen(false);
    inputRef.current?.focus();
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

  const timeOptions = generateTimeOptions();

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
            onFocus={() => setIsOpen(true)}
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
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={handleClear}
              >
                ×
              </button>
            ) : (
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>
        </div>
        {isOpen && (
          <div
            className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {timeOptions.map((option) => (
              <div
                key={option.value}
                className={`
                  px-4 py-2 cursor-pointer hover:bg-gray-100
                  ${option.value === value ? 'bg-red-50 text-red-600' : ''}
                `}
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </div>
            ))}
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

export default TimePicker;
