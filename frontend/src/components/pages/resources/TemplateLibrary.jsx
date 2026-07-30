import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Layout,
  Plus,
  Search,
  Download,
  Eye,
  Info,
  Edit,
  Trash2,
  Share2,
  HardDrive,
  FileCode,
  Presentation,
  FileText,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import StatisticsCard from '../../ui/StatisticsCard';
import SearchInput from '../../ui/SearchInput';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import LoadingSpinner from '../../ui/LoadingSpinner';
import EmptyState from '../../ui/EmptyState';
import ErrorState from '../../ui/ErrorState';
import resourceService from '../../../services/resourceService';
import useNotification from '../../../hooks/useNotification';
import { PreviewModal, DetailsModal, EditModal } from './ResourceModals';

import { useAuth } from '../../../hooks/useAuth';

export const TemplateLibrary = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Upload Form
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Report Templates');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { showSuccess, showError } = useNotification();

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await resourceService.getAll({
        type: 'template',
        q: searchTerm,
      });

      if (res.success && Array.isArray(res.data)) {
        setTemplates(res.data);
      } else {
        setTemplates(res.data?.resources || []);
      }
    } catch (err) {
      setError('Unable to fetch template library from server.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      const matchesSearch =
        !searchTerm ||
        tpl.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tpl.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        categoryFilter === 'all' ||
        tpl.category?.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [templates, searchTerm, categoryFilter]);

  const handleDownload = async (tpl) => {
    try {
      showSuccess(`Downloading ${tpl.title}...`);
      await resourceService.download(tpl._id || tpl.id, tpl.title);
    } catch (err) {
      showError('Failed to download template.');
    }
  };

  const handleDelete = async (tpl) => {
    if (!window.confirm(`Delete template "${tpl.title}"?`)) return;
    try {
      const res = await resourceService.delete(tpl._id || tpl.id);
      if (res.success) {
        showSuccess('Template deleted.');
        setTemplates((prev) =>
          prev.filter((t) => (t._id || t.id) !== (tpl._id || tpl.id))
        );
      } else {
        showError(res.message || 'Failed to delete.');
      }
    } catch (err) {
      showError('Error deleting template.');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      showError('Please enter a template title.');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', uploadTitle);
      formData.append('category', uploadCategory);
      formData.append('type', 'template');
      formData.append('description', uploadDescription);
      if (uploadFile) formData.append('files', uploadFile);

      const res = await resourceService.upload(formData);
      if (res.success) {
        showSuccess('Template uploaded successfully!');
        setIsUploadOpen(false);
        setUploadTitle('');
        setUploadDescription('');
        setUploadFile(null);
        fetchTemplates();
      } else {
        showError(res.message || 'Upload failed.');
      }
    } catch (err) {
      showError('Upload error.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='space-y-6 pb-12'>
      <PageHeader
        title='Project Template Library'
        subtitle='Standardized project report skeletons, slide decks, IEEE documents, and code boilerplates.'
        icon={Layout}
        badge={`${templates.length} Templates`}
        actions={
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              icon={RefreshCw}
              onClick={fetchTemplates}
            >
              Refresh
            </Button>
            {isAdmin && (
              <Button
                variant='primary'
                size='sm'
                icon={Plus}
                onClick={() => setIsUploadOpen(true)}
              >
                Upload Template
              </Button>
            )}
          </div>
        }
      />

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <StatisticsCard
          title='Total Templates'
          value={templates.length}
          icon={Layout}
          color='indigo'
          description='Ready-to-use project formats'
        />
        <StatisticsCard
          title='Slide Decks'
          value={
            templates.filter(
              (t) =>
                t.fileType === 'pptx' ||
                t.title.toLowerCase().includes('presentation')
            ).length
          }
          icon={Presentation}
          color='amber'
          description='Defense & presentation decks'
        />
        <StatisticsCard
          title='SRS & Reports'
          value={
            templates.filter(
              (t) =>
                t.fileType === 'docx' || t.title.toLowerCase().includes('srs')
            ).length
          }
          icon={FileCode}
          color='emerald'
          description='IEEE & synopsis templates'
        />
      </div>

      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-4 shadow-sm dark:border-slate-800 '>
        <div className='flex flex-1 items-center gap-3'>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder='Search templates (e.g. IEEE, Synopsis, Presentation)...'
            className='max-w-md'
          />
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Categories' },
              { value: 'Report Templates', label: 'Report Templates' },
              { value: 'Presentation Decks', label: 'Presentation Decks' },
              { value: 'Code Skeletons', label: 'Code Skeletons' },
            ]}
            className='w-48'
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message='Loading template library...' />
      ) : error ? (
        <ErrorState
          title='Error Loading Templates'
          message={error}
          onRetry={fetchTemplates}
        />
      ) : filteredTemplates.length === 0 ? (
        <EmptyState
          title='No Templates Available'
          description='No project templates found matching your criteria.'
          icon={Layout}
          actionText='Upload Template'
          onAction={() => setIsUploadOpen(true)}
        />
      ) : (
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredTemplates.map((tpl) => {
            const isPptx =
              tpl.fileType === 'pptx' ||
              tpl.title.toLowerCase().includes('presentation');
            const isDocx =
              tpl.fileType === 'docx' ||
              tpl.title.toLowerCase().includes('srs');
            const tplId = tpl._id || tpl.id;

            return (
              <div
                key={tplId}
                className='flex flex-col justify-between rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-5 shadow-xs transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 '
              >
                <div>
                  <div className='mb-3 flex items-start justify-between'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                          isPptx
                            ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                            : isDocx
                              ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                              : 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                        }`}
                      >
                        {isPptx ? (
                          <Presentation className='h-6 w-6' />
                        ) : isDocx ? (
                          <FileCode className='h-6 w-6' />
                        ) : (
                          <FileText className='h-6 w-6' />
                        )}
                      </div>
                      <div>
                        <span className='inline-block rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:text-slate-200  dark:text-slate-300'>
                          {tpl.category || 'Academic Template'}
                        </span>
                        <p className='mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400'>
                          {tpl.fileType?.toUpperCase() || 'TEMPLATE'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className='font-bold text-slate-900 dark:text-white line-clamp-1'>
                    {tpl.title}
                  </h3>
                  <p className='mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400'>
                    {tpl.description ||
                      'Standardized template for student project requirements.'}
                  </p>
                </div>

                <div className='mt-5 border-t border-slate-100 pt-3 dark:border-slate-800'>
                  <div className='flex items-center justify-between text-xs text-slate-500 dark:text-slate-400'>
                    <span className='flex items-center gap-1'>
                      <HardDrive className='h-3.5 w-3.5' />
                      {tpl.fileSize || '1.0 MB'}
                    </span>
                    <span className='font-semibold text-slate-700 dark:text-slate-300'>
                      {tpl.downloadsCount || tpl.downloads || 0} downloads
                    </span>
                  </div>

                  <div className='mt-3 flex items-center justify-between gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      icon={Eye}
                      onClick={() => {
                        setSelectedTemplate(tpl);
                        setIsPreviewOpen(true);
                      }}
                    >
                      Preview
                    </Button>
                    <Button
                      variant='primary'
                      size='sm'
                      icon={Download}
                      onClick={() => handleDownload(tpl)}
                    >
                      Download
                    </Button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(tpl)}
                        className='rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                        title='Delete'
                      >
                        <Trash2 className='h-4 w-4' />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs'>
          <div className='w-full max-w-lg rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-xl dark:border-slate-800 '>
            <h3 className='text-lg font-bold text-slate-900 dark:text-white'>
              Upload Template
            </h3>
            <form onSubmit={handleUpload} className='mt-4 space-y-4'>
              <div>
                <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase'>
                  Template Title
                </label>
                <input
                  type='text'
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder='e.g. IEEE Conference Paper Template (DOCX)'
                  className='mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white'
                />
              </div>
              <Select
                label='Category'
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                options={[
                  'Report Templates',
                  'Presentation Decks',
                  'Code Skeletons',
                ]}
              />
              <div>
                <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase'>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder='Details about template format and structure...'
                  className='mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white'
                />
              </div>
              <div>
                <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase'>
                  File
                </label>
                <input
                  type='file'
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className='mt-1 w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:rounded-xl file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-indigo-600 dark:file:bg-indigo-950/60 dark:file:text-indigo-300'
                />
              </div>
              <div className='flex justify-end gap-3 pt-2'>
                <Button
                  variant='outline'
                  type='button'
                  onClick={() => setIsUploadOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant='primary' type='submit' loading={uploading}>
                  Upload Template
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <PreviewModal
        resource={selectedTemplate}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onDownload={handleDownload}
      />
      <DetailsModal
        resource={selectedTemplate}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default TemplateLibrary;
