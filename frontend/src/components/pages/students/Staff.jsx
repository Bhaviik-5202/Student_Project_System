import React, { memo, useEffect, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  Phone, 
  Shield, 
  Building, 
  Edit2, 
  Trash2, 
  X,
  Save,
  UserCheck
} from "lucide-react";
import staffService from "../../../services/staffService";
import { toast } from "react-hot-toast";

const StaffModal = ({ isOpen, onClose, onSave, staff = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Faculty",
    department: "",
    staffId: ""
  });

  useEffect(() => {
    if (staff) {
      setFormData(staff);
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "Faculty",
        department: "",
        staffId: ""
      });
    }
  }, [staff, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-lg shadow-2xl animate-scale-up">
        <div className="card-body p-0">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-indigo-600 rounded-t-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              {staff ? <Edit2 size={18} /> : <UserPlus size={18} />}
              {staff ? "Edit Staff Profile" : "Add New Staff Member"}
            </h3>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="relative">
                <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="form-control pl-10"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Sarah Connor"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    className="form-control pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sarah@university.edu"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="form-control pl-10"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Designation / Role</label>
                <div className="relative">
                  <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <select
                    className="form-control pl-10 appearance-none"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="Faculty">Faculty</option>
                    <option value="HOD">HOD</option>
                    <option value="Admin">Admin Staff</option>
                    <option value="System Intern">System Intern</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <div className="relative">
                  <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="form-control pl-10"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Computer Science"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Staff ID</label>
              <input
                type="text"
                className="form-control"
                value={formData.staffId}
                onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                placeholder="Leave blank for auto-generation"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary flex-[2]">
                <Save size={18} />
                {staff ? "Update Profile" : "Enroll Staff"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const StaffRow = memo(({ staff, onEdit, onDelete }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors group">
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="text-xs font-bold font-mono text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">
        {staff.id}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/30">
          <Users size={18} />
        </div>
        <div>
          <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{staff.name}</div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{staff.phone || "No contact"}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
        {staff.role}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-medium">
      {staff.department}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-500 italic">
      {staff.email}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="table-status status-active">
        <UserCheck size={12} className="mr-1" />
        {staff.status}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right">
      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(staff)} 
          className="p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
        >
          <Edit2 size={16} />
        </button>
        <button 
          onClick={() => onDelete(staff.dbId)} 
          className="p-2 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30 rounded-xl transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </td>
  </tr>
));

StaffRow.displayName = "StaffRow";

const Staff = memo(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await staffService.getAllStaff();
    if (res.success) {
      setStaffMembers(
        (res.data || []).map((staff, index) => ({
          dbId: staff._id || staff.id,
          id: staff.staffId || `STF-${String(index + 1).padStart(3, "0")}`,
          name: staff.name,
          role: staff.role || "Faculty",
          department: staff.department || "",
          email: staff.email,
          phone: staff.phone || "",
          status: "Active",
          staffId: staff.staffId
        }))
      );
    } else {
      setError(res.message || "Failed to load staff profiles");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleSaveStaff = async (formData) => {
    const toastId = toast.loading(selectedStaff ? "Updating profile..." : "Enrolling staff...");
    try {
      let res;
      if (selectedStaff) {
        res = await staffService.updateStaff(selectedStaff.dbId, formData);
      } else {
        res = await staffService.createStaff(formData);
      }
      
      if (res.success) {
        toast.success(selectedStaff ? "Profile updated!" : "Staff enrolled!", { id: toastId });
        setIsModalOpen(false);
        fetchStaff();
      } else {
        toast.error(res.message || "Operation failed", { id: toastId });
      }
    } catch (err) {
      toast.error("Network error occurred", { id: toastId });
    }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm("Permanently remove this staff record?")) {
      const toastId = toast.loading("Removing record...");
      const res = await staffService.deleteStaff(id);
      if (res.success) {
        toast.success("Record removed", { id: toastId });
        fetchStaff();
      } else {
        toast.error(res.message || "Failed to remove record", { id: toastId });
      }
    }
  };

  const filteredStaff = useMemo(() => {
    return staffMembers.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [staffMembers, searchQuery]);

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Staff Management</h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Manage university faculty and administrative staff</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => handleExport()} 
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium text-sm"
          >
            Export Staff
          </button>
          <button 
            onClick={() => { setSelectedStaff(null); setIsModalOpen(true); }} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm shadow-sm"
          >
            Add Staff Member
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card">
        <div className="card-body">
          <div className="relative max-w-md group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors z-10 pointer-events-none" />
            <div className="absolute left-12 top-1/2 -translate-y-1/2 w-[1px] h-5 bg-gray-200 dark:bg-slate-700 z-10" />
            <input
              type="text"
              className="form-control pl-16 bg-gray-50/50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800 focus:bg-white transition-all text-sm"
              placeholder="Search by name, ID or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="table-container shadow-md">
        <table className="table">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-slate-900/50">
              <th className="w-28 px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Member Info</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Designation</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="text-right px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Management</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="py-20 text-center text-gray-400 italic font-medium">
                  Accessing personnel directory...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="py-20 text-center text-rose-500 font-bold">
                  {error}
                </td>
              </tr>
            ) : filteredStaff.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-20 text-center text-gray-400 italic font-medium">
                  No staff records found matching your query.
                </td>
              </tr>
            ) : (
              filteredStaff.map((staff) => (
                <StaffRow
                  key={staff.dbId}
                  staff={staff}
                  onEdit={(s) => { setSelectedStaff(s); setIsModalOpen(true); }}
                  onDelete={handleDeleteStaff}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <StaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStaff}
        staff={selectedStaff}
      />
    </div>
  );
});

Staff.displayName = "Staff";
export default Staff;
