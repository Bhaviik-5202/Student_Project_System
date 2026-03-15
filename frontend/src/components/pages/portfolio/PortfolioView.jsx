import React, { useState, useMemo, useCallback, useEffect } from "react";
import api from "../../../utils/api";

const PortfolioView = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const [portfolioData, setPortfolioData] = useState({
    student: { name: "", title: "", avatar: "", university: "", major: "", graduation: "", email: "" },
    stats: { projects: 0, skills: 0, achievements: 0, contributions: 0 },
    projects: [],
    skills: [],
    achievements: [],
    education: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/portfolio/overview');
        if (response.data?.data) {
          setPortfolioData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch portfolio data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const tabs = useMemo(
    () => [
      { id: "overview", name: "Overview", icon: "fas fa-home" },
      { id: "projects", name: "Projects", icon: "fas fa-project-diagram" },
      { id: "skills", name: "Skills", icon: "fas fa-code" },
      { id: "achievements", name: "Achievements", icon: "fas fa-trophy" },
      { id: "education", name: "Education", icon: "fas fa-graduation-cap" },
      { id: "contact", name: "Contact", icon: "fas fa-envelope" },
    ],
    [],
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Welcome to My Portfolio
              </h3>
              <p className="text-gray-700 mb-4">
                Passionate software engineering student with expertise in
                full-stack development, machine learning, and project
                management. Seeking opportunities to apply skills in innovative
                projects and collaborative environments.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(portfolioData.stats).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-white border border-gray-200 rounded-lg p-4 text-center"
                >
                  <div className="text-2xl font-bold text-blue-600">
                    {value}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">{key}</div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Featured Projects
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolioData.projects.slice(0, 2).map((project) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="h-40 bg-gray-200"></div>
                    <div className="p-4">
                      <h4 className="font-bold text-gray-800 mb-2">
                        {project.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "projects":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                Projects ({portfolioData.projects.length})
              </h3>
              <select className="px-3 py-2 border border-gray-300 rounded-lg">
                <option>All Projects</option>
                <option>Completed</option>
                <option>In Progress</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioData.projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-gray-200 relative">
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          project.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-800">
                        {project.name}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {project.date}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        View Details
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <i className="fas fa-external-link-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "skills":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800">
              Skills & Expertise
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolioData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800">
                      {skill.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {skill.category}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {skill.level}%
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-800 mb-4">Skill Categories</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Frontend", "Backend", "Design", "Soft Skills"].map(
                  (category) => {
                    const categorySkills = portfolioData.skills.filter(
                      (s) => s.category === category,
                    );
                    const avgLevel =
                      categorySkills.length > 0
                        ? Math.round(
                            categorySkills.reduce(
                              (sum, s) => sum + s.level,
                              0,
                            ) / categorySkills.length,
                          )
                        : 0;

                    return (
                      <div key={category} className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {avgLevel}%
                        </div>
                        <div className="text-sm text-gray-600">{category}</div>
                        <div className="text-xs text-gray-500">
                          {categorySkills.length} skills
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        );

      case "achievements":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800">
              Achievements & Awards
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioData.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="border border-gray-200 rounded-lg p-5 text-center hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-trophy text-yellow-600 text-2xl"></i>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">
                    {achievement.title}
                  </h4>
                  <div className="text-sm text-gray-600 mb-2">
                    {achievement.issuer}
                  </div>
                  <div className="text-xs text-gray-500">
                    {achievement.date}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-800 mb-2">Certifications</h4>
              <div className="space-y-3">
                {[
                  "AWS Certified Developer",
                  "Google Cloud Professional",
                  "React Developer Certification",
                  "Scrum Master Certification",
                ].map((cert) => (
                  <div
                    key={cert}
                    className="flex items-center justify-between p-3 bg-white rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-certificate text-green-600"></i>
                      </div>
                      <span className="font-medium">{cert}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      <i className="fas fa-external-link-alt"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "education":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800">Education</h3>

            <div className="space-y-4">
              {portfolioData.education.map((edu, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 pl-4 py-2"
                >
                  <h4 className="font-bold text-gray-800">{edu.degree}</h4>
                  <p className="text-gray-600">{edu.school}</p>
                  <p className="text-sm text-gray-500">{edu.year}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-800 mb-4">
                Academic Performance
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">3.8</div>
                  <div className="text-sm text-gray-600">GPA</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">42</div>
                  <div className="text-sm text-gray-600">Credits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-sm text-gray-600">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">95%</div>
                  <div className="text-sm text-gray-600">Attendance</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-envelope text-blue-600"></i>
                  </div>
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-gray-600">
                      {portfolioData.student.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-university text-green-600"></i>
                  </div>
                  <div>
                    <div className="font-medium">University</div>
                    <div className="text-gray-600">
                      {portfolioData.student.university}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-graduation-cap text-purple-600"></i>
                  </div>
                  <div>
                    <div className="font-medium">Major</div>
                    <div className="text-gray-600">
                      {portfolioData.student.major}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-calendar-alt text-yellow-600"></i>
                  </div>
                  <div>
                    <div className="font-medium">Graduation</div>
                    <div className="text-gray-600">
                      {portfolioData.student.graduation}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-800 mb-4">Connect With Me</h4>
              <div className="flex space-x-4">
                {["linkedin", "github", "twitter", "portfolio"].map(
                  (platform) => (
                    <button
                      key={platform}
                      className="flex-1 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 capitalize"
                    >
                      <i className={`fab fa-${platform} mr-2`}></i>
                      {platform}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  if (loading) return <div className="p-6 text-center text-slate-500">Loading portfolio...</div>;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white p-6 rounded-t-lg">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-32 h-32 bg-white rounded-full overflow-hidden border-4 border-white">
            <img
              src={portfolioData.student.avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold">{portfolioData.student.name}</h1>
            <p className="text-xl opacity-90">{portfolioData.student.title}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                "Software Engineer",
                "Web Developer",
                "Machine Learning Enthusiast",
                "Team Player",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-opacity-90">
              <i className="fas fa-download mr-2"></i>
              Download CV
            </button>
            <button className="px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600">
              <i className="fas fa-share-alt mr-2"></i>
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <i className={tab.icon}></i>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">{renderTabContent()}</div>

      {/* Footer */}
      <div className="border-t border-slate-200 dark:border-slate-700 p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p>
          Portfolio generated using Project Management System • Last updated:{" "}
          {new Date().toLocaleDateString()}
        </p>
        <p className="mt-1">
          © {new Date().getFullYear()} {portfolioData.student.name}. All rights
          reserved.
        </p>
      </div>
    </div>
  );
};

PortfolioView.displayName = "PortfolioView";

export default React.memo(PortfolioView);
