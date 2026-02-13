import React, { useState, useMemo, useCallback } from "react";

const ProjectGallery = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [filter, setFilter] = useState("all");

  const projects = useMemo(
    () => [
      {
        id: 1,
        title: "E-Commerce Platform",
        description: "Full-stack e-commerce solution with modern UI",
        category: "web",
        status: "completed",
        team: ["Alex Johnson", "Sarah Miller"],
        technologies: ["React", "Node.js", "MongoDB"],
        images: [
          "https://via.placeholder.com/800x450/3B82F6/FFFFFF?text=Home+Page",
          "https://via.placeholder.com/800x450/10B981/FFFFFF?text=Product+Page",
          "https://via.placeholder.com/800x450/8B5CF6/FFFFFF?text=Checkout",
        ],
        date: "Jan 2024",
        likes: 42,
        views: 156,
      },
      {
        id: 2,
        title: "AI Research Assistant",
        description: "Machine learning model for academic research",
        category: "ai",
        status: "in-progress",
        team: ["Mike Chen"],
        technologies: ["Python", "TensorFlow", "NLP"],
        images: [
          "https://via.placeholder.com/800x450/EF4444/FFFFFF?text=AI+Dashboard",
          "https://via.placeholder.com/800x450/F59E0B/FFFFFF?text=Training+Interface",
        ],
        date: "Dec 2023",
        likes: 28,
        views: 98,
      },
      {
        id: 3,
        title: "Mobile Fitness App",
        description: "Cross-platform fitness tracking application",
        category: "mobile",
        status: "completed",
        team: ["Emma Wilson", "David Lee", "Lisa Park"],
        technologies: ["React Native", "Firebase", "Redux"],
        images: [
          "https://via.placeholder.com/800x450/6366F1/FFFFFF?text=Workout+Screen",
          "https://via.placeholder.com/800x450/EC4899/FFFFFF?text=Progress+Tracking",
        ],
        date: "Nov 2023",
        likes: 56,
        views: 210,
      },
      {
        id: 4,
        title: "Data Visualization Dashboard",
        description: "Interactive dashboard for business analytics",
        category: "web",
        status: "completed",
        team: ["Robert Kim", "Jessica Wang"],
        technologies: ["D3.js", "Vue.js", "Express"],
        images: [
          "https://via.placeholder.com/800x450/059669/FFFFFF?text=Dashboard+View",
          "https://via.placeholder.com/800x450/DC2626/FFFFFF?text=Analytics+Chart",
        ],
        date: "Oct 2023",
        likes: 37,
        views: 134,
      },
      {
        id: 5,
        title: "IoT Home Automation",
        description: "Smart home system with IoT integration",
        category: "iot",
        status: "planning",
        team: ["Tom Harris", "Nina Rodriguez"],
        technologies: ["Python", "Raspberry Pi", "MQTT"],
        images: [
          "https://via.placeholder.com/800x450/7C3AED/FFFFFF?text=Control+Panel",
        ],
        date: "Planned",
        likes: 15,
        views: 67,
      },
      {
        id: 6,
        title: "Blockchain Voting System",
        description: "Secure voting platform using blockchain technology",
        category: "blockchain",
        status: "in-progress",
        team: ["Alex Johnson", "Sarah Miller", "Mike Chen"],
        technologies: ["Solidity", "Web3.js", "Ethereum"],
        images: [
          "https://via.placeholder.com/800x450/0EA5E9/FFFFFF?text=Voting+Interface",
          "https://via.placeholder.com/800x450/84CC16/FFFFFF?text=Results+Screen",
        ],
        date: "Feb 2024",
        likes: 31,
        views: 112,
      },
    ],
    [],
  );

  const filters = useMemo(
    () => [
      { id: "all", name: "All Projects", count: 6 },
      { id: "web", name: "Web Development", count: 2 },
      { id: "mobile", name: "Mobile Apps", count: 1 },
      { id: "ai", name: "AI/ML", count: 1 },
      { id: "completed", name: "Completed", count: 3 },
      { id: "in-progress", name: "In Progress", count: 2 },
    ],
    [],
  );

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        if (filter === "all") return true;
        if (filter === "completed") return project.status === "completed";
        if (filter === "in-progress") return project.status === "in-progress";
        return project.category === filter || project.status === filter;
      }),
    [projects, filter],
  );

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200";
      case "in-progress":
        return "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-200";
      case "planning":
        return "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200";
      default:
        return "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300";
    }
  }, []);

  const getCategoryIcon = useCallback((category) => {
    switch (category) {
      case "web":
        return "fas fa-globe";
      case "mobile":
        return "fas fa-mobile-alt";
      case "ai":
        return "fas fa-brain";
      case "iot":
        return "fas fa-microchip";
      case "blockchain":
        return "fas fa-link";
      default:
        return "fas fa-project-diagram";
    }
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6\">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Project Gallery</h2>
          <p className="text-gray-600 mt-1">
            Showcasing student projects and innovations
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 rounded ${
                viewMode === "grid" ? "bg-white shadow" : ""
              }`}
            >
              <i className="fas fa-th-large"></i>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded ${
                viewMode === "list" ? "bg-white shadow" : ""
              }`}
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <i className="fas fa-plus mr-2"></i>
            Add Project
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {filters.map((filterItem) => (
            <button
              key={filterItem.id}
              onClick={() => setFilter(filterItem.id)}
              className={`px-4 py-2 rounded-lg ${
                filter === filterItem.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filterItem.name} ({filterItem.count})
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              {/* Project Image */}
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                      project.status,
                    )}`}
                  >
                    {project.status.replace("-", " ")}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <div className="flex items-center space-x-2 text-white">
                    <div className="w-8 h-8 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <i className={getCategoryIcon(project.category)}></i>
                    </div>
                    <div>
                      <h3 className="font-bold">{project.title}</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-3">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <i className="fas fa-heart mr-1"></i>
                      {project.likes}
                    </span>
                    <span className="flex items-center">
                      <i className="fas fa-eye mr-1"></i>
                      {project.views}
                    </span>
                  </div>
                  <span>{project.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col md:flex-row border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              onClick={() => setSelectedProject(project)}
            >
              <div className="md:w-64 h-48 md:h-auto bg-gray-200"></div>
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800">{project.title}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                      project.status,
                    )}`}
                  >
                    {project.status.replace("-", " ")}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{project.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <i className="fas fa-users text-gray-400"></i>
                      <span className="text-sm text-gray-600">
                        {project.team.length} members
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <i className={getCategoryIcon(project.category)}></i>
                      <span className="text-sm text-gray-600 capitalize">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {project.date}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-project-diagram text-gray-300 text-4xl mb-3"></i>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No projects found
          </h3>
          <p className="text-gray-500">Try adjusting your filter criteria</p>
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedProject.title}
                  </h2>
                  <div className="flex items-center space-x-3 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        selectedProject.status,
                      )}`}
                    >
                      {selectedProject.status.replace("-", " ")}
                    </span>
                    <span className="text-gray-500">
                      <i className="fas fa-calendar mr-1"></i>
                      {selectedProject.date}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              {/* Image Gallery */}
              <div className="mb-6">
                <div className="grid grid-cols-3 gap-3">
                  {selectedProject.images.map((img, index) => (
                    <div
                      key={index}
                      className="aspect-video bg-gray-200 rounded-lg overflow-hidden"
                    >
                      {/* Image would go here */}
                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        <i className="fas fa-image text-gray-400 text-2xl"></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-3">
                      Description
                    </h3>
                    <p className="text-gray-700">
                      {selectedProject.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800 mb-3">
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-3">
                      Team Members
                    </h3>
                    <div className="space-y-2">
                      {selectedProject.team.map((member, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                        >
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                          <span className="font-medium">{member}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800 mb-3">
                      Project Stats
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Likes</span>
                        <span className="font-medium">
                          {selectedProject.likes}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Views</span>
                        <span className="font-medium">
                          {selectedProject.views}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category</span>
                        <span className="font-medium capitalize">
                          {selectedProject.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <i className="fas fa-external-link-alt mr-2"></i>
                      Visit Project
                    </button>
                    <button className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      <i className="fas fa-download mr-2"></i>
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Stats */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700\">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {projects.length}
            </div>
            <div className="text-sm text-gray-600">Total Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {projects.filter((p) => p.status === "completed").length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {projects.reduce((sum, p) => sum + p.likes, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Likes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {projects.reduce((sum, p) => sum + p.views, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProjectGallery.displayName = "ProjectGallery";

export default React.memo(ProjectGallery);
