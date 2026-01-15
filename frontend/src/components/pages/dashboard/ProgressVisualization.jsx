// src/components/pages/dashboard/ProgressVisualization.jsx
const ProgressVisualization = ({ userRole }) => {
  const projects =
    userRole === "student"
      ? [
          {
            name: "E-commerce Platform",
            progress: 65,
            color: "blue",
            status: "In Progress",
          },
          {
            name: "AI Chatbot",
            progress: 100,
            color: "green",
            status: "Completed",
          },
          {
            name: "IoT Smart Home",
            progress: 45,
            color: "yellow",
            status: "In Progress",
          },
        ]
      : [
          {
            name: "Computer Science Projects",
            progress: 78,
            color: "blue",
            students: 24,
          },
          {
            name: "Engineering Projects",
            progress: 92,
            color: "green",
            students: 18,
          },
          {
            name: "Business Projects",
            progress: 65,
            color: "purple",
            students: 32,
          },
        ];

  return (
    <div className="space-y-6">
      {projects.map((project, index) => (
        <div key={index} className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-3 ${
                  project.color === "blue"
                    ? "bg-blue-500"
                    : project.color === "green"
                    ? "bg-green-500"
                    : project.color === "yellow"
                    ? "bg-yellow-500"
                    : "bg-purple-500"
                }`}
              ></div>
              <div>
                <div className="font-medium text-gray-900">{project.name}</div>
                <div className="text-sm text-gray-500">
                  {userRole === "student"
                    ? project.status
                    : `${project.students} students`}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="font-bold text-gray-900 mr-3">
                {project.progress}%
              </span>
              {project.progress === 100 && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                  Completed
                </span>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  project.color === "blue"
                    ? "bg-blue-500"
                    : project.color === "green"
                    ? "bg-green-500"
                    : project.color === "yellow"
                    ? "bg-yellow-500"
                    : "bg-purple-500"
                } transition-all duration-500`}
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>

            {/* Milestone markers */}
            <div className="flex justify-between mt-1">
              {[0, 25, 50, 75, 100].map((milestone) => (
                <div key={milestone} className="flex flex-col items-center">
                  <div
                    className={`w-1 h-1 rounded-full ${
                      project.progress >= milestone
                        ? "bg-gray-600"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">
                    {milestone}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressVisualization;
