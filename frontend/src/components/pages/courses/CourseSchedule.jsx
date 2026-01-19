// src/components/pages/courses/CourseSchedule.jsx
import React, { useState } from "react";

const CourseSchedule = () => {
  const [selectedDay, setSelectedDay] = useState("Monday");

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const scheduleData = {
    Monday: [
      {
        time: "09:00 - 10:30",
        course: "CS401 - Web Technologies",
        room: "Room 301",
        instructor: "Dr. Sarah Johnson",
      },
      {
        time: "11:00 - 12:30",
        course: "CS402 - Database Systems",
        room: "Lab 204",
        instructor: "Prof. Michael Brown",
      },
      {
        time: "14:00 - 15:30",
        course: "CS403 - Software Engineering",
        room: "Room 305",
        instructor: "Dr. Emily Davis",
      },
    ],
    Tuesday: [
      {
        time: "10:00 - 11:30",
        course: "CS404 - AI & Machine Learning",
        room: "Lab 301",
        instructor: "Dr. Robert Wilson",
      },
      {
        time: "13:00 - 14:30",
        course: "CS401 - Web Technologies",
        room: "Room 301",
        instructor: "Dr. Sarah Johnson",
      },
    ],
    Wednesday: [
      {
        time: "09:00 - 12:00",
        course: "Project Work",
        room: "Project Lab",
        instructor: "Team Supervisors",
      },
      {
        time: "14:00 - 16:00",
        course: "CS402 - Database Systems",
        room: "Lab 204",
        instructor: "Prof. Michael Brown",
      },
    ],
    Thursday: [
      {
        time: "11:00 - 13:00",
        course: "CS403 - Software Engineering",
        room: "Room 305",
        instructor: "Dr. Emily Davis",
      },
      {
        time: "15:00 - 17:00",
        course: "Elective: Cybersecurity",
        room: "Room 402",
        instructor: "Prof. James Miller",
      },
    ],
    Friday: [
      {
        time: "10:00 - 12:00",
        course: "CS404 - AI & Machine Learning",
        room: "Lab 301",
        instructor: "Dr. Robert Wilson",
      },
      {
        time: "13:00 - 15:00",
        course: "Guest Lecture",
        room: "Auditorium",
        instructor: "Industry Expert",
      },
    ],
    Saturday: [
      {
        time: "09:00 - 12:00",
        course: "Self Study / Project Work",
        room: "Library/Lab",
        instructor: "Self",
      },
    ],
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Course Schedule
        </h1>
        <p className="text-gray-600">Spring Semester 2024</p>
      </div>

      {/* Day Selector */}
      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                selectedDay === day
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule for Selected Day */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="bg-primary-50 p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedDay}'s Schedule
          </h2>
          <p className="text-sm text-gray-600">
            {scheduleData[selectedDay].length} classes scheduled
          </p>
        </div>

        <div className="divide-y">
          {scheduleData[selectedDay].map((classItem, index) => (
            <div key={index} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <h3 className="font-medium text-gray-800">
                      {classItem.course}
                    </h3>
                  </div>
                  <div className="ml-6 space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-clock mr-2"></i>
                      <span>{classItem.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      <span>{classItem.room}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-user mr-2"></i>
                      <span>{classItem.instructor}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-blue-600 text-blue-600 rounded-lg text-sm hover:bg-blue-50">
                    Join Class
                  </button>
                  <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Weekly Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {days.map((day) => (
            <div
              key={day}
              className={`bg-white rounded-lg shadow p-4 text-center cursor-pointer hover:shadow-md transition-shadow ${
                selectedDay === day ? "ring-2 ring-primary-500" : ""
              }`}
              onClick={() => setSelectedDay(day)}
            >
              <div className="text-sm font-medium text-gray-600 mb-1">
                {day.substring(0, 3)}
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-2">
                {scheduleData[day].length}
              </div>
              <div className="text-xs text-gray-500">Classes</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseSchedule;
