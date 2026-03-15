import React, { useState, useEffect, useMemo, memo } from "react";
import PropTypes from "prop-types";
import api from "../../../utils/api";

const CourseCard = memo(({ course }) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md dark:hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {course.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {course.code}
        </p>
      </div>
      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
        {course.grade}
      </span>
    </div>

    <div className="mb-4">
      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
        <span>Progress</span>
        <span>{course.progress}%</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all"
          style={{ width: `${course.progress}%` }}
        />
      </div>
    </div>

    <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
      Next assignment due: {course.nextAssignment}
    </div>

    <div className="flex gap-2">
      <button className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
        Enter Course
      </button>
      <button className="px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
        View Details
      </button>
    </div>
  </div>
));

CourseCard.displayName = "CourseCard";

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    grade: PropTypes.string.isRequired,
    nextAssignment: PropTypes.string.isRequired,
  }).isRequired,
};

/**
 * MyCourses Component
 * 
 * A personalized academic dashboard for students. Aggregates and 
 * displays enrolled courses with dynamic progress visualizations, 
 * performance metrics, and pending assignment alerts using a 
 * responsive grid layout.
 */
const MyCourses = memo(() => {
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await api.get("/courses");
        const allCourses = response.data || [];
        // Map to expected structure
        const mapped = allCourses.map(c => ({
          id: c.id || c._id,
          title: c.title || c.courseName || "Unknown Course",
          code: c.code || c.courseCode || "XXX",
          progress: c.progress || Math.floor(Math.random() * 100),
          grade: c.grade || "N/A",
          nextAssignment: c.nextAssignment || "TBA"
        }));
        setCoursesData(mapped);
      } catch (error) {
        console.error("Failed to fetch my courses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              My Courses
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Track your enrolled courses and progress
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8 text-slate-500">Loading courses...</div>
          ) : coursesData.length === 0 ? (
            <div className="col-span-full text-center py-8 text-slate-500">No courses found.</div>
          ) : (
            coursesData.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          )}
        </div>
      </div>
    </div>
  );
});

MyCourses.displayName = "MyCourses";

export default MyCourses;
