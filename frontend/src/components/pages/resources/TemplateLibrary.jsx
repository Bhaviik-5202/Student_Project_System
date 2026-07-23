import React, { useState, useMemo, useCallback, memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, Download, Eye, Plus, Search, Layout } from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import resourceService from '../../../services/resourceService';
import useNotification from '../../../hooks/useNotification';

const CategoryTab = memo(({ category, isActive, onSelect }) => (
  <button
    onClick={() => onSelect(category.id)}
    className={`whitespace-nowrap rounded-lg px-4 py-2 ${
      isActive
        ? 'bg-blue-100 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
    }`}
  >
    {category.name} ({category.count})
  </button>
));

CategoryTab.displayName = 'CategoryTab';

const TemplateCard = memo(({ template, onDownload, onPreview }) => (
  <div className='rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800'>
    <div className='mb-4 flex items-start justify-between'>
      <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700'>
        <FileText className='text-blue-500' size={24} />
      </div>
      <span className='rounded bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-500 dark:bg-gray-700 dark:text-gray-400'>
        {template.type}
      </span>
    </div>

    <h3 className='mb-2 font-bold text-gray-800 dark:text-white'>
      {template.title}
    </h3>
    <p className='mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400'>
      {template.description}
    </p>

    <div className='mb-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
      <span className='flex items-center'>
        <Calendar size={14} className='mr-1' />
        {new Date(template.createdAt).toLocaleDateString()}
      </span>
      <span>{template.size || 'MB'}</span>
    </div>

    <div className='flex space-x-2'>
      <button
        onClick={() => onDownload(template)}
        className='flex flex-1 items-center justify-center rounded-lg bg-indigo-600 py-2 text-white transition-colors hover:bg-indigo-700'
      >
        <Download size={18} className='mr-2' />
        Download
      </button>
      <button
        onClick={() => onPreview(template)}
        className='rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
      >
        <Eye size={18} />
      </button>
    </div>
  </div>
));

TemplateCard.displayName = 'TemplateCard';

const TemplateLibrary = memo(() => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { showSuccess } = useNotification();
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await resourceService.getAll({ type: 'template' });
        if (res.success) {
          setTemplates(res.data || []);
        } else {
          setError(res.message || 'Failed to load templates.');
        }
      } catch (err) {
        setError('Failed to load templates.');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const categories = useMemo(() => {
    const cats = templates.reduce((acc, t) => {
      const cat = t.type || 'template';
      if (!acc[cat])
        acc[cat] = {
          id: cat,
          name: cat.charAt(0).toUpperCase() + cat.slice(1) + 's',
          count: 0,
        };
      acc[cat].count++;
      return acc;
    }, {});
    return [
      { id: 'all', name: 'All Templates', count: templates.length },
      ...Object.values(cats),
    ];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    const lowered = searchTerm.toLowerCase();
    return templates.filter((template) => {
      const matchesSearch =
        template.title.toLowerCase().includes(lowered) ||
        (template.description &&
          template.description.toLowerCase().includes(lowered));
      const matchesCategory =
        selectedCategory === 'all' || template.type === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchTerm, selectedCategory]);

  const handleDownload = useCallback(
    (template) => {
      if (template.url) window.open(template.url, '_blank');
      showSuccess(`Downloading ${template.title}`);
    },
    [showSuccess]
  );

  const handlePreview = useCallback(
    (template) => {
      if (template.url) window.open(template.url, '_blank');
      showSuccess(`Previewing ${template.title}`);
    },
    [showSuccess]
  );

  const handleCategorySelect = useCallback((id) => {
    setSelectedCategory(id);
  }, []);

  return (
    <div className='space-y-6 animate-fade-in p-4 md:p-6'>
      <PageHeader
        title='Template Library'
        subtitle='Browse and download standardized project report & presentation templates'
        icon={Layout}
        badge={`${filteredTemplates.length} Templates`}
        actions={
          <button
            onClick={() => navigate('/resource-upload')}
            className='flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all dark:shadow-none'
          >
            <Plus size={16} />
            Upload Template
          </button>
        }
      />

      {loading ? (
        <div className='py-12 text-center text-gray-500 dark:text-gray-400'>
          Loading templates...
        </div>
      ) : error ? (
        <div className='py-12 text-center text-red-500'>{error}</div>
      ) : (
        <>
          {/* Search and Filter */}
          <div className='mb-6'>
            <div className='flex flex-col gap-4 md:flex-row'>
              <div className='flex-1'>
                <div className='relative'>
                  <Search
                    size={18}
                    className='absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400 dark:text-gray-500'
                  />
                  <input
                    type='text'
                    placeholder='Search templates...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400'
                  />
                </div>
              </div>
              <div className='w-full md:w-64'>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400'
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className='mb-6 flex space-x-2 overflow-x-auto pb-2'>
            {categories.map((category) => (
              <CategoryTab
                key={category.id}
                category={category}
                isActive={selectedCategory === category.id}
                onSelect={handleCategorySelect}
              />
            ))}
          </div>

          {/* Template Grid */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template._id || template.id}
                template={template}
                onDownload={handleDownload}
                onPreview={handlePreview}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredTemplates.length === 0 && (
            <div className='py-12 text-center'>
              <Search
                className='mx-auto mb-3 text-gray-300 dark:text-gray-600'
                size={48}
              />
              <h3 className='mb-2 text-lg font-medium text-gray-700 dark:text-gray-200'>
                No templates found
              </h3>
              <p className='text-gray-500 dark:text-gray-400'>
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}

          {/* Stats */}
          <div className='mt-8 border-t border-gray-200 pt-6 dark:border-gray-700'>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              <div className='p-4 text-center'>
                <div className='text-2xl font-bold text-blue-600'>
                  {templates.length}
                </div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  Total Templates
                </div>
              </div>
              <div className='p-4 text-center'>
                <div className='text-2xl font-bold text-green-600'>
                  {templates.filter((t) => t.type === 'template').length}
                </div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  Design Templates
                </div>
              </div>
              <div className='p-4 text-center'>
                <div className='text-2xl font-bold text-purple-600'>
                  {
                    templates.filter(
                      (t) =>
                        new Date(t.createdAt).getMonth() ===
                        new Date().getMonth()
                    ).length
                  }
                </div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  New This Month
                </div>
              </div>
              <div className='p-4 text-center'>
                <div className='text-2xl font-bold text-yellow-600'>24/7</div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  Availability
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

TemplateLibrary.displayName = 'TemplateLibrary';

export default TemplateLibrary;
