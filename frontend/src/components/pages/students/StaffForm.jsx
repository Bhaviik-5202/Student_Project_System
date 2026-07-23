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
} from 'lucide-react';
import PageHeader from '../../common/PageHeader';
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
        department: '',
        staffId: '',
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
                // Fallback list search
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
                    department: staffData.department || '',
                    staffId: staffData.staffId || staffData.id || '',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            toast.error('Please provide both name and email');
            return;
        }

        try {
            setSubmitting(true);
            let res;
            if (isEditMode) {
                res = await staffService.updateStaff(id, formData);
            } else {
                res = await staffService.createStaff(formData);
            }

            if (res && res.success !== false) {
                toast.success(
                    isEditMode ? 'Staff profile updated!' : 'Staff member enrolled!'
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
                        <div className='form-group'>
                            <label className='mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300'>
                                Full Name <span className='text-rose-500'>*</span>
                            </label>
                            <div className='relative'>
                                <Users
                                    size={18}
                                    className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
                                />
                                <input
                                    type='text'
                                    className='w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:focus:bg-slate-700'
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    placeholder='e.g. Dr. Sarah Connor'
                                    required
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='form-group'>
                                <label className='mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300'>
                                    Email Address <span className='text-rose-500'>*</span>
                                </label>
                                <div className='relative'>
                                    <Mail
                                        size={18}
                                        className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
                                    />
                                    <input
                                        type='email'
                                        className='w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:focus:bg-slate-700'
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
                                <label className='mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300'>
                                    Phone Number
                                </label>
                                <div className='relative'>
                                    <Phone
                                        size={18}
                                        className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
                                    />
                                    <input
                                        type='text'
                                        className='w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:focus:bg-slate-700'
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({ ...formData, phone: e.target.value })
                                        }
                                        placeholder='+91 98765 43210'
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='form-group'>
                                <label className='mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300'>
                                    Designation / Role
                                </label>
                                <div className='relative'>
                                    <Shield
                                        size={18}
                                        className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
                                    />
                                    <select
                                        className='w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:focus:bg-slate-700'
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
                                <label className='mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300'>
                                    Department
                                </label>
                                <div className='relative'>
                                    <Building
                                        size={18}
                                        className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
                                    />
                                    <input
                                        type='text'
                                        className='w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:focus:bg-slate-700'
                                        value={formData.department}
                                        onChange={(e) =>
                                            setFormData({ ...formData, department: e.target.value })
                                        }
                                        placeholder='e.g. Computer Engineering'
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='form-group'>
                            <label className='mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300'>
                                Staff ID
                            </label>
                            <input
                                type='text'
                                className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:focus:bg-slate-700'
                                value={formData.staffId}
                                onChange={(e) =>
                                    setFormData({ ...formData, staffId: e.target.value })
                                }
                                placeholder='Leave blank for auto-generation'
                            />
                        </div>

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
