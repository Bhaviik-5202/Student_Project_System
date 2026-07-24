// src/components/pages/resources/ResourceDetails.jsx
import React, { useState, useCallback, useEffect, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  Download,
  Share2,
  Trash2,
  Edit,
  User,
  Calendar,
  HardDrive,
  Eye,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import useNotification from '../../../hooks/useNotification';
import resourceService from '../../../services/resourceService';
import { PreviewModal, EditModal } from './ResourceModals';

const ResourceDetails = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [relatedResources, setRelatedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { showSuccess, showError } = useNotification();

  const fetchResourceDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await resourceService.getById(id);
      if (response.success || response.data) {
        const item = response.data || response;
        setResource(item);

        // Fetch related resources
        const relatedRes = await resourceService.getAll({ limit: 4 });
        if (relatedRes.data) {
          setRelatedResources(relatedRes.data.filter((r) => r._id !== id));
        }
      } else {
        showError('Resource not found.');
      }
    } catch (error) {
      console.error('Failed to fetch resource details', error);
      showError('Failed to load resource details.');
    } finally {
      setLoading(false);
    }
  }, [id, showError]);

  useEffect(() => {
    fetchResourceDetails();
  }, [fetchResourceDetails]);

  const handleDownload = async () => {
    if (!resource) return;
    showSuccess(`Downloading ${resource.title || resource.name}...`);
    await resourceService.download(
      resource._id,
      `${resource.title || resource.name}.${resource.fileType || 'pdf'}`
    );
  };

  const handleDelete = async () => {
    if (!resource) return;
    if (window.confirm(`Delete "${resource.title || resource.name}"?`)) {
      const res = await resourceService.delete(resource._id);
      if (res.success || !res.error) {
        showSuccess('Resource deleted successfully.');
        navigate('/resources');
      } else {
        showError(res.message || 'Failed to delete resource');
      }
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/resources/${id}`;
    navigator.clipboard.writeText(url);
    showSuccess('Resource link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className='p-8 text-center text-slate-500 dark:text-slate-400'>
        Loading resource details...
      </div>
    );
  }

  if (!resource) {
    return (
      <div className='p-8 text-center text-red-500'>
        <p className='font-bold text-lg mb-2'>Resource not found</p>
        <button
          onClick={() => navigate('/resources')}
          className='inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white'
        >
          <ArrowLeft size={16} /> Back to Resources
        </button>
      </div>
    );
  }

  const title = resource.title || resource.name || 'Untitled Resource';
  const category = resource.category || 'General';
  const fileSize = resource.fileSize || resource.size || '1.0 MB';
  const downloads = resource.downloadsCount || resource.downloads || 0;
  const tags = Array.isArray(resource.tags) ? resource.tags : [];
  const uploaderName =
    resource.uploadedBy?.name || resource.uploadedBy || 'Academic Faculty';

  return (
    <div className='pt-0 pb-6 space-y-6 animate-fade-in'>
      {/* Top Header */}
      <div className='flex items-center justify-between'>
        <button
          onClick={() => navigate('/resources')}
          className='flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600  dark:hover:text-indigo-400 transition-colors'
        >
          <ArrowLeft size={16} /> Back to Resource Browser
        </button>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setIsEditOpen(true)}
            className='flex items-center gap-1.5 rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 dark:border-slate-600   transition-colors'
          >
            <Edit size={14} /> Edit
          </button>
          <button
            onClick={handleDelete}
            className='flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 transition-colors'
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Left 2 Columns */}
        <div className='lg:col-span-2 space-y-6'>
          <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
            <div className='mb-6 flex items-start gap-4'>
              <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 shadow-sm'>
                <FileText size={28} />
              </div>
              <div className='flex-1'>
                <span className='inline-block rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 dark:bg-slate-700  mb-1.5'>
                  {category}
                </span>
                <h1 className='text-xl font-bold text-slate-900 dark:text-white'>
                  {title}
                </h1>
                <div className='mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400'>
                  <span className='flex items-center gap-1'>
                    <HardDrive size={14} /> {fileSize}
                  </span>
                  <span className='flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300'>
                    <Download size={14} className='text-indigo-500' />{' '}
                    {downloads} downloads
                  </span>
                </div>
              </div>
            </div>

            <div className='space-y-6 border-t border-slate-100 pt-6 dark:border-slate-700/60'>
              <div>
                <h3 className='mb-2 text-xs font-bold uppercase tracking-wider text-slate-400'>
                  Description
                </h3>
                <p className='text-sm leading-relaxed text-slate-700 dark:text-slate-300'>
                  {resource.description ||
                    'No additional description provided.'}
                </p>
              </div>

              {tags.length > 0 && (
                <div>
                  <h3 className='mb-2 text-xs font-bold uppercase tracking-wider text-slate-400'>
                    Tags & Keywords
                  </h3>
                  <div className='flex flex-wrap gap-1.5'>
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className='rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300'
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className='grid grid-cols-2 gap-4 rounded-xl bg-slate-50 dark:bg-slate-800 p-4 dark:bg-slate-700/40 text-xs'>
                <div className='flex items-center gap-3'>
                  <User size={18} className='text-slate-400' />
                  <div>
                    <p className='text-[10px] uppercase font-bold text-slate-400'>
                      Uploaded By
                    </p>
                    <p className='font-bold text-slate-800 dark:text-slate-200'>
                      {uploaderName}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <Calendar size={18} className='text-slate-400' />
                  <div>
                    <p className='text-[10px] uppercase font-bold text-slate-400'>
                      Date Uploaded
                    </p>
                    <p className='font-bold text-slate-800 dark:text-slate-200'>
                      {resource.createdAt
                        ? new Date(resource.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-8 flex flex-wrap gap-3 pt-4 border-t border-slate-100 dark:border-slate-700'>
              <button
                onClick={handleDownload}
                className='flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow hover:bg-indigo-700 transition-colors'
              >
                <Download size={16} /> Download Asset
              </button>
              <button
                onClick={() => setIsPreviewOpen(true)}
                className='flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 dark:border-slate-600   transition-colors'
              >
                <Eye size={16} /> Preview File
              </button>
              <button
                onClick={handleShare}
                className='flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 dark:border-slate-600   transition-colors'
              >
                <Share2 size={16} /> Share Link
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className='space-y-6'>
          <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
            <h3 className='mb-3 text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2'>
              <Eye size={16} className='text-indigo-600' /> Quick Preview
            </h3>
            <div
              onClick={() => setIsPreviewOpen(true)}
              className='flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 hover:border-indigo-400 dark:bg-slate-700/50 dark:border-slate-600 transition-all group'
            >
              <FileText
                size={40}
                className='mb-2 text-indigo-500 group-hover:scale-110 transition-transform'
              />
              <p className='text-xs font-bold text-slate-800 dark:text-white'>
                Click to Open Preview
              </p>
              <p className='text-[10px] text-slate-400 mt-1'>
                PDF, Doc, Image, or Video viewer
              </p>
            </div>
          </div>

          {relatedResources.length > 0 && (
            <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
              <h3 className='mb-3 text-sm font-bold text-slate-900 dark:text-white'>
                Related Assets
              </h3>
              <div className='space-y-2.5'>
                {relatedResources.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => navigate(`/resources/${item._id}`)}
                    className='flex items-center gap-3 rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700/50 cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                  >
                    <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300 shrink-0'>
                      <FileText size={16} />
                    </div>
                    <div className='flex-1 overflow-hidden'>
                      <p className='truncate text-xs font-bold text-slate-800 dark:text-white'>
                        {item.title || item.name}
                      </p>
                      <p className='text-[10px] text-slate-400'>
                        {item.category || 'Resource'} &bull;{' '}
                        {item.fileSize || '1.0 MB'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <PreviewModal
        resource={resource}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onDownload={handleDownload}
      />

      <EditModal
        resource={resource}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSaved={fetchResourceDetails}
      />
    </div>
  );
});

ResourceDetails.displayName = 'ResourceDetails';

export default ResourceDetails;
