import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import assignmentService from "../../../services/assignmentService";
import courseService from "../../../services/courseService";
import toast from "react-hot-toast";

/**
 * AssignmentUpload Component
 * 
 * A specialized interface for faculty to create new academic tasks.
 * Includes fields for title, detailed description, course selection,
 * due date, point allocation, and resource file uploads.
 */
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
      assignmentData.append("course", formData.courseId); // Changed courseId -> course
      assignmentData.append("dueDate", formData.deadline); // Changed deadline -> dueDate
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
      <div className="assignment-page" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p className="assignment-subtitle">Loading creation form...</p>
      </div>
    );
  }

  return (
    <div className="assignment-page">
      <div className="assignment-container" style={{ maxWidth: "900px" }}>
        <div className="assignment-header">
          <div>
            <h1 className="assignment-title">Create New Assignment</h1>
            <p className="assignment-subtitle">Set up a new academic task for your students</p>
          </div>
        </div>

        <div className="assignment-card">
          <form onSubmit={handleSubmit}>
            <div className="assignment-grid assignment-grid-2">
              <div className="assignment-form-group">
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

              <div className="assignment-form-group">
                <label className="assignment-label">Course</label>
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

              <div className="assignment-form-group">
                <label className="assignment-label">Due Date</label>
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

              <div className="assignment-form-group">
                <label className="assignment-label">Total Points</label>
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
            </div>

            <div className="assignment-form-group">
              <label className="assignment-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="assignment-textarea"
                placeholder="Brief summary of the assignment"
                rows="3"
                required
              />
            </div>

            <div className="assignment-form-group">
              <label className="assignment-label">Instructions</label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                className="assignment-textarea"
                placeholder="Detailed instructions for students..."
                rows="5"
              />
            </div>

            <div className="assignment-form-group">
              <label className="assignment-label">Attachments & Resources</label>
              <div 
                className="assignment-upload-area"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <div style={{ color: "var(--assignment-text-muted)" }}>
                  <p style={{ fontWeight: "600", color: "var(--assignment-primary)", marginBottom: "4px" }}>
                    Click to upload
                  </p>
                  <p style={{ fontSize: "12px" }}>Resource files for students (PDF, ZIP, etc.)</p>
                </div>
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>

              {formData.files.length > 0 && (
                <div className="assignment-file-list">
                  {formData.files.map((file, index) => (
                    <div key={index} className="assignment-file-item">
                      <span style={{ fontSize: "14px" }}>{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="assignment-btn-text"
                        style={{ color: "var(--color-error)" }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="assignment-btn assignment-btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="assignment-btn assignment-btn-primary"
                style={{ flex: 2 }}
              >
                {submitting ? "Processing..." : "Create Assignment"}
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
