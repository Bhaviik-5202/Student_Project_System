// src/components/pages/resources/ResourceDetails.jsx
import React, { useState, useCallback, useMemo, useEffect, memo } from 'react';
import { useParams } from 'react-router-dom';
import useNotification from '../../../hooks/useNotification';
import api from '../../../utils/api';

const ResourceDetails = memo(() => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [relatedResources, setRelatedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    const fetchResourceDetails = async () => {
      try {
        const response = await api.get(`/resources/${id}`);
        setResource(response.data?.resource || response.data || null);
        setRelatedResources(response.data?.related || []);
      } catch (error) {
        console.error('Failed to fetch resource details', error);
        showError('Failed to load resource details.'); // Add error notification
      } finally {
        setLoading(false);
      }
    };
    fetchResourceDetails();
  }, [id, showError]); // Add showError to dependency array

  if (loading)
    return (
      <div className='p-6 text-center text-slate-500'>
        Loading resource details...
      </div>
    );
  if (!resource)
    return (
      <div className='p-6 text-center text-red-500'>Resource not found</div>
    );

  return (
    <div className='p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-slate-800 dark:text-white'>
          Resource Details
        </h1>
        <button className='rounded-lg bg-red-100 px-4 py-2 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60'>
          Delete Resource
        </button>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <div className='rounded-xl bg-white p-6 shadow dark:bg-slate-800 dark:shadow-md'>
            <div className='mb-6 flex items-start justify-between'>
              <div className='flex items-center gap-4'>
                <div className='flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900'>
                  <span className='text-3xl'>📄</span>
                </div>
                <div>
                  <h2 className='text-xl font-bold text-slate-800 dark:text-white'>
                    {resource.name}
                  </h2>
                  <div className='mt-2 flex items-center gap-3'>
                    <span className='rounded bg-slate-100 px-2 py-1 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-200'>
                      {resource.category}
                    </span>
                    <span className='text-slate-600 dark:text-slate-400'>
                      {resource.size}
                    </span>
                    <span className='text-slate-600 dark:text-slate-400'>
                      📥 {resource.downloads} downloads
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-6'>
              <div>
                <h3 className='mb-2 font-semibold text-slate-800 dark:text-white'>
                  Description
                </h3>
                <p className='text-slate-700 dark:text-slate-300'>
                  {resource.description}
                </p>
              </div>

              <div>
                <h3 className='mb-3 font-semibold text-slate-800 dark:text-white'>
                  Tags
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {resource.tags.map((tag, index) => (
                    <span
                      key={index}
                      className='rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-6'>
                <div>
                  <h3 className='mb-2 font-semibold text-slate-800 dark:text-white'>
                    Upload Information
                  </h3>
                  <div className='space-y-2'>
                    <p className='text-slate-700 dark:text-slate-300'>
                      <span className='font-medium'>Uploaded by:</span>{' '}
                      {resource.uploadedBy}
                    </p>
                    <p className='text-slate-700 dark:text-slate-300'>
                      <span className='font-medium'>Upload date:</span>{' '}
                      {resource.uploadDate}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className='mb-2 font-semibold text-slate-800 dark:text-white'>
                    Permissions
                  </h3>
                  <div className='space-y-2'>
                    <p className='text-slate-700 dark:text-slate-300'>
                      ✅ View & Download
                    </p>
                    <p className='text-slate-700 dark:text-slate-300'>
                      ❌ Edit & Delete
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-8 flex gap-4'>
              <button className='flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 dark:focus:ring-blue-400'>
                <span>📥</span> Download Resource
              </button>
              <button className='rounded-lg border border-slate-300 px-6 py-3 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'>
                Share Resource
              </button>
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='rounded-xl bg-white p-6 shadow dark:bg-slate-800 dark:shadow-md'>
            <h3 className='mb-4 font-semibold text-slate-800 dark:text-white'>
              Preview
            </h3>
            <div className='flex h-64 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-700'>
              <div className='text-center'>
                <div className='mb-2 text-4xl'>📄</div>
                <p className='text-slate-600 dark:text-slate-300'>
                  PDF Preview
                </p>
                <p className='text-sm text-slate-500 dark:text-slate-400'>
                  Click to view full document
                </p>
              </div>
            </div>
          </div>

          <div className='rounded-xl bg-white p-6 shadow dark:bg-slate-800 dark:shadow-md'>
            <h3 className='mb-4 font-semibold text-slate-800 dark:text-white'>
              Related Resources
            </h3>
            <div className='space-y-3'>
              {relatedResources.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center gap-3 rounded p-2 hover:bg-slate-50 dark:hover:bg-slate-700'
                >
                  <span className='text-xl'>📄</span>
                  <div className='flex-1'>
                    <p className='text-sm font-medium text-slate-900 dark:text-white'>
                      {item.name || item.title || item}
                    </p>
                    <p className='text-xs text-slate-500 dark:text-slate-400'>
                      {item.type || 'PDF'} • {item.size || '1.2 MB'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ResourceDetails.displayName = 'ResourceDetails';

export default ResourceDetails;
