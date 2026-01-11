const ProjectList = () => {
  const projects = [
    {
      id: 1,
      title: "E-commerce Platform",
      status: "In Progress",
      statusColor: "blue",
      description: "Full-stack e-commerce website with payment integration",
      startDate: "2024-01-15",
      endDate: "2024-05-30",
      guide: "Dr. Sarah Johnson",
      progress: 65,
    },
    {
      id: 2,
      title: "AI Chatbot",
      status: "Completed",
      statusColor: "green",
      description: "Intelligent chatbot for customer service",
      startDate: "2023-09-01",
      endDate: "2023-12-15",
      guide: "Prof. Michael Chen",
      progress: 100,
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
          <p className="text-gray-600">Track and manage your projects</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-150 flex items-center">
          <i className="fas fa-plus mr-2"></i> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 mr-3">
                    {project.title}
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full bg-${project.statusColor}-100 text-${project.statusColor}-800`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-600">{project.description}</p>
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
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${project.statusColor}-500 h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Start Date</p>
                  <p className="font-medium">
                    {new Date(project.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">End Date</p>
                  <p className="font-medium">
                    {new Date(project.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Guide</p>
                  <p className="font-medium">{project.guide}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-medium">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
