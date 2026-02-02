import React, { useState, memo, useCallback, useMemo } from "react";
import PropTypes from "prop-types";

const Calendar = memo(({ events = [], onDateClick }) => {
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

  const handleDateClick = useCallback((day) => {
    if (onDateClick) {
      onDateClick(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      );
    }
  }, [currentDate, onDateClick]);

  const monthYear = useMemo(
    () =>
      currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [currentDate]
  );

  const daysOfWeek = useMemo(
    () => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    []
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-lg dark:shadow-gray-950">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          aria-label="Previous month"
          title="Previous month"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {monthYear}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          aria-label="Next month"
          title="Next month"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center font-medium text-gray-600 dark:text-gray-400 p-2"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendarData.emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="p-2" />
        ))}
        {calendarData.days.map((day) => (
          <div
            key={day}
            className="p-2 text-center border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors text-gray-900 dark:text-white"
            onClick={() => handleDateClick(day)}
            role="button"
            tabIndex="0"
            aria-label={`${currentDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
});

Calendar.displayName = "Calendar";

Calendar.propTypes = {
  events: PropTypes.array,
  onDateClick: PropTypes.func,
};

Calendar.defaultProps = {
  events: [],
};

export default Calendar;
