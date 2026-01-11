const ProjectGroupsList = () => {
  const groups = [
    {
      id: "G001",
      name: "Group A - E-commerce Platform",
      project: "E-commerce Platform",
      guide: "Dr. Sarah Johnson",
      members: ["John Smith", "Sarah Johnson", "Mike Chen"],
      status: "Active",
      progress: 65,
    },
    {
      id: "G002",
      name: "Group B - AI Chatbot",
      project: "AI Chatbot",
      guide: "Prof. Michael Chen",
      members: ["Emily Davis", "David Wilson"],
      status: "Completed",
      progress: 100,
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Groups</h2>
          <p className="text-gray-600">Manage student project groups</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-150 flex items-center">
          <i className="fas fa-users mr-2"></i> Create Group
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 mr-3">
                    {group.name}
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      group.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {group.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">
                  <i className="fas fa-user-tie mr-2 text-gray-400"></i>
                  Guide: {group.guide}
                </p>
                <p className="text-gray-600">
                  <i className="fas fa-users mr-2 text-gray-400"></i>
                  Members: {group.members.join(", ")}
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700">
                  View Details
                </button>
                <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                  Edit
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Project Progress</span>
                  <span>{group.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      group.status === "Completed"
                        ? "bg-blue-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${group.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Group ID</p>
                  <p className="font-medium">{group.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Project</p>
                  <p className="font-medium">{group.project}</p>
                </div>
                <div>
                  <p className="text-gray-500">Members Count</p>
                  <p className="font-medium">{group.members.length} students</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectGroupsList;
