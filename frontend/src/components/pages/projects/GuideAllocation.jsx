import React, { memo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import projectService from "../../../services/projectService";
import staffService from "../../../services/staffService";

const GuideCard = memo(({ guide }) => {
  const statusClass =
    guide.status === "Available"
      ? "text-green-600 bg-green-50"
      : "text-amber-600 bg-amber-50";

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
          <i className="fas fa-user-tie text-indigo-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
            {guide.guide}
          </h3>
          <p className="text-xs text-gray-500">
            {guide.department}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] font-medium uppercase tracking-wider">
        <div className="p-2 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
          <p className="text-gray-400 mb-0.5">Capacity</p>
          <p className="text-gray-900 dark:text-white">{guide.allocatedGroups}/{guide.maxCapacity}</p>
        </div>
        <div className={`p-2 rounded-lg ${statusClass} dark:bg-opacity-10`}>
          <p className="opacity-70 mb-0.5">Status</p>
          <p className="font-bold">{guide.status}</p>
        </div>
      </div>
    </div>
  );
});

GuideCard.displayName = "GuideCard";

const AllocationRow = memo(({ project, availableGuides, onAssign }) => {
  const navigate = useNavigate();
  const [selectedGuide, setSelectedGuide] = useState("");

  const handleAssignClick = () => {
    if (selectedGuide) {
      onAssign(project.id, selectedGuide);
    }
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600 dark:text-gray-300">
        {project.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {project.name}
        </p>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {project.group}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`text-sm px-2 py-1 rounded-full ${project.currentGuide === "None" ? "bg-yellow-50 text-yellow-700 font-bold" : "text-gray-600"}`}>
          {project.currentGuide}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center gap-2">
        <select 
          value={selectedGuide}
          onChange={(e) => setSelectedGuide(e.target.value)}
          className="text-xs bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="">Select Guide</option>
          {availableGuides.map(guide => (
            <option key={guide.id} value={guide.id}>{guide.guide}</option>
          ))}
        </select>
        <button 
          onClick={handleAssignClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-3 rounded-lg transition-colors shadow-sm"
        >
          Assign
        </button>
        <button 
          onClick={() => navigate(`/projects/${project.id}`)}
          className="border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 p-1.5 rounded-lg transition-colors"
          title="View Details"
        >
          <i className="fas fa-external-link-alt text-gray-400" />
        </button>
      </td>
    </tr>
  );
});

AllocationRow.displayName = "AllocationRow";

const GuideAllocationList = memo(() => {
  const [allocations, setAllocations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingGuides, setLoadingGuides] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      setLoadingGuides(true);
      const res = await staffService.getAllStaff();
      if (res.success) {
        setAllocations(
          (res.data || [])
            .filter(s => s.role?.toLowerCase() === "faculty" || s.role?.toLowerCase() === "guide")
            .map(g => ({
              id: g._id || g.id,
              guide: g.name,
              department: g.department || "General",
              allocatedGroups: g.allocatedGroups || 0,
              maxCapacity: g.maxCapacity || 5,
              students: g.studentsCount || 0,
              status: (g.allocatedGroups || 0) < (g.maxCapacity || 5) ? "Available" : "Full",
            }))
        );
      }
      setLoadingGuides(false);
    };

    const fetchProjects = async () => {
      setLoadingProjects(true);
      const res = await projectService.getAllProjects();
      if (res.success) {
        setProjects(
          (res.data || []).map(p => ({
            id: p._id || p.id,
            name: p.title,
            group: p.teamMembers?.length > 0 ? p.teamMembers.join(", ") : "Ungrouped",
            currentGuide: p.guide || "None",
          }))
        );
      }
      setLoadingProjects(false);
    };

    fetchGuides();
    fetchProjects();
  }, []);

  const handleAssignGuide = async (projectId, guideId) => {
    const guideName = allocations.find(g => g.id === guideId)?.guide;
    const res = await projectService.updateProject(projectId, { guide: guideId });
    if (res.success) {
      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, currentGuide: guideName || "Assigned" } : p
      ));
      alert("Guide assigned successfully!");
    } else {
      alert("Failed to assign guide: " + res.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-6 space-y-8 print:p-0">
      <div className="flex justify-between items-center no-print">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Guide Allocation</h2>
          <p className="text-sm text-gray-500">Manage mentor assignments and capacity</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <i className="fas fa-print text-gray-400" /> Print Report
        </button>
      </div>

      {/* Guides Grid */}
      <div className="space-y-4 no-print">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Mentor Availability</h3>
        {loadingGuides ? (
          <div className="text-center py-10 text-gray-400 text-sm">Loading mentors...</div>
        ) : allocations.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800 rounded-xl border border-dashed border-gray-200">No mentors found matching criteria.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {allocations.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        )}
      </div>

      {/* Projects Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden print:border-none">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center no-print">
          <h3 className="font-bold text-gray-900 dark:text-white tabular-nums">Allocation Management</h3>
          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">Total Projects: {projects.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID</th>
                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Group</th>
                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Guide</th>
                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest no-print">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {loadingProjects ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-400 text-sm">Fetching projects data...</td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                   <td colSpan="5" className="px-6 py-10 text-center text-gray-400 text-sm">All projects have been allocated guides.</td>
                </tr>
              ) : (
                projects.map((project) => (
                  <AllocationRow 
                    key={project.id} 
                    project={project} 
                    availableGuides={allocations}
                    onAssign={handleAssignGuide}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

GuideAllocationList.displayName = "GuideAllocationList";
export default GuideAllocationList;
