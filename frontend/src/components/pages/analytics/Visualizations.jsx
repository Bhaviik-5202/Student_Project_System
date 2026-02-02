import { useState, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";

const Visualizations = memo(() => {
  const navigate = useNavigate();
  const [chartType, setChartType] = useState("bar");

  const gradeBars = useMemo(
    () => [
      { label: "A", value: 25, color: "bg-emerald-500" },
      { label: "B", value: 40, color: "bg-blue-500" },
      { label: "C", value: 20, color: "bg-amber-500" },
      { label: "D", value: 10, color: "bg-orange-500" },
      { label: "F", value: 5, color: "bg-rose-500" },
    ],
    []
  );

  const courseEnrollments = useMemo(
    () => [
      {
        course: "Software Engineering",
        enrollment: 45,
        capacity: 50,
      },
      { course: "Database Systems", enrollment: 40, capacity: 45 },
      { course: "Web Development", enrollment: 35, capacity: 40 },
      { course: "Data Structures", enrollment: 40, capacity: 45 },
      { course: "Machine Learning", enrollment: 30, capacity: 35 },
    ],
    []
  );

  const performanceMonths = useMemo(
    () => [
      { month: "Sep", overall: 65, attendance: 70, assignments: 60 },
      { month: "Oct", overall: 70, attendance: 75, assignments: 65 },
      { month: "Nov", overall: 75, attendance: 80, assignments: 70 },
      { month: "Dec", overall: 78, attendance: 82, assignments: 75 },
      { month: "Jan", overall: 82, attendance: 85, assignments: 80 },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Data Visualizations
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Interactive charts and data visualizations
            </p>
          </div>
          <div className="flex gap-2">
            {["bar", "line", "pie", "radar"].map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-1 rounded-lg text-sm capitalize ${
                  chartType === type
                    ? "bg-blue-600 dark:bg-blue-700 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Grade Distribution Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Grade Distribution
            </h3>
            <div className="h-64 flex items-end justify-between">
              {gradeBars.map((bar, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-12 ${bar.color} rounded-t-lg`}
                    style={{ height: `${bar.value * 2}px` }}
                  ></div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">{bar.label}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{bar.value}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Course Enrollment */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Course Enrollment
            </h3>
            <div className="space-y-4">
              {courseEnrollments.map((course, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
                    <span>{course.course}</span>
                    <span>
                      {course.enrollment}/{course.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        course.enrollment / course.capacity >= 0.9
                          ? "bg-rose-500"
                          : course.enrollment / course.capacity >= 0.7
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{
                        width: `${
                          (course.enrollment / course.capacity) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Trends */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Performance Trends Over Time
          </h3>
          <div className="h-64 flex items-end space-x-4">
            {performanceMonths.map((month, index) => (
              <div key={index} className="flex-1 flex space-x-1">
                <div
                  className="w-1/3 bg-blue-500 rounded-t"
                  style={{ height: `${month.overall * 2}px` }}
                  title={`Overall: ${month.overall}%`}
                ></div>
                <div
                  className="w-1/3 bg-emerald-500 rounded-t"
                  style={{ height: `${month.attendance * 2}px` }}
                  title={`Attendance: ${month.attendance}%`}
                ></div>
                <div
                  className="w-1/3 bg-purple-500 rounded-t"
                  style={{ height: `${month.assignments * 2}px` }}
                  title={`Assignments: ${month.assignments}%`}
                ></div>
                <div className="absolute mt-2 text-xs text-slate-600 dark:text-slate-400">
                  {month.month}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-6 mt-8">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Overall</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-emerald-500 rounded mr-2"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Attendance</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Assignments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Visualizations.displayName = "Visualizations";

export default Visualizations;
