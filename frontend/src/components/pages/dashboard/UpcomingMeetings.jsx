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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Upcoming Meetings
          </h3>
          <p className="text-sm text-gray-500">
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
                ? "border-blue-200 bg-blue-50"
                : meeting.type === "faculty"
                ? "border-green-200 bg-green-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      meeting.type === "review"
                        ? "bg-blue-100 text-blue-800"
                        : meeting.type === "faculty"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    } mr-3`}
                  >
                    {meeting.type === "review"
                      ? "Project Review"
                      : meeting.type === "faculty"
                      ? "Faculty Meeting"
                      : "Weekly Sync"}
                  </span>
                  <span className="text-xs text-gray-500">
                    <i className="fas fa-users mr-1"></i>
                    {meeting.participants} people
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">
                  {meeting.title}
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
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
                      ? "bg-primary-600 text-white hover:bg-primary-700"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
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
                <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white transition duration-150">
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
