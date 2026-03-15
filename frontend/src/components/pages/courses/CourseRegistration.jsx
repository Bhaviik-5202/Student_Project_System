import React, { memo, useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../../utils/api";

const CourseRegistration = memo(() => {
  const navigate = useNavigate();

  const [availableCourses, setAvailableCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");
        setAvailableCourses(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleCourseSelection = useCallback((courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId],
    );
  }, []);

  const handleRegistration = useCallback(async () => {
    if (selectedCourses.length === 0) {
      toast.error("Please select at least one course");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      toast.success(
        `Successfully registered for ${selectedCourses.length} course(s)`,
      );
      setLoading(false);
      setSelectedCourses([]);
      navigate("/courses/my");
    }, 1500);
  }, [selectedCourses, navigate]);

  const totalCredits = useMemo(
    () =>
      selectedCourses.reduce((total, courseId) => {
        const course = availableCourses.find((c) => c.id === courseId);
        return total + (course?.credits || 0);
      }, 0),
    [selectedCourses, availableCourses],
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/courses")}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center mb-4"
          >
            ← Back to Courses
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Course Registration
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Register for courses for the upcoming semester
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Available Courses
              </h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {coursesLoading ? (
                  <div className="text-center py-4 text-slate-500">Loading available courses...</div>
                ) : availableCourses.length === 0 ? (
                  <div className="text-center py-4 text-slate-500">No courses available.</div>
                ) : (
                  availableCourses.map((course) => (
                    <div
                      key={course.id || course._id}
                      className="border border-slate-200 dark:border-slate-700 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            checked={selectedCourses.includes(course.id || course._id)}
                            onChange={() => toggleCourseSelection(course.id || course._id)}
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                          />
                          <div className="ml-3">
                            <div className="font-medium text-slate-900 dark:text-white">
                              {course.title || course.courseName}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {course.code || course.courseCode} • {course.instructor || (course.instructorId ? course.instructorId.name : "TBA")}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                              {course.schedule || "TBA"} • {course.credits || 3} Credits •{" "}
                              {course.seats || 30} seats available
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {course.credits || 3} Credits
                          </div>
                          <div
                            className={`text-sm ${
                              (course.seats !== undefined ? course.seats : 30) > 5 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {course.seats !== undefined ? course.seats : 30} seats left
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Registration Summary */}
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Registration Summary
              </h3>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-slate-600 dark:text-slate-400">
                    Selected Courses
                  </div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    {selectedCourses.length}
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-slate-600 dark:text-slate-400">
                    Total Credits
                  </div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    {totalCredits}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-slate-600 dark:text-slate-400">
                    Maximum Allowed
                  </div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    18 Credits
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                  Selected Courses
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedCourses.map((courseId) => {
                    const course = availableCourses.find(
                      (c) => c.id === courseId,
                    );
                    return (
                      <div
                        key={courseId}
                        className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700 rounded"
                      >
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {course?.code}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {course?.credits} credits
                        </div>
                      </div>
                    );
                  })}
                  {selectedCourses.length === 0 && (
                    <div className="text-center py-4 text-slate-500 dark:text-slate-400">
                      No courses selected
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Registration Deadline
                </div>
                <div className="font-medium text-slate-900 dark:text-white">
                  January 30, 2024
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Late registration may incur fees
                </div>
              </div>

              <button
                onClick={handleRegistration}
                disabled={
                  loading || selectedCourses.length === 0 || totalCredits > 18
                }
                className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Registration...
                  </div>
                ) : totalCredits > 18 ? (
                  "Credit Limit Exceeded"
                ) : (
                  `Register for ${selectedCourses.length} Course(s)`
                )}
              </button>

              {totalCredits > 18 && (
                <div className="mt-3 text-sm text-rose-600 dark:text-rose-400 text-center">
                  Maximum credit limit is 18 credits
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CourseRegistration.displayName = "CourseRegistration";

export default CourseRegistration;
