import React, { useState, useCallback, useMemo, useEffect, memo } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Upload,
  ArrowLeft,
  FileText,
  CheckCircle,
  Tag,
  FolderOpen,
  X,
  Layers,
  Video,
  File,
  AlertCircle,
  Save,
  Eye,
  Shield,
  FileCode,
  Presentation,
} from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import useNotification from '../../../hooks/useNotification';
import resourceService from '../../../services/resourceService';

const ResourceUpload = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Detect context type from route or query params
  const typeParam = searchParams.get('type');
  const pathname = location.pathname;

  let initialType = 'document';
  let initialCategory = 'Project Documentation';

  if (pathname.includes('/templates') || typeParam === 'template') {
    initialType = 'template';
    initialCategory = 'Academic Templates';
  } else if (pathname.includes('/documents') || typeParam === 'document') {
    initialType = 'document';
    initialCategory = 'Project Documentation';
  } else if (typeParam === 'video') {
    initialType = 'video';
    initialCategory = 'Tutorials';
  }

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [type, setType] = useState(initialType);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [visibility, setVisibility] = useState('public');
  const [tagsInput, setTagsInput] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { showSuccess, showError } = useNotification();

  // Update defaults when route changes
  useEffect(() => {
    if (pathname.includes('/templates') || typeParam === 'template') {
      setType('template');
      setCategory('Academic Templates');
    } else if (pathname.includes('/documents') || typeParam === 'document') {
      setType('document');
      setCategory('Project Documentation');
    }
  }, [pathname, typeParam]);

  const handleFileSelect = useCallback(
    (e) => {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length > 0) {
        setFiles(selectedFiles);
        if (!title) {
          // Auto-fill title from file name without extension
          const fileName = selectedFiles[0].name.replace(/\.[^/.]+$/, '');
          setTitle(fileName);
        }
      }
    },
    [title]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(droppedFiles);
        if (!title) {
          const fileName = droppedFiles[0].name.replace(/\.[^/.]+$/, '');
          setTitle(fileName);
        }
      }
    },
    [title]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const removeFile = useCallback((index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showError('Please enter a resource title');
      return;
    }

    if (files.length === 0) {
      showError('Please select or attach a file to upload');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', category.trim());
      formData.append('type', type);
      formData.append('description', description.trim());
      formData.append('status', status);
      formData.append('visibility', visibility);

      // Process tags
      const tagsArray = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      tagsArray.forEach((tag) => formData.append('tags', tag));

      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await resourceService.upload(formData);

      if (response.success || !response.error) {
        showSuccess(`"${title}" uploaded successfully!`);

        // Redirect back to appropriate section
        if (type === 'template') {
          navigate('/templates');
        } else if (type === 'document') {
          navigate('/documents');
        } else {
          navigate('/resources');
        }
      } else {
        showError(response.message || 'Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      showError('Failed to upload resource. Please check server connection.');
    } finally {
      setUploading(false);
    }
  };

  const pageTitle =
    type === 'template'
      ? 'Upload Template'
      : type === 'document'
        ? 'Upload Document'
        : 'Upload Resource';

  const backDestination =
    type === 'template'
      ? '/templates'
      : type === 'document'
        ? '/documents'
        : '/resources';

  return (
    <div className='space-y-6 animate-fade-in pt-0 pb-6 max-w-5xl mx-auto'>
      <div className='flex items-center justify-between'>
        <button
          onClick={() => navigate(backDestination)}
          className='inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600  dark:hover:text-indigo-400 transition-colors'
        >
          <ArrowLeft size={16} /> Back to Library
        </button>
      </div>

      <PageHeader
        title={pageTitle}
        subtitle='Upload new academic guidelines, templates, documentation, or video tutorials to the repository'
        icon={Upload}
      />

      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 gap-8 lg:grid-cols-3'
      >
        {/* Left 2 Columns - Main Form */}
        <div className='lg:col-span-2 space-y-6'>
          <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-800 space-y-5'>
            <h3 className='text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2'>
              <FileText size={16} className='text-indigo-500' /> Basic Details
            </h3>

            {/* Title */}
            <div>
              <label className='block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5'>
                Resource Title <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='e.g., Senior Project SRS Formatting Standard Guidelines v2'
                className='w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 p-3 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:bg-white dark:bg-slate-900 focus:outline-none dark:border-slate-700 /50 dark:text-white'
              />
            </div>

            {/* Type & Category Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5'>
                  Resource Type <span className='text-red-500'>*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className='w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 p-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:border-indigo-500 focus:bg-white dark:bg-slate-900 focus:outline-none dark:border-slate-700 /50 dark:text-white'
                >
                  <option value='document'>Document (PDF, Word, Text)</option>
                  <option value='template'>Template (Docx, PPTX)</option>
                  <option value='video'>Video Tutorial</option>
                </select>
              </div>

              <div>
                <label className='block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5'>
                  Category <span className='text-red-500'>*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className='w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 p-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:border-indigo-500 focus:bg-white dark:bg-slate-900 focus:outline-none dark:border-slate-700 /50 dark:text-white'
                >
                  <option value='Project Documentation'>
                    Project Documentation
                  </option>
                  <option value='Guidelines'>Guidelines & Policies</option>
                  <option value='Academic Templates'>Academic Templates</option>
                  <option value='Reports'>Reports & Rubrics</option>
                  <option value='Tutorials'>Tutorials & Lecturing</option>
                  <option value='General'>General Resources</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className='block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5'>
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Provide a concise overview of what this resource contains...'
                className='w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 p-3 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:bg-white dark:bg-slate-900 focus:outline-none dark:border-slate-700 /50 dark:text-white'
              />
            </div>

            {/* Tags */}
            <div>
              <label className='block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5'>
                <Tag size={14} className='text-slate-400' /> Tags (Optional,
                comma-separated)
              </label>
              <input
                type='text'
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder='e.g., IEEE, SRS, Format, Presentation, Final Report'
                className='w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 p-3 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:bg-white dark:bg-slate-900 focus:outline-none dark:border-slate-700 /50 dark:text-white'
              />
            </div>
          </div>

          {/* File Upload Box */}
          <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-800 space-y-4'>
            <h3 className='text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2'>
              <Upload size={16} className='text-indigo-500' /> Attachment File{' '}
              <span className='text-red-500'>*</span>
            </h3>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className='relative rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 dark:bg-slate-800 p-8 text-center transition-colors hover:border-indigo-500 dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-indigo-400 cursor-pointer'
            >
              <input
                type='file'
                onChange={handleFileSelect}
                id='dedicated-file-upload'
                className='hidden'
              />
              <label
                htmlFor='dedicated-file-upload'
                className='cursor-pointer block space-y-3'
              >
                <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 shadow-sm'>
                  <Upload size={28} />
                </div>
                <div>
                  <p className='text-sm font-bold text-slate-800 dark:text-white'>
                    Drag & drop file here or{' '}
                    <span className='text-indigo-600 dark:text-indigo-400 underline'>
                      click to browse
                    </span>
                  </p>
                  <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
                    Supports PDF, DOCX, PPTX, XLSX, MP4, WEBM (Max file size:
                    50MB)
                  </p>
                </div>
              </label>
            </div>

            {/* Selected File List */}
            {files.length > 0 && (
              <div className='space-y-2 pt-2'>
                <p className='text-xs font-bold text-slate-700 dark:text-slate-300'>
                  Attached File:
                </p>
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className='flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/50 p-3 dark:border-indigo-900/40 dark:bg-indigo-950/30'
                  >
                    <div className='flex items-center gap-3 overflow-hidden'>
                      <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white'>
                        <FileText size={18} />
                      </div>
                      <div className='truncate text-xs'>
                        <p className='truncate font-bold text-slate-900 dark:text-white'>
                          {file.name}
                        </p>
                        <p className='text-[10px] text-slate-500 dark:text-slate-400'>
                          {(file.size / 1024 / 1024).toFixed(2)} MB &bull;{' '}
                          {file.type || 'Unknown Format'}
                        </p>
                      </div>
                    </div>
                    <button
                      type='button'
                      onClick={() => removeFile(idx)}
                      className='rounded-lg p-1.5 text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors'
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Config & Guidelines */}
        <div className='space-y-6'>
          <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-800 space-y-4'>
            <h3 className='text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5'>
              <Shield size={14} /> Settings & Visibility
            </h3>

            <div>
              <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className='w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-white'
              >
                <option value='active'>Active / Published</option>
                <option value='draft'>Draft Mode</option>
                <option value='archived'>Archived</option>
              </select>
            </div>

            <div>
              <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                Access Scope
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className='w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-white'
              >
                <option value='public'>Public (All Students & Faculty)</option>
                <option value='faculty_only'>Faculty Only</option>
                <option value='restricted'>Restricted Access</option>
              </select>
            </div>

            <div className='pt-2 border-t border-slate-100 dark:border-slate-700'>
              <button
                type='submit'
                disabled={uploading}
                className='w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all dark:shadow-none'
              >
                {uploading ? (
                  <>Uploading & Saving...</>
                ) : (
                  <>
                    <Save size={16} /> Upload & Publish
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Guidelines */}
          <div className='rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-800 p-5 dark:border-slate-700/80 /60 text-xs space-y-3'>
            <h4 className='font-bold text-slate-900 dark:text-white flex items-center gap-1.5'>
              <CheckCircle size={15} className='text-emerald-500' /> Upload
              Requirements
            </h4>
            <ul className='space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]'>
              <li>
                &bull; Ensure documents follow official university formatting
                standards.
              </li>
              <li>
                &bull; Include clear descriptions to help students discover
                relevant assets.
              </li>
              <li>
                &bull; PDF format is recommended for guidelines and evaluation
                rubrics.
              </li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
});

ResourceUpload.displayName = 'ResourceUpload';

export default ResourceUpload;
