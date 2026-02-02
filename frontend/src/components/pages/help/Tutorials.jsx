import React, { memo, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Tutorials = memo(() => {
  const navigate = useNavigate();
  const tutorials = useMemo(() => [
    {
      id: 1,
      title: "Getting Started Guide",
      description: "Learn the basics of using the system",
      duration: "15 min",
      category: "Basics",
      completed: true,
    },
    {
      id: 2,
      title: "Project Management",
      description: "How to create and manage projects",
      duration: "25 min",
      category: "Projects",
      completed: true,
    },
    {
      id: 3,
      title: "Team Collaboration",
      description: "Working with teams and discussions",
      duration: "20 min",
      category: "Collaboration",
      completed: false,
    },
    {
      id: 4,
      title: "Assignment Submission",
      description: "How to submit assignments properly",
      duration: "10 min",
      category: "Assignments",
      completed: false,
    },
    {
      id: 5,
      title: "Using the Calendar",
      description: "Managing meetings and deadlines",
      duration: "12 min",
      category: "Features",
      completed: false,
    },
    {
      id: 6,
      title: "Reporting and Analytics",
      description: "Understanding your progress data",
      duration: "18 min",
      category: "Analytics",
      completed: false,
    },
  ], []);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => [
    "All",
    "Basics",
    "Projects",
    "Collaboration",
    "Assignments",
    "Features",
    "Analytics",
  ], []);

  const filteredTutorials = useMemo(() => 
    tutorials.filter(
      (tutorial) =>
        selectedCategory === "All" ||
        tutorial.category === selectedCategory
    ),
    [tutorials, selectedCategory]
  );

  const completedCount = useMemo(() => 
    tutorials.filter((t) => t.completed).length,
    [tutorials]
  );

  const progressPercentage = useMemo(() => 
    (completedCount / tutorials.length) * 100,
    [completedCount, tutorials.length]
  );

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/help")}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center mb-4"
          >
            ← Back to Help Center
          </button>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Video Tutorials
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Watch step-by-step video tutorials to learn how to use the system
              effectively
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 dark:bg-blue-500 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredTutorials.map((tutorial) => (
              <div
                key={tutorial.id}
                className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6"
              >
                <div className="relative mb-4">
                  <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎬</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {tutorial.duration}
                      </div>
                    </div>
                  </div>
                  {tutorial.completed && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs rounded-full">
                      Completed
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {tutorial.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {tutorial.description}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded">
                    {tutorial.category}
                  </span>
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                    {tutorial.completed ? "Watch Again" : "Start Tutorial"}
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Progress */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Your Learning Progress
          </h3>
          <div className="mb-6">
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
              <span>Completed Tutorials</span>
              <span>
                {completedCount} of {tutorials.length}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
              <div
                className="bg-emerald-500 dark:bg-emerald-400 h-3 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
              View All Tutorials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

Tutorials.displayName = 'Tutorials';

export default Tutorials;
