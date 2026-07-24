import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  HardDrive,
  Calendar,
  User,
  Plus,
} from 'lucide-react';
import PageHeader from '../../ui/PageHeader';
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

export const DocumentLibrary = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table');

  // Modals
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Upload state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Guidelines');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { showSuccess, showError } = useNotification();

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await resourceService.getAll({
        type: 'document',
        q: searchTerm,
      });

      if (res.success && Array.isArray(res.data)) {
        setDocuments(res.data);
      } else {
        setDocuments(res.data?.resources || []);
      }
    } catch (err) {
      setError('Unable to fetch document library from server.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        !searchTerm ||
        doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        categoryFilter === 'all' ||
        doc.category?.toLowerCase() === categoryFilter.toLowerCase();

      const matchesFormat =
        formatFilter === 'all' ||
        doc.fileType?.toLowerCase() === formatFilter.toLowerCase();

      return matchesSearch && matchesCat && matchesFormat;
    });
  }, [documents, searchTerm, categoryFilter, formatFilter]);

  const handleDownload = async (doc) => {
    try {
      showSuccess(`Downloading ${doc.title}...`);
      await resourceService.download(doc._id || doc.id, doc.title);
    } catch (err) {
      showError('Failed to download document.');
    }
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Delete document "${doc.title}"?`)) return;
    try {
      const res = await resourceService.delete(doc._id || doc.id);
      if (res.success) {
        showSuccess('Document deleted.');
        setDocuments((prev) => prev.filter((d) => (d._id || d.id) !== (doc._id || doc.id)));
      } else {
        showError(res.message || 'Failed to delete.');
      }
    } catch (err) {
      showError('Error deleting document.');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      showError('Please enter a document title.');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', uploadTitle);
      formData.append('category', uploadCategory);
      formData.append('type', 'document');
      formData.append('description', uploadDescription);
      if (uploadFile) formData.append('file', uploadFile);

      const res = await resourceService.upload(formData);
      if (res.success) {
        showSuccess('Document uploaded successfully!');
        setIsUploadOpen(false);
        setUploadTitle('');
        setUploadDescription('');
        setUploadFile(null);
        fetchDocuments();
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
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Document Library"
        description="Official academic guidelines, project rubrics, policy documents, and user manuals."
        icon={FileText}
        badgeText="Official Specs"
        badgeVariant="info"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={fetchDocuments}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsUploadOpen(true)}
            >
              Upload Document
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatisticsCard
          title="Total Documents"
          value={documents.length}
          icon={FileText}
          color="indigo"
          description="Uploaded guidelines & manuals"
        />
        <StatisticsCard
          title="PDF Specs"
          value={documents.filter((d) => d.fileType === 'pdf').length}
          icon={FileText}
          color="blue"
          description="Read-only policy documents"
        />
        <StatisticsCard
          title="Editable Guides"
          value={documents.filter((d) => ['docx', 'doc'].includes(d.fileType)).length}
          icon={FileText}
          color="emerald"
          description="Word & template files"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-1 items-center gap-3">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search document title or keywords..."
            className="max-w-md"
          />
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Categories' },
              { value: 'Guidelines', label: 'Guidelines' },
              { value: 'Policies', label: 'Policies' },
              { value: 'User Guides', label: 'User Guides' },
              { value: 'Templates', label: 'Templates' },
            ]}
            className="w-44"
          />
          <Select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Formats' },
              { value: 'pdf', label: 'PDF' },
              { value: 'docx', label: 'DOCX' },
            ]}
            className="w-36"
          />
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-slate-200 p-1 dark:border-slate-800">
          <button
            onClick={() => setViewMode('table')}
            className={`rounded-lg p-2 text-xs font-semibold transition-all ${viewMode === 'table'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded-lg p-2 text-xs font-semibold transition-all ${viewMode === 'grid'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <Grid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching documents..." />
      ) : error ? (
        <ErrorState
          title="Error Loading Documents"
          message={error}
          onRetry={fetchDocuments}
        />
      ) : filteredDocs.length === 0 ? (
        <EmptyState
          title="No Documents Found"
          description="There are currently no documents matching your search filters."
          icon={FileText}
          actionText="Upload Document"
          onAction={() => setIsUploadOpen(true)}
        />
      ) : viewMode === 'table' ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Document Title</th>
                <th className="px-6 py-3.5 font-semibold">Category</th>
                <th className="px-6 py-3.5 font-semibold">Format</th>
                <th className="px-6 py-3.5 font-semibold">Downloads</th>
                <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDocs.map((doc) => {
                const docId = doc._id || doc.id;
                return (
                  <tr key={docId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{doc.title}</p>
                          <p className="line-clamp-1 text-xs text-slate-400">{doc.description || 'No description'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {doc.category || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 uppercase text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {doc.fileType || 'PDF'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                      {doc.downloadsCount || doc.downloads || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Eye}
                          onClick={() => {
                            setSelectedDoc(doc);
                            setIsPreviewOpen(true);
                          }}
                        >
                          Preview
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={Download}
                          onClick={() => handleDownload(doc)}
                        >
                          Download
                        </Button>
                        <button
                          onClick={() => handleDelete(doc)}
                          className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocs.map((doc) => {
            const docId = doc._id || doc.id;
            return (
              <div
                key={docId}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                      {doc.category || 'General'}
                    </span>
                    <span className="text-xs font-bold uppercase text-slate-400">
                      {doc.fileType || 'PDF'}
                    </span>
                  </div>
                  <h3 className="mt-3 font-bold text-slate-900 dark:text-white">{doc.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                    {doc.description || 'No description provided.'}
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                  <span className="text-xs text-slate-400">
                    Downloads: {doc.downloadsCount || doc.downloads || 0}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Eye}
                      onClick={() => {
                        setSelectedDoc(doc);
                        setIsPreviewOpen(true);
                      }}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Download}
                      onClick={() => handleDownload(doc)}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upload New Document</h3>
            <form onSubmit={handleUpload} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Document Title</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Project Evaluation Rubric 2026"
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>
              <Select
                label="Category"
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                options={['Guidelines', 'Policies', 'User Guides', 'Templates']}
              />
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Description</label>
                <textarea
                  rows={3}
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Summary of document requirements..."
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">File</label>
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="mt-1 w-full text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-indigo-600 dark:file:bg-indigo-950/60 dark:file:text-indigo-300"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" type="button" onClick={() => setIsUploadOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" loading={uploading}>
                  Upload Document
                </Button>
              </div>
            </form>
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
      />
    </div>
  );
};

export default DocumentLibrary;
