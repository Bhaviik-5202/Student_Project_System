import { useCallback, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";

const RoadmapViewer = memo(() => {
  const navigate = useNavigate();
  const roadmap = useMemo(
    () => ({
      title: "Software Engineering Roadmap",
      description: "Complete learning path for software engineering students",
      phases: [
        {
          id: 1,
          name: "Foundation",
          quarter: "Q1 2024",
          objectives: [
            "Learn programming fundamentals",
            "Understand basic algorithms",
            "Master version control with Git",
          ],
          status: "completed",
        },
        {
          id: 2,
          name: "Web Development",
          quarter: "Q2 2024",
          objectives: [
            "Learn HTML, CSS, JavaScript",
            "Master React framework",
            "Build responsive web applications",
          ],
          status: "in-progress",
        },
        {
          id: 3,
          name: "Backend Development",
          quarter: "Q3 2024",
          objectives: [
            "Learn Node.js and Express",
            "Understand databases (SQL & NoSQL)",
            "Build RESTful APIs",
          ],
          status: "upcoming",
        },
        {
          id: 4,
          name: "Advanced Topics",
          quarter: "Q4 2024",
          objectives: [
            "Learn cloud computing",
            "Understand DevOps practices",
            "Study system design",
          ],
          status: "upcoming",
        },
      ],
    }),
    [],
  );

  const statusStyles = {
    completed: {
      indicator: "bg-emerald-500",
      card: "border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-950/30",
      text: "text-emerald-700 dark:text-emerald-300",
      bullet: "text-emerald-500",
    },
    "in-progress": {
      indicator: "bg-amber-500",
      card: "border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/30",
      text: "text-amber-700 dark:text-amber-300",
      bullet: "text-amber-500",
    },
    upcoming: {
      indicator: "bg-slate-400",
      card: "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900",
      text: "text-slate-700 dark:text-slate-300",
      bullet: "text-slate-400",
    },
  };

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate],
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => handleNavigate("/timeline")}
            className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 flex items-center mb-4"
          >
            ← Back to Timeline
          </button>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {roadmap.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              {roadmap.description}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-0 right-0 top-8 h-1 bg-slate-300 dark:bg-slate-700"></div>

            {/* Phases */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {roadmap.phases.map((phase, index) => (
                <div key={phase.id} className="relative">
                  {/* Phase Indicator */}
                  <div
                    className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 z-10 ${
                      statusStyles[phase.status].indicator
                    }`}
                  ></div>

                  {/* Phase Card */}
                  <div
                    className={`mt-8 p-6 border rounded-lg ${
                      statusStyles[phase.status].card
                    }`}
                  >
                    <div className="mb-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          {phase.name}
                        </h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 text-xs rounded">
                          {phase.quarter}
                        </span>
                      </div>
                      <div
                        className={`text-sm font-medium mt-2 ${
                          statusStyles[phase.status].text
                        }`}
                      >
                        {phase.status.replace("-", " ").toUpperCase()}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Objectives:
                      </div>
                      <ul className="space-y-2">
                        {phase.objectives.map((objective, idx) => (
                          <li
                            key={idx}
                            className="flex items-start text-sm text-slate-700 dark:text-slate-300"
                          >
                            <span
                              className={`mr-2 mt-1 ${
                                phase.status === "completed"
                                  ? statusStyles.completed.bullet
                                  : phase.status === "in-progress" && idx < 2
                                    ? statusStyles["in-progress"].bullet
                                    : statusStyles.upcoming.bullet
                              }`}
                            >
                              {phase.status === "completed" ||
                              (phase.status === "in-progress" && idx < 2)
                                ? "✓"
                                : "○"}
                            </span>
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
              Legend
            </h4>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Completed
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  In Progress
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-slate-400 rounded-full mr-2"></div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Upcoming
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

RoadmapViewer.displayName = "RoadmapViewer";

export default RoadmapViewer;
