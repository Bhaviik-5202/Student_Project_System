import React, { useState } from "react";

const PortfolioBuilder = () => {
  const [portfolio, setPortfolio] = useState({
    name: "My Professional Portfolio",
    description: "Showcasing my projects and skills",
    visibility: "public",
    sections: [
      {
        id: 1,
        title: "About Me",
        type: "text",
        content: "Brief introduction...",
        enabled: true,
      },
      {
        id: 2,
        title: "Projects",
        type: "projects",
        content: [],
        enabled: true,
      },
      { id: 3, title: "Skills", type: "skills", content: [], enabled: true },
      {
        id: 4,
        title: "Education",
        type: "education",
        content: [],
        enabled: true,
      },
      {
        id: 5,
        title: "Experience",
        type: "experience",
        content: [],
        enabled: false,
      },
      {
        id: 6,
        title: "Certifications",
        type: "certifications",
        content: [],
        enabled: false,
      },
    ],
    theme: "light",
    layout: "modern",
  });

  const [activeSection, setActiveSection] = useState(1);

  // Inline notification function since hook isn't available
  const showNotification = (type, message) => {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${
      type === "success"
        ? "bg-green-500 text-white"
        : type === "error"
        ? "bg-red-500 text-white"
        : type === "warning"
        ? "bg-yellow-500 text-black"
        : "bg-blue-500 text-white"
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const handleSectionToggle = (sectionId) => {
    setPortfolio((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, enabled: !section.enabled }
          : section
      ),
    }));
  };

  const handleSectionOrder = (fromIndex, toIndex) => {
    const newSections = [...portfolio.sections];
    const [movedSection] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, movedSection);
    setPortfolio((prev) => ({ ...prev, sections: newSections }));
  };

  const handleSave = () => {
    showNotification("success", "Portfolio saved successfully");
  };

  const handlePreview = () => {
    showNotification("info", "Opening preview...");
  };

  const handlePublish = () => {
    showNotification("success", "Portfolio published successfully");
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Builder Controls */}
        <div className="lg:w-1/3">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Portfolio Builder
            </h2>

            {/* Portfolio Settings */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Portfolio Name
                </label>
                <input
                  type="text"
                  value={portfolio.name}
                  onChange={(e) =>
                    setPortfolio({ ...portfolio, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={portfolio.description}
                  onChange={(e) =>
                    setPortfolio({ ...portfolio, description: e.target.value })
                  }
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Visibility
                </label>
                <select
                  value={portfolio.visibility}
                  onChange={(e) =>
                    setPortfolio({ ...portfolio, visibility: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="restricted">Restricted Access</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Theme
                </label>
                <div className="flex space-x-2">
                  {["light", "dark", "blue", "green"].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setPortfolio({ ...portfolio, theme })}
                      className={`px-4 py-2 rounded-lg capitalize ${
                        portfolio.theme === theme
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section Management */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-3">Sections</h3>
              <div className="space-y-2">
                {portfolio.sections.map((section, index) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleSectionToggle(section.id)}
                        className={`w-8 h-8 rounded flex items-center justify-center ${
                          section.enabled
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <i
                          className={`fas fa-${
                            section.enabled ? "check" : "plus"
                          }`}
                        ></i>
                      </button>
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div className="text-xs text-gray-500 capitalize">
                          {section.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <div className="flex flex-col">
                        {index > 0 && (
                          <button
                            onClick={() => handleSectionOrder(index, index - 1)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <i className="fas fa-chevron-up"></i>
                          </button>
                        )}
                        {index < portfolio.sections.length - 1 && (
                          <button
                            onClick={() => handleSectionOrder(index, index + 1)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <i className="fas fa-chevron-down"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSave}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
              >
                <i className="fas fa-save mr-2"></i>
                Save Draft
              </button>
              <button
                onClick={handlePreview}
                className="w-full py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center justify-center"
              >
                <i className="fas fa-eye mr-2"></i>
                Preview
              </button>
              <button
                onClick={handlePublish}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
              >
                <i className="fas fa-rocket mr-2"></i>
                Publish Portfolio
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="lg:w-2/3">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">Preview</h3>
              <div className="text-sm text-gray-500">
                <i className="fas fa-eye mr-1"></i>
                Real-time Preview
              </div>
            </div>

            {/* Portfolio Preview */}
            <div className="bg-white rounded-lg shadow p-6">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {portfolio.name}
                </h1>
                <p className="text-gray-600">{portfolio.description}</p>
                <div className="mt-4 flex justify-center space-x-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                    Contact
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg">
                    Download CV
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg">
                    Share
                  </button>
                </div>
              </div>

              {/* Sections Preview */}
              <div className="space-y-8">
                {portfolio.sections
                  .filter((section) => section.enabled)
                  .map((section) => (
                    <div key={section.id} className="border-t pt-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {section.title}
                      </h2>

                      {section.type === "text" && (
                        <div className="text-gray-700">
                          <p>
                            This is a sample text section. You can edit this
                            content in the builder.
                          </p>
                        </div>
                      )}

                      {section.type === "projects" && (
                        <div className="grid grid-cols-2 gap-4">
                          {[1, 2].map((proj) => (
                            <div
                              key={proj}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <h3 className="font-bold mb-2">
                                Sample Project {proj}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Project description goes here...
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.type === "skills" && (
                        <div className="space-y-3">
                          {[
                            "React",
                            "Node.js",
                            "UI/UX Design",
                            "Project Management",
                          ].map((skill) => (
                            <div
                              key={skill}
                              className="flex items-center justify-between"
                            >
                              <span className="font-medium">{skill}</span>
                              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: "80%" }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.type === "education" && (
                        <div className="space-y-4">
                          <div className="border-l-4 border-blue-500 pl-4">
                            <h3 className="font-bold">University Name</h3>
                            <p className="text-gray-600">Degree Program</p>
                            <p className="text-sm text-gray-500">2018 - 2022</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t text-center text-gray-500 text-sm">
                <p>Portfolio generated using Project Management System</p>
                <p className="mt-1">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                {portfolio.sections.filter((s) => s.enabled).length}
              </div>
              <div className="text-sm text-gray-600">Active Sections</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-gray-600">Projects Included</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">
                {portfolio.visibility === "public" ? "Public" : "Private"}
              </div>
              <div className="text-sm text-gray-600">Visibility</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioBuilder;
