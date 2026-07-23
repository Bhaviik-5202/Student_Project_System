import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  FileText,
  Upload,
  Search,
  Download,
  Eye,
  Info,
  Edit,
  Trash2,
  Share2,
  Grid,
  List,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  HardDrive,
  Calendar,
  User,
  CheckCircle,
} from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import resourceService from '../../../services/resourceService';
import useNotification from '../../../hooks/useNotification';
import {
  PreviewModal,
  DetailsModal,
  EditModal,
} from './ResourceModals';

const DocumentLibrary = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState('table');

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { showSuccess, showError } = useNotification();

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        type: 'document',
        page,
        limit,
        sort: activeTab === 'popular' ? 'popular' : sortBy,
        q: searchTerm,
        category:
          activeTab !== 'all' && activeTab !== 'popular'
            ? activeTab
            : undefined,
      };

      const res = await resourceService.getAll(params);
      if (res.success || !res.error) {
        let items = res.data || [];
        if (formatFilter !== 'all') {
          items = items.filter(
            (d) => (d.fileType || '').toLowerCase() === formatFilter.toLowerCase()
          );
        }
        setDocuments(items);
        if (res.pagination) {
          setTotalCount(res.pagination.total);
          setTotalPages(res.pagination.totalPages || 1);
        } else {
          setTotalCount(items.length);
          setTotalPages(1);
        }
      } else {
        setError(res.message || 'Failed to fetch documents');
      }
    } catch (err) {
      setError('Failed to fetch documents from server.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, searchTerm, activeTab, formatFilter]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Actions
  const handleDownload = useCallback(
    async (doc) => {
      showSuccess(`Downloading ${doc.title}...`);
      await resourceService.download(doc._id, `${doc.title}.${doc.fileType || 'pdf'}`);
    },
    [showSuccess]
  );

  const handlePreview = useCallback((doc) => {
    setSelectedDoc(doc);
    setIsPreviewOpen(true);
  }, []);

  const handleDetails = useCallback((doc) => {
    setSelectedDoc(doc);
    setIsDetailsOpen(true);
  }, []);

  const handleEdit = useCallback((doc) => {
    setSelectedDoc(doc);
    setIsEditOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (doc) => {
      if (window.confirm(`Delete document "${doc.title}"?`)) {
        const res = await resourceService.delete(doc._id);
        if (res.success || !res.error) {
          showSuccess('Document deleted successfully');
          fetchDocuments();
        } else {
          showError(res.message || 'Failed to delete document');
        }
      }
    },
    [fetchDocuments, showError, showSuccess]
  );

  const handleShare = useCallback(
    (doc) => {
      const url = `${window.location.origin}/documents?id=${doc._id}`;
      navigator.clipboard.writeText(url);
      showSuccess('Document link copied to clipboard!');
    },
    [showSuccess]
  );

  const tabs = [
    { id: 'all', label: 'All Documents' },
    { id: 'Guidelines', label: 'Guidelines & Policies' },
    { id: 'Documentation', label: 'Formatting & Standards' },
    { id: 'Reports', label: 'Evaluation & Rubrics' },
    { id: 'popular', label: 'Most Popular' },
  ];

  return (
    <div className='space-y-6 animate-fade-in p-4 md:p-6'>
      <PageHeader
        title='Document Library'
        subtitle='Access official senior project guidelines, academic policies, IEEE templates, and evaluation rubrics'
        icon={FileText}
        badge={`${totalCount} Official Documents`}
        actions={
          <button
            onClick={() => navigate('/documents/upload')}
            className='flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all dark:shadow-none active:scale-[0.98]'
          >
            <Upload size={16} />
            Upload Document
          </button>
        }
      />

      {/* Tabs Bar */}
      <div className='flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2 dark:border-slate-700 scrollbar-none'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setPage(1);
            }}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all ${activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Toolbar Controls */}
      <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
        {/* Search */}
        <div className='relative flex-1'>
          <Search size={18} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder='Search documents by title, tags, or description...'
            className='w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-white'
          />
        </div>

        {/* Filters */}
        <div className='flex items-center gap-2 text-xs'>
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            className='rounded-xl border border-slate-200 bg-slate-50 p-2 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200'
          >
            <option value='all'>All Formats</option>
            <option value='pdf'>PDF Documents</option>
            <option value='docx'>Word Documents (.docx)</option>
            <option value='txt'>Text Files</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='rounded-xl border border-slate-200 bg-slate-50 p-2 font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200'
          >
            <option value='latest'>Newest First</option>
            <option value='popular'>Most Downloaded</option>
            <option value='a-z'>Alphabetical A-Z</option>
          </select>

          <div className='flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-900/50'>
            <button
              onClick={() => setViewMode('table')}
              className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${viewMode === 'table'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400'
                  : 'text-slate-400'
                }`}
            >
              <List size={15} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${viewMode === 'grid'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400'
                  : 'text-slate-400'
                }`}
            >
              <Grid size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className='p-12 text-center text-slate-500 dark:text-slate-400'>
          Loading documents...
        </div>
      ) : error ? (
        <div className='rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600 dark:border-red-900/40 dark:bg-red-950/20'>
          {error}
        </div>
      ) : documents.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800'>
          <FileText size={48} className='mx-auto mb-3 text-slate-300 dark:text-slate-600' />
          <h3 className='text-base font-bold text-slate-800 dark:text-white mb-1'>
            No documents found
          </h3>
          <p className='text-xs text-slate-500 dark:text-slate-400'>
            There are no documents matching your selected tab or search query.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-xs'>
              <thead className='bg-slate-50 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700'>
                <tr>
                  <th className='p-4 px-6'>Document Title</th>
                  <th className='p-4'>Category</th>
                  <th className='p-4'>Uploaded By</th>
                  <th className='p-4'>Date</th>
                  <th className='p-4'>Size</th>
                  <th className='p-4'>Downloads</th>
                  <th className='p-4 text-right px-6'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100 dark:divide-slate-700/60 font-medium text-slate-700 dark:text-slate-200'>
                {documents.map((doc) => (
                  <tr
                    key={doc._id}
                    className='hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors'
                  >
                    <td className='p-4 px-6'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'>
                          <FileText size={18} />
                        </div>
                        <div>
                          <span
                            onClick={() => handleDetails(doc)}
                            className='font-bold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 cursor-pointer block truncate max-w-xs'
                          >
                            {doc.title}
                          </span>
                          <span className='text-[10px] text-slate-400 block truncate max-w-xs'>
                            {doc.description || 'Official Document'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className='p-4 whitespace-nowrap'>
                      <span className='rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300'>
                        {doc.category || 'Guidelines'}
                      </span>
                    </td>
                    <td className='p-4 whitespace-nowrap'>
                      {doc.uploadedBy?.name || 'Academic Faculty'}
                    </td>
                    <td className='p-4 whitespace-nowrap text-slate-500'>
                      {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className='p-4 whitespace-nowrap text-slate-500'>
                      {doc.fileSize || '1.0 MB'}
                    </td>
                    <td className='p-4 whitespace-nowrap font-bold text-slate-800 dark:text-white'>
                      {doc.downloadsCount || 0}
                    </td>
                    <td className='p-4 text-right px-6 whitespace-nowrap'>
                      <div className='flex items-center justify-end gap-1.5'>
                        <button
                          onClick={() => handleDownload(doc)}
                          className='rounded-lg bg-indigo-50 p-2 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 transition-colors'
                          title='Download'
                        >
                          <Download size={14} />
                        </button>
                        <button
                          onClick={() => handlePreview(doc)}
                          className='rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                          title='Preview'
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDetails(doc)}
                          className='rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                          title='Details'
                        >
                          <Info size={14} />
                        </button>
                        <button
                          onClick={() => handleEdit(doc)}
                          className='rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                          title='Edit'
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(doc)}
                          className='rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                          title='Delete'
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {documents.map((doc) => (
            <div
              key={doc._id}
              className='flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all'
            >
              <div>
                <div className='mb-3 flex items-center justify-between'>
                  <span className='rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'>
                    {doc.category || 'Guidelines'}
                  </span>
                  <span className='text-[10px] font-bold uppercase text-slate-400'>
                    {doc.fileType || 'PDF'}
                  </span>
                </div>
                <h3
                  onClick={() => handleDetails(doc)}
                  className='mb-2 text-base font-bold text-slate-900 dark:text-white cursor-pointer hover:text-indigo-600 line-clamp-1'
                >
                  {doc.title}
                </h3>
                <p className='mb-4 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 min-h-[32px]'>
                  {doc.description || 'Official academic document.'}
                </p>
              </div>

              <div>
                <div className='mb-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3 dark:border-slate-700'>
                  <span>{doc.fileSize || '1.2 MB'}</span>
                  <span className='font-bold text-slate-700 dark:text-slate-200'>
                    {doc.downloadsCount || 0} downloads
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => handleDownload(doc)}
                    className='flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2 text-xs font-bold text-white shadow hover:bg-indigo-700'
                  >
                    <Download size={14} /> Download
                  </button>
                  <button
                    onClick={() => handlePreview(doc)}
                    className='rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300'
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleDetails(doc)}
                    className='rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300'
                  >
                    <Info size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 px-6 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300'>
          <div>
            Showing Page <span className='font-bold text-slate-900 dark:text-white'>{page}</span> of{' '}
            <span className='font-bold text-slate-900 dark:text-white'>{totalPages}</span> ({totalCount} total)
          </div>

          <div className='flex items-center gap-2'>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className='flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-600 dark:text-slate-200'
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className='flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-600 dark:text-slate-200'
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <PreviewModal
        resource={selectedDoc}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onDownload={handleDownload}
      />

      <DetailsModal
        resource={selectedDoc}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onDownload={handleDownload}
        onEdit={(doc) => {
          setIsDetailsOpen(false);
          handleEdit(doc);
        }}
        onDelete={(doc) => {
          setIsDetailsOpen(false);
          handleDelete(doc);
        }}
        onShare={handleShare}
      />

      <EditModal
        resource={selectedDoc}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSaved={fetchDocuments}
      />
    </div>
  );
};

export default DocumentLibrary;
