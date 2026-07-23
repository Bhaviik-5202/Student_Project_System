import React, { useState } from 'react';
import {
    X,
    Download,
    Eye,
    FileText,
    Calendar,
    User,
    HardDrive,
    Tag,
    Share2,
    Trash2,
    Edit,
    Check,
    AlertCircle,
    FileCode,
    FileSpreadsheet,
    Presentation,
    Video,
    ExternalLink,
    Upload,
} from 'lucide-react';
import resourceService from '../../../services/resourceService';
import useNotification from '../../../hooks/useNotification';

export const PreviewModal = ({ resource, isOpen, onClose, onDownload }) => {
    if (!isOpen || !resource) return null;

    const isPdf = resource.fileType === 'pdf' || resource.url?.toLowerCase().endsWith('.pdf');
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(resource.fileType?.toLowerCase());
    const isVideo = resource.type === 'video' || resource.url?.includes('youtube') || resource.url?.includes('embed');

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in'>
            <div className='flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden'>
                {/* Header */}
                <div className='flex items-center justify-between border-b border-slate-200 p-4 px-6 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80'>
                    <div className='flex items-center gap-3 overflow-hidden'>
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400'>
                            <Eye size={20} />
                        </div>
                        <div className='truncate'>
                            <h3 className='truncate font-semibold text-slate-900 dark:text-white'>
                                {resource.title}
                            </h3>
                            <p className='text-xs text-slate-500 dark:text-slate-400'>
                                {resource.category || 'General'} &bull; {resource.fileSize || '1.0 MB'} &bull; {resource.fileType?.toUpperCase() || 'DOCUMENT'}
                            </p>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={() => onDownload(resource)}
                            className='flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition-colors'
                        >
                            <Download size={14} />
                            Download
                        </button>
                        <button
                            onClick={onClose}
                            className='rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200'
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content Body */}
                <div className='flex-1 overflow-y-auto p-6 min-h-[350px] flex flex-col justify-center items-center bg-slate-100/50 dark:bg-slate-900/50'>
                    {isPdf ? (
                        <div className='w-full h-[550px] rounded-lg border border-slate-200 overflow-hidden dark:border-slate-700 bg-white'>
                            <iframe
                                src={`/api/v1/resources/${resource._id}/preview`}
                                className='w-full h-full border-0'
                                title={resource.title}
                            />
                        </div>
                    ) : isImage ? (
                        <div className='max-h-[500px] overflow-hidden rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-700'>
                            <img
                                src={`/api/v1/resources/${resource._id}/preview`}
                                alt={resource.title}
                                className='max-h-[480px] w-auto object-contain rounded'
                            />
                        </div>
                    ) : isVideo ? (
                        <div className='w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 bg-black'>
                            {resource.url?.includes('youtube') || resource.url?.includes('embed') ? (
                                <iframe
                                    src={resource.url}
                                    className='w-full h-full border-0'
                                    title={resource.title}
                                    allowFullScreen
                                />
                            ) : (
                                <video controls className='w-full h-full'>
                                    <source src={`/api/v1/resources/${resource._id}/preview`} />
                                    Your browser does not support HTML5 video player.
                                </video>
                            )}
                        </div>
                    ) : (
                        <div className='w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700'>
                            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400'>
                                <FileText size={32} />
                            </div>
                            <h4 className='mb-2 text-lg font-bold text-slate-800 dark:text-white'>
                                {resource.title}
                            </h4>
                            <p className='mb-4 text-xs text-slate-500 dark:text-slate-400'>
                                {resource.description || 'No additional preview available for this file format.'}
                            </p>
                            <div className='mb-6 rounded-xl bg-slate-50 p-4 text-left text-xs space-y-2 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600'>
                                <div className='flex justify-between text-slate-600 dark:text-slate-300'>
                                    <span className='font-medium'>Format:</span>
                                    <span className='font-semibold uppercase text-indigo-600 dark:text-indigo-400'>{resource.fileType || 'Doc'}</span>
                                </div>
                                <div className='flex justify-between text-slate-600 dark:text-slate-300'>
                                    <span className='font-medium'>File Size:</span>
                                    <span>{resource.fileSize || '1.2 MB'}</span>
                                </div>
                                <div className='flex justify-between text-slate-600 dark:text-slate-300'>
                                    <span className='font-medium'>Total Downloads:</span>
                                    <span>{resource.downloadsCount || 0}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => onDownload(resource)}
                                className='w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition-colors'
                            >
                                <Download size={16} />
                                Download Full File
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const DetailsModal = ({
    resource,
    isOpen,
    onClose,
    onDownload,
    onEdit,
    onDelete,
    onShare,
}) => {
    if (!isOpen || !resource) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in'>
            <div className='w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden'>
                {/* Header */}
                <div className='flex items-center justify-between border-b border-slate-200 p-5 px-6 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80'>
                    <div className='flex items-center gap-3'>
                        <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'>
                            <FileText size={22} />
                        </div>
                        <div>
                            <h3 className='font-bold text-slate-900 dark:text-white text-base'>
                                Resource Metadata & Details
                            </h3>
                            <p className='text-xs text-slate-500 dark:text-slate-400'>
                                ID: {resource._id}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className='rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200'
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className='p-6 space-y-6 max-h-[75vh] overflow-y-auto'>
                    <div>
                        <span className='inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300 mb-2'>
                            {resource.category || 'General'}
                        </span>
                        <h2 className='text-xl font-bold text-slate-900 dark:text-white'>
                            {resource.title}
                        </h2>
                        <p className='mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300'>
                            {resource.description || 'No detailed description provided for this academic resource.'}
                        </p>
                    </div>

                    <div className='grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 text-xs'>
                        <div className='flex items-center gap-2.5 text-slate-700 dark:text-slate-300'>
                            <User size={16} className='text-slate-400' />
                            <div>
                                <p className='text-[10px] text-slate-400 uppercase font-bold'>Uploaded By</p>
                                <p className='font-semibold'>{resource.uploadedBy?.name || 'Academic Faculty'}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2.5 text-slate-700 dark:text-slate-300'>
                            <Calendar size={16} className='text-slate-400' />
                            <div>
                                <p className='text-[10px] text-slate-400 uppercase font-bold'>Upload Date</p>
                                <p className='font-semibold'>
                                    {resource.createdAt ? new Date(resource.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' }) : 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2.5 text-slate-700 dark:text-slate-300'>
                            <HardDrive size={16} className='text-slate-400' />
                            <div>
                                <p className='text-[10px] text-slate-400 uppercase font-bold'>File Size</p>
                                <p className='font-semibold'>{resource.fileSize || '1.0 MB'}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2.5 text-slate-700 dark:text-slate-300'>
                            <Download size={16} className='text-slate-400' />
                            <div>
                                <p className='text-[10px] text-slate-400 uppercase font-bold'>Downloads</p>
                                <p className='font-semibold'>{resource.downloadsCount || 0} times</p>
                            </div>
                        </div>
                    </div>

                    {resource.tags && resource.tags.length > 0 && (
                        <div>
                            <p className='mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5'>
                                <Tag size={14} /> Tags & Keywords
                            </p>
                            <div className='flex flex-wrap gap-1.5'>
                                {resource.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className='rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className='flex items-center justify-between border-t border-slate-200 bg-slate-50 p-4 px-6 dark:border-slate-700 dark:bg-slate-800/80'>
                    <div className='flex items-center gap-2'>
                        {onShare && (
                            <button
                                onClick={() => onShare(resource)}
                                className='flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors'
                            >
                                <Share2 size={14} />
                                Share
                            </button>
                        )}
                        {onEdit && (
                            <button
                                onClick={() => onEdit(resource)}
                                className='flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors'
                            >
                                <Edit size={14} />
                                Edit
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(resource)}
                                className='flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors'
                            >
                                <Trash2 size={14} />
                                Delete
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => onDownload(resource)}
                        className='flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-700 transition-colors'
                    >
                        <Download size={16} />
                        Download Resource
                    </button>
                </div>
            </div>
        </div>
    );
};

export const EditModal = ({ resource, isOpen, onClose, onSaved }) => {
    const [formData, setFormData] = useState({
        title: resource?.title || '',
        category: resource?.category || 'General',
        type: resource?.type || 'document',
        description: resource?.description || '',
        status: resource?.status || 'active',
        tags: Array.isArray(resource?.tags) ? resource.tags.join(', ') : '',
    });
    const [saving, setSaving] = useState(false);
    const { showSuccess, showError } = useNotification();

    React.useEffect(() => {
        if (resource) {
            setFormData({
                title: resource.title || '',
                category: resource.category || 'General',
                type: resource.type || 'document',
                description: resource.description || '',
                status: resource.status || 'active',
                tags: Array.isArray(resource.tags) ? resource.tags.join(', ') : '',
            });
        }
    }, [resource]);

    if (!isOpen || !resource) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...formData,
                tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
            };
            const res = await resourceService.update(resource._id, payload);
            if (res.success || !res.error) {
                showSuccess('Resource updated successfully');
                onSaved();
                onClose();
            } else {
                showError(res.message || 'Failed to update resource');
            }
        } catch (err) {
            showError('Failed to update resource');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in'>
            <div className='w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden'>
                <div className='flex items-center justify-between border-b border-slate-200 p-4 px-6 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80'>
                    <h3 className='font-bold text-slate-900 dark:text-white text-base flex items-center gap-2'>
                        <Edit size={18} className='text-indigo-600' /> Edit Resource Metadata
                    </h3>
                    <button
                        onClick={onClose}
                        className='rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200'
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='p-6 space-y-4 text-xs'>
                    <div>
                        <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Title</label>
                        <input
                            type='text'
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className='w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
                            required
                        />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Category</label>
                            <input
                                type='text'
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className='w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
                                required
                            />
                        </div>
                        <div>
                            <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className='w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
                            >
                                <option value='document'>Document</option>
                                <option value='template'>Template</option>
                                <option value='video'>Video</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Description</label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className='w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
                        />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className='w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
                            >
                                <option value='active'>Active</option>
                                <option value='archived'>Archived</option>
                                <option value='draft'>Draft</option>
                            </select>
                        </div>
                        <div>
                            <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Tags (comma-separated)</label>
                            <input
                                type='text'
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder='e.g. SRS, IEEE, Guidelines'
                                className='w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
                            />
                        </div>
                    </div>

                    <div className='flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='rounded-xl border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            disabled={saving}
                            className='rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white shadow hover:bg-indigo-700 disabled:opacity-50 transition-colors'
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const UploadModal = ({ isOpen, onClose, onUploaded, defaultType = 'document' }) => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(defaultType === 'template' ? 'Academic Templates' : 'Project Documentation');
    const [type, setType] = useState(defaultType);
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const { showSuccess, showError } = useNotification();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file && !title) {
            showError('Please select a file or enter a title');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('title', title || file?.name || 'New Resource');
            formData.append('type', type);
            formData.append('category', category);
            formData.append('description', description);
            if (file) {
                formData.append('files', file);
            }

            const res = await resourceService.upload(formData);
            if (res.success || !res.error) {
                showSuccess('Resource uploaded successfully');
                onUploaded();
                onClose();
            } else {
                showError(res.message || 'Upload failed');
            }
        } catch (err) {
            showError('Upload failed. Please check file format.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in'>
            <div className='w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden'>
                <div className='flex items-center justify-between border-b border-slate-200 p-4 px-6 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80'>
                    <h3 className='font-bold text-slate-900 dark:text-white text-base flex items-center gap-2'>
                        <Upload size={18} className='text-indigo-600' /> Upload New Resource
                    </h3>
                    <button
                        onClick={onClose}
                        className='rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200'
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='p-6 space-y-4 text-xs'>
                    <div>
                        <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Resource Title</label>
                        <input
                            type='text'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder='e.g. IEEE Report Formatting Guidelines'
                            className='w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
                        />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Category</label>
                            <input
                                type='text'
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder='e.g. Guidelines, Reports'
                                className='w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
                                required
                            />
                        </div>
                        <div>
                            <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Resource Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className='w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
                            >
                                <option value='document'>Document</option>
                                <option value='template'>Template</option>
                                <option value='video'>Video</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Description</label>
                        <textarea
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='Brief description of the asset...'
                            className='w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
                        />
                    </div>

                    <div>
                        <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Select Attachment File</label>
                        <div className='rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center dark:border-slate-600 dark:bg-slate-700/50 hover:border-indigo-400 transition-colors cursor-pointer'>
                            <input
                                type='file'
                                id='modal-file-upload'
                                onChange={(e) => setFile(e.target.files[0])}
                                className='hidden'
                            />
                            <label htmlFor='modal-file-upload' className='cursor-pointer block'>
                                <Upload size={28} className='mx-auto mb-2 text-indigo-500' />
                                {file ? (
                                    <p className='font-bold text-slate-800 dark:text-white text-xs truncate max-w-xs mx-auto'>
                                        Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </p>
                                ) : (
                                    <>
                                        <p className='font-semibold text-slate-700 dark:text-slate-200 text-xs'>
                                            Click to choose PDF, DOCX, PPTX, or Video
                                        </p>
                                        <p className='text-[10px] text-slate-400 mt-1'>Maximum file size: 50MB</p>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className='flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='rounded-xl border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            disabled={uploading}
                            className='rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white shadow hover:bg-indigo-700 disabled:opacity-50 transition-colors'
                        >
                            {uploading ? 'Uploading...' : 'Upload Asset'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
