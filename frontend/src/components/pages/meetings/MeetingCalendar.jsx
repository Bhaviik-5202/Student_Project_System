import React, { useState, useMemo, useCallback, memo } from "react";

const MeetingCalendar = memo(() => {
  const [showModal, setShowModal] = useState(false);
  const [meetingForm, setMeetingForm] = useState({
    title: "",
    date: "",
    time: "",
    duration: "1.5",
    location: "",
    description: "",
    participants: [],
  });

  const meetings = useMemo(
    () => [
      {
        id: 1,
        title: "Project Review - Group B",
        type: "review",
        time: "Tomorrow • 10:00 AM - 11:30 AM",
        description: "Review of project progress and technical implementation",
        date: "2024-02-15",
        location: "Room 302, Computer Science Building",
        participants: 4,
        color: "blue",
      },
      {
        id: 2,
        title: "Weekly Sync - Group D",
        type: "sync",
        time: "Nov 15 • 2:00 PM - 3:00 PM",
        description: "Weekly progress update and task allocation",
        date: "2024-02-16",
        location: "Online - Zoom Meeting",
        participants: 3,
        color: "gray",
      },
    ],
    [],
  );

  const calendarDays = useMemo(
    () => [
      { day: 29, month: "prev", meetings: 0 },
      { day: 30, month: "prev", meetings: 0 },
      { day: 31, month: "prev", meetings: 0 },
      { day: 1, month: "current", meetings: 2, current: true },
      { day: 2, month: "current", meetings: 0 },
      { day: 3, month: "current", meetings: 1 },
      { day: 4, month: "current", meetings: 0 },
      { day: 5, month: "current", meetings: 0 },
      { day: 6, month: "current", meetings: 1 },
      { day: 7, month: "current", meetings: 0 },
      { day: 8, month: "current", meetings: 0 },
      { day: 9, month: "current", meetings: 0 },
      { day: 10, month: "current", meetings: 0 },
      { day: 11, month: "current", meetings: 0 },
      { day: 12, month: "current", meetings: 2 },
      { day: 13, month: "current", meetings: 0 },
      { day: 14, month: "current", meetings: 1 },
      { day: 15, month: "current", meetings: 0 },
      { day: 16, month: "current", meetings: 0 },
      { day: 17, month: "current", meetings: 0 },
      { day: 18, month: "current", meetings: 0 },
      { day: 19, month: "current", meetings: 0 },
      { day: 20, month: "current", meetings: 1 },
      { day: 21, month: "current", meetings: 0 },
      { day: 22, month: "current", meetings: 0 },
      { day: 23, month: "current", meetings: 0 },
      { day: 24, month: "current", meetings: 0 },
      { day: 25, month: "current", meetings: 0 },
      { day: 26, month: "current", meetings: 0 },
      { day: 27, month: "current", meetings: 0 },
      { day: 28, month: "current", meetings: 0 },
      { day: 29, month: "next", meetings: 0 },
      { day: 30, month: "next", meetings: 0 },
    ],
    [],
  );

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setMeetingForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleScheduleMeeting = useCallback(() => {
    // ...existing code...
    alert("Meeting scheduled successfully!");
    setShowModal(false);
    setMeetingForm({
      title: "",
      date: "",
      time: "",
      duration: "1.5",
      location: "",
      description: "",
      participants: [],
    });
  }, [meetingForm]);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Meeting Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Schedule and manage project meetings
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-lg transition duration-150 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          <i className="fas fa-plus mr-2" /> Schedule Meeting
        </button>
      </div>

      {/* Calendar View */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            November 2023
          </h3>
          <div className="flex space-x-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <i className="fas fa-chevron-left" />
            </button>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg">
              Today
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <i className="fas fa-chevron-right" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`h-24 border border-gray-200 dark:border-gray-700 rounded-lg p-2 ${
                day.month === "current" && day.current
                  ? "bg-blue-50 dark:bg-blue-900/30"
                  : day.month === "prev" || day.month === "next"
                    ? "bg-gray-50 dark:bg-gray-700"
                    : ""
              }`}
            >
              <div
                className={`text-sm ${
                  day.month === "current"
                    ? "font-medium text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {day.day}
              </div>
              {day.meetings > 0 && (
                <div className="mt-1">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                    {day.meetings} meeting{day.meetings !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Meetings List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Upcoming Meetings
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        meeting.type === "review"
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      } mr-3`}
                    >
                      {meeting.type === "review"
                        ? "Project Review"
                        : "Weekly Sync"}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      <i className="fas fa-clock mr-1" /> 2 hours
                    </span>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    {meeting.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {meeting.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <i className="fas fa-calendar-alt mr-2" />
                    <span>{meeting.time}</span>
                    <i className="fas fa-map-marker-alt ml-4 mr-2" />
                    <span>{meeting.location}</span>
                  </div>
                  <div className="mt-3 flex items-center">
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(3, meeting.participants))].map(
                        (_, i) => (
                          <div
                            key={i}
                            className={`w-8 h-8 ${
                              i === 0
                                ? "bg-blue-100 dark:bg-blue-900"
                                : i === 1
                                  ? "bg-green-100 dark:bg-green-900"
                                  : "bg-yellow-100 dark:bg-yellow-900"
                            } rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800`}
                          >
                            <i
                              className={`fas fa-user ${
                                i === 0
                                  ? "text-blue-600 dark:text-blue-300"
                                  : i === 1
                                    ? "text-green-600 dark:text-green-300"
                                    : "text-yellow-600 dark:text-yellow-300"
                              } text-xs`}
                            />
                          </div>
                        ),
                      )}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-3">
                      {meeting.participants} participants
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex space-x-2">
                  <button className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white text-sm rounded-lg">
                    <i className="fas fa-video mr-1" /> Join
                  </button>
                  <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    <i className="fas fa-edit mr-1" /> Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity modal-overlay"
              onClick={() => setShowModal(false)}
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                      Schedule New Meeting
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Meeting Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          required
                          value={meetingForm.title}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                          placeholder="Enter meeting title"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            name="date"
                            required
                            value={meetingForm.date}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Time
                          </label>
                          <input
                            type="time"
                            name="time"
                            required
                            value={meetingForm.time}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Duration (hours)
                        </label>
                        <input
                          type="number"
                          name="duration"
                          min="0.5"
                          max="8"
                          step="0.5"
                          value={meetingForm.duration}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                          placeholder="1.5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={meetingForm.location}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                          placeholder="Enter meeting location"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description
                        </label>
                        <textarea
                          rows="3"
                          name="description"
                          value={meetingForm.description}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                          placeholder="Meeting agenda and notes"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleScheduleMeeting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Schedule Meeting
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

MeetingCalendar.displayName = "MeetingCalendar";

export default MeetingCalendar;
