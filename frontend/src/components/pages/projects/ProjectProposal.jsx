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
  const [projectTypes, setProjectTypes] = useState([]);
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

  useEffect(() => {
    const fetchProjectTypes = async () => {
      try {
        const res = await projectService.getProjectTypes();
        if (res.success || Array.isArray(res.data)) {
          setProjectTypes(res.data || res);
        }
      } catch (error) {
        console.error("Failed to fetch project types");
      }
    };
    fetchProjectTypes();
  }, []);

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
    <div className="project-page animate-fade-in text-gray-600 dark:text-gray-400">
      <div className="project-header">
        <div>
          <h2 className="project-title text-gray-900 dark:text-white">Project Proposal</h2>
          <p className="project-subtitle">Formalize your venture for academic review</p>
        </div>
        <button
          onClick={() => navigate("/projects")}
          className="project-btn project-btn-secondary"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="project-card-simple">
            <h3 className="text-xs font-bold text-gray-400 tracking-[0.2em] mb-6">Principal Data</h3>
            <div className="space-y-4">
              <div>
                <label className="project-label mb-1.5">Venture Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="project-input"
                  placeholder="Official project name..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="project-label mb-1.5">Project Classification</label>
                  <select
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleChange}
                    className="project-select"
                  >
                    <option value="">Select Classification</option>
                    {projectTypes.map((type) => (
                      <option key={type._id || type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="project-label mb-1.5">Collaborative Team</label>
                  <input
                    type="text"
                    name="teamMembers"
                    required
                    value={formData.teamMembers}
                    onChange={handleChange}
                    className="project-input"
                    placeholder="Names, comma separated..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="project-card-simple">
            <h3 className="text-xs font-bold text-gray-400 tracking-[0.2em] mb-6">Conceptual Core</h3>
            <div className="space-y-4">
              <div>
                <label className="project-label mb-1.5">Executive Abstract</label>
                <textarea
                  name="abstract"
                  required
                  rows="4"
                  value={formData.abstract}
                  onChange={handleChange}
                  className="project-textarea"
                  placeholder="High-level overview of the project..."
                />
              </div>
              <div>
                <label className="project-label mb-1.5">Strategic Objectives</label>
                <textarea
                  name="objectives"
                  required
                  rows="3"
                  value={formData.objectives}
                  onChange={handleChange}
                  className="project-textarea"
                  placeholder="Key milestones to achieve..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="project-card-simple">
            <h3 className="text-xs font-bold text-gray-400 tracking-[0.2em] mb-6">Timeline & Resources</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="project-label mb-1.5">Start</label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    value={formData.startDate}
                    onChange={handleChange}
                    className="project-input"
                  />
                </div>
                <div>
                  <label className="project-label mb-1.5">Conclusion</label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    value={formData.endDate}
                    onChange={handleChange}
                    className="project-input"
                  />
                </div>
              </div>
              <div>
                <label className="project-label mb-1.5">Technical Resources</label>
                <textarea
                  name="resources"
                  rows="2"
                  value={formData.resources}
                  onChange={handleChange}
                  className="project-textarea"
                  placeholder="Hardware, software, specialized tools..."
                />
              </div>
            </div>
          </div>

          <div className="project-card-simple">
            <h3 className="text-xs font-bold text-gray-400 tracking-[0.2em] mb-6">Documentation</h3>
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
                <p className="text-[10px] font-bold text-gray-400 truncate">
                  {formData.document ? formData.document.name : "Select Proposal File"}
                </p>
                <p className="text-[8px] text-gray-300 mt-1">PDF, DOC (MAX 10MB)</p>
              </div>
              
              <button
                type="submit"
                className="w-full project-btn project-btn-primary py-4 font-bold"
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
