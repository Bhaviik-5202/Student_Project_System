import React, { memo, useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ChevronLeft as ChevronLeftIcon,
} from "lucide-react";
import api from "../../../utils/api";

const ProjectArchitectureForm = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    maxStudents: 3,
    category: "Internal",
    status: "Active"
  });

  useEffect(() => {
    if (isEditing) {
      const fetchArchitecture = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/projects/types/${id}`);
          const data = response.data || response;
          if (data) {
            setFormData({
              name: data.name || "",
              description: data.description || "",
              duration: data.duration || "",
              maxStudents: data.maxStudents || 3,
              category: data.category || "Internal",
              status: data.status || "Active"
            });
          }
        } catch (error) {
          toast.error("Failed to load architecture data");
          navigate("/project-types");
        } finally {
          setLoading(false);
        }
      };
      fetchArchitecture();
    }
  }, [id, isEditing, navigate]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "maxStudents" ? parseInt(value) || 0 : value
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading(isEditing ? "Updating..." : "Creating...");

    try {
      const res = isEditing
        ? await api.put(`/projects/types/${id}`, formData)
        : await api.post("/projects/types", formData);

      if (res.success || res.id || res._id || (res.data && (res.data.id || res.data._id))) {
        toast.success(isEditing ? "Architecture updated" : "Architecture created", { id: toastId });
        navigate("/project-types");
      } else {
        toast.error(res.message || "Operation failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Error occurred", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center text-gray-400 text-sm italic">
        Loading configuration...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/project-types")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronLeftIcon size={20} className="text-gray-400" />
          </button>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <i className={`fas fa-${isEditing ? 'folder-open' : 'folder-plus'} mr-3 text-gray-400`}></i>
              {isEditing ? "Edit Architecture" : "New Architecture"}
            </h2>
            <p className="text-sm text-gray-500">
              Define the blueprint for project classification
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">General Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                  Architecture Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none"
                  placeholder="e.g. Research Thesis"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                  Description / Manifesto
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none min-h-[160px] resize-none"
                  placeholder="Define scope, objectives, and limitations..."
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Operational Data</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-bold transition-all outline-none"
                >
                  <option value="Internal">Internal</option>
                  <option value="External">External</option>
                  <option value="Research">Research</option>
                  <option value="Industry">Industry</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                  Timeline (Duration)
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none"
                  placeholder="e.g. 2 Semesters"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                  Student Limit
                </label>
                <input
                  type="number"
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none"
                  min="1"
                  required
                />
              </div>

              {isEditing && (
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-bold transition-all outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <i className="fas fa-save mr-2"></i>
                )}
                {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
});

ProjectArchitectureForm.displayName = "ProjectArchitectureForm";
export default ProjectArchitectureForm;
