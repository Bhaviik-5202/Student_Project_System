import React, { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Plus,
  User,
  Info,
  Library,
  GraduationCap,
  Clock,
  Layout,
  ArrowRight
} from "lucide-react";
import courseService from "../../../services/courseService";

const CourseCard = memo(({ course }) => {
  const navigate = useNavigate();
  const progress = course.progress || 0;

  return (
    <div className="card h-full flex flex-col">
      <div className="card-header bg-gray-50/50 dark:bg-gray-900/50">
        <div className="flex justify-between items-start">
          <div>
            <span className="badge badge-primary mb-2">{course.code}</span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
              {course.name || course.title}
            </h3>
          </div>
        </div>
      </div>

      <div className="card-body flex-1 flex flex-col">
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Progress</span>
            <span className="text-sm font-bold text-indigo-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 py-4 border-t border-gray-100 dark:border-gray-800 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400">
            <User className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Instructor</p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {course.faculty?.name || course.instructor || "Visiting Lead"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          <button
            onClick={() => navigate(`/courses/${course.id || course._id}`)}
            className="btn btn-secondary btn-sm flex items-center justify-center gap-2"
          >
            <Info className="w-4 h-4" /> Details
          </button>
          <button
            onClick={() => navigate(`/courses/${course.id || course._id}/materials`)}
            className="btn btn-primary btn-sm flex items-center justify-center gap-2"
          >
            <Library className="w-4 h-4" /> Resources
          </button>
        </div>
      </div>
    </div>
  );
});

CourseCard.displayName = "CourseCard";

const MyCourses = memo(() => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await courseService.getMyCourses();
        if (res.success) {
          setCourses(res.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch my courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading your courses...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Courses
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your active modules and academic progress
          </p>
        </div>
        <button
          onClick={() => navigate("/courses/register")}
          className="btn btn-primary flex items-center gap-2 py-3 px-6"
        >
          <Plus className="w-5 h-5" /> New Enrollment
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="card p-16 text-center max-w-2xl mx-auto border-dashed">
          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No active courses</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
            You haven't registered for any modules this semester yet.
          </p>
          <button
            onClick={() => navigate("/courses/register")}
            className="btn btn-primary px-8"
          >
            Start Registration <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id || course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
});

MyCourses.displayName = "MyCourses";
export default MyCourses;
