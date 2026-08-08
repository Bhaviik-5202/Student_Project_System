import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  UserCheck,
} from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import staffService from '../../../services/staffService';
import { subscribeDataChanged } from '../../../utils/eventBus';
import { toast } from 'react-hot-toast';

const MobileStaffCard = memo(({ staff, onEdit, onDelete }) => (
  <div className='flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
    <div className='flex items-start justify-between gap-3'>
      <div className='flex items-center gap-3 min-w-0'>
        {staff.avatar ? (
          <img src={staff.avatar} alt={staff.name} className='h-11 w-11 shrink-0 rounded-2xl object-cover border border-gray-200 dark:border-gray-700' />
        ) : (
          <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 text-lg font-black text-purple-600 dark:from-purple-950/60 dark:to-purple-900/40 dark:text-purple-400'>
            {staff.name ? staff.name.charAt(0).toUpperCase() : 'F'}
          </div>
        )}
        <div className='flex flex-col min-w-0'>
          <div className='text-[14px] font-black text-slate-900 dark:text-white leading-tight truncate'>
            {staff.name}
          </div>
          <div className='text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 truncate'>
            {staff.email}
          </div>
        </div>
      </div>
      <span className={`inline-flex shrink-0 items-center rounded-xl px-2 py-1 text-[10px] font-black uppercase tracking-wider ${
        staff.status === 'Active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
      }`}>
        <UserCheck size={10} className='mr-1' />
        {staff.status || 'Active'}
      </span>
    </div>

    <div className='mt-2 flex flex-col gap-2 rounded-xl bg-slate-50/50 p-3 dark:bg-slate-800/40'>
      <div className='flex flex-row items-center justify-between sm:flex-col sm:items-start sm:gap-1'>
        <span className='font-bold text-gray-800 dark:text-gray-200 text-[12px]'>
          {staff.designation || 'Assistant Professor'}
        </span>
        <span className='text-[10px] font-bold text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/30 px-1.5 py-0.5 rounded'>
          {staff.facultyId || staff.staffId || 'FAC-2026-001'}
        </span>
      </div>
      <div className='flex items-center gap-1 text-[11px] text-gray-600 dark:text-gray-400'>
        <Building size={12} className='text-gray-400 shrink-0' />
        <span className='truncate'>{staff.department || 'Computer Engineering'}</span>
      </div>
      
      <div className='mt-2 flex flex-col gap-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 font-medium'>
          <Phone size={12} className='text-gray-400 shrink-0' />
          <span className='truncate'>{staff.phone && staff.phone !== 'N/A' ? staff.phone : <span className='italic'>6353712057</span>}</span>
        </div>
        <div className='flex w-full items-center gap-2 sm:w-auto'>
          <button onClick={() => onEdit(staff)} className='flex h-11 flex-1 px-4 items-center gap-1.5 justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-transform active:scale-90 dark:bg-indigo-500/20 dark:text-indigo-400 shadow-xs'>
            <Edit2 size={14} />
            <span className='font-bold text-[12px]'>Edit</span>
          </button>
          <button onClick={() => onDelete(staff.dbId || staff.id)} className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition-transform active:scale-90 dark:bg-rose-500/20 dark:text-rose-400 shadow-xs'>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  </div>
));

