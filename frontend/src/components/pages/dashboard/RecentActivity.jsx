const RecentActivity = ({ userRole }) => {
  // Role-specific activities
  const getActivities = () => {
    if (userRole === "admin") {
      return [
        {
          type: "approved",
          icon: "fa-check",
          title: 'Project "E-commerce Platform" approved',
          description: "By Dr. Smith • 2 hours ago",
          color: "green",
        },
        {
          type: "submission",
          icon: "fa-upload",
          title: "New project proposal submitted",
          description: "By John Doe • 4 hours ago",
          color: "blue",
        },
        {
          type: "meeting",
          icon: "fa-calendar",
          title: "Meeting scheduled for Group A",
          description: "By Prof. Johnson • 1 day ago",
          color: "yellow",
        },
      ];
    } else if (userRole === "faculty") {
      return [
        {
          type: "review",
          icon: "fa-clipboard-check",
          title: "Project review submitted",
          description: "For Group B • 1 hour ago",
          color: "green",
        },
        {
          type: "meeting",
          icon: "fa-calendar",
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
      ];
    } else if (userRole === "student") {
      return [
        {
          type: "submission",
          icon: "fa-upload",
          title: "Project proposal submitted",
          description: "Awaiting review • 1 day ago",
          color: "blue",
        },
        {
          type: "feedback",
          icon: "fa-comment",
          title: "Feedback received on assignment",
          description: "From Dr. Johnson • 2 days ago",
          color: "green",
        },
        {
          type: "meeting",
          icon: "fa-calendar",
          title: "Meeting scheduled",
          description: "Tomorrow at 2:00 PM • Room 302",
          color: "yellow",
        },
      ];
    }

    return [];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <a
          href="#"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View all
        </a>
      </div>
      <div className="space-y-4">
        {getActivities().map((activity, index) => (
          <div key={index} className="flex items-start">
            <div
              className={`flex-shrink-0 w-10 h-10 bg-${activity.color}-100 rounded-full flex items-center justify-center`}
            >
              <i
                className={`fas ${activity.icon} text-${activity.color}-600`}
              ></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">
                {activity.title}
              </p>
              <p className="text-sm text-gray-500">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
