import { useState, useCallback, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import submissionService from "../../../services/submissionService";

const AssignmentSubmission = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
    comments: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!formData.file) {
        toast.error("Please select a file to upload");
        return;
      }

      setLoading(true);
      const toastId = toast.loading("Submitting assignment...");

      try {
        const submissionData = new FormData();
        submissionData.append("assignmentId", id);
        submissionData.append("title", formData.title);
        submissionData.append("description", formData.description);
        submissionData.append("file", formData.file);
        submissionData.append("comments", formData.comments);

        const res = await submissionService.createSubmission(submissionData);
        if (res.success) {
          toast.success("Assignment submitted successfully", { id: toastId });
          navigate("/assignments");
        } else {
          toast.error(res.message || "Failed to submit assignment", { id: toastId });
        }
      } catch (error) {
        toast.error("An error occurred while submitting", { id: toastId });
      } finally {
        setLoading(false);
      }
    },
    [id, formData, navigate],
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/assignments")}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center mb-4"
          >
            ← Back to Assignments
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Submit Assignment
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Submit your work for assignment {id}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Submission Title
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter your submission title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                rows="4"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your submission..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Upload Files
              </label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                formData.file ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50'
              }`}>
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  onChange={(e) =>
                    setFormData({ ...formData, file: e.target.files[0] })
                  }
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-slate-600 dark:text-slate-400">
                    {formData.file ? (
                      <div className="text-emerald-600 dark:text-emerald-400">
                        <i className="fas fa-file-check text-3xl mb-2" />
                        <p className="font-medium">{formData.file.name}</p>
                        <p className="text-sm">Click to change file</p>
                      </div>
                    ) : (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="mt-2 text-slate-700 dark:text-slate-300">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          PDF, DOC, ZIP up to 50MB
                        </p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Additional Comments
              </label>
              <textarea
                rows="2"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                value={formData.comments}
                onChange={(e) =>
                  setFormData({ ...formData, comments: e.target.value })
                }
                placeholder="Any additional comments for the instructor..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-emerald-600 dark:bg-emerald-700 text-white rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-800 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Assignment"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/assignments")}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cancel
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
