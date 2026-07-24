import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  BookOpen,
  HelpCircle,
  Loader2,
} from 'lucide-react';
import api from '../../../utils/api';
import PageHeader from '../../common/PageHeader';

const HelpCenter = memo(() => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHelpData = async () => {
      try {
        const response = await api.get('/help/overview');
        if (response.success && response.data) {
          if (response.data.faqs) setFaqs(response.data.faqs);
          if (response.data.categories) {
            setCategories(['All', ...response.data.categories]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch help center data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHelpData();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFaqs = useMemo(
    () =>
      faqs.filter(
        (faq) =>
          (selectedCategory === 'All' || faq.category === selectedCategory) &&
          (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    [faqs, selectedCategory, searchTerm]
  );

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  return (
    <div className='space-y-6 animate-fade-in pt-0 pb-6'>
      <PageHeader
        title='Help Center'
        subtitle='Search our knowledge base, read FAQs, or contact support for assistance'
        icon={HelpCircle}
      />

      {/* Search Bar */}
      <div className='mb-10 max-w-xl'>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search help articles...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full rounded-lg border border-slate-300 bg-white dark:bg-slate-900 px-4 py-3 pl-12 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 '
          />
          <div className='absolute left-4 top-3.5 text-slate-400'>
            <Search size={18} />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className='absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:text-slate-300'
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Cards */}
      <div className='mb-12 grid grid-cols-1 gap-6 md:grid-cols-2'>
        {[
          {
            title: 'User Guide',
            icon: (
              <BookOpen
                className='text-blue-600 dark:text-blue-400'
                size={20}
              />
            ),
            desc: 'Browse full documentation',
            link: '/user-guide',
            color: 'blue',
          },
          {
            title: 'FAQs',
            icon: (
              <HelpCircle
                className='text-indigo-600 dark:text-indigo-400'
                size={20}
              />
            ),
            desc: 'Common questions & answers',
            link: '/faq',
            color: 'indigo',
          },
        ].map((card) => (
          <button
            key={card.title}
            onClick={() => navigate(card.link)}
            className='rounded-lg border border-slate-200 bg-white dark:bg-slate-900 p-6 text-left transition-all hover:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500'
          >
            <div className='mb-4 flex items-center'>
              <div
                className={`h-10 w-10 rounded bg-${card.color}-100 dark:bg-${card.color}-900/30 mr-3 flex items-center justify-center`}
              >
                {card.icon}
              </div>
              <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>
                {card.title}
              </h3>
            </div>
            <p className='text-sm text-slate-500 dark:text-slate-400'>
              {card.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Category Filters */}
      <div className='mb-8 flex flex-wrap gap-2'>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`rounded border px-4 py-1.5 text-sm font-medium transition-all ${selectedCategory === category
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-slate-200 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* FAQ Section */}
      <div className='mb-12 overflow-hidden rounded-lg border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 dark:bg-slate-800'>
        <div className='border-b border-slate-200 bg-slate-50 dark:bg-slate-800 px-6 py-4 dark:border-slate-700 /50'>
          <h2 className='font-semibold text-slate-900 dark:text-white'>
            Trending Articles
          </h2>
        </div>
        <div className='divide-y divide-slate-200 dark:divide-slate-700'>
          {loading ? (
            <div className='p-8 text-center text-slate-500 dark:text-slate-400'>
              <Loader2 size={24} className='mr-2 inline-block animate-spin' />{' '}
              Loading...
            </div>
          ) : filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div
                key={faq.id || faq._id}
                className='p-6 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-900'
              >
                <div className='mb-2 flex items-start justify-between'>
                  <h3 className='font-medium text-slate-900 dark:text-white'>
                    {faq.question}
                  </h3>
                  <span className='rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 dark:bg-slate-700 '>
                    {faq.category}
                  </span>
                </div>
                <p className='text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
                  {faq.answer}
                </p>
              </div>
            ))
          ) : (
            <div className='p-8 text-center italic text-slate-500 dark:text-slate-400'>
              No matching results found.
            </div>
          )}
        </div>
      </div>

      {/* Contact Support */}
      <div className='rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-800 p-8 text-center dark:border-slate-700 /50'>
        <h3 className='mb-2 text-xl font-bold text-slate-900 dark:text-white'>
          Can't find what you're looking for?
        </h3>
        <p className='mb-6 text-slate-600 dark:text-slate-400'>
          Our support team is ready to help you with any technical or
          administrative issues.
        </p>
        <button
          onClick={() => navigate('/support')}
          className='rounded bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700'
        >
          Submit Support Ticket
        </button>
      </div>
    </div>
  );
});

HelpCenter.displayName = 'HelpCenter';

export default HelpCenter;
