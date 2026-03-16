import React, { memo, useMemo, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import { 
  Projector as ProjectIcon, 
  Plus as PlusIcon, 
  Search as SearchIcon, 
  MoreHorizontal as MoreIcon, 
  Edit2 as EditIcon, 
  Trash2 as TrashIcon,
  Clock as ClockIcon,
  Users as UsersIcon,
  LayoutGrid as GridIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  History as HistoryIcon,
  Calendar as CalendarIcon,
  AlertCircle as AlertIcon
} from "lucide-react";
import api from "../../../utils/api";
import Modal from "../../common/Modal";

const ProjectTypeRow = memo(({ type, onEdit, onDelete }) => (
  <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-200">
          <ProjectIcon size={18} />
        </div>
        <div className="ml-4">
          <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {type.name}
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            ID: PT{(type._id || type.id).toString().slice(-4).toUpperCase()}
          </div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs line-clamp-1 italic hover:line-clamp-none transition-all cursor-help" title={type.description}>
        {type.description}
      </p>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
        <ClockIcon size={14} className="mr-2 text-indigo-500" />
        {type.duration}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
        <UsersIcon size={14} className="mr-2 text-blue-500" />
        {type.maxStudents} Students
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
        type.status === "Active" 
          ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/40 dark:border-green-800 dark:text-green-400"
          : "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/40 dark:border-red-800 dark:text-red-400"
      }`}>
        {type.status === "Active" ? <CheckCircleIcon size={12} className="mr-1" /> : <XCircleIcon size={12} className="mr-1" />}
        {type.status || "Active"}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button 
          onClick={() => onEdit(type)}
          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-all transform hover:scale-110"
          title="Edit"
        >
          <EditIcon size={16} />
        </button>
        <button 
          onClick={() => onDelete(type._id || type.id)}
          className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-all transform hover:scale-110"
          title="Delete"
        >
          <TrashIcon size={16} />
        </button>
      </div>
    </td>
  </tr>
));

ProjectTypeRow.displayName = "ProjectTypeRow";
ProjectTypeRow.propTypes = {
  type: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    _id: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    maxStudents: PropTypes.number.isRequired,
    status: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const ProjectTypesList = memo(() => {
  const [projectTypes, setProjectTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    maxStudents: 3,
    status: "Active"
  });

  const fetchProjectTypes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects/types');
      const data = response.data || response || [];
      setProjectTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch project types", error);
      toast.error("Failed to load project types");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjectTypes();
  }, [fetchProjectTypes]);

  const filteredTypes = useMemo(() => {
    if (!searchQuery) return projectTypes;
    const query = searchQuery.toLowerCase();
    return projectTypes.filter(t => 
      t.name.toLowerCase().includes(query) || 
      t.description.toLowerCase().includes(query)
    );
  }, [projectTypes, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: projectTypes.length,
      active: projectTypes.filter(t => t.status === "Active").length,
      inactive: projectTypes.filter(t => t.status === "Inactive").length,
    };
  }, [projectTypes]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "maxStudents" ? parseInt(value) || 0 : value
    }));
  }, []);

  const handleEdit = useCallback((type) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      description: type.description,
      duration: type.duration,
      maxStudents: type.maxStudents,
      status: type.status || "Active"
    });
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to delete this project type?")) return;
    
    const toastId = toast.loading("Deleting project type...");
    try {
      const res = await api.delete(`/projects/types/${id}`);
      if (res.success) {
        toast.success("Project type deleted successfully", { id: toastId });
        fetchProjectTypes();
      } else {
        toast.error(res.message || "Failed to delete project type", { id: toastId });
      }
    } catch (error) {
      toast.error("An error occurred", { id: toastId });
    }
  }, [fetchProjectTypes]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingType(null);
    setFormData({ name: "", description: "", duration: "", maxStudents: 3, status: "Active" });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading(editingType ? "Updating project type..." : "Adding project type...");

    try {
      const res = editingType 
        ? await api.put(`/projects/types/${editingType._id || editingType.id}`, formData)
        : await api.post("/projects/types", formData);

      if (res.success || res._id || res.id) {
        toast.success(`Project type ${editingType ? "updated" : "added"} successfully!`, { id: toastId });
        closeModal();
        fetchProjectTypes();
      } else {
        toast.error(res.message || `Failed to ${editingType ? "update" : "add"} project type`, { id: toastId });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Premium Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-xl shadow-slate-100 dark:shadow-none p-6 md:p-8 transition-all duration-300">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1 flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none animate-pulse-subtle">
              <GridIcon size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Project Types Configuration
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                <CalendarIcon size={14} className="mr-2" />
                Define templates for various academic project categories
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-2xl hover:shadow-blue-300 dark:hover:shadow-none transition-all duration-300 font-bold overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <PlusIcon size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
            New Category
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Types", value: stats.total, icon: GridIcon, color: "blue", trend: "Stable" },
          { label: "Active", value: stats.active, icon: CheckCircleIcon, color: "green", trend: "Maintained" },
          { label: "Inactive", value: stats.inactive, icon: XCircleIcon, color: "red", trend: "N/A" },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group flex items-center">
            <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 mr-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 md:p-6 border-b border-gray-100 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="relative w-full md:w-96">
            <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Export CSV">
              <HistoryIcon size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Reload System">
              <AlertIcon size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading && projectTypes.length === 0 ? (
            <div className="p-20 text-center">
              <LoadingSpinner size="lg" className="mb-6" />
              <p className="text-gray-400 font-medium animate-pulse">Syncing with server database...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Description</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Duration</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Team Size</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {filteredTypes.length > 0 ? (
                  filteredTypes.map((type) => (
                    <ProjectTypeRow 
                      key={type._id || type.id} 
                      type={type} 
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-24">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-slate-300">
                          <PlusIcon size={40} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Empty Records</h3>
                        <p className="text-gray-400 max-w-xs mx-auto">Click "New Category" to begin configuring your academic landscape.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingType ? "Update Configuration" : "New Type Configuration"}
        footer={null}
        className="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block">Category Name</label>
            <div className="relative">
              <GridIcon size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white font-medium"
                placeholder="e.g. Capstone Research Project"
                required
              />
            </div>
          </div>
          
          <div className="form-group space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block">Detailed Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white italic min-h-[120px]"
              placeholder="Provide a comprehensive summary of this project standard..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block">Expected Duration</label>
              <div className="relative">
                <ClockIcon size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="e.g. 1 Academic Year"
                  required
                />
              </div>
            </div>
            
            <div className="form-group space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block">Max Team Size</label>
              <div className="relative">
                <UsersIcon size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="number"
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          {editingType && (
            <div className="form-group space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block">Administrative Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white font-bold"
              >
                <option value="Active">Active / Publicly Visible</option>
                <option value="Inactive">Inactive / Restricted Access</option>
              </select>
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t border-gray-50 dark:border-slate-700">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-6 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-xl font-bold transition-all border border-gray-100 dark:border-slate-700"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-bold hover:shadow-xl transition-all shadow-md disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : (editingType ? "Update Configuration" : "Finalize Category")}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
});

ProjectTypesList.displayName = "ProjectTypesList";

export default ProjectTypesList;

const LoadingSpinner = ({ size = "sm", className = "" }) => (
  <div className={`flex justify-center items-center ${className}`}>
    <div className={`animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-500 ${
      size === "sm" ? "w-6 h-6 border-2" : size === "md" ? "w-10 h-10" : "w-16 h-16"
    }`} />
  </div>
);
