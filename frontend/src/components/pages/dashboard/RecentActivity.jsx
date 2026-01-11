const RecentActivity = ({ userRole }) => {
  const activities = {
    admin: [
      {
        type: "approved",
        icon: "fa-check-circle",
        title: 'Project "E-commerce Platform" approved',
        description: "By Dr. Smith • 2 hours ago",
        color: "green",
      },
      {
        type: "submission",
        icon: "fa-file-upload",
        title: "New project proposal submitted",
        description: "By John Doe • 4 hours ago",
        color: "blue",
      },
      {
        type: "meeting",
        icon: "fa-calendar-check",
        title: "Meeting scheduled for Group A",
        description: "By Prof. Johnson • 1 day ago",
        color: "yellow",
      },
      {
        type: "update",
        icon: "fa-sync-alt",
        title: "System update completed",
        description: "Version 2.1.0 deployed • 2 days ago",
        color: "purple",
      },
    ],
    faculty: [
      {
        type: "review",
        icon: "fa-clipboard-check",
        title: "Project review submitted",
        description: "For Group B • 1 hour ago",
        color: "green",
      },
      {
        type: "meeting",
        icon: "fa-video",
        title: "Meeting with Group C completed",
        description: "Yesterday • 3:00 PM",
        color: "blue",
      },
      {
        type: "submission",
        icon: "fa-upload",
        title: "New project proposal received",
        description: "From student • 1 day ago",
        color: "yellow",
      },
    ],
    student: [
      {
        type: "submission",
        icon: "fa-paper-plane",
        title: "Project proposal submitted",
        description: "Awaiting review • 1 day ago",
        color: "blue",
      },
      {
        type: "feedback",
        icon: "fa-comment-alt",
        title: "Feedback received on assignment",
        description: "From Dr. Johnson • 2 days ago",
        color: "green",
      },
      {
        type: "meeting",
        icon: "fa-calendar-plus",
        title: "Meeting scheduled",
        description: "Tomorrow at 2:00 PM • Room 302",
        color: "yellow",
      },
    ],
  };

  const currentActivities = activities[userRole] || activities.admin;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h3>
          <p className="text-sm text-gray-500">
            Latest updates from your workspace
          </p>
        </div>
        <a
          href="#"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
        >
          View all <i className="fas fa-chevron-right ml-1"></i>
        </a>
      </div>
      <div className="space-y-4">
        {currentActivities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition duration-150 group"
          >
            <div
              className={`flex-shrink-0 w-10 h-10 bg-${activity.color}-100 rounded-full flex items-center justify-center mr-4`}
            >
              <i
                className={`fas ${activity.icon} text-${activity.color}-600`}
              ></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-150">
                {activity.title}
              </p>
              <p className="text-sm text-gray-500">{activity.description}</p>
            </div>
            <button className="ml-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-150">
              <i className="fas fa-ellipsis-h"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
