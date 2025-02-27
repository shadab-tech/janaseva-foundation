import { FC, useState } from 'react';
import { Dropdown } from './Dropdown';
import { DatePicker } from './DatePicker';
import { TimePicker, formatTimeString } from './TimePicker';

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  minTime?: string;
  maxTime?: string;
  timeInterval?: number;
  timeFormat?: '12h' | '24h';
  placeholder?: string;
  className?: string;
  required?: boolean;
  name?: string;
}

export const DateTimePicker: FC<DateTimePickerProps> = ({
  value,
  onChange,
  label,
  error,
  disabled = false,
  minDate,
  maxDate,
  minTime = '00:00',
  maxTime = '23:59',
  timeInterval = 30,
  timeFormat = '12h',
  placeholder = 'Select date and time',
  className = '',
  required = false,
  name,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
  const [selectedTime, setSelectedTime] = useState<string>(
    value ? `${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}` : ''
  );

  const formatDateTime = (date?: Date, time?: string): string => {
    if (!date) return placeholder;
    
    const dateStr = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (!time) return dateStr;

    const timeStr = formatTimeString(time, timeFormat);
    return `${dateStr} at ${timeStr}`;
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    
    if (selectedTime) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes);
      onChange?.(newDate);
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    
    if (selectedDate) {
      const [hours, minutes] = time.split(':').map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes);
      onChange?.(newDate);
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
        {formatDateTime(selectedDate, selectedTime)}
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
          <div className="space-y-4">
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              minDate={minDate}
              maxDate={maxDate}
              disabled={disabled}
            />
            <TimePicker
              value={selectedTime}
              onChange={handleTimeChange}
              minTime={minTime}
              maxTime={maxTime}
              interval={timeInterval}
              format={timeFormat}
              disabled={disabled || !selectedDate}
            />
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

// Helper function to combine date and time
export const combineDateAndTime = (date: Date, time: string): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes);
  return result;
};

// Helper function to format date and time
export const formatDateTime = (
  date: Date,
  timeFormat: '12h' | '24h' = '12h'
): string => {
  const dateStr = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeStr = formatTimeString(
    `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
    timeFormat
  );

  return `${dateStr} at ${timeStr}`;
};

export default DateTimePicker;
