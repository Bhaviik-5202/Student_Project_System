import React, { useState } from "react";

const Calendar = ({ events = [], onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const emptyDays = Array(firstDayOfMonth).fill(null);

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold">{monthYear}</h3>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center font-medium text-gray-600 p-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="p-2" />
        ))}
        {days.map((day) => (
          <div
            key={day}
            className="p-2 text-center border rounded hover:bg-gray-50 cursor-pointer"
            onClick={() =>
              onDateClick(
                new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
              )
            }
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
