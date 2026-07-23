import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
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
  ChevronLeft,
  ChevronRight,
  Check,
  Tag,
  ArrowUpDown,
} from 'lucide-react';
import PageHeader from '../../common/PageHeader';
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
    return { icon: Video, color: 'text-red-500 bg-red-50 dark:bg-red-950/40 dark:text-red-400' };
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
  return { icon: FolderOpen, color: 'text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-300' };
};

const ResourceCard = memo(
  ({ resource, onDetails, onPreview, onDownload, onEdit, onDelete, onShare }) => {
    const { icon: FormatIcon, color: iconStyle } = getFormatIcon(
      resource.fileType,
      resource.type
    );

    return (
      <div className='group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-slate-700/80 dark:bg-slate-800 dark:hover:border-indigo-500/50'>
        <div>
          {/* Top Header Strip */}
          <div className='mb-3.5 flex items-center justify-between'>
            <div className='flex items-center gap-2.5'>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ${iconStyle}`}>
                <FormatIcon size={22} />
              </div>
              <div>
                <span className='inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200'>
                  {resource.category || 'General'}
                </span>
                <p className='text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5'>
                  {resource.fileType || resource.type || 'DOCUMENT'}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-1'>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${resource.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                  }`}
              >
                {resource.status || 'Active'}
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <h3
            onClick={() => onDetails(resource)}
            className='mb-1.5 cursor-pointer text-base font-bold text-slate-900 transition-colors hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 line-clamp-1'
            title={resource.title}
          >
            {resource.title}
          </h3>

          <p className='mb-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2 min-h-[32px]'>
            {resource.description || 'No detailed description provided.'}
          </p>
        </div>

        <div>
          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className='mb-3.5 flex flex-wrap gap-1'>
              {resource.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className='rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-700/60 dark:text-slate-300'
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Metadata Grid */}
          <div className='mb-4 flex items-center justify-between border-t border-b border-slate-100 py-2.5 text-xs text-slate-500 dark:border-slate-700/60 dark:text-slate-400'>
            <div className='flex items-center gap-1.5 truncate max-w-[140px]'>
              <User size={13} className='text-slate-400 shrink-0' />
              <span className='truncate font-medium text-slate-700 dark:text-slate-300'>
                {resource.uploadedBy?.name || 'Faculty'}
              </span>
            </div>
            <div className='flex items-center gap-3 shrink-0'>
              <span className='flex items-center gap-1'>
                <HardDrive size={13} className='text-slate-400' />
                {resource.fileSize || '1.0 MB'}
              </span>
              <span className='flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200'>
                <Download size={13} className='text-indigo-500' />
                {resource.downloadsCount || 0}
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className='flex items-center gap-1.5'>
            <button
              onClick={() => onDownload(resource)}
              className='flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-all active:scale-[0.98]'
            >
              <Download size={14} />
              Download
            </button>
            <button
              onClick={() => onPreview(resource)}
              title='Preview'
              className='flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors'
            >
              <Eye size={15} />
            </button>
            <button
              onClick={() => onDetails(resource)}
              title='View Metadata Details'
              className='flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors'
            >
              <Info size={15} />
            </button>
            <button
              onClick={() => onShare(resource)}
              title='Share Link'
              className='flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors'
            >
              <Share2 size={15} />
            </button>
            <button
              onClick={() => onEdit(resource)}
              title='Edit Resource'
              className='flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors'
            >
              <Edit size={15} />
            </button>
            <button
              onClick={() => onDelete(resource)}
              title='Delete Resource'
              className='flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors'
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ResourceCard.displayName = 'ResourceCard';

const ResourceBrowser = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('any');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState('grid');

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [selectedResource, setSelectedResource] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { showSuccess, showError } = useNotification();

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        sort: sortBy,
        q: searchTerm,
        category: categoryFilter !== 'All' ? categoryFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        date: dateFilter !== 'any' ? dateFilter : undefined,
      };

      const res = await resourceService.getAll(params);
      if (res.success || !res.error) {
        const items = res.data || [];
        setResources(items);
        if (res.pagination) {
          setTotalCount(res.pagination.total);
          setTotalPages(res.pagination.totalPages || 1);
        } else {
          setTotalCount(items.length);
          setTotalPages(1);
        }
      } else {
        setError(res.message || 'Failed to fetch resource items');
      }
    } catch (err) {
      setError('Error loading resources. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, searchTerm, categoryFilter, typeFilter, dateFilter]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // Action Handlers
  const handleDownload = useCallback(
    async (resource) => {
      showSuccess(`Initiating download for ${resource.title}...`);
      await resourceService.download(resource._id, `${resource.title}.${resource.fileType || 'txt'}`);
    },
    [showSuccess]
  );

  const handlePreview = useCallback((resource) => {
    setSelectedResource(resource);
    setIsPreviewOpen(true);
  }, []);

  const handleDetails = useCallback((resource) => {
    setSelectedResource(resource);
    setIsDetailsOpen(true);
  }, []);

  const handleEdit = useCallback((resource) => {
    setSelectedResource(resource);
    setIsEditOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (resource) => {
      if (window.confirm(`Are you sure you want to delete "${resource.title}"?`)) {
        const res = await resourceService.delete(resource._id);
        if (res.success || !res.error) {
          showSuccess('Resource deleted successfully');
          fetchResources();
        } else {
          showError(res.message || 'Failed to delete resource');
        }
      }
    },
    [fetchResources, showError, showSuccess]
  );

  const handleShare = useCallback(
    (resource) => {
      const url = `${window.location.origin}/resources?id=${resource._id}`;
      navigator.clipboard.writeText(url);
      showSuccess('Resource link copied to clipboard!');
    },
    [showSuccess]
  );

  const categories = [
    'All',
    'Guidelines',
    'Project Proposal',
    'Documentation',
    'Reports',
    'Academic Templates',
    'Tutorials',
    'General',
  ];

  return (
    <div className='space-y-6 animate-fade-in p-4 md:p-6'>
      <PageHeader
        title='Resource Browser'
        subtitle='Browse, filter, preview, and download official project guidelines, academic templates, and technical assets'
        icon={FolderOpen}
        badge={`${totalCount} Resources Available`}
        actions={
          <button
            onClick={() => navigate('/resources/upload')}
            className='flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all dark:shadow-none active:scale-[0.98]'
          >
            <Plus size={16} />
            Upload Resource
          </button>
        }
      />

      {/* Toolbar & Filter Bar */}
      <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-800 space-y-4'>
        {/* Top Controls: Search + Dropdown Filters + View Switcher */}
        <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
          {/* Search Input */}
          <div className='relative flex-1'>
            <Search
              size={18}
              className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
            />
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder='Search by title, description, category, or tags...'
              className='w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-900'
            />
          </div>

          {/* Filter Dropdowns */}
          <div className='flex flex-wrap items-center gap-2.5 text-xs'>
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className='rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200'
            >
              <option value='all'>All Types</option>
              <option value='document'>Documents</option>
              <option value='template'>Templates</option>
              <option value='video'>Videos</option>
            </select>

            {/* Upload Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
              className='rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200'
            >
              <option value='any'>Any Date</option>
              <option value='today'>Today</option>
              <option value='this_week'>Past 7 Days</option>
              <option value='this_month'>This Month</option>
              <option value='this_year'>This Year</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className='rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200'
            >
              <option value='latest'>Newest First</option>
              <option value='popular'>Most Downloaded</option>
              <option value='a-z'>Alphabetical A-Z</option>
              <option value='oldest'>Oldest First</option>
            </select>

            {/* View Mode Switcher */}
            <div className='flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-900/50'>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${viewMode === 'grid'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                title='Grid View'
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${viewMode === 'table'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                title='Table View'
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className='flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 scrollbar-none'>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                setPage(1);
              }}
              className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${categoryFilter === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700/60 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className='h-64 animate-pulse rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800'
            >
              <div className='mb-4 flex items-center gap-3'>
                <div className='h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-700' />
                <div className='space-y-2 flex-1'>
                  <div className='h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700' />
                  <div className='h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700' />
                </div>
              </div>
              <div className='space-y-2 mb-6'>
                <div className='h-3 w-full rounded bg-slate-200 dark:bg-slate-700' />
                <div className='h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-700' />
              </div>
              <div className='h-10 w-full rounded-xl bg-slate-200 dark:bg-slate-700 mt-auto' />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className='rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/20'>
          <p className='font-bold text-red-600 dark:text-red-400 mb-2'>{error}</p>
          <button
            onClick={fetchResources}
            className='inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-red-700 transition-colors'
          >
            <RefreshCw size={14} /> Try Again
          </button>
        </div>
      ) : resources.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800'>
          <FolderOpen size={48} className='mx-auto mb-3 text-slate-300 dark:text-slate-600' />
          <h3 className='text-base font-bold text-slate-800 dark:text-white mb-1'>
            No resources match your search or filter criteria
          </h3>
          <p className='text-xs text-slate-500 dark:text-slate-400 mb-4'>
            Try resetting your filters or search keywords
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('All');
              setTypeFilter('all');
              setDateFilter('any');
              setPage(1);
            }}
            className='inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200'
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {resources.map((res) => (
            <ResourceCard
              key={res._id}
              resource={res}
              onDetails={handleDetails}
              onPreview={handlePreview}
              onDownload={handleDownload}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onShare={handleShare}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-xs'>
              <thead className='bg-slate-50 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700'>
                <tr>
                  <th className='p-4 px-6'>Resource Name</th>
                  <th className='p-4'>Category</th>
                  <th className='p-4'>Type</th>
                  <th className='p-4'>Uploaded By</th>
                  <th className='p-4'>Date</th>
                  <th className='p-4'>Size</th>
                  <th className='p-4'>Downloads</th>
                  <th className='p-4 text-right px-6'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100 dark:divide-slate-700/60 font-medium text-slate-700 dark:text-slate-200'>
                {resources.map((res) => {
                  const { icon: FormatIcon, color: iconStyle } = getFormatIcon(
                    res.fileType,
                    res.type
                  );
                  return (
                    <tr
                      key={res._id}
                      className='hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors'
                    >
                      <td className='p-4 px-6'>
                        <div className='flex items-center gap-3'>
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}>
                            <FormatIcon size={18} />
                          </div>
                          <div>
                            <span
                              onClick={() => handleDetails(res)}
                              className='font-bold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 cursor-pointer block truncate max-w-xs'
                            >
                              {res.title}
                            </span>
                            <span className='text-[10px] text-slate-400 block truncate max-w-xs'>
                              {res.description || 'No description'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className='p-4 whitespace-nowrap'>
                        <span className='rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300'>
                          {res.category || 'General'}
                        </span>
                      </td>
                      <td className='p-4 whitespace-nowrap uppercase font-semibold text-[10px] text-slate-500'>
                        {res.fileType || res.type}
                      </td>
                      <td className='p-4 whitespace-nowrap'>
                        {res.uploadedBy?.name || 'Faculty'}
                      </td>
                      <td className='p-4 whitespace-nowrap text-slate-500'>
                        {res.createdAt ? new Date(res.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className='p-4 whitespace-nowrap text-slate-500'>
                        {res.fileSize || '1.0 MB'}
                      </td>
                      <td className='p-4 whitespace-nowrap font-bold text-slate-800 dark:text-white'>
                        {res.downloadsCount || 0}
                      </td>
                      <td className='p-4 text-right px-6 whitespace-nowrap'>
                        <div className='flex items-center justify-end gap-1.5'>
                          <button
                            onClick={() => handleDownload(res)}
                            className='rounded-lg bg-indigo-50 p-2 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 transition-colors'
                            title='Download'
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => handlePreview(res)}
                            className='rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors'
                            title='Preview'
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleDetails(res)}
                            className='rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors'
                            title='Details'
                          >
                            <Info size={14} />
                          </button>
                          <button
                            onClick={() => handleEdit(res)}
                            className='rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors'
                            title='Edit'
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(res)}
                            className='rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'
                            title='Delete'
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className='flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 px-6 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300'>
          <div>
            Showing <span className='font-bold text-slate-900 dark:text-white'>{(page - 1) * limit + 1}</span> to{' '}
            <span className='font-bold text-slate-900 dark:text-white'>
              {Math.min(page * limit, totalCount)}
            </span>{' '}
            of <span className='font-bold text-slate-900 dark:text-white'>{totalCount}</span> items
          </div>

          <div className='flex items-center gap-2'>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className='flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors'
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <span className='font-bold px-2 text-slate-800 dark:text-white'>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className='flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors'
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <PreviewModal
        resource={selectedResource}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onDownload={handleDownload}
      />

      <DetailsModal
        resource={selectedResource}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onDownload={handleDownload}
        onEdit={(res) => {
          setIsDetailsOpen(false);
          handleEdit(res);
        }}
        onDelete={(res) => {
          setIsDetailsOpen(false);
          handleDelete(res);
        }}
        onShare={handleShare}
      />

      <EditModal
        resource={selectedResource}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSaved={fetchResources}
      />
    </div>
  );
};

export default ResourceBrowser;
