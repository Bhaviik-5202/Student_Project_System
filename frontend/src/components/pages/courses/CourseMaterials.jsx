import React, { useState, useEffect, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { 
  ChevronLeft, 
  FileText, 
  Download, 
  ArrowRight,
  Library,
  MonitorPlay,
  FileCode,
  ExternalLink
} from "lucide-react";
import courseService from "../../../services/courseService";

const CourseMaterials = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await courseService.getCourseById(id);
        if (response.success) {
          setCourse(response.data);
        } else {
          toast.error(response.message || "Failed to load materials");
          navigate(`/courses/${id}`);
        }
      } catch (error) {
        console.error("Error fetching course", error);
        toast.error("An error occurred while loading materials");
        navigate(`/courses/${id}`);
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
        <p className="mt-4 text-gray-500 font-medium">Loading materials...</p>
      </div>
    );
  }

  const materials = course?.materials || [];

  return (
    <div className="dashboard-content">
      <div className="mb-8">
        <button
          onClick={() => navigate(`/courses/${id}`)}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 font-semibold transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Course
        </button>
        
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 text-white rounded-xl">
            <Library className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Course Resources
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Learning assets for {course?.name || course?.title}
            </p>
          </div>
        </div>
      </div>

      {materials.length === 0 ? (
        <div className="card p-16 text-center border-dashed max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileCode className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No resources available</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Your instructor hasn't uploaded any materials for this course yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material, index) => (
            <div key={index} className="card h-full flex flex-col">
              <div className="card-body flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    material.type === "PDF" 
                    ? "bg-red-50 text-red-600 dark:bg-red-900/20" 
                    : material.type === "Video" 
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20" 
                    : "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20"
                  }`}>
                    {material.type === "PDF" ? <FileText className="w-6 h-6" /> : material.type === "Video" ? <MonitorPlay className="w-6 h-6" /> : <ExternalLink className="w-6 h-6" />}
                  </div>
                  <span className="badge badge-secondary">{material.type}</span>
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {material.title}
                </h3>
              </div>
              
              <div className="card-footer bg-gray-50/50 dark:bg-white/5 flex items-center justify-between py-3 px-4">
                <a 
                  href={material.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 font-bold text-sm flex items-center gap-1 hover:underline"
                >
                  View <ArrowRight className="w-4 h-4" />
                </a>
                <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

CourseMaterials.displayName = "CourseMaterials";

export default CourseMaterials;
