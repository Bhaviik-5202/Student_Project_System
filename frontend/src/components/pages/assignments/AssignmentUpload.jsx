import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  BookOpen, 
  Calendar, 
  Award, 
  Plus, 
  X, 
  Save, 
  ArrowLeft, 
  Upload, 
  Info,
  Layout,
  ChevronRight
} from "lucide-react";
import assignmentService from "../../../services/assignmentService";
import courseService from "../../../services/courseService";
import toast from "react-hot-toast";

const AssignmentUpload = memo(() => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    deadline: "",
    maxScore: 100,
    instructions: "",
    files: [],
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseService.getAllCourses();
        if (response.success) {
          setCourses(response.data || []);
        } else {
          toast.error("Failed to load courses");
        }
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...selectedFiles],
    }));
  }, []);

  const removeFile = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.courseId) {
      toast.error("Please select a course");
      return;
    }

    try {
      setSubmitting(true);
      const toastId = toast.loading("Creating assignment...");
      
      const assignmentData = new FormData();
      assignmentData.append("title", formData.title);
      assignmentData.append("description", formData.description);
      assignmentData.append("course", formData.courseId);
      assignmentData.append("dueDate", formData.deadline);
      assignmentData.append("maxScore", formData.maxScore);
      assignmentData.append("instructions", formData.instructions);
      
      formData.files.forEach((file) => {
        if (file instanceof File) {
          assignmentData.append("attachments", file);
        }
      });

      const response = await assignmentService.create(assignmentData);
      
      if (response.success) {
        toast.success("Assignment created successfully!", { id: toastId });
        navigate("/assignments");
      } else {
        toast.error(response.message || "Failed to create assignment", { id: toastId });
      }
    } catch (error) {
      console.error("Creation failed", error);
      toast.error("An error occurred during assignment creation");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium text-sm italic">Initializing assignment registry...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 pb-4 border-b border-gray-100 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assignment Registry</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Set up a new academic task for your students</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-secondary p-2.5 rounded-xl shadow-sm"
          title="Discard changes"
        >
          <X size={20} />
        </button>
      </div>

      <div className="card shadow-lg border-gray-100 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="card-body p-6 md:p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Title */}
            <div className="form-group md:col-span-2">
              <label className="form-label font-bold text-gray-700 dark:text-gray-300 mb-2">Assignment Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input py-3"
                placeholder="e.g. Database Design Phase 1"
                required
              />
            </div>

            {/* Course */}
            <div className="form-group">
              <label className="form-label font-bold text-gray-700 dark:text-gray-300 mb-2">Target Course</label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleInputChange}
                className="select input py-3"
                required
              >
                <option value="">Select a Course</option>
                {courses.map((course) => (
                  <option key={course.id || course._id} value={course.id || course._id}>
                    {course.title || course.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="form-group">
              <label className="form-label font-bold text-gray-700 dark:text-gray-300 mb-2">Submission Deadline</label>
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                onClick={(e) => e.target.showPicker()}
                onFocus={(e) => e.target.showPicker()}
                onKeyDown={(e) => e.preventDefault()}
                className="input py-3"
                required
              />
            </div>

            {/* Total Points */}
            <div className="form-group">
              <label className="form-label font-bold text-gray-700 dark:text-gray-300 mb-2">Max Score Allocation</label>
              <input
                type="number"
                name="maxScore"
                value={formData.maxScore}
                onChange={handleInputChange}
                className="input py-3"
                min="0"
                required
              />
            </div>

            {/* Description */}
            <div className="form-group md:col-span-2">
              <label className="form-label font-bold text-gray-700 dark:text-gray-300 mb-2">Brief Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input textarea py-3"
                placeholder="Summary of the academic task..."
                rows="2"
                required
              />
            </div>

            {/* Instructions */}
            <div className="form-group md:col-span-2">
              <label className="form-label font-bold text-gray-700 dark:text-gray-300 mb-2">Detailed Instructions</label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                className="input textarea py-3"
                placeholder="Tell students exactly what is expected..."
                rows="4"
              />
            </div>

            {/* File Upload Area */}
            <div className="form-group md:col-span-2">
              <label className="form-label font-bold text-gray-700 dark:text-gray-300 mb-2">Supporting Resources</label>
              <div 
                className="border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/10 transition-all group shadow-inner-top bg-gray-50/30 dark:bg-slate-900/20"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all text-gray-400 shadow-sm border border-gray-100 dark:border-slate-700">
                    <Upload size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Click to upload resource files</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Documents, ZIPs, or reference materials</p>
                  </div>
                </div>
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {formData.files.length > 0 && (
                <div className="mt-8 flex flex-col gap-3">
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800 animate-slide-in">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center text-indigo-500 border border-gray-100 dark:border-slate-700 shadow-sm">
                          <FileText size={18} />
                        </div>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-gray-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary flex-1 h-14 font-bold text-base"
            >
              Cancel & Exit
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary flex-[2] h-14 font-bold text-base"
            >
              {submitting ? (
                "Finalizing..."
              ) : (
                "Create Assignment Registry"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

AssignmentUpload.displayName = "AssignmentUpload";
export default AssignmentUpload;
