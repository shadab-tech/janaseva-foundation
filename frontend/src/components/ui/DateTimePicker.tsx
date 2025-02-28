import { FC, useState, useEffect } from 'react';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | null) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  clearable?: boolean;
  timeFormat?: '12h' | '24h';
  timeStep?: number;
  minTime?: string;
  maxTime?: string;
  showWeekNumbers?: boolean;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  locale?: string;
}

export const DateTimePicker: FC<DateTimePickerProps> = ({
  value,
  onChange,
  label,
  error,
  disabled = false,
  className = '',
  minDate,
  maxDate,
  clearable = true,
  timeFormat = '24h',
  timeStep = 30,
  minTime,
  maxTime,
  showWeekNumbers = false,
  weekStartsOn = 1,
  locale = 'en-US',
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);
  const [selectedTime, setSelectedTime] = useState<string | null>(
    value ? `${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}` : null
  );

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setSelectedTime(`${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`);
    } else {
      setSelectedDate(null);
      setSelectedTime(null);
    }
  }, [value]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date && selectedTime) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes);
      onChange?.(newDate);
    } else if (!date) {
      onChange?.(null);
    }
  };

  const handleTimeChange = (time: string | null) => {
    setSelectedTime(time);
    if (selectedDate && time) {
      const [hours, minutes] = time.split(':').map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes);
      onChange?.(newDate);
    } else if (!time) {
      onChange?.(null);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="space-y-2">
        <DatePicker
          value={selectedDate || undefined}
          onChange={handleDateChange}
          placeholder="Select date"
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          clearable={clearable}
          showWeekNumbers={showWeekNumbers}
          weekStartsOn={weekStartsOn}
          locale={locale}
        />
        <TimePicker
          value={selectedTime || undefined}
          onChange={handleTimeChange}
          placeholder="Select time"
          disabled={disabled || !selectedDate}
          format={timeFormat}
          step={timeStep}
          minTime={minTime}
          maxTime={maxTime}
          clearable={clearable}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
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
export const formatDateTime = (date: Date, timeFormat: '12h' | '24h' = '24h', locale: string = 'en-US'): string => {
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const timeFormatter = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: timeFormat === '12h',
  });

  return `${dateFormatter.format(date)} ${timeFormatter.format(date)}`;
};

// Helper function to parse date and time string
export const parseDateTimeString = (dateTimeString: string, timeFormat: '12h' | '24h' = '24h'): Date | null => {
  try {
    const [datePart, timePart] = dateTimeString.split(' ');
    const [month, day, year] = datePart.split('/').map(Number);
    
    let hours = 0;
    let minutes = 0;
    
    if (timeFormat === '12h') {
      const [time, period] = timePart.split(' ');
      const [h, m] = time.split(':').map(Number);
      hours = h % 12 + (period.toUpperCase() === 'PM' ? 12 : 0);
      minutes = m;
    } else {
      const [h, m] = timePart.split(':').map(Number);
      hours = h;
      minutes = m;
    }

    const date = new Date(year, month - 1, day, hours, minutes);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    console.error('Error parsing date time string:', error);
    return null;
  }
};

export default DateTimePicker;
