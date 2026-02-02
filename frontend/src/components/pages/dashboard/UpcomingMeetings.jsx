const UpcomingMeetings = ({ userRole }) => {
  const meetings = {
    admin: [
      {
        title: "Project Review - Group B",
        time: "Tomorrow • 10:00 AM - 11:30 AM",
        type: "review",
        location: "Room 302, CS Building",
        participants: 4,
        color: "blue",
      },
      {
        title: "Weekly Sync - Group D",
        time: "Nov 15 • 2:00 PM - 3:00 PM",
        type: "sync",
        location: "Online - Zoom",
        participants: 3,
        color: "gray",
      },
    ],
    faculty: [
      {
        title: "Project Review - Group B",
        time: "Tomorrow • 10:00 AM - 11:30 AM",
        type: "review",
        location: "Room 302",
        participants: 4,
        color: "blue",
      },
      {
        title: "Faculty Meeting",
        time: "Today • 4:00 PM - 5:00 PM",
        type: "faculty",
        location: "Conference Room",
        participants: 8,
        color: "green",
      },
    ],
    student: [
      {
        title: "Project Meeting with Guide",
        time: "Tomorrow • 2:00 PM - 3:00 PM",
        type: "review",
        location: "Room 302",
        participants: 3,
        color: "blue",
      },
      {
        title: "Group Study Session",
        time: "Today • 6:00 PM - 8:00 PM",
        type: "study",
        location: "Library",
        participants: 4,
        color: "green",
      },
    ],
  };

  const currentMeetings = meetings[userRole] || meetings.admin;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Upcoming Meetings
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your scheduled meetings and events
          </p>
        </div>
        <a
          href="#"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
        >
          <i className="fas fa-plus mr-1"></i> Schedule
        </a>
      </div>
      <div className="space-y-4">
        {currentMeetings.map((meeting, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border transition-all duration-150 hover:shadow-sm ${
              meeting.type === "review"
                ? "border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30"
                : meeting.type === "faculty"
                ? "border-emerald-200 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/30"
                : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/30"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      meeting.type === "review"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : meeting.type === "faculty"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                        : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
                    } mr-3`}
                  >
                    {meeting.type === "review"
                      ? "Project Review"
                      : meeting.type === "faculty"
                      ? "Faculty Meeting"
                      : "Weekly Sync"}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    <i className="fas fa-users mr-1"></i>
                    {meeting.participants} people
                  </span>
                </div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                  {meeting.title}
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <span className="flex items-center">
                    <i className="fas fa-clock mr-1"></i>
                    {meeting.time}
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-map-marker-alt mr-1"></i>
                    {meeting.location}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`px-3 py-1.5 text-sm rounded-lg transition duration-150 ${
                    meeting.type === "review"
                      ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      : "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {meeting.type === "review" ? (
                    <>
                      <i className="fas fa-video mr-1"></i> Join
                    </>
                  ) : (
                    "Details"
                  )}
                </button>
                <button className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition duration-150">
                  <i className="fas fa-ellipsis-h"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Meeting Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <i className="fas fa-calendar-alt text-gray-400 mr-2"></i>
            <span className="text-gray-600">This week:</span>
            <span className="font-medium text-gray-900 ml-1">
              {currentMeetings.length} meetings
            </span>
          </div>
          <a
            href="/meetings"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View calendar →
          </a>
        </div>
      </div>
    </div>
  );
};

export default UpcomingMeetings;
