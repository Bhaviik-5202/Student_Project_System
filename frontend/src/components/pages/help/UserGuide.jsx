import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserGuide = () => {
  const navigate = useNavigate();
  const [chapters] = useState([
    {
      id: 1,
      title: "Introduction",
      sections: [
        "Welcome to the System",
        "System Requirements",
        "Getting Started",
      ],
    },
    {
      id: 2,
      title: "User Accounts",
      sections: [
        "Creating an Account",
        "Profile Management",
        "Security Settings",
      ],
    },
    {
      id: 3,
      title: "Dashboard",
      sections: ["Overview", "Navigation", "Quick Actions"],
    },
    {
      id: 4,
      title: "Projects",
      sections: ["Creating Projects", "Managing Teams", "Project Submissions"],
    },
    {
      id: 5,
      title: "Assignments",
      sections: ["Submitting Work", "Grading System", "Deadlines"],
    },
  ]);

  const [activeChapter, setActiveChapter] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/help")}
            className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
          >
            ← Back to Help Center
          </button>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              User Guide
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Complete user manual and documentation for the Project Management
              System
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chapters Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Chapters
              </h3>
              <div className="space-y-2">
                {chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => setActiveChapter(chapter.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeChapter === chapter.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium">{chapter.title}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chapter Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {chapters.find((ch) => ch.id === activeChapter) && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {chapters.find((ch) => ch.id === activeChapter)?.title}
                  </h2>

                  <div className="prose max-w-none">
                    {activeChapter === 1 && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Welcome to the System
                          </h3>
                          <p className="text-gray-700">
                            Welcome to the Project Management System for
                            Students. This platform is designed to help
                            students, faculty, and administrators manage
                            academic projects efficiently.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            System Requirements
                          </h3>
                          <ul className="list-disc pl-5 text-gray-700 space-y-2">
                            <li>
                              Modern web browser (Chrome, Firefox, Safari, Edge)
                            </li>
                            <li>Internet connection</li>
                            <li>JavaScript enabled</li>
                            <li>Minimum screen resolution: 1024x768</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Getting Started
                          </h3>
                          <p className="text-gray-700">
                            To get started, create an account using your
                            institutional email. Once registered, you can access
                            your dashboard and begin using the system features.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeChapter === 2 && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Creating an Account
                          </h3>
                          <p className="text-gray-700">
                            Click on the Register button and fill out the
                            registration form with your details. You'll need to
                            verify your email address to activate your account.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Profile Management
                          </h3>
                          <p className="text-gray-700">
                            Update your profile information, upload a profile
                            picture, and manage your personal settings from the
                            Profile section.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeChapter === 3 && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Dashboard Overview
                          </h3>
                          <p className="text-gray-700">
                            Your dashboard provides an overview of your
                            activities, upcoming deadlines, recent
                            notifications, and quick access to important
                            features.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Navigation
                          </h3>
                          <p className="text-gray-700">
                            Use the sidebar navigation to access different
                            sections of the system. The main sections include
                            Projects, Assignments, Meetings, and Reports.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex justify-between">
                      <button
                        onClick={() =>
                          setActiveChapter(Math.max(1, activeChapter - 1))
                        }
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        disabled={activeChapter === 1}
                      >
                        ← Previous Chapter
                      </button>
                      <button
                        onClick={() =>
                          setActiveChapter(
                            Math.min(chapters.length, activeChapter + 1)
                          )
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        disabled={activeChapter === chapters.length}
                      >
                        Next Chapter →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
