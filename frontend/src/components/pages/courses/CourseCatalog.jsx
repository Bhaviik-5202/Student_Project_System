import React, { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  BookOpen, 
  User, 
  Clock, 
  Plus, 
  GraduationCap, 
  Info,
  Layers
} from "lucide-react";
import courseService from "../../../services/courseService";
import { useAuth } from "../../../hooks/useAuth";

const CourseCard = memo(({ course }) => {
  const navigate = useNavigate();
  
  return (
    <div className="card h-full flex flex-col hover:shadow-md transition-shadow">
      <div className="card-header pb-2 flex justify-between items-start">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{course.code}</span>
        </div>
        <span className="badge badge-secondary text-[10px]">
          {course.semester || "Current Term"}
        </span>
      </div>

      <div className="card-body flex-1">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
          {course.name || course.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">
          {course.description || "Course description not available."}
        </p>
        
        <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <User className="w-4 h-4" />
            <span>{course.faculty?.name || course.instructor || "Visiting Faculty"}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              <span>{course.credits || 0} Credits</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{course.schedule?.split(" ")[0] || "Flexible"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-50 dark:border-gray-800 mt-auto">
        <button
          onClick={() => navigate(`/courses/${course.id || course._id}`)}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
        >
          <Info className="w-4 h-4" /> View Details
        </button>
      </div>
    </div>
  );
});

CourseCard.displayName = "CourseCard";

const CourseCatalog = memo(() => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseService.getAllCourses();
        if (res?.success) {
          setCourses(res.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const searchLower = searchTerm.toLowerCase();
    const name = (course.name || course.title || "").toLowerCase();
    const code = (course.code || "").toLowerCase();
    const instructor = (course.faculty?.name || course.instructor || "").toLowerCase();
    
    return name.includes(searchLower) || code.includes(searchLower) || instructor.includes(searchLower);
  });

  const canAddCourse = user?.role === "admin" || user?.role === "faculty";

  return (
    <div className="dashboard-content">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Academic Catalog
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Explore and register for available modules
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control pl-10 h-10 min-w-[250px]"
            />
          </div>
          {canAddCourse && (
            <button 
              onClick={() => navigate("/courses/new")}
              className="btn btn-primary flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> New Module
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-400 font-medium">Loading catalog...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="card p-12 text-center max-w-lg mx-auto mt-10">
          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Modules Found</h3>
          <p className="text-gray-500">
            Try adjusting your search for "{searchTerm}"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id || course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
});

CourseCatalog.displayName = "CourseCatalog";

export default CourseCatalog;
