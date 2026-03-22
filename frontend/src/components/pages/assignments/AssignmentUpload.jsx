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
import "../../../assets/styles/assignments.css";

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
      <div className="assignment-page flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="assignment-subtitle mt-4">Initializing assignment registry...</p>
      </div>
    );
  }

  return (
    <div className="assignment-page">
      <div className="assignment-container" style={{ maxWidth: '900px' }}>
        <div className="assignment-header">
          <div>
            <h1 className="assignment-title">Assignment Registry</h1>
            <p className="assignment-subtitle">Set up a new academic task for your students</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="assignment-btn assignment-btn-secondary p-2"
            title="Discard changes"
          >
            <X size={20} />
          </button>
        </div>

        <div className="assignment-card">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="assignment-form-group md:col-span-2">
                <label className="assignment-label">Assignment Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="assignment-input"
                  placeholder="e.g. Database Design Phase 1"
                  required
                />
              </div>

              {/* Course */}
              <div className="assignment-form-group">
                <label className="assignment-label">Target Course</label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  className="assignment-select"
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
              <div className="assignment-form-group">
                <label className="assignment-label">Submission Deadline</label>
                <input
                  type="datetime-local"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  onClick={(e) => e.target.showPicker()}
                  onFocus={(e) => e.target.showPicker()}
                  onKeyDown={(e) => e.preventDefault()}
                  className="assignment-input"
                  required
                />
              </div>

              {/* Total Points */}
              <div className="assignment-form-group">
                <label className="assignment-label">Max Score Allocation</label>
                <input
                  type="number"
                  name="maxScore"
                  value={formData.maxScore}
                  onChange={handleInputChange}
                  className="assignment-input"
                  min="0"
                  required
                />
              </div>

              {/* Description */}
              <div className="assignment-form-group md:col-span-2">
                <label className="assignment-label">Brief Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="assignment-textarea"
                  placeholder="Summary of the academic task..."
                  rows="2"
                  required
                />
              </div>

              {/* Instructions */}
              <div className="assignment-form-group md:col-span-2">
                <label className="assignment-label">Detailed Instructions</label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  className="assignment-textarea"
                  placeholder="Tell students exactly what is expected..."
                  rows="4"
                />
              </div>

              {/* File Upload Area */}
              <div className="assignment-form-group md:col-span-2">
                <label className="assignment-label">Supporting Resources</label>
                <div 
                  className="assignment-upload-area"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center">
                      <Upload size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Click to upload resource files</p>
                      <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest">Documents, ZIPs, or reference materials</p>
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
                  <div className="assignment-file-list">
                    {formData.files.map((file, index) => (
                      <div key={index} className="assignment-file-item">
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-indigo-500" />
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="assignment-btn assignment-btn-secondary flex-1"
              >
                Cancel & Exit
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="assignment-btn assignment-btn-primary flex-[2]"
              >
                {submitting ? "Finalizing..." : "Create Assignment Registry"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

AssignmentUpload.displayName = "AssignmentUpload";
export default AssignmentUpload;
