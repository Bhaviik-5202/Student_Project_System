import React, { useState, useCallback, useEffect, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import projectService from "../../../services/projectService";

const ProjectProposal = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    teamMembers: "",
    guide: "",
    abstract: "",
    objectives: "",
    outcomes: "",
    startDate: "",
    endDate: "",
    resources: "",
    budget: "",
    document: null,
  });

  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      const fetchProject = async () => {
        try {
          const res = await projectService.getProjectById(id);
          if (res.success && res.data) {
            const data = res.data;
            setFormData({
              title: data.title || "",
              type: data.type || "",
              teamMembers: Array.isArray(data.teamMembers) ? data.teamMembers.join(", ") : (data.teamMembers || ""),
              guide: data.guide || "",
              abstract: data.abstract || "",
              objectives: data.objectives || "",
              outcomes: data.outcomes || "",
              startDate: data.startDate ? data.startDate.split('T')[0] : "",
              endDate: data.endDate ? data.endDate.split('T')[0] : "",
              resources: data.resources || "",
              budget: data.budget || "",
              document: null, 
            });
          } else {
            toast.error("Failed to fetch project details");
            navigate("/projects");
          }
        } catch (error) {
          toast.error("Error fetching project");
          navigate("/projects");
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    }
  }, [id, isEditing, navigate]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, document: e.target.files[0] }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const toastId = toast.loading(isEditing ? "Synchronizing changes..." : "Dispatching proposal...");
      
      try {
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== null && formData[key] !== "") {
            data.append(key, formData[key]);
          }
        });

        const res = isEditing
          ? await projectService.updateProject(id, data)
          : await projectService.createProject(data);
          
        if (res.success) {
          toast.success(`Project ${isEditing ? "updated" : "submitted"}!`, { id: toastId });
          navigate("/projects");
        } else {
          toast.error(res.message || "Transmission failed", { id: toastId });
        }
      } catch (error) {
        toast.error("Process error", { id: toastId });
      }
    },
    [formData, id, isEditing, navigate]
  );

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400 text-sm italic">
        Initializing interface...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Project Proposal
          </h2>
          <p className="text-sm text-gray-500">
            Formalize your venture for academic review
          </p>
        </div>
        <button
          onClick={() => navigate("/projects")}
          className="text-gray-400 hover:text-gray-600 text-xs font-bold uppercase tracking-widest"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Principal Data</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Venture Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none"
                  placeholder="Official project name..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Project Classification
                  </label>
                  <select
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none appearance-none"
                  >
                    <option value="">Select Category</option>
                    <option value="research">Research</option>
                    <option value="development">Development</option>
                    <option value="hardware">Hardware</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Collaborative Team
                  </label>
                  <input
                    type="text"
                    name="teamMembers"
                    required
                    value={formData.teamMembers}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none"
                    placeholder="Names, comma separated..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Conceptual Core</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Executive Abstract
                </label>
                <textarea
                  name="abstract"
                  required
                  rows="4"
                  value={formData.abstract}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none resize-none"
                  placeholder="High-level overview of the project..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Strategic Objectives
                </label>
                <textarea
                  name="objectives"
                  required
                  rows="3"
                  value={formData.objectives}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none resize-none"
                  placeholder="Key milestones to achieve..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Timeline & Resources</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Start
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Conclusion
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Technical Resources
                </label>
                <textarea
                  name="resources"
                  rows="2"
                  value={formData.resources}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none resize-none"
                  placeholder="Hardware, software, specialized tools..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Documentation</h3>
            <div className="space-y-4">
              <div className="relative border-2 border-dashed border-gray-100 dark:border-slate-700 rounded-xl p-6 text-center group hover:border-indigo-400 transition-colors">
                <input
                  type="file"
                  name="document"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx"
                  required={!isEditing}
                />
                <i className="fas fa-file-upload text-gray-300 group-hover:text-indigo-500 text-2xl mb-2 transition-colors" />
                <p className="text-[10px] font-bold text-gray-400 uppercase truncate">
                  {formData.document ? formData.document.name : "Select Proposal File"}
                </p>
                <p className="text-[8px] text-gray-300 mt-1 uppercase">PDF, DOC (MAX 10MB)</p>
              </div>
              
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
              >
                {isEditing ? "Update Submission" : "Submit Proposal"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
});

ProjectProposal.displayName = "ProjectProposal";
export default ProjectProposal;