const StaffRow = memo(({ staff, onEdit, onDelete }) => (
  <tr className='group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-slate-900/50'>
    {/* Faculty ID */}
    <td className='whitespace-nowrap px-6 py-4'>
      <span className='rounded-lg bg-purple-50 px-2.5 py-1 font-mono text-xs font-bold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-100 dark:border-purple-800'>
        {staff.facultyId || staff.staffId || 'FAC-2026-001'}
      </span>
    </td>

    {/* Faculty Name & Contact */}
    <td className='whitespace-nowrap px-6 py-4'>
      <div className='flex items-center gap-3'>
        {staff.avatar ? (
          <img
            src={staff.avatar}
            alt={staff.name}
            className='h-9 w-9 rounded-xl object-cover border border-gray-200 dark:border-gray-700'
          />
        ) : (
          <div className='flex h-9 w-9 items-center justify-center rounded-xl border border-purple-100 bg-purple-50 font-bold text-purple-600 dark:border-purple-800/30 dark:bg-purple-900/20 dark:text-purple-400'>
            {staff.name ? staff.name.charAt(0).toUpperCase() : 'F'}
          </div>
        )}
        <div>
          <div className='text-sm font-bold text-gray-900 dark:text-white transition-colors group-hover:text-purple-600 '>
            {staff.name}
          </div>
          <div className='text-xs text-gray-500 dark:text-slate-400'>
            {staff.email}
          </div>
        </div>
      </div>
    </td>

    {/* Department */}
    <td className='whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-800 dark:text-gray-200'>
      {staff.department || 'Computer Engineering'}
    </td>

    {/* Designation & Role */}
    <td className='whitespace-nowrap px-6 py-4'>
      <div className='flex flex-col gap-0.5'>
        <span className='text-xs font-bold text-gray-800 dark:text-gray-200'>
          {staff.designation || 'Assistant Professor'}
        </span>
        <span className='text-[10px] font-semibold text-gray-400 uppercase tracking-wider'>
          {staff.role || 'Faculty'}
        </span>
      </div>
    </td>

    {/* Contact Number */}
    <td className='whitespace-nowrap px-6 py-4 text-xs font-medium text-gray-600 dark:text-gray-400'>
      {staff.phone && staff.phone !== 'N/A' ? (
        staff.phone
      ) : (
        <span className='italic text-gray-400'>6353712057</span>
      )}
    </td>

    {/* Status */}
    <td className='whitespace-nowrap px-6 py-4'>
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
          staff.status === 'Active'
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }`}
      >
        <UserCheck size={12} className='mr-1' />
        {staff.status || 'Active'}
      </span>
    </td>

    {/* Joining Date */}
    <td className='whitespace-nowrap px-6 py-4 text-xs text-gray-500 dark:text-slate-400'>
      {new Date(
        staff.joiningDate || staff.createdAt || Date.now()
      ).toLocaleDateString(undefined, { dateStyle: 'medium' })}
    </td>

    {/* Actions */}
    <td className='whitespace-nowrap px-3 py-3 sm:px-6 sm:py-4 text-right'>
      <div className='flex justify-end gap-2 opacity-100 sm:opacity-0 transition-opacity sm:group-hover:opacity-100'>
        <button
          onClick={() => onEdit(staff)}
          className='rounded-xl p-2 text-indigo-600 transition-all hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30'
          title='Edit Profile'
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(staff.dbId || staff.id)}
          className='rounded-xl p-2 text-rose-600 transition-all hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30'
          title='Delete Faculty Member'
        >
          <Trash2 size={16} />
        </button>
      </div>
    </td>
  </tr>
));

StaffRow.displayName = 'StaffRow';

const Staff = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await staffService.getAllStaff();
    if (res.success) {
      const nonAdminStaff = (res.data || []).filter((s) => {
        const role = (s.role || '').toLowerCase();
        const email = (s.email || '').toLowerCase().trim();
        return (
          role !== 'admin' &&
          role !== 'administrator' &&
          email !== 'er.bhavik5202@gmail.com'
        );
      });
      setStaffMembers(
        nonAdminStaff.map((staff, index) => ({
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

  // Auto-refresh when any staff or user CRUD event fires
  useEffect(() => {
    const unsubscribe = subscribeDataChanged((detail) => {
      if (detail?.type === 'staff_changed' || detail?.type === 'user_changed') {
        fetchStaff();
      }
    });
    return () => unsubscribe();
  }, [fetchStaff]);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchStaff();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, fetchStaff, navigate, location.pathname]);

  const handleEditStaff = (staff) => {
    if (
      staff.role?.toLowerCase() === 'admin' ||
      staff.email?.toLowerCase().trim() === 'er.bhavik5202@gmail.com'
    ) {
      toast.error('Super Admin account is protected and cannot be modified.');
      return;
    }
    const targetId = staff.dbId || staff.id;
    navigate(`/staff/${targetId}/edit`);
  };

  const handleDeleteStaff = async (id) => {
    const targetStaff = staffMembers.find((s) => (s.dbId || s.id) === id);
    if (
      targetStaff &&
      (targetStaff.role?.toLowerCase() === 'admin' ||
        targetStaff.email?.toLowerCase().trim() === 'er.bhavik5202@gmail.com')
    ) {
      toast.error('Super Admin account is protected and cannot be modified.');
      return;
    }

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
    const q = searchQuery.toLowerCase();
    return staffMembers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        (s.department || '').toLowerCase().includes(q) ||
        (s.designation || '').toLowerCase().includes(q)
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
    <div className='animate-fade-in space-y-6 pt-0 pb-6'>
      <PageHeader
        title='Staff Management'
        subtitle='Manage university faculty and administrative staff'
        icon={UserCheck}
        badge={`${filteredStaff.length} Staff Members`}
        actions={
          <div className='flex items-center gap-3'>
            <button
              onClick={() => handleExport()}
              className='rounded-xl border border-gray-200 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-sm transition hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
            >
              Export Staff CSV
            </button>
            <button
              onClick={() => navigate('/staff/new')}
              className='flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all dark:shadow-none'
            >
              <UserPlus size={16} />
              <span>Add Staff Member</span>
            </button>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className='card mb-2'>
        <div className='card-body'>
          <div className='group relative w-full sm:max-w-md'>
            <Search
              size={18}
              className='pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-indigo-500'
            />
            <div className='absolute left-12 top-1/2 z-10 h-5 w-[1px] -translate-y-1/2 bg-gray-200 dark:bg-slate-700' />
            <input
              type='text'
              className='form-control border-gray-100 bg-gray-50 !pl-16 text-sm transition-all focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:focus:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 w-full'
              placeholder='Search by name, ID, email, department...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className='hidden md:block table-container table-responsive overflow-x-auto shadow-md'>
        <table className='table'>
          <thead>
            <tr className='bg-gray-50 dark:bg-gray-800/50 dark:bg-slate-900/50'>
              <th className='w-32 px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                Faculty ID
              </th>
              <th className='px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                Faculty Info
              </th>
              <th className='px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                Department
              </th>
              <th className='px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                Designation
              </th>
              <th className='px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                Contact No.
              </th>
              <th className='px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                Status
              </th>
              <th className='px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                Joining Date
              </th>
              <th className='px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                Actions
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
                  colSpan='8'
                  className='py-20 text-center font-bold text-rose-500'
                >
                  {error}
                </td>
              </tr>
            ) : filteredStaff.length === 0 ? (
              <tr>
                <td
                  colSpan='8'
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
                  onEdit={handleEditStaff}
                  onDelete={handleDeleteStaff}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards Layout */}
      <div className='block md:hidden space-y-4'>
        {loading ? (
          <div className='flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white py-12 px-4 text-center dark:border-slate-800 dark:bg-slate-900'>
            <div className='h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent mb-3' />
            <span className='text-[13px] font-semibold text-slate-500'>Accessing directory...</span>
          </div>
        ) : error ? (
          <div className='flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white py-12 px-4 text-center dark:border-slate-800 dark:bg-slate-900'>
            <span className='text-[13px] font-semibold text-rose-500 mb-2'>{error}</span>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white py-12 px-4 text-center dark:border-slate-800 dark:bg-slate-900'>
            <Users className='mb-3 h-10 w-10 text-slate-300 dark:text-slate-600' />
            <span className='text-[13px] font-semibold text-slate-500'>No staff records found.</span>
          </div>
        ) : (
          filteredStaff.map((staff) => (
            <MobileStaffCard
              key={staff.dbId}
              staff={staff}
              onEdit={handleEditStaff}
              onDelete={handleDeleteStaff}
            />
          ))
        )}
      </div>
    </div>
  );
});

Staff.displayName = 'Staff';
export default Staff;
