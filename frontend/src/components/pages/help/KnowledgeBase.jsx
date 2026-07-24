import React, { memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import api from '../../../utils/api';

const KnowledgeBase = memo(() => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKbData = async () => {
      try {
        const response = await api.get('/help/kb');
        if (response.success && response.data) {
          if (response.data.categories) setCategories(response.data.categories);
          if (response.data.popularArticles)
            setPopularArticles(response.data.popularArticles);
        }
      } catch (error) {
        console.error('Failed to fetch knowledge base data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchKbData();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className='space-y-6 animate-fade-in pt-0 pb-6'>
      <PageHeader
        title='Knowledge Base'
        subtitle='Find detailed guides, tutorials, and documentation for all system features'
        icon={BookOpen}
      />

        {/* Search */}
        <div className='mx-auto mb-8 max-w-3xl'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search knowledge base...'
              className='w-full rounded-lg border border-slate-300 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800  dark:focus:ring-blue-400'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className='absolute right-3 top-3 text-slate-400 dark:text-slate-500 dark:text-slate-400'>
              🔍
            </button>
          </div>
        </div>

        {loading ? (
          <div className='py-12 text-center text-slate-500 dark:text-slate-400'>
            Loading knowledge base...
          </div>
        ) : (
          <>
            {/* Categories */}
            <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {categories.map((category) => (
                <div
                  key={category.id || category._id}
                  className='rounded-lg border border-slate-200 bg-white dark:bg-slate-900 p-6 dark:border-slate-700 dark:bg-slate-800'
                >
                  <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
                    {category.name}
                  </h3>
                  <div className='space-y-3'>
                    {category.articles?.map((article) => (
                      <button
                        key={article.id || article._id}
                        onClick={() =>
                          navigate(`/help?article=${article.id || article._id}`)
                        }
                        className='block w-full cursor-pointer rounded-lg border border-slate-200 p-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:border-slate-600 dark:hover:bg-slate-700'
                      >
                        <div className='font-medium text-slate-900 dark:text-white'>
                          {article.title}
                        </div>
                        <div className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
                          {article.views || 0} views
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Popular Articles */}
            <div className='rounded-lg border border-slate-200 bg-white dark:bg-slate-900 p-6 dark:border-slate-700 dark:bg-slate-800'>
              <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
                Popular Articles
              </h3>
              <div className='space-y-4'>
                {popularArticles.map((article, index) => (
                  <div
                    key={article.id || article._id || index}
                    className='flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-600'
                  >
                    <div>
                      <div className='font-medium text-slate-900 dark:text-white'>
                        {article.title}
                      </div>
                      <div className='text-sm text-slate-600 dark:text-slate-400'>
                        {article.category} • {article.views || 0} views
                      </div>
                    </div>
                    <button className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'>
                      Read →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  });

KnowledgeBase.displayName = 'KnowledgeBase';

export default KnowledgeBase;
