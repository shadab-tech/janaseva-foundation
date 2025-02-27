import { FC, useMemo } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from './Dropdown';

interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  minTime?: string;
  maxTime?: string;
  interval?: number;
  format?: '12h' | '24h';
  placeholder?: string;
  className?: string;
  required?: boolean;
  name?: string;
}

export const TimePicker: FC<TimePickerProps> = ({
  value,
  onChange,
  label,
  error,
  disabled = false,
  minTime = '00:00',
  maxTime = '23:59',
  interval = 30,
  format = '12h',
  placeholder = 'Select time',
  className = '',
  required = false,
  name,
}) => {
  // Generate time slots
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    const [minHour, minMinute] = minTime.split(':').map(Number);
    const [maxHour, maxMinute] = maxTime.split(':').map(Number);
    
    const startMinutes = minHour * 60 + minMinute;
    const endMinutes = maxHour * 60 + maxMinute;
    
    for (let minutes = startMinutes; minutes <= endMinutes; minutes += interval) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(time24);
    }
    
    return slots;
  }, [minTime, maxTime, interval]);

  // Format time for display
  const formatTime = (time: string): string => {
    if (!time) return '';
    
    const [hour, minute] = time.split(':').map(Number);
    
    if (format === '12h') {
      const period = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
    }
    
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const handleSelect = (time: string) => {
    onChange?.(time);
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
        {value ? formatTime(value) : placeholder}
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
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
        width="trigger"
        className={disabled ? 'pointer-events-none' : ''}
      >
        <DropdownMenu className="max-h-60 overflow-auto py-1">
          {timeSlots.map((time) => (
            <DropdownItem
              key={time}
              onClick={() => handleSelect(time)}
              className={time === value ? 'bg-red-50 text-red-600' : ''}
            >
              {formatTime(time)}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {name && value && (
        <input
          type="hidden"
          name={name}
          value={value}
        />
      )}
    </div>
  );
};

// Helper function to check if a time is within a range
export const isTimeInRange = (
  time: string,
  minTime: string,
  maxTime: string
): boolean => {
  const [timeHour, timeMinute] = time.split(':').map(Number);
  const [minHour, minMinute] = minTime.split(':').map(Number);
  const [maxHour, maxMinute] = maxTime.split(':').map(Number);

  const timeMinutes = timeHour * 60 + timeMinute;
  const minMinutes = minHour * 60 + minMinute;
  const maxMinutes = maxHour * 60 + maxMinute;

  return timeMinutes >= minMinutes && timeMinutes <= maxMinutes;
};

// Helper function to format time string
export const formatTimeString = (time: string, format: '12h' | '24h' = '12h'): string => {
  const [hour, minute] = time.split(':').map(Number);
  
  if (format === '12h') {
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
  }
  
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

export default TimePicker;
