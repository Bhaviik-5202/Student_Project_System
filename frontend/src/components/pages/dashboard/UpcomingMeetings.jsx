const UpcomingMeetings = ({ userRole }) => {
  // Role-specific meetings
  const getMeetings = () => {
    if (userRole === "admin" || userRole === "faculty") {
      return [
        {
          title: "Project Review - Group B",
          time: "Tomorrow • 10:00 AM - 11:30 AM",
          type: "review",
          role: "host",
        },
        {
          title: "Weekly Sync - Group D",
          time: "Nov 15 • 2:00 PM - 3:00 PM",
          type: "sync",
          role: "host",
        },
      ];
    } else if (userRole === "student") {
      return [
        {
          title: "Project Meeting with Guide",
          time: "Tomorrow • 2:00 PM - 3:00 PM",
          type: "review",
          role: "participant",
        },
        {
          title: "Group Study Session",
          time: "Nov 16 • 4:00 PM - 5:30 PM",
          type: "study",
          role: "participant",
        },
      ];
    }

    return [];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Upcoming Meetings
        </h3>
        <a
          href="#"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Schedule new
        </a>
      </div>
      <div className="space-y-4">
        {getMeetings().map((meeting, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-4 ${
              meeting.type === "review"
                ? "bg-blue-50"
                : meeting.type === "study"
                ? "bg-green-50"
                : "bg-gray-50"
            } rounded-lg`}
          >
            <div>
              <p className="font-medium text-gray-900">{meeting.title}</p>
              <p className="text-sm text-gray-600">{meeting.time}</p>
              <p className="text-xs text-gray-500 mt-1">
                {meeting.role === "host"
                  ? "You are hosting"
                  : "You are participating"}
              </p>
            </div>
            <button
              className={`px-3 py-1 ${
                meeting.type === "review"
                  ? "bg-primary-600 text-white hover:bg-primary-700"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              } text-sm rounded-lg`}
            >
              {meeting.type === "review" ? "Join" : "Details"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingMeetings;
