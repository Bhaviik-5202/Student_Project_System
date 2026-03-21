import { useState, useEffect, useCallback, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import submissionService from "../../../services/submissionService";
import assignmentService from "../../../services/assignmentService";
import toast from "react-hot-toast";

/**
 * AssignmentSubmission Component
 * 
 * A specialized interface for students to submit their completed 
 * project work. Features a multi-input form for title, description, 
 * file uploads, and student comments, with real-time submission 
 * status feedback.
 */
const AssignmentSubmission = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    comment: "",
    files: [],
  });

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await assignmentService.getById(id);
        if (response.success) {
          setAssignment(response.data);
          setFormData((prev) => ({
            ...prev,
            title: `Submission: ${response.data.title}`,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch assignment", error);
        toast.error("Failed to load assignment details");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [id]);

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
    if (formData.files.length === 0) {
      toast.error("Please upload at least one file");
      return;
    }

    try {
      setSubmitting(true);
      const toastId = toast.loading("Submitting assignment...");
      
      const submissionData = new FormData();
      submissionData.append("assignment", id); // Changed assignmentId -> assignment
      submissionData.append("title", formData.title);
      submissionData.append("description", formData.description);
      submissionData.append("comments", formData.comment);
      
      formData.files.forEach((file) => {
        submissionData.append("file", file); // Backend expects 'file' or 'files'? Based on controller it might be Single file or plural.
      });

      const response = await submissionService.createSubmission(submissionData);
      
      if (response.success) {
        toast.success("Assignment submitted successfully!", { id: toastId });
        navigate("/assignments");
      } else {
        toast.error(response.message || "Failed to submit assignment", { id: toastId });
      }
    } catch (error) {
      console.error("Submission failed", error);
      toast.error("An error occurred during submission");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="assignment-page" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p className="assignment-subtitle">Loading assignment details...</p>
      </div>
    );
  }

  return (
    <div className="assignment-page">
      <div className="assignment-container" style={{ maxWidth: "800px" }}>
        <div className="assignment-header">
          <div>
            <h1 className="assignment-title">Submit Assignment</h1>
            <p className="assignment-subtitle">
              {assignment?.title} - {assignment?.course || (assignment?.courseId?.title) || "Course Name"}
            </p>
          </div>
        </div>

        <div className="assignment-card">
          <form onSubmit={handleSubmit}>
            <div className="assignment-form-group">
              <label className="assignment-label">Submission Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="assignment-input"
                placeholder="Enter submission title"
                required
              />
            </div>

            <div className="assignment-form-group">
              <label className="assignment-label">Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="assignment-textarea"
                placeholder="Briefly describe your work"
                rows="3"
              />
            </div>

            <div className="assignment-form-group">
              <label className="assignment-label">Upload Files</label>
              <div 
                className="assignment-upload-area"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <div style={{ color: "var(--assignment-text-muted)" }}>
                  <p style={{ fontWeight: "600", color: "var(--assignment-primary)", marginBottom: "4px" }}>
                    Click to upload
                  </p>
                  <p style={{ fontSize: "12px" }}>PDF, ZIP, DOCX up to 10MB</p>
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
                      <span style={{ fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {file.name}
                      </span>
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

            <div className="assignment-form-group">
              <label className="assignment-label">Comments for Instructor</label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                className="assignment-textarea"
                placeholder="Any additional notes..."
                rows="2"
              />
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
                {submitting ? "Submitting..." : "Submit Assignment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

AssignmentSubmission.displayName = "AssignmentSubmission";

export default AssignmentSubmission;
