import React, { useState, useEffect, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  BookOpen, 
  User, 
  Clock, 
  MapPin, 
  GraduationCap,
  FileText,
  Users,
  CheckCircle,
  MessageCircle,
  Video,
  Info,
  ArrowRight
} from "lucide-react";
import courseService from "../../../services/courseService";
import { toast } from "react-hot-toast";

const CourseDetails = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await courseService.getCourseById(id);
        if (res.success) {
          setCourse(res.data);
        } else {
          toast.error(res.message || "Course not found");
          navigate("/courses/catalog");
        }
      } catch (err) {
        console.error("Failed to fetch course details", err);
        toast.error("Error loading course details");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading course data...</p>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="dashboard-content">
      <button
        onClick={() => navigate("/courses/catalog")}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 font-semibold transition-colors"
      >
        <ChevronLeft className="w-5 h-5" /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-header bg-gray-50/50 dark:bg-gray-900/50 block">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="badge badge-primary">{course.code}</span>
                <span className="badge badge-secondary">{course.semester || "Spring 2024"}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {course.name || course.title}
              </h1>
            </div>
            <div className="card-body">
              <div className="flex items-center gap-2 text-indigo-600 mb-4">
                <Info className="w-5 h-5" />
                <h3 className="text-lg font-bold">Course Synopsis</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                {course.description || "This comprehensive module covers the fundamental and advanced principles of the subject, providing students with both theoretical knowledge and practical applications."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Schedule</span>
                  </div>
                  <p className="text-sm font-semibold">{course.schedule || "Mon, Wed 10:00 AM"}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Location</span>
                  </div>
                  <p className="text-sm font-semibold">{course.room || "Lab 402, Block B"}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Credits</span>
                  </div>
                  <p className="text-sm font-semibold">{course.credits || 4} Units</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h3 className="card-title flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" /> Curriculum Map
              </h3>
              <button
                onClick={() => navigate(`/courses/${id}/syllabus`)}
                className="btn btn-secondary btn-sm"
              >
                Full Roadmap <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {(course.syllabus && course.syllabus.length > 0) ? (
                  course.syllabus.slice(0, 3).map((topic, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                      <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-gray-800 text-indigo-600 rounded-lg flex items-center justify-center font-bold border border-gray-100 dark:border-gray-700">
                        {topic.week || index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                          {topic.topic || topic.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {topic.description || "Core concepts and specialized case studies."}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-400 italic">Syllabus details coming soon.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Lead Instructor</h3>
            </div>
            <div className="card-body text-center">
              <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white dark:border-gray-800 shadow-sm">
                <User className="w-10 h-10 text-indigo-500" />
              </div>
              <h4 className="text-lg font-bold">{course.faculty?.name || course.instructor || "Visiting Lead"}</h4>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4">Professor</p>

              <div className="flex flex-col gap-2 mt-4">
                <button className="btn btn-secondary w-full flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Message
                </button>
                <button className="btn btn-secondary w-full flex items-center justify-center gap-2">
                  <Video className="w-4 h-4" /> Office Hours
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-indigo-600 text-white border-0 shadow-lg">
            <div className="card-body">
              <h3 className="text-xl font-bold mb-2">Registration Open</h3>
              <p className="text-indigo-100 text-sm mb-6">
                Enrollment for academic session 2024 is currently active.
              </p>
              <button
                onClick={() => navigate("/courses/register")}
                className="btn bg-white text-indigo-600 hover:bg-gray-100 w-full font-bold py-3"
              >
                Enroll in Course
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" /> Learning Resources
              </h3>
            </div>
            <div className="card-body">
              <p className="text-sm text-gray-500 mb-4">Access course materials, readings, and repository.</p>
              <button
                onClick={() => navigate(`/courses/${id}/materials`)}
                className="btn btn-secondary w-full"
              >
                Access Repository
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CourseDetails.displayName = "CourseDetails";

export default CourseDetails;
