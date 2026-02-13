// src/components/pages/dashboard/ProgressVisualization.jsx
import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";

const MilestoneMarker = memo(({ milestone, projectProgress }) => (
  <div key={milestone} className="flex flex-col items-center">
    <div
      className={`w-1 h-1 rounded-full ${
        projectProgress >= milestone
          ? "bg-slate-600 dark:bg-slate-300"
          : "bg-slate-300 dark:bg-slate-600"
      }`}
    />
    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
      {milestone}%
    </span>
  </div>
));

MilestoneMarker.displayName = "MilestoneMarker";

MilestoneMarker.propTypes = {
  milestone: PropTypes.number.isRequired,
  projectProgress: PropTypes.number.isRequired,
};

const getColorClass = (color) => {
  const colorMap = {
    blue: "bg-blue-500",
    green: "bg-emerald-500",
    yellow: "bg-amber-500",
    purple: "bg-purple-500",
  };
  return colorMap[color] || "bg-blue-500";
};

const ProgressVisualization = memo(({ userRole = "student" }) => {
  const projects = useMemo(
    () =>
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
          ],
    [userRole],
  );

  return (
    <div className="space-y-6">
      {projects.map((project, index) => (
        <div key={index} className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-3 ${getColorClass(
                  project.color,
                )}`}
              />
              <div>
                <div className="font-medium text-slate-900 dark:text-white">
                  {project.name}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {userRole === "student"
                    ? project.status
                    : `${project.students} students`}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="font-bold text-slate-900 dark:text-white mr-3">
                {project.progress}%
              </span>
              {project.progress === 100 && (
                <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 rounded text-xs font-medium">
                  Completed
                </span>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${getColorClass(
                  project.color,
                )} transition-all duration-500`}
                style={{ width: `${project.progress}%` }}
              />
            </div>

            {/* Milestone markers */}
            <div className="flex justify-between mt-1">
              {[0, 25, 50, 75, 100].map((milestone) => (
                <MilestoneMarker
                  key={milestone}
                  milestone={milestone}
                  projectProgress={project.progress}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

ProgressVisualization.displayName = "ProgressVisualization";

ProgressVisualization.propTypes = {
  userRole: PropTypes.oneOf(["student", "faculty", "admin"]),
};

export default ProgressVisualization;
