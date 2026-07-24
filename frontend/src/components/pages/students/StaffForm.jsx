import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Users,
  UserPlus,
  ArrowLeft,
  Save,
  Loader2,
  Mail,
  Phone,
  Shield,
  Building,
  UserCheck,
  Hash,
  CheckCircle2,
  User as UserIcon,
} from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import Input from '../../ui/Input';
import staffService from '../../../services/staffService';

const StaffForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Faculty',
    department: 'Computer Engineering',
    staffId: '',
    status: 'Active',
  });

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);

  const fetchStaff = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      let staffData = null;
      const res = await staffService.getStaffById(id);
      if (res && res.success !== false) {
        staffData = res.data || res.staff || res;
      }

      if (!staffData) {
        const listRes = await staffService.getAllStaff();
        if (listRes.success && Array.isArray(listRes.data)) {
          staffData = listRes.data.find(
            (s) => s._id === id || s.id === id || s.staffId === id
          );
        }
      }

      if (staffData) {
        setFormData({
          name: staffData.name || '',
          email: staffData.email || '',
          phone: staffData.phone || '',
          role: staffData.role || 'Faculty',
          department: staffData.department || 'Computer Engineering',
          staffId: staffData.staffId || staffData.facultyId || staffData.id || '',
          status: staffData.status || 'Active',
        });
      } else {
        toast.error('Staff member not found');
        navigate('/staff');
      }
    } catch (err) {
      console.error('Error fetching staff member:', err);
      toast.error('Failed to load staff member details');
      navigate('/staff');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (isEditMode) {
      fetchStaff();
    }
  }, [isEditMode, fetchStaff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please provide both name and email');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        role: formData.role,
        department: formData.department,
        status: formData.status,
      };

      if (formData.staffId.trim()) {
        payload.staffId = formData.staffId.trim();
        payload.facultyId = formData.staffId.trim();
      }

      let res;
      if (isEditMode) {
        res = await staffService.updateStaff(id, payload);
      } else {
        res = await staffService.createStaff(payload);
      }

      if (res && res.success !== false) {
        toast.success(
          isEditMode ? 'Staff profile updated successfully!' : 'Staff member enrolled successfully!'
        );
        navigate('/staff', { state: { refresh: true } });
      } else {
        toast.error(res?.message || 'Operation failed. Please try again.');
      }
    } catch (err) {
      console.error('Failed to save staff member:', err);
      toast.error('An unexpected error occurred while saving staff details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='animate-fade-in space-y-6 p-4 md:p-6 max-w-4xl mx-auto'>
      <PageHeader
        title={isEditMode ? 'Edit Staff Profile' : 'Enroll Staff Member'}
        subtitle={
          isEditMode
            ? 'Update university faculty or staff information'
            : 'Register a new faculty or administrative staff member'
        }
        icon={isEditMode ? UserCheck : UserPlus}
        actions={
          <button
            type='button'
            onClick={() => navigate('/staff')}
            className='flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-all'
          >
            <ArrowLeft size={16} />
            <span>Back to Staff Management</span>
          </button>
        }
      />

      {loading ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
          <Loader2 className='h-8 w-8 animate-spin text-indigo-600' />
          <p className='mt-3 text-sm font-medium text-slate-500 dark:text-slate-400'>
            Loading staff profile details...
          </p>
        </div>
      ) : (
        <div className='rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Name & Staff ID */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Input
                label='Full Name'
                name='name'
                type='text'
                icon={UserIcon}
                placeholder='e.g. Dr. Sarah Connor'
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Input
                label='Staff / Faculty ID'
                name='staffId'
                type='text'
                icon={Hash}
                placeholder='e.g. FAC-2026-001 (Leave blank for auto-generation)'
                value={formData.staffId}
                onChange={handleChange}
                helperText='Leave blank to auto-generate a unique ID'
              />
            </div>

            {/* Email & Phone */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Input
                label='Email Address'
                name='email'
                type='email'
                icon={Mail}
                placeholder='e.g. sarah@university.edu'
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Input
                label='Phone Number'
                name='phone'
                type='text'
                icon={Phone}
                placeholder='e.g. +91 98765 43210'
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Role, Department, Status */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div>
                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300'>
                  Designation / Role <span className='text-red-500'>*</span>
                </label>
                <div className='relative'>
                  <Shield
                    size={16}
                    className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
                  />
                  <select
                    name='role'
                    className='w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value='Faculty'>Faculty</option>
                    <option value='Assistant Professor'>Assistant Professor</option>
                    <option value='Associate Professor'>Associate Professor</option>
                    <option value='HOD'>HOD</option>
                    <option value='Admin Staff'>Admin Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300'>
                  Department
                </label>
                <div className='relative'>
                  <Building
                    size={16}
                    className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
                  />
                  <select
                    name='department'
                    className='w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value='Computer Engineering'>Computer Engineering</option>
                    <option value='Information Technology'>Information Technology</option>
                    <option value='Electronics & Communication'>Electronics & Communication</option>
                    <option value='Mechanical Engineering'>Mechanical Engineering</option>
                    <option value='Civil Engineering'>Civil Engineering</option>
                  </select>
                </div>
              </div>

              <div>
                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300'>
                  Account Status
                </label>
                <div className='relative'>
                  <CheckCircle2
                    size={16}
                    className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
                  />
                  <select
                    name='status'
                    className='w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value='Active'>Active</option>
                    <option value='Inactive'>Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className='flex items-center justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-700'>
              <button
                type='button'
                onClick={() => navigate('/staff')}
                className='rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={submitting}
                className='flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 dark:shadow-none disabled:opacity-50'
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className='animate-spin' />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>{isEditMode ? 'Update Profile' : 'Enroll Staff'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StaffForm;
