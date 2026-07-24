import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FolderOpen,
  Plus,
  Search,
  Grid,
  List,
  Download,
  Eye,
  Info,
  Edit,
  Trash2,
  Share2,
  Calendar,
  User,
  HardDrive,
  FileText,
  FileCode,
  FileSpreadsheet,
  Presentation,
  Video,
  Filter,
  RefreshCw,
  Tag,
  Check,
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
import {
  PreviewModal,
  DetailsModal,
  EditModal,
} from './ResourceModals';

const getFormatIcon = (fileType, type) => {
  const ext = (fileType || '').toLowerCase();
  if (type === 'video' || ext === 'mp4' || ext === 'webm') {
    return { icon: Video, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400' };
  }
  if (ext === 'pdf') {
    return { icon: FileText, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400' };
  }
  if (ext === 'docx' || ext === 'doc') {
    return { icon: FileCode, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400' };
  }
  if (ext === 'pptx' || ext === 'ppt') {
    return { icon: Presentation, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400' };
  }
  if (ext === 'xlsx' || ext === 'xls') {
    return { icon: FileSpreadsheet, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400' };
  }
  return { icon: FolderOpen, color: 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 ' };
};

export const ResourceBrowser = () => {
  const { showSuccess, showError } = useNotification();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  // Modals state
  const [previewResource, setPreviewResource] = useState(null);
  const [detailsResource, setDetailsResource] = useState(null);
  const [editResource, setEditResource] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Guidelines');
  const [uploadType, setUploadType] = useState('document');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadTags, setUploadTags] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await resourceService.getAll({
        search: searchQuery,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
      });

      if (res.success && Array.isArray(res.data)) {
        setResources(res.data);
      } else {
        setResources(res.data?.resources || []);
      }
    } catch (err) {
      console.error('Failed to load resources:', err);
      setError('Unable to fetch resource repository. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categoryFilter, typeFilter]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const matchesSearch =
        !searchQuery ||
        res.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        categoryFilter === 'all' ||
        res.category?.toLowerCase() === categoryFilter.toLowerCase();

      const matchesType =
        typeFilter === 'all' ||
        res.type?.toLowerCase() === typeFilter.toLowerCase() ||
        res.fileType?.toLowerCase() === typeFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [resources, searchQuery, categoryFilter, typeFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = resources.length;
    const totalDownloads = resources.reduce((sum, r) => sum + (r.downloadsCount || r.downloads || 0), 0);
    const categories = new Set(resources.map((r) => r.category)).size;
    return { total, totalDownloads, categories };
  }, [resources]);

  const handleDownload = async (resource) => {
    try {
      showSuccess(`Initiating download for "${resource.title}"...`);
      await resourceService.download(resource._id || resource.id, resource.title);
    } catch (err) {
      showError('Failed to download file.');
    }
  };

  const handleDelete = async (resource) => {
    if (!window.confirm(`Are you sure you want to delete "${resource.title}"?`)) return;
    try {
      const res = await resourceService.delete(resource._id || resource.id);
      if (res.success) {
        showSuccess('Resource deleted successfully.');
        setResources((prev) => prev.filter((r) => (r._id || r.id) !== (resource._id || resource.id)));
      } else {
        showError(res.message || 'Failed to delete resource.');
      }
    } catch (err) {
      showError('Error deleting resource.');
    }
  };

  const handleShare = (resource) => {
    const shareUrl = `${window.location.origin}/resources/${resource._id || resource.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(resource._id || resource.id);
    showSuccess('Resource link copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      showError('Please enter a resource title');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', uploadTitle);
      formData.append('category', uploadCategory);
      formData.append('type', uploadType);
      formData.append('description', uploadDescription);
      formData.append('tags', uploadTags);
      if (uploadFile) {
        formData.append('files', uploadFile);
      }

      const res = await resourceService.upload(formData);
      if (res.success) {
        showSuccess('Resource uploaded successfully!');
        setIsUploadOpen(false);
        setUploadTitle('');
        setUploadDescription('');
        setUploadFile(null);
        fetchResources();
      } else {
        showError(res.message || 'Failed to upload resource.');
      }
    } catch (err) {
      showError('Upload error occurred.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Resource Library"
        subtitle="Access and manage shared project documents, templates, reference materials, and guidelines."
        icon={FolderOpen}
        badge={`${stats.total} Files`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={fetchResources}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsUploadOpen(true)}
            >
              Upload Resource
            </Button>
          </div>
        }
      />

      {/* Analytics Statistics Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatisticsCard
          title="Total Resources"
          value={stats.total}
          icon={FolderOpen}
          color="indigo"
          description="Available project assets"
        />
        <StatisticsCard
          title="Total Downloads"
          value={stats.totalDownloads}
          icon={Download}
          color="emerald"
          description="Cumulative file access"
        />
        <StatisticsCard
          title="Categories"
          value={stats.categories}
          icon={Tag}
          color="amber"
          description="Organized topic folders"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-4 shadow-sm dark:border-slate-800 ">
        <div className="flex flex-1 items-center gap-3">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by title, description, or tags..."
            className="max-w-md"
          />
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Categories' },
              { value: 'Guidelines', label: 'Guidelines' },
              { value: 'Templates', label: 'Templates' },
              { value: 'Policies', label: 'Policies' },
              { value: 'User Guides', label: 'User Guides' },
              { value: 'Code Examples', label: 'Code Examples' },
            ]}
            className="w-44"
          />
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All File Types' },
              { value: 'pdf', label: 'PDF Documents' },
              { value: 'document', label: 'Word Documents' },
              { value: 'template', label: 'Templates' },
              { value: 'video', label: 'Video Tutorials' },
            ]}
            className="w-40"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 p-1 dark:border-slate-800">
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded-lg p-2 text-xs font-semibold transition-all ${viewMode === 'grid'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white dark:text-white '
              }`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`rounded-lg p-2 text-xs font-semibold transition-all ${viewMode === 'list'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white dark:text-white '
              }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <LoadingSpinner message="Loading resource library..." />
      ) : error ? (
        <ErrorState
          title="Failed to Load Resources"
          message={error}
          onRetry={fetchResources}
        />
      ) : filteredResources.length === 0 ? (
        <EmptyState
          title="No Resources Found"
          description={
            searchQuery || categoryFilter !== 'all'
              ? 'No files matched your search or category filters. Try resetting search parameters.'
              : 'The resource repository is currently empty. Click below to upload your first document.'
          }
          icon={FolderOpen}
          actionText="Upload First Resource"
          onAction={() => setIsUploadOpen(true)}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource) => {
            const { icon: FormatIcon, color: iconStyle } = getFormatIcon(
              resource.fileType,
              resource.type
            );
            const resId = resource._id || resource.id;

            return (
              <div
                key={resId}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 "
              >
                <div>
                  <div className="mb-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconStyle}`}>
                        <FormatIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="inline-block rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:text-slate-200  dark:text-slate-300">
                          {resource.category || 'General'}
                        </span>
                        <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {resource.fileType || resource.type || 'FILE'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="line-clamp-1 font-bold text-slate-900 dark:text-white">
                    {resource.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                    {resource.description || 'No description provided.'}
                  </p>

                  {resource.tags && resource.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {resource.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-indigo-50/70 px-2 py-0.5 text-[10px] font-medium text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {resource.uploadedBy?.name || 'Admin'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="h-3.5 w-3.5 text-slate-400" />
                      {resource.downloadsCount || resource.downloads || 0}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPreviewResource(resource)}
                        title="Preview"
                        className="rounded-lg p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-white"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDetailsResource(resource)}
                        title="Details"
                        className="rounded-lg p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-white"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleShare(resource)}
                        title="Share link"
                        className="rounded-lg p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-white"
                      >
                        {copiedId === resId ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => setEditResource(resource)}
                        title="Edit"
                        className="rounded-lg p-1.5 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(resource)}
                        title="Delete"
                        className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      icon={Download}
                      onClick={() => handleDownload(resource)}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 shadow-xs dark:border-slate-800 ">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="border-b border-slate-200 bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400 dark:border-slate-800 /50 ">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Title</th>
                <th className="px-6 py-3.5 font-semibold">Category</th>
                <th className="px-6 py-3.5 font-semibold">Uploaded By</th>
                <th className="px-6 py-3.5 font-semibold">Downloads</th>
                <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredResources.map((resource) => {
                const { icon: FormatIcon, color: iconStyle } = getFormatIcon(
                  resource.fileType,
                  resource.type
                );
                const resId = resource._id || resource.id;

                return (
                  <tr key={resId} className="hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800/50 /50">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconStyle}`}>
                          <FormatIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{resource.title}</p>
                          <p className="text-xs text-slate-400">{resource.fileType || 'File'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200  dark:text-slate-300">
                        {resource.category || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {resource.uploadedBy?.name || 'Admin'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                      {resource.downloadsCount || resource.downloads || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Eye}
                          onClick={() => setPreviewResource(resource)}
                        >
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Edit}
                          onClick={() => setEditResource(resource)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={Download}
                          onClick={() => handleDownload(resource)}
                        >
                          Download
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-xl dark:border-slate-800 ">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Upload New Resource
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Add a document, template, or guide to the resource repository.
            </p>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Title</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. IEEE Project Report Format Guidelines"
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Category"
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  options={[
                    'Guidelines',
                    'Templates',
                    'Policies',
                    'User Guides',
                    'Code Examples',
                  ]}
                />
                <Select
                  label="Type"
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  options={[
                    { value: 'document', label: 'Document' },
                    { value: 'template', label: 'Template' },
                    { value: 'guide', label: 'Guide' },
                    { value: 'video', label: 'Video' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Description</label>
                <textarea
                  rows={3}
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Provide brief details about this resource..."
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  placeholder="e.g. ieee, report, documentation"
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Select File</label>
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="mt-1 w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:rounded-xl file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-indigo-600 hover:file:bg-indigo-100 dark:file:bg-indigo-950/60 dark:file:text-indigo-300"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUploadOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={uploading}
                >
                  Upload File
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview, Details, Edit Modals */}
      <PreviewModal
        resource={previewResource}
        isOpen={!!previewResource}
        onClose={() => setPreviewResource(null)}
        onDownload={handleDownload}
      />
      <DetailsModal
        resource={detailsResource}
        isOpen={!!detailsResource}
        onClose={() => setDetailsResource(null)}
        onDownload={handleDownload}
        onEdit={(res) => {
          setDetailsResource(null);
          setEditResource(res);
        }}
        onDelete={(res) => {
          setDetailsResource(null);
          handleDelete(res);
        }}
        onShare={handleShare}
      />
      <EditModal
        resource={editResource}
        isOpen={!!editResource}
        onClose={() => setEditResource(null)}
        onSave={() => {
          setEditResource(null);
          fetchResources();
        }}
      />
    </div>
  );
};

export default ResourceBrowser;
