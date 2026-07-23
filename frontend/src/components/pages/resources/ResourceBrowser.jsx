// src/components/pages/resources/ResourceBrowser.jsx
import { useState, useMemo, useCallback, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import resourceService from '../../../services/resourceService';

const ResourceCard = memo(({ resource, icon }) => {
  const getToken = () => {
    const raw = localStorage.getItem('token') || '';
    return raw.replace(/^"|"$/g, '').trim();
  };

  const getFileUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const cleanPath = url.replace(/\\/g, '/');
    const fullUrl = `http://localhost:5000/${cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath}`;
    const token = getToken();
    return token ? `${fullUrl}?token=${encodeURIComponent(token)}` : fullUrl;
  };

  const handleDownload = () => {
    const id = resource._id || resource.id;
    const token = getToken();
    if (id) {
      window.open(`http://localhost:5000/api/v1/resources/${id}/download?token=${encodeURIComponent(token)}`, '_blank');
    } else if (resource.url) {
      window.open(getFileUrl(resource.url), '_blank');
    }
  };

  const handlePreview = () => {
    if (resource.url) {
      window.open(getFileUrl(resource.url), '_blank');
    }
  };

  return (
    <div className='rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500'>
      <div className='mb-3 flex items-start justify-between'>
        <div className='flex items-center gap-3'>
          <i className={`${icon} text-xl`} />
          <div>
            <h4 className='font-medium text-slate-800 dark:text-white'>
              {resource.title}
            </h4>
            <p className='text-sm capitalize text-slate-600 dark:text-slate-400'>
              {resource.type}
            </p>
          </div>
        </div>
        <button className='text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'>
          <i className='fas fa-ellipsis-h' />
        </button>
      </div>

      <div className='flex items-center justify-between text-sm text-slate-500 dark:text-slate-400'>
        <span>{resource.size || 'MB'}</span>
        <span>{resource.createdAt ? new Date(resource.createdAt).toLocaleDateString() : 'Recent'}</span>
      </div>

      <div className='mt-4 flex gap-2'>
        <button
          onClick={handleDownload}
          className='flex-1 rounded bg-blue-50 px-3 py-2 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
        >
          Download
        </button>
        <button
          onClick={handlePreview}
          className='rounded border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
        >
          Preview
        </button>
      </div>
    </div>
  );
});

ResourceCard.displayName = 'ResourceCard';

ResourceCard.propTypes = {
  resource: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    size: PropTypes.string,
  }).isRequired,
  icon: PropTypes.string.isRequired,
};

const CategoryButton = memo(({ category, isActive, onSelect }) => (
  <button
    onClick={() => onSelect(category)}
    className={`rounded-lg px-4 py-2 ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
    }`}
  >
    {category}
  </button>
));

CategoryButton.displayName = 'CategoryButton';

CategoryButton.propTypes = {
  category: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const ResourceBrowser = memo(() => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await resourceService.getAll();
        if (res.success) {
          setResources(res.data || []);
        } else {
          setError(res.message || 'Failed to load resources.');
        }
      } catch (err) {
        setError('Failed to load resources.');
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const categories = useMemo(
    () => [
      'All',
      'Documents',
      'Presentations',
      'Templates',
      'Design',
      'Videos',
    ],
    []
  );
  const [selectedCategory, setSelectedCategory] = useState('All');

  const getIcon = useCallback((type) => {
    switch (type) {
      case 'pdf':
        return 'fas fa-file-alt text-blue-500';
      case 'ppt':
        return 'fas fa-file-powerpoint text-orange-500';
      case 'zip':
        return 'fas fa-file-archive text-yellow-500';
      case 'fig':
        return 'fas fa-palette text-purple-500';
      case 'video':
        return 'fas fa-video text-red-500';
      default:
        return 'fas fa-folder text-gray-500';
    }
  }, []);

  const filteredResources = useMemo(() => {
    if (selectedCategory === 'All') return resources;
    const typeMapping = {
      Documents: 'document',
      Templates: 'template',
      Videos: 'video',
    };
    const targetType =
      typeMapping[selectedCategory] ||
      selectedCategory.toLowerCase().slice(0, -1);
    return resources.filter((r) => r.type === targetType);
  }, [resources, selectedCategory]);

  const handleSelectCategory = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  return (
    <div className='p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-slate-800 dark:text-white'>
          Resource Browser
        </h1>
        <button
          onClick={() => navigate('/resource-upload')}
          className='flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 dark:focus:ring-blue-400'
        >
          <i className='fas fa-plus' /> Upload Resource
        </button>
      </div>

      <div className='mb-6'>
        <h3 className='mb-3 text-lg font-semibold text-slate-800 dark:text-white'>
          Categories
        </h3>
        <div className='flex flex-wrap gap-2'>
          {categories.map((category) => (
            <CategoryButton
              key={category}
              category={category}
              isActive={selectedCategory === category}
              onSelect={handleSelectCategory}
            />
          ))}
        </div>
      </div>

      <div className='overflow-hidden rounded-xl bg-white shadow dark:bg-slate-800 dark:shadow-md'>
        <div className='p-6'>
          {loading ? (
            <div className='py-8 text-center text-slate-500 dark:text-slate-400'>
              Loading resources...
            </div>
          ) : error ? (
            <div className='py-8 text-center text-red-500'>{error}</div>
          ) : (
            <>
              <div className='mb-6 flex items-center justify-between'>
                <div>
                  <h2 className='text-lg font-semibold text-slate-800 dark:text-white'>
                    {selectedCategory === 'All'
                      ? 'All Resources'
                      : `${selectedCategory} Resources`}
                  </h2>
                  <p className='text-slate-600 dark:text-slate-400'>
                    {filteredResources.length} items found
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <input
                    type='text'
                    placeholder='Search resources...'
                    className='rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
                  />
                  <button className='rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'>
                    Sort By
                  </button>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    icon={getIcon(resource.type)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

ResourceBrowser.displayName = 'ResourceBrowser';

export default ResourceBrowser;
