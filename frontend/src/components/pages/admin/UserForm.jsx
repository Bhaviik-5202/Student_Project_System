import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Users, ArrowLeft, Save, Loader2, UserPlus, Shield } from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import api from '../../../utils/api';

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'student',
        password: '',
    });

    const [loading, setLoading] = useState(isEditMode);
    const [submitting, setSubmitting] = useState(false);

    const fetchUser = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            let userData = null;
            try {
                const res = await api.get(`/users/${id}`);
                userData = res.data || res.user || res;
            } catch (err) {
                // Fallback: search in list
                const resList = await api.get('/users');
                let list = [];
                if (Array.isArray(resList)) list = resList;
                else if (Array.isArray(resList?.data)) list = resList.data;
                else if (Array.isArray(resList?.data?.data)) list = resList.data.data;
                else if (Array.isArray(resList?.users)) list = resList.users;

                userData = list.find((u) => (u._id || u.id) === id);
            }

            if (userData) {
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    role: userData.role || 'student',
                    password: '',
                });
            } else {
                toast.error('User not found');
                navigate('/user-management');
            }
        } catch (err) {
            console.error('Error fetching user details:', err);
            toast.error('Failed to load user details');
            navigate('/user-management');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        if (isEditMode) {
            fetchUser();
        }
    }, [isEditMode, fetchUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            toast.error('Please enter name and email');
            return;
        }
        if (!isEditMode && !formData.password) {
            toast.error('Password is required for new users');
            return;
        }

        try {
            setSubmitting(true);
            const payload = { ...formData };
            if (isEditMode && !payload.password) {
                delete payload.password;
            }

            if (isEditMode) {
                await api.put(`/users/${id}`, payload);
                toast.success('User updated successfully');
            } else {
                await api.post('/users', payload);
                toast.success('User created successfully');
            }

            navigate('/user-management', { state: { refresh: true } });
        } catch (err) {
            console.error('Failed to save user:', err);
            const msg =
                err.response?.data?.message ||
                'Failed to save user. Please verify input details.';
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className='animate-fade-in space-y-6 p-4 md:p-6 max-w-4xl mx-auto'>
            <PageHeader
                title={isEditMode ? 'Edit User Profile' : 'Add New User'}
                subtitle={
                    isEditMode
                        ? 'Update user account credentials, email, and system roles'
                        : 'Enroll a new user account into the system directory'
                }
                icon={isEditMode ? Users : UserPlus}
                actions={
                    <button
                        type='button'
                        onClick={() => navigate('/user-management')}
                        className='flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-all'
                    >
                        <ArrowLeft size={16} />
                        <span>Back to User Management</span>
                    </button>
                }
            />

            {loading ? (
                <div className='flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
                    <Loader2 className='h-8 w-8 animate-spin text-indigo-600' />
                    <p className='mt-3 text-sm font-medium text-slate-500 dark:text-slate-400'>
                        Loading user profile details...
                    </p>
                </div>
            ) : (
                <div className='rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div>
                                <label className='mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300'>
                                    Full Name <span className='text-rose-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:focus:bg-slate-700'
                                    placeholder='e.g. John Doe'
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <label className='mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300'>
                                    Email Address <span className='text-rose-500'>*</span>
                                </label>
                                <input
                                    type='email'
                                    className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:focus:bg-slate-700'
                                    placeholder='e.g. john@university.edu'
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div>
                                <label className='mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300'>
                                    System Role <span className='text-rose-500'>*</span>
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
                                        <option value='student'>Student</option>
                                        <option value='faculty'>Faculty</option>
                                        <option value='admin'>Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className='mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300'>
                                    Password{' '}
                                    {isEditMode ? (
                                        <span className='normal-case text-xs font-normal text-slate-400'>
                                            (Leave blank to keep unchanged)
                                        </span>
                                    ) : (
                                        <span className='text-rose-500'>*</span>
                                    )}
                                </label>
                                <input
                                    type='password'
                                    className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:focus:bg-slate-700'
                                    placeholder={
                                        isEditMode
                                            ? '••••••••'
                                            : 'At least 6 characters'
                                    }
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    required={!isEditMode}
                                />
                            </div>
                        </div>

                        <div className='flex items-center justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-700'>
                            <button
                                type='button'
                                onClick={() => navigate('/user-management')}
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
                                        <span>{isEditMode ? 'Update User' : 'Create User'}</span>
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

export default UserForm;
