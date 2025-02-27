import { FC, useState } from 'react';
import { Dropdown } from './Dropdown';

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  className?: string;
  required?: boolean;
  name?: string;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DatePicker: FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  error,
  disabled = false,
  minDate,
  maxDate,
  placeholder = 'Select date',
  className = '',
  required = false,
  name,
}) => {
  const [currentDate, setCurrentDate] = useState(value || new Date());

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date): boolean => {
    return value
      ? date.getDate() === value.getDate() &&
          date.getMonth() === value.getMonth() &&
          date.getFullYear() === value.getFullYear()
      : false;
  };

  const isDisabled = (date: Date): boolean => {
    if (disabled) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getCalendarDays = (): Date[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = getDaysInMonth(year, month);
    const days: Date[] = [];

    // Add previous month's days
    for (let i = 0; i < firstDay.getDay(); i++) {
      const date = new Date(year, month, -i);
      days.unshift(date);
    }

    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    // Add next month's days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleSelectDate = (date: Date) => {
    if (!isDisabled(date)) {
      onChange?.(date);
    }
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
        {value ? formatDate(value) : placeholder}
      </span>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
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
        width={320}
        closeOnClick={false}
        className={disabled ? 'pointer-events-none' : ''}
      >
        <div className="p-2" onClick={(e) => e.stopPropagation()}>
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-sm font-medium">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 py-1"
              >
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {getCalendarDays().map((date, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectDate(date)}
                disabled={isDisabled(date)}
                className={`
                  text-sm p-2 rounded-full
                  ${date.getMonth() === currentDate.getMonth()
                    ? 'text-gray-900'
                    : 'text-gray-400'
                  }
                  ${isToday(date) && !isSelected(date)
                    ? 'border border-red-500'
                    : ''
                  }
                  ${isSelected(date)
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'hover:bg-gray-100'
                  }
                  ${isDisabled(date)
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer'
                  }
                `}
              >
                {date.getDate()}
              </button>
            ))}
          </div>
        </div>
      </Dropdown>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {name && value && (
        <input
          type="hidden"
          name={name}
          value={value.toISOString()}
        />
      )}
    </div>
  );
};

export default DatePicker;
