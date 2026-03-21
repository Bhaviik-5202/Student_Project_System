import React, { memo, useMemo, useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { 
  Plus as PlusIcon, 
  Search as SearchIcon, 
  Edit2 as EditIcon, 
  Trash2 as TrashIcon,
  Clock as ClockIcon,
  Users as UsersIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon
} from "lucide-react";
import api from "../../../utils/api";
import Modal from "../../common/Modal";

const ProjectTypeRow = memo(({ type, onEdit, onDelete }) => (
  <tr className="border-b border-gray-50 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
    <td className="px-6 py-4">
      <div className="flex flex-col">
        <span className="text-sm font-bold text-gray-900 dark:text-white">{type.name}</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          ID: PT{(type._id || type.id).toString().slice(-4)}
        </span>
      </div>
    </td>
    <td className="px-6 py-4">
      <p className="text-xs text-gray-500 line-clamp-1 max-w-xs">{type.description}</p>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-400">
        <ClockIcon size={12} className="text-gray-400" />
        {type.duration}
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-400">
        <UsersIcon size={12} className="text-gray-400" />
        {type.maxStudents}
      </div>
    </td>
    <td className="px-6 py-4">
      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
        type.status === "Active" 
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-700"
      }`}>
        {type.status || "Active"}
      </span>
    </td>
    <td className="px-6 py-4 text-right">
      <div className="flex justify-end gap-1">
        <button onClick={() => onEdit(type)} className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors">
          <EditIcon size={14} />
        </button>
        <button onClick={() => onDelete(type._id || type.id)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
          <TrashIcon size={14} />
        </button>
      </div>
    </td>
  </tr>
));

ProjectTypeRow.displayName = "ProjectTypeRow";

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
      toast.error("Failed to load types");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjectTypes();
  }, [fetchProjectTypes]);

  const filteredTypes = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return projectTypes.filter(t => 
      t.name.toLowerCase().includes(query) || 
      t.description.toLowerCase().includes(query)
    );
  }, [projectTypes, searchQuery]);

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
    if (!window.confirm("Confirm deletion?")) return;
    const toastId = toast.loading("Processing...");
    try {
      const res = await api.delete(`/projects/types/${id}`);
      if (res.success) {
        toast.success("Project Type Deleted", { id: toastId });
        fetchProjectTypes();
      } else {
        toast.error(res.message || "Deletion failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Error occurred", { id: toastId });
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
    const toastId = toast.loading(editingType ? "Synchronizing..." : "Initializing...");

    try {
      const res = editingType 
        ? await api.put(`/projects/types/${editingType._id || editingType.id}`, formData)
        : await api.post("/projects/types", formData);

      if (res.success || res._id || res.id) {
        toast.success("Success!", { id: toastId });
        closeModal();
        fetchProjectTypes();
      } else {
        toast.error(res.message || "Operation failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Error occurred", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Project Architectures
          </h1>
          <p className="text-sm text-gray-500">
            Define templates for academic ventures
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
        >
          <PlusIcon size={16} /> New Definition
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 dark:border-slate-700/50 flex justify-between items-center bg-gray-50/30 dark:bg-slate-900/20">
          <div className="relative flex-1 max-w-sm">
            <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Filter definitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg text-xs font-semibold outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">
            <span>Total: {projectTypes.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading && projectTypes.length === 0 ? (
            <div className="p-20 text-center text-gray-400 text-sm italic">Synchronizing definitions...</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-900/40 border-b border-gray-100 dark:border-slate-700">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Descriptor</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Manifesto</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Timeline</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unit Size</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
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
                    <td colSpan="6" className="text-center py-20 text-gray-300 italic text-sm">No classifications registered</td>
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
        title={editingType ? "Update Protocol" : "Define Protocol"}
        className="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Venture Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all outline-none"
              placeholder="e.g. Research Thesis"
              required
            />
          </div>
          
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Abstract Template</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all outline-none min-h-[100px] resize-none"
              placeholder="Scope and limitations..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all outline-none"
                placeholder="2 Semesters"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Unit Limit</label>
              <input
                type="number"
                name="maxStudents"
                value={formData.maxStudents}
                onChange={handleInputChange}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all outline-none"
                min="1"
                required
              />
            </div>
          </div>

          {editingType && (
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Registry Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 rounded-lg px-4 py-2.5 text-sm font-bold transition-all outline-none appearance-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 rounded-lg shadow-lg shadow-indigo-100 dark:shadow-none transition-all"
            >
              {isSubmitting ? "Processing..." : "Commit Definition"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
});

ProjectTypesList.displayName = "ProjectTypesList";
export default ProjectTypesList;
