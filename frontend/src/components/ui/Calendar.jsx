import { useState, memo, useCallback, useMemo } from "react";
import PropTypes from "prop-types";

const Calendar = memo(({ onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarData = useMemo(() => {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    ).getDate();

    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    ).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array(firstDayOfMonth).fill(null);

    return { days, emptyDays, daysInMonth };
  }, [currentDate]);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  }, [currentDate]);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  }, [currentDate]);

  const handleDateClick = useCallback(
    (day) => {
      if (onDateClick) {
        onDateClick(
          new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
        );
      }
    },
    [currentDate, onDateClick],
  );

  const monthYear = useMemo(
    () =>
      currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [currentDate],
  );

  const daysOfWeek = useMemo(
    () => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    [],
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 w-72 sm:w-80">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
        <button
          onClick={handlePrevMonth}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          aria-label="Previous month"
          title="Previous month"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {monthYear}
        </h3>
        <button
          onClick={handleNextMonth}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          aria-label="Next month"
          title="Next month"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarData.emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="w-9 h-9 sm:w-10 sm:h-10" />
        ))}
        {calendarData.days.map((day) => {
          const isToday =
            day === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear();

          return (
            <button
              key={day}
              className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-sm rounded-lg transition-all cursor-pointer
                ${
                  isToday
                    ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/30 hover:bg-blue-700"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
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
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <button
          onClick={() => {
            setCurrentDate(new Date());
            if (onDateClick) onDateClick(new Date());
          }}
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          Today
        </button>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
});

Calendar.displayName = "Calendar";

Calendar.propTypes = {
  onDateClick: PropTypes.func,
};

export default Calendar;
