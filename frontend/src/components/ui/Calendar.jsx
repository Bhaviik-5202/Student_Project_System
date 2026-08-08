import { useState, memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = memo(({ onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarData = useMemo(() => {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array(firstDayOfMonth).fill(null);

    return { days, emptyDays, daysInMonth };
  }, [currentDate]);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  }, [currentDate]);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  }, [currentDate]);

  const handleDateClick = useCallback(
    (day) => {
      if (onDateClick) {
        onDateClick(
          new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        );
      }
    },
    [currentDate, onDateClick]
  );

  const monthYear = useMemo(
    () =>
      currentDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
    [currentDate]
  );

  const daysOfWeek = useMemo(
    () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    []
  );

  return (
    <div className='w-72 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl shadow-gray-200/50 dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/50 sm:w-80'>
      {/* Calendar Header */}
      <div className='mb-4 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-700'>
        <button
          onClick={handlePrevMonth}
          className='flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400'
          aria-label='Previous month'
          title='Previous month'
        >
          <ChevronLeft className='h-4 w-4' />
        </button>
        <h3 className='text-sm font-semibold text-gray-900 dark:text-white'>
          {monthYear}
        </h3>
        <button
          onClick={handleNextMonth}
          className='flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400'
          aria-label='Next month'
          title='Next month'
        >
          <ChevronRight className='h-4 w-4' />
        </button>
      </div>

      {/* Days of Week Header */}
      <div className='mb-2 grid grid-cols-7 gap-1'>
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className='py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400'
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className='grid grid-cols-7 gap-1'>
        {calendarData.emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className='h-9 w-9 sm:h-10 sm:w-10' />
        ))}
        {calendarData.days.map((day) => {
          const isToday =
            day === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear();

          return (
            <button
              key={day}
              className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-sm transition-all sm:h-10 sm:w-10 ${
                isToday
                  ? 'bg-blue-600 font-semibold text-white shadow-md shadow-blue-500/30 hover:bg-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400'
              }`}
              onClick={() => handleDateClick(day)}
              aria-label={`${day} ${monthYear}`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Quick Actions Footer */}
      <div className='mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700'>
        <button
          onClick={() => {
            setCurrentDate(new Date());
            if (onDateClick) onDateClick(new Date());
          }}
          className='text-xs font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
        >
          Today
        </button>
        <span className='text-xs text-gray-500 dark:text-gray-400'>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
});

Calendar.displayName = 'Calendar';

Calendar.propTypes = {
  onDateClick: PropTypes.func,
};

export default Calendar;
