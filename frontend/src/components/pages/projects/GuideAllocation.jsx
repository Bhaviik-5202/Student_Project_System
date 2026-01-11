const GuideAllocationList = () => {
  const allocations = [
    {
      id: 1,
      guide: "Dr. Sarah Johnson",
      department: "Computer Science",
      allocatedGroups: 3,
      maxCapacity: 5,
      students: 8,
      status: "Available",
    },
    {
      id: 2,
      guide: "Prof. Michael Chen",
      department: "Information Technology",
      allocatedGroups: 2,
      maxCapacity: 4,
      students: 6,
      status: "Available",
    },
    {
      id: 3,
      guide: "Dr. Emily Williams",
      department: "Electronics",
      allocatedGroups: 4,
      maxCapacity: 4,
      students: 10,
      status: "Full",
    },
  ];

  const projects = [
    {
      id: "P001",
      name: "E-commerce Platform",
      group: "Group A",
      currentGuide: "Dr. Sarah Johnson",
    },
    {
      id: "P002",
      name: "AI Chatbot",
      group: "Group B",
      currentGuide: "Prof. Michael Chen",
    },
    {
      id: "P003",
      name: "IoT Smart Home",
      group: "Group C",
      currentGuide: "None",
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Guide Allocation</h2>
          <p className="text-gray-600">Assign and manage project guides</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-150 flex items-center">
          <i className="fas fa-user-tie mr-2"></i> Assign Guide
        </button>
      </div>

      {/* Guides Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {allocations.map((guide) => (
          <div
            key={guide.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 card-hover"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <i className="fas fa-user-tie text-purple-600 text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{guide.guide}</h3>
                <p className="text-sm text-gray-500">{guide.department}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Allocated Groups</span>
                <span className="font-medium">
                  {guide.allocatedGroups}/{guide.maxCapacity}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Students</span>
                <span className="font-medium">{guide.students}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status</span>
                <span
                  className={`font-medium ${
                    guide.status === "Available"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {guide.status}
                </span>
              </div>
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition duration-150 text-sm">
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Projects for Allocation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Projects Pending Allocation
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Guide
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {project.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <i className="fas fa-project-diagram text-blue-600"></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {project.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.group}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm ${
                        project.currentGuide === "None"
                          ? "text-yellow-600 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {project.currentGuide}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <option value="">Select Guide</option>
                      <option value="1">Dr. Sarah Johnson</option>
                      <option value="2">Prof. Michael Chen</option>
                      <option value="3">Dr. Emily Williams</option>
                    </select>
                    <button className="ml-2 px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700">
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GuideAllocationList;
