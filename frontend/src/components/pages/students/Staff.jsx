import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
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
  UserCheck,
} from 'lucide-react';
import staffService from '../../../services/staffService';
import { toast } from 'react-hot-toast';

const StaffModal = ({ isOpen, onClose, onSave, staff = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Faculty',
    department: '',
    staffId: '',
  });

  useEffect(() => {
    if (staff) {
      setFormData(staff);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'Faculty',
        department: '',
        staffId: '',
      });
    }
  }, [staff, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className='fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm'>
      <div className='card w-full max-w-lg animate-scale-up shadow-2xl'>
        <div className='card-body p-0'>
          <div className='flex items-center justify-between rounded-t-2xl border-b border-gray-100 bg-indigo-600 px-6 py-4 dark:border-slate-800'>
            <h3 className='flex items-center gap-2 text-lg font-bold text-white'>
              {staff ? <Edit2 size={18} /> : <UserPlus size={18} />}
              {staff ? 'Edit Staff Profile' : 'Add New Staff Member'}
            </h3>
            <button
              onClick={onClose}
              className='text-white/80 transition-colors hover:text-white'
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className='space-y-5 p-6'>
            <div className='form-group'>
              <label className='form-label'>Full Name</label>
              <div className='relative'>
                <Users
                  size={16}
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                />
                <input
                  type='text'
                  className='form-control pl-10'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder='e.g. Dr. Sarah Connor'
                  required
                />
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='form-group'>
                <label className='form-label'>Email Address</label>
                <div className='relative'>
                  <Mail
                    size={16}
                    className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                  />
                  <input
                    type='email'
                    className='form-control pl-10'
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder='sarah@university.edu'
                    required
                  />
                </div>
              </div>
              <div className='form-group'>
                <label className='form-label'>Phone Number</label>
                <div className='relative'>
                  <Phone
                    size={16}
                    className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                  />
                  <input
                    type='text'
                    className='form-control pl-10'
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder='+91 98765 43210'
                  />
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='form-group'>
                <label className='form-label'>Designation / Role</label>
                <div className='relative'>
                  <Shield
                    size={16}
                    className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                  />
                  <select
                    className='form-control appearance-none pl-10'
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option value='Faculty'>Faculty</option>
                    <option value='HOD'>HOD</option>
                    <option value='Admin'>Admin Staff</option>
                    <option value='System Intern'>System Intern</option>
                  </select>
                </div>
              </div>
              <div className='form-group'>
                <label className='form-label'>Department</label>
                <div className='relative'>
                  <Building
                    size={16}
                    className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                  />
                  <input
                    type='text'
                    className='form-control pl-10'
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    placeholder='e.g. Computer Science'
                  />
                </div>
              </div>
            </div>

            <div className='form-group'>
              <label className='form-label'>Staff ID</label>
              <input
                type='text'
                className='form-control'
                value={formData.staffId}
                onChange={(e) =>
                  setFormData({ ...formData, staffId: e.target.value })
                }
                placeholder='Leave blank for auto-generation'
              />
            </div>

            <div className='flex gap-3 pt-4'>
              <button
                type='button'
                onClick={onClose}
                className='btn btn-secondary flex-1'
              >
                Cancel
              </button>
              <button type='submit' className='btn btn-primary flex-[2]'>
                <Save size={18} />
                {staff ? 'Update Profile' : 'Enroll Staff'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const StaffRow = memo(({ staff, onEdit, onDelete }) => (
  <tr className='group transition-colors hover:bg-gray-50 dark:hover:bg-slate-900/50'>
    <td className='whitespace-nowrap px-6 py-4'>
      <span className='rounded bg-gray-100 px-2 py-1 font-mono text-xs font-bold text-gray-400 dark:bg-slate-800 dark:text-slate-500'>
        {staff.id}
      </span>
    </td>
    <td className='whitespace-nowrap px-6 py-4'>
      <div className='flex items-center gap-3'>
        <div className='flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600 dark:border-indigo-800/30 dark:bg-indigo-900/20 dark:text-indigo-400'>
          <Users size={18} />
        </div>
        <div>
          <div className='text-sm font-bold text-gray-900 transition-colors group-hover:text-indigo-600 dark:text-white'>
            {staff.name}
          </div>
          <div className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>
            {staff.phone || 'No contact'}
          </div>
        </div>
      </div>
    </td>
    <td className='whitespace-nowrap px-6 py-4'>
      <span className='rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:bg-slate-800 dark:text-gray-300'>
        {staff.role}
      </span>
    </td>
    <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400'>
      {staff.department}
    </td>
    <td className='whitespace-nowrap px-6 py-4 text-sm italic text-gray-500 dark:text-gray-500'>
      {staff.email}
    </td>
    <td className='whitespace-nowrap px-6 py-4'>
      <span className='table-status status-active'>
        <UserCheck size={12} className='mr-1' />
        {staff.status}
      </span>
    </td>
    <td className='whitespace-nowrap px-6 py-4 text-right'>
      <div className='flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
        <button
          onClick={() => onEdit(staff)}
          className='rounded-xl p-2 text-indigo-600 transition-all hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30'
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(staff.dbId)}
          className='rounded-xl p-2 text-rose-600 transition-all hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30'
        >
          <Trash2 size={16} />
        </button>
      </div>
    </td>
  </tr>
));

StaffRow.displayName = 'StaffRow';

const Staff = memo(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await staffService.getAllStaff();
    if (res.success) {
      setStaffMembers(
        (res.data || []).map((staff, index) => ({
          dbId: staff._id || staff.id,
          id: staff.staffId || `STF-${String(index + 1).padStart(3, '0')}`,
          name: staff.name,
          role: staff.role || 'Faculty',
          department: staff.department || '',
          email: staff.email,
          phone: staff.phone || '',
          status: 'Active',
          staffId: staff.staffId,
        }))
      );
    } else {
      setError(res.message || 'Failed to load staff profiles');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleSaveStaff = async (formData) => {
    const toastId = toast.loading(
      selectedStaff ? 'Updating profile...' : 'Enrolling staff...'
    );
    try {
      let res;
      if (selectedStaff) {
        res = await staffService.updateStaff(selectedStaff.dbId, formData);
      } else {
        res = await staffService.createStaff(formData);
      }

      if (res.success) {
        toast.success(selectedStaff ? 'Profile updated!' : 'Staff enrolled!', {
          id: toastId,
        });
        setIsModalOpen(false);
        fetchStaff();
      } else {
        toast.error(res.message || 'Operation failed', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error occurred', { id: toastId });
    }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm('Permanently remove this staff record?')) {
      const toastId = toast.loading('Removing record...');
      const res = await staffService.deleteStaff(id);
      if (res.success) {
        toast.success('Record removed', { id: toastId });
        fetchStaff();
      } else {
        toast.error(res.message || 'Failed to remove record', { id: toastId });
      }
    }
  };

  const filteredStaff = useMemo(() => {
    return staffMembers.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [staffMembers, searchQuery]);

  const handleExport = useCallback(() => {
    if (filteredStaff.length === 0) {
      toast.error('No staff records to export');
      return;
    }

    const headers = [
      'Staff ID',
      'Name',
      'Role',
      'Department',
      'Email',
      'Phone',
      'Status',
    ];
    const csvData = filteredStaff.map((s) => [
      s.id,
      s.name,
      s.role,
      s.department,
      s.email,
      s.phone,
      s.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `staff_directory_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Staff directory exported successfully');
  }, [filteredStaff]);

  return (
    <div className='animate-fade-in space-y-6 p-4 md:p-6'>
      <div className='flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
            Staff Management
          </h1>
          <p className='mt-1 text-sm text-slate-500 dark:text-gray-400'>
            Manage university faculty and administrative staff
          </p>
        </div>
        <div className='flex gap-4'>
          <button
            onClick={() => handleExport()}
            className='rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
          >
            Export Staff
          </button>
          <button
            onClick={() => {
              setSelectedStaff(null);
              setIsModalOpen(true);
            }}
            className='rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700'
          >
            Add Staff Member
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className='card'>
        <div className='card-body'>
          <div className='group relative max-w-md'>
            <Search
              size={18}
              className='pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-indigo-500'
            />
            <div className='absolute left-12 top-1/2 z-10 h-5 w-[1px] -translate-y-1/2 bg-gray-200 dark:bg-slate-700' />
            <input
              type='text'
              className='form-control border-gray-100 bg-gray-50/50 pl-16 text-sm transition-all focus:bg-white dark:border-slate-800 dark:bg-slate-900/50'
              placeholder='Search by name, ID or email...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className='table-container shadow-md'>
        <table className='table'>
          <thead>
            <tr className='bg-gray-50/50 dark:bg-slate-900/50'>
              <th className='w-28 px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                ID
              </th>
              <th className='px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                Member Info
              </th>
              <th className='px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                Designation
              </th>
              <th className='px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                Department
              </th>
              <th className='px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                Email
              </th>
              <th className='px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                Status
              </th>
              <th className='px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                Management
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan='7'
                  className='py-20 text-center font-medium italic text-gray-400'
                >
                  Accessing personnel directory...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan='7'
                  className='py-20 text-center font-bold text-rose-500'
                >
                  {error}
                </td>
              </tr>
            ) : filteredStaff.length === 0 ? (
              <tr>
                <td
                  colSpan='7'
                  className='py-20 text-center font-medium italic text-gray-400'
                >
                  No staff records found matching your query.
                </td>
              </tr>
            ) : (
              filteredStaff.map((staff) => (
                <StaffRow
                  key={staff.dbId}
                  staff={staff}
                  onEdit={(s) => {
                    setSelectedStaff(s);
                    setIsModalOpen(true);
                  }}
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

Staff.displayName = 'Staff';
export default Staff;
