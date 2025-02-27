import { FC, useState, useMemo } from 'react';

interface CalendarProps {
  value?: Date | Date[];
  onChange?: (date: Date | Date[]) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  highlightedDates?: Date[];
  mode?: 'single' | 'multiple' | 'range';
  className?: string;
  showWeekNumbers?: boolean;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  locale?: string;
  monthsToDisplay?: number;
  onMonthChange?: (date: Date) => void;
}

export const Calendar: FC<CalendarProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabledDates = [],
  highlightedDates = [],
  mode = 'single',
  className = '',
  showWeekNumbers = false,
  weekStartsOn = 1,
  locale = 'en-US',
  monthsToDisplay = 1,
  onMonthChange,
}) => {
  const [currentDate, setCurrentDate] = useState(
    Array.isArray(value) ? value[0] : value || new Date()
  );
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const DAYS = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return [...days.slice(weekStartsOn), ...days.slice(0, weekStartsOn)].map(day => day.slice(0, 2));
  }, [weekStartsOn]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return (firstDay - weekStartsOn + 7) % 7;
  };

  const getWeekNumber = (date: Date) => {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return disabledDates.some(
      disabledDate =>
        disabledDate.getFullYear() === date.getFullYear() &&
        disabledDate.getMonth() === date.getMonth() &&
        disabledDate.getDate() === date.getDate()
    );
  };

  const isDateHighlighted = (date: Date) => {
    return highlightedDates.some(
      highlightedDate =>
        highlightedDate.getFullYear() === date.getFullYear() &&
        highlightedDate.getMonth() === date.getMonth() &&
        highlightedDate.getDate() === date.getDate()
    );
  };

  const isDateSelected = (date: Date) => {
    if (!value) return false;
    if (Array.isArray(value)) {
      if (mode === 'range' && value.length === 2) {
        return date >= value[0] && date <= value[1];
      }
      return value.some(
        selectedDate =>
          selectedDate.getFullYear() === date.getFullYear() &&
          selectedDate.getMonth() === date.getMonth() &&
          selectedDate.getDate() === date.getDate()
      );
    }
    return (
      value.getFullYear() === date.getFullYear() &&
      value.getMonth() === date.getMonth() &&
      value.getDate() === date.getDate()
    );
  };

  const isDateInRange = (date: Date) => {
    if (mode !== 'range' || !Array.isArray(value) || value.length !== 1 || !hoverDate) {
      return false;
    }
    const start = value[0] < hoverDate ? value[0] : hoverDate;
    const end = value[0] < hoverDate ? hoverDate : value[0];
    return date > start && date < end;
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (mode === 'single') {
      onChange?.(date);
    } else if (mode === 'multiple') {
      const newDates = Array.isArray(value) ? [...value] : [];
      const dateIndex = newDates.findIndex(
        d =>
          d.getFullYear() === date.getFullYear() &&
          d.getMonth() === date.getMonth() &&
          d.getDate() === date.getDate()
      );
      if (dateIndex === -1) {
        newDates.push(date);
      } else {
        newDates.splice(dateIndex, 1);
      }
      onChange?.(newDates);
    } else if (mode === 'range') {
      if (!Array.isArray(value) || value.length === 2 || value.length === 0) {
        onChange?.([date]);
      } else {
        const [start] = value;
        const end = date;
        onChange?.([start, end].sort((a, b) => a.getTime() - b.getTime()));
      }
    }
  };

  const handleMonthChange = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
    onMonthChange?.(newDate);
  };

  const renderMonth = (monthOffset: number = 0) => {
    const monthDate = new Date(currentDate);
    monthDate.setMonth(monthDate.getMonth() + monthOffset);

    const daysInMonth = getDaysInMonth(monthDate);
    const firstDayOfMonth = getFirstDayOfMonth(monthDate);
    const days: (Date | null)[] = [];

    // Add empty days for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), i));
    }

    return (
      <div key={monthOffset} className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {monthDate.toLocaleString(locale, { month: 'long', year: 'numeric' })}
          </h2>
          {monthOffset === 0 && monthsToDisplay === 1 && (
            <div className="flex gap-1">
              <button
                onClick={() => handleMonthChange(-1)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ←
              </button>
              <button
                onClick={() => handleMonthChange(1)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                →
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {showWeekNumbers && <div className="text-xs text-gray-500 h-8" />}
          {DAYS.map(day => (
            <div key={day} className="text-xs text-gray-500 h-8 flex items-center justify-center">
              {day}
            </div>
          ))}

          {days.map((date, index) => {
            if (!date) {
              return (
                <div
                  key={`empty-${index}`}
                  className="h-10"
                />
              );
            }

            const isDisabled = isDateDisabled(date);
            const isSelected = isDateSelected(date);
            const isHighlighted = isDateHighlighted(date);
            const isInRange = isDateInRange(date);

            return (
              <div
                key={date.toISOString()}
                className={`
                  relative h-10 flex items-center justify-center
                  ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}
                  ${isSelected ? 'bg-red-500 text-white hover:bg-red-600' : ''}
                  ${isHighlighted ? 'font-bold' : ''}
                  ${isInRange ? 'bg-red-100' : ''}
                `}
                onClick={() => handleDateClick(date)}
                onMouseEnter={() => mode === 'range' && setHoverDate(date)}
                onMouseLeave={() => mode === 'range' && setHoverDate(null)}
              >
                {showWeekNumbers && index % 7 === 0 && (
                  <span className="absolute -left-8 text-xs text-gray-500">
                    {getWeekNumber(date)}
                  </span>
                )}
                {date.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`inline-flex bg-white rounded-lg shadow ${className}`}>
      {Array.from({ length: monthsToDisplay }).map((_, index) => renderMonth(index))}
    </div>
  );
};

export default Calendar;
