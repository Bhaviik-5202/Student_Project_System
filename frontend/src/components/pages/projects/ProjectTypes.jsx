import React, { memo, useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Search as SearchIcon,
  Edit2 as EditIcon,
  Trash2 as TrashIcon,
  Calendar as CalendarIcon,
  Users as UsersIcon,
  ChevronRight as ChevronRightIcon
} from "lucide-react";
import api from "../../../utils/api";

const ProjectArchitectureCard = memo(({ architecture, onEdit, onDelete }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start gap-4 mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
            {architecture.name}
          </h3>
          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
            architecture.status === "Active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}>
            {architecture.status || "Active"}
          </span>
        </div>
        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block mb-2">
          {architecture.category || "General"}
        </span>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {architecture.description}
        </p>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => onEdit(architecture._id || architecture.id)}
          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
          title="Edit"
        >
          <EditIcon size={16} />
        </button>
        <button 
          onClick={() => onDelete(architecture._id || architecture.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          title="Delete"
        >
          <TrashIcon size={16} />
        </button>
      </div>
    </div>

    <div className="pt-4 border-t border-gray-50 dark:border-slate-700 grid grid-cols-2 gap-4">
      <div className="flex items-center gap-2">
        <CalendarIcon size={14} className="text-gray-400" />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Timeline</span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{architecture.duration}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <UsersIcon size={14} className="text-gray-400" />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Team Size</span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{architecture.maxStudents} Students</span>
        </div>
      </div>
    </div>
    
    <div className="mt-4 pt-4 border-t border-gray-50 dark:border-slate-700 flex justify-end">
      <button 
        onClick={() => onEdit(architecture._id || architecture.id)}
        className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-all"
      >
        Manage Configuration <ChevronRightIcon size={14} />
      </button>
    </div>
  </div>
));

ProjectArchitectureCard.displayName = "ProjectArchitectureCard";

const ProjectArchitecturesList = memo(() => {
  const navigate = useNavigate();
  const [architectures, setArchitectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const fetchArchitectures = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects/types');
      const data = response.data || response || [];
      setArchitectures(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load architectures");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchitectures();
  }, [fetchArchitectures]);

  const filteredArchitectures = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return architectures.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(query) || a.description.toLowerCase().includes(query);
      const matchesFilter = filterCategory === "All" || a.category === filterCategory;
      return matchesSearch && matchesFilter;
    });
  }, [architectures, searchQuery, filterCategory]);

  const categories = useMemo(() => {
    const cats = new Set(architectures.map(a => a.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [architectures]);

  const handleEdit = useCallback((id) => {
    if (!id) {
      toast.error("Invalid Architecture ID");
      return;
    }
    navigate(`/project-types/${id}/edit`);
  }, [navigate]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Confirm deletion?")) return;
    const toastId = toast.loading("Processing...");
    try {
      const res = await api.delete(`/projects/types/${id}`);
      if (res.success) {
        toast.success("Architecture deleted", { id: toastId });
        fetchArchitectures();
      } else {
        toast.error(res.message || "Deletion failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Error occurred", { id: toastId });
    }
  }, [fetchArchitectures]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            Project Architectures
          </h2>
          <p className="text-sm text-gray-500">Manage project classification templates</p>
        </div>
        <button
          onClick={() => navigate("/project-types/new")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors shadow-sm"
        >
          <i className="fas fa-plus mr-2"></i> New Definition
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="relative flex-1">
          <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search definitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 rounded-lg text-sm outline-none transition-all dark:text-white"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                filterCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading && architectures.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-sm italic">Loading definitions...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArchitectures.length > 0 ? (
            filteredArchitectures.map((arch) => (
              <ProjectArchitectureCard
                key={arch._id || arch.id}
                architecture={arch}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="col-span-full py-20 bg-gray-50 dark:bg-slate-800 rounded-xl border border-dashed border-gray-200 dark:border-slate-700 text-center">
              <p className="text-gray-400 text-sm">No architectures found matching your criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

ProjectArchitecturesList.displayName = "ProjectArchitecturesList";
export default ProjectArchitecturesList;
