import React, { memo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import api from '../../../utils/api';

const FAQ = memo(() => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await api.get('/help/overview');
        if (response.success && response.data) {
          const rawFaqs = response.data.faqs || response.data.groupedFaqs || [];
          if (Array.isArray(rawFaqs) && rawFaqs.length > 0 && rawFaqs[0].question) {
            const grouped = Object.values(
              rawFaqs.reduce((acc, curr) => {
                const cat = curr.category || 'General';
                if (!acc[cat]) acc[cat] = { category: cat, questions: [] };
                acc[cat].questions.push(curr);
                return acc;
              }, {})
            );
            setFaqs(grouped);
          } else {
            setFaqs(Array.isArray(rawFaqs) ? rawFaqs : []);
          }
        }
      } catch (error) {
        console.error('Failed to fetch FAQs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggleFAQ = useCallback((index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <div className='space-y-6 animate-fade-in pt-0 pb-6'>
      <PageHeader
        title='Frequently Asked Questions'
        subtitle='Find quick answers to common questions about project management workflows'
        icon={HelpCircle}
      />

      <div className='w-full max-w-full'>
        {loading ? (
          <div className='py-12 text-center text-slate-500 dark:text-slate-400'>
            Loading FAQs...
          </div>
        ) : faqs.length === 0 ? (
          <div className='py-12 text-center text-slate-500 dark:text-slate-400'>
            No FAQs available.
          </div>
        ) : (
          faqs.map((section, sectionIndex) => (
            <div key={sectionIndex} className='mb-8'>
              <h2 className='mb-4 text-xl font-semibold text-slate-900 dark:text-white'>
                {section.category}
              </h2>
              <div className='space-y-3'>
                {section.questions?.map((faq, faqIndex) => {
                  const index = sectionIndex * 10 + faqIndex;
                  return (
                    <div
                      key={index}
                      className='rounded-lg border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 dark:bg-slate-800'
                    >
                      <button
                        onClick={() => toggleFAQ(index)}
                        className='flex w-full items-center justify-between rounded-lg px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700'
                      >
                        <span className='font-medium text-slate-900 dark:text-white'>
                          {faq.q || faq.question}
                        </span>
                        <span className='text-slate-500 dark:text-slate-400'>
                          {activeIndex === index ? '−' : '+'}
                        </span>
                      </button>
                      {activeIndex === index && (
                        <div className='border-t border-slate-200 bg-slate-50 dark:bg-slate-800 px-4 py-3 dark:border-slate-700 dark:bg-slate-700/50'>
                          <p className='text-slate-600 dark:text-slate-400'>
                            {faq.a || faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

FAQ.displayName = 'FAQ';

export default FAQ;
