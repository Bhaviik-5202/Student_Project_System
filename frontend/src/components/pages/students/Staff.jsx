import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import staffService from "../../../services/staffService";
import "../../../assets/styles/admin.css";

const StaffModal = ({ isOpen, onClose, onSave, staff = null }) => {
  const [formData, setFormData] = useState(staff || {
    name: "",
    email: "",
    phone: "",
    role: "Faculty",
    department: "",
    staffId: ""
  });

  useEffect(() => {
    if (staff) setFormData(staff);
    else setFormData({
      name: "",
      email: "",
      phone: "",
      role: "Faculty",
      department: "",
      staffId: ""
    });
  }, [staff, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="admin-modal-overlay" style={{ alignItems: 'flex-start', paddingTop: '60px', overflowY: 'auto' }}>
      <div className="admin-modal shadow-lg">
        <div className="admin-modal-header">
          <h3 className="text-lg font-bold">{staff ? "Edit Staff" : "Add New Staff"}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="admin-form-group">
              <label className="admin-label">Full Name</label>
              <input
                type="text"
                className="admin-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="admin-form-group">
                <label className="admin-label">Email</label>
                <input
                  type="email"
                  className="admin-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Phone</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="admin-form-group">
                <label className="admin-label">Role</label>
                <select
                  className="admin-input"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="Faculty">Faculty</option>
                  <option value="HOD">HOD</option>
                  <option value="Admin">Admin Staff</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Department</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Computer Science"
                />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Staff ID (Optional)</label>
              <input
                type="text"
                className="admin-input"
                value={formData.staffId}
                onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                placeholder="Leave blank to auto-generate"
              />
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" onClick={onClose} className="admin-btn admin-btn-secondary">Cancel</button>
            <button type="submit" className="admin-btn admin-btn-primary">
              {staff ? "Update Staff" : "Add Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Staff Row Component
const StaffRow = memo(({ staff, onEdit, onDelete }) => (
  <tr>
    <td style={{ fontWeight: '600' }}>{staff.id}</td>
    <td>
      <div style={{ fontWeight: '600' }}>{staff.name}</div>
      <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{staff.phone}</div>
    </td>
    <td>{staff.role}</td>
    <td>{staff.department}</td>
    <td>{staff.email}</td>
    <td>
      <span className="admin-badge admin-badge-success">{staff.status}</span>
    </td>
    <td style={{ textAlign: 'right' }}>
      <button onClick={() => onEdit(staff)} className="text-blue-600 hover:text-blue-800 font-semibold text-sm mr-4">
        Edit
      </button>
      <button onClick={() => onDelete(staff.dbId)} className="text-rose-600 hover:text-rose-800 font-semibold text-sm">
        Delete
      </button>
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

  const fetchStaff = async () => {
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
      setError(res.message || "Failed to load staff");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  const handleEditStaff = (staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleSaveStaff = async (formData) => {
    try {
      if (selectedStaff) {
        await staffService.updateStaff(selectedStaff.dbId, formData);
      } else {
        await staffService.createStaff(formData);
      }
      setIsModalOpen(false);
      fetchStaff();
    } catch (error) {
      console.error("Failed to save staff", error);
      alert("Failed to save staff. Please check the data.");
    }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      const res = await staffService.deleteStaff(id);
      if (res.success) {
        fetchStaff();
      } else {
        alert(res.message || "Failed to delete staff member");
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <header className="admin-header">
          <div>
            <h1 className="admin-title">Staff Management</h1>
            <p className="admin-subtitle">Manage faculty and staff profiles</p>
          </div>
          <button onClick={handleAddStaff} className="admin-btn admin-btn-primary">
            + Add Staff
          </button>
        </header>

        <div className="admin-table-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--admin-text-muted)' }}>
              Loading staff profiles...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--admin-danger)' }}>
              {error}
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Staff ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffMembers.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '48px' }}>
                      No staff records found.
                    </td>
                  </tr>
                ) : (
                  staffMembers.map((staff) => (
                    <StaffRow
                      key={staff.dbId}
                      staff={staff}
                      onEdit={handleEditStaff}
                      onDelete={handleDeleteStaff}
                    />
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
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
