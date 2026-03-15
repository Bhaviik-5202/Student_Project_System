import { useState, useEffect, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

const GradeDistribution = memo(() => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/analytics/grade-distribution");
        setCourses(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch grade distribution", error);
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const [selectedCourse, setSelectedCourse] = useState(1);

  const selectedCourseData = useMemo(
    () => courses.find((c) => c.id === selectedCourse),
    [courses, selectedCourse],
  );

  const gradeItems = useMemo(
    () => [
      {
        grade: "A (90-100%)",
        count: selectedCourseData?.a || 0,
        color: "bg-emerald-500",
      },
      {
        grade: "B (80-89%)",
        count: selectedCourseData?.b || 0,
        color: "bg-blue-500",
      },
      {
        grade: "C (70-79%)",
        count: selectedCourseData?.c || 0,
        color: "bg-amber-500",
      },
      {
        grade: "D (60-69%)",
        count: selectedCourseData?.d || 0,
        color: "bg-orange-500",
      },
      {
        grade: "F (Below 60%)",
        count: selectedCourseData?.f || 0,
        color: "bg-rose-500",
      },
    ],
    [selectedCourseData],
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Grade Distribution
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              View grade statistics across courses
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800">
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Course Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Select Course
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {coursesLoading ? (
                  <div className="text-center py-4 text-slate-500">Loading courses...</div>
                ) : courses.length === 0 ? (
                  <div className="text-center py-4 text-slate-500">No course data found.</div>
                ) : (
                  courses.map((course) => (
                    <button
                      key={course.id || course._id}
                      onClick={() => setSelectedCourse(course.id || course._id)}
                      className={`w-full p-4 text-left rounded-lg transition-colors ${
                        selectedCourse === (course.id || course._id)
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 border"
                          : "border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      <div className="font-medium text-slate-900 dark:text-white">
                        {course.name || course.courseName}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Average Grade: {course.avgGrade}%
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Grade Distribution Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                {selectedCourseData?.name} - Grade Distribution
              </h3>

              <div className="space-y-4">
                {gradeItems.map((item, index) => {
                  const total =
                    (selectedCourseData?.a || 0) +
                    (selectedCourseData?.b || 0) +
                    (selectedCourseData?.c || 0) +
                    (selectedCourseData?.d || 0) +
                    (selectedCourseData?.f || 0);
                  const percentage =
                    total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;

                  return (
                    <div key={index}>
                      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
                        <span>{item.grade}</span>
                        <span>
                          {item.count} students ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                        <div
                          className={`h-4 rounded-full ${item.color}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Statistics */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedCourseData?.avgGrade}%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Average Grade
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {(selectedCourseData?.a || 0) +
                        (selectedCourseData?.b || 0) +
                        (selectedCourseData?.c || 0)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Passing Students
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedCourseData?.f || 0}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Failed Students
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedCourseData
                        ? selectedCourseData.a +
                          selectedCourseData.b +
                          selectedCourseData.c +
                          selectedCourseData.d +
                          selectedCourseData.f
                        : 0}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Total Students
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

GradeDistribution.displayName = "GradeDistribution";

export default GradeDistribution;
