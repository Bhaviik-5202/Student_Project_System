import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../../utils/api';

const Tutorials = memo(() => {
  const navigate = useNavigate();
  const [tutorials, setTutorials] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const response = await api.get('/help/tutorials');
        if (response.success && response.data) {
          if (response.data.tutorials) setTutorials(response.data.tutorials);
          if (response.data.categories)
            setCategories(['All', ...response.data.categories]);
        }
      } catch (error) {
        console.error('Failed to fetch tutorials', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTutorials();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTutorials = useMemo(
    () =>
      tutorials.filter(
        (tutorial) =>
          selectedCategory === 'All' || tutorial.category === selectedCategory
      ),
    [tutorials, selectedCategory]
  );

  const completedCount = useMemo(
    () => tutorials.filter((t) => t.completed).length,
    [tutorials]
  );

  const progressPercentage = useMemo(
    () => (completedCount / tutorials.length) * 100,
    [completedCount, tutorials.length]
  );

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleStartTutorial = useCallback((tutorial) => {
    // In a real app, this would open a video modal
    toast.success(`Starting tutorial: ${tutorial.title}`);
  }, []);

  const handleViewAll = useCallback(() => {
    setSelectedCategory('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6'>
          <button
            onClick={() => navigate('/help')}
            className='mb-4 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
          >
            ← Back to Help Center
          </button>
          <div className='mb-8 text-center'>
            <h1 className='mb-4 text-3xl font-bold text-slate-900 dark:text-white'>
              Video Tutorials
            </h1>
            <p className='mx-auto max-w-2xl text-slate-600 dark:text-slate-400'>
              Watch step-by-step video tutorials to learn how to use the system
              effectively
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className='mb-8 flex flex-wrap justify-center gap-2'>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`rounded-full px-4 py-2 transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Tutorials Grid */}
        {loading ? (
          <div className='py-12 text-center text-slate-500'>
            Loading tutorials...
          </div>
        ) : (
          <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredTutorials.map((tutorial) => (
              <div
                key={tutorial.id || tutorial._id}
                className='rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800'
              >
                <div className='relative mb-4'>
                  <div
                    className='aspect-video group flex cursor-pointer items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700'
                    onClick={() => handleStartTutorial(tutorial)}
                  >
                    <div className='text-center transition-transform group-hover:scale-110'>
                      <div className='mb-2 text-4xl text-blue-600'>
                        <i className='fas fa-play-circle' />
                      </div>
                      <div className='text-sm text-slate-600 dark:text-slate-400'>
                        {tutorial.duration}
                      </div>
                    </div>
                  </div>
                  {tutorial.completed && (
                    <div className='absolute right-2 top-2 rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'>
                      Completed
                    </div>
                  )}
                </div>

                <div className='mb-4'>
                  <h3 className='mb-2 text-lg font-semibold text-slate-900 dark:text-white'>
                    {tutorial.title}
                  </h3>
                  <p className='h-10 overflow-hidden text-sm text-slate-600 dark:text-slate-400'>
                    {tutorial.description}
                  </p>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='rounded bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300'>
                    {tutorial.category}
                  </span>
                  <button
                    onClick={() => handleStartTutorial(tutorial)}
                    className='rounded-lg bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                  >
                    {tutorial.completed ? 'Watch Again' : 'Start Tutorial'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Progress */}
        <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
          <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
            Your Learning Progress
          </h3>
          <div className='mb-6'>
            <div className='mb-1 flex justify-between text-sm text-slate-600 dark:text-slate-400'>
              <span>Completed Tutorials</span>
              <span>
                {completedCount} of {tutorials.length}
              </span>
            </div>
            <div className='h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700'>
              <div
                className='h-3 rounded-full bg-emerald-500 transition-all duration-500 dark:bg-emerald-400'
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className='text-center'>
            <button
              onClick={handleViewAll}
              className='rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
            >
              View All Tutorials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

Tutorials.displayName = 'Tutorials';

export default Tutorials;
