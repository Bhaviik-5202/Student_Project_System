import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
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
  Calendar,
  HardDrive,
  FileCode,
  Presentation,
  FileText,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
} from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import resourceService from '../../../services/resourceService';
import useNotification from '../../../hooks/useNotification';
import {
  PreviewModal,
  DetailsModal,
  EditModal,
} from './ResourceModals';

const TemplateCard = ({
  template,
  onDownload,
  onPreview,
  onDetails,
  onEdit,
  onDelete,
  onShare,
}) => {
  const isDocx = template.fileType === 'docx' || template.title.toLowerCase().includes('docx') || template.title.toLowerCase().includes('srs');
  const isPptx = template.fileType === 'pptx' || template.title.toLowerCase().includes('presentation') || template.title.toLowerCase().includes('deck');

  return (
    <div className='flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-300 hover:shadow-xl dark:border-slate-700/80 dark:bg-slate-800 dark:hover:border-indigo-500/50 transition-all duration-200'>
      <div>
        <div className='mb-3 flex items-start justify-between'>
          <div className='flex items-center gap-3'>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-sm ${isPptx
                ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                : isDocx
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                  : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                }`}
            >
              {isPptx ? <Presentation size={24} /> : isDocx ? <FileCode size={24} /> : <FileText size={24} />}
            </div>
            <div>
              <span className='inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200'>
                {template.category || 'Academic Templates'}
              </span>
              <p className='text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5'>
                {template.fileType?.toUpperCase() || 'TEMPLATE'}
              </p>
            </div>
          </div>

          <span className='rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'>
            Verified
          </span>
        </div>

        <h3
          onClick={() => onDetails(template)}
          className='mb-2 text-base font-bold text-slate-900 dark:text-white cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1'
          title={template.title}
        >
          {template.title}
        </h3>

        <p className='mb-4 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 min-h-[32px]'>
          {template.description || 'Standardized template for senior project requirements.'}
        </p>
      </div>

      <div>
        <div className='mb-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-700'>
          <span className='flex items-center gap-1'>
            <HardDrive size={13} className='text-slate-400' />
            {template.fileSize || '1.0 MB'}
          </span>
          <span className='flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200'>
            <Download size={13} className='text-indigo-500' />
            {template.downloadsCount || 0} downloads
          </span>
        </div>

        <div className='flex items-center gap-1.5'>
          <button
            onClick={() => onDownload(template)}
            className='flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-700 transition-colors'
          >
            <Download size={14} /> Download Template
          </button>
          <button
            onClick={() => onPreview(template)}
            className='flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-200'
            title='Preview'
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => onDetails(template)}
            className='flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-200'
            title='Details'
          >
            <Info size={15} />
          </button>
          <button
            onClick={() => onEdit(template)}
            className='flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-200'
            title='Edit'
          >
            <Edit size={15} />
          </button>
          <button
            onClick={() => onDelete(template)}
            className='flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400'
            title='Delete'
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

const TemplateLibrary = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');

  // Modals
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { showSuccess, showError } = useNotification();

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        type: 'template',
        q: searchTerm,
      };
      const res = await resourceService.getAll(params);
      if (res.success || !res.error) {
        setTemplates(res.data || []);
      } else {
        setError(res.message || 'Failed to fetch templates');
      }
    } catch (err) {
      setError('Error connecting to template repository.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Actions
  const handleDownload = useCallback(
    async (template) => {
      showSuccess(`Downloading template: ${template.title}`);
      await resourceService.download(template._id, `${template.title}.${template.fileType || 'docx'}`);
    },
    [showSuccess]
  );

  const handlePreview = useCallback((template) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  }, []);

  const handleDetails = useCallback((template) => {
    setSelectedTemplate(template);
    setIsDetailsOpen(true);
  }, []);

  const handleEdit = useCallback((template) => {
    setSelectedTemplate(template);
    setIsEditOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (template) => {
      if (window.confirm(`Delete template "${template.title}"?`)) {
        const res = await resourceService.delete(template._id);
        if (res.success || !res.error) {
          showSuccess('Template deleted successfully');
          fetchTemplates();
        } else {
          showError(res.message || 'Failed to delete template');
        }
      }
    },
    [fetchTemplates, showError, showSuccess]
  );

  const handleShare = useCallback(
    (template) => {
      const url = `${window.location.origin}/templates?id=${template._id}`;
      navigator.clipboard.writeText(url);
      showSuccess('Template share link copied!');
    },
    [showSuccess]
  );

  const categories = useMemo(() => {
    const catsMap = {};
    templates.forEach((t) => {
      const cat = t.category || 'Academic Templates';
      if (!catsMap[cat]) catsMap[cat] = 0;
      catsMap[cat]++;
    });

    return [
      { id: 'all', name: 'All Templates', count: templates.length },
      ...Object.keys(catsMap).map((cat) => ({
        id: cat,
        name: cat,
        count: catsMap[cat],
      })),
    ];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return templates.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query));
      const matchesCat =
        selectedCategory === 'all' || t.category === selectedCategory;
      const matchesFormat =
        formatFilter === 'all' ||
        (t.fileType || '').toLowerCase() === formatFilter.toLowerCase();

      return matchesSearch && matchesCat && matchesFormat;
    });
  }, [templates, searchTerm, selectedCategory, formatFilter]);

  return (
    <div className='space-y-6 animate-fade-in p-4 md:p-6'>
      <PageHeader
        title='Template Library'
        subtitle='Download pre-formatted, university-approved document templates for SRS, project proposals, slide decks, and viva presentations'
        icon={Layout}
        badge={`${templates.length} Approved Templates`}
        actions={
          <button
            onClick={() => navigate('/templates/upload')}
            className='flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all dark:shadow-none active:scale-[0.98]'
          >
            <Plus size={16} />
            Upload Template
          </button>
        }
      />

      {/* Toolbar */}
      <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 space-y-4'>
        <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
          <div className='relative flex-1'>
            <Search size={18} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search templates by title, SRS, slide deck, report format...'
              className='w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-white'
            />
          </div>

          <div className='flex items-center gap-2 text-xs'>
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className='rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200'
            >
              <option value='all'>All File Types</option>
              <option value='docx'>Word Templates (.docx)</option>
              <option value='pptx'>PowerPoint Decks (.pptx)</option>
              <option value='pdf'>PDF Templates (.pdf)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className='flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none'>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${selectedCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700/60 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className='p-12 text-center text-slate-500 dark:text-slate-400'>
          Loading template library...
        </div>
      ) : error ? (
        <div className='rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600 dark:border-red-900/40 dark:bg-red-950/20'>
          {error}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800'>
          <Layout size={48} className='mx-auto mb-3 text-slate-300 dark:text-slate-600' />
          <h3 className='text-base font-bold text-slate-800 dark:text-white mb-1'>
            No templates match your query
          </h3>
          <p className='text-xs text-slate-500 dark:text-slate-400'>
            Try clearing search terms or selecting 'All Templates'.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template._id}
              template={template}
              onDownload={handleDownload}
              onPreview={handlePreview}
              onDetails={handleDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onShare={handleShare}
            />
          ))}
        </div>
      )}

      {/* Stats Footprint Bar */}
      <div className='rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4 text-center divide-x divide-slate-100 dark:divide-slate-700/60'>
          <div>
            <p className='text-2xl font-black text-indigo-600 dark:text-indigo-400'>
              {templates.length}
            </p>
            <p className='text-xs font-medium text-slate-500 dark:text-slate-400 mt-1'>
              Total Templates
            </p>
          </div>
          <div>
            <p className='text-2xl font-black text-emerald-600 dark:text-emerald-400'>
              {templates.filter((t) => t.fileType === 'docx').length}
            </p>
            <p className='text-xs font-medium text-slate-500 dark:text-slate-400 mt-1'>
              Word Documents
            </p>
          </div>
          <div>
            <p className='text-2xl font-black text-amber-600 dark:text-amber-400'>
              {templates.filter((t) => t.fileType === 'pptx').length}
            </p>
            <p className='text-xs font-medium text-slate-500 dark:text-slate-400 mt-1'>
              Presentation Decks
            </p>
          </div>
          <div>
            <p className='text-2xl font-black text-blue-600 dark:text-blue-400'>
              {templates.reduce((acc, t) => acc + (t.downloadsCount || 0), 0)}
            </p>
            <p className='text-xs font-medium text-slate-500 dark:text-slate-400 mt-1'>
              Total Downloads
            </p>
          </div>
        </div>
      </div>

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
        onEdit={(tpl) => {
          setIsDetailsOpen(false);
          handleEdit(tpl);
        }}
        onDelete={(tpl) => {
          setIsDetailsOpen(false);
          handleDelete(tpl);
        }}
        onShare={handleShare}
      />

      <EditModal
        resource={selectedTemplate}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSaved={fetchTemplates}
      />
    </div>
  );
};

export default TemplateLibrary;
