import { memo, useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload } from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import resourceService from '../../../services/resourceService';

const DocumentRow = memo(({ doc }) => {
  const handleDownload = () => {
    if (doc.url) window.open(doc.url, '_blank');
  };

  return (
    <tr className='hover:bg-slate-50 dark:hover:bg-slate-700'>
      <td className='whitespace-nowrap px-6 py-4'>
        <div className='font-medium text-slate-900 dark:text-white'>
          {doc.title}
        </div>
      </td>
      <td className='whitespace-nowrap px-6 py-4'>
        <span className='rounded-full bg-slate-100 px-2 py-1 text-xs capitalize text-slate-800 dark:bg-slate-700 dark:text-slate-200'>
          {doc.type}
        </span>
      </td>
      <td className='whitespace-nowrap px-6 py-4 text-slate-900 dark:text-white'>
        {doc.uploadedBy?.name || 'Faculty'}
      </td>
      <td className='whitespace-nowrap px-6 py-4 text-slate-900 dark:text-white'>
        {new Date(doc.createdAt).toLocaleDateString()}
      </td>
      <td className='whitespace-nowrap px-6 py-4 text-slate-900 dark:text-white'>
        {doc.size || 'MB'}
      </td>
      <td className='whitespace-nowrap px-6 py-4 text-sm font-medium'>
        <button
          onClick={handleDownload}
          className='mr-3 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300'
        >
          Download
        </button>
        <button
          onClick={handleDownload}
          className='text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
        >
          Preview
        </button>
      </td>
    </tr>
  );
});

DocumentRow.displayName = 'DocumentRow';

DocumentRow.propTypes = {
  doc: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    uploadedBy: PropTypes.object,
    createdAt: PropTypes.string.isRequired,
    size: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
};

const DocumentLibrary = memo(() => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await resourceService.getAll({ type: 'document' });
        if (res.success) {
          // The backend might return { resources: [], total: ... } or just the array depending on controller
          // Based on resource.controller.js line 69, data is result.data.resources
          setDocuments(res.data || []);
        } else {
          setError(res.message || 'Failed to load documents');
        }
      } catch (err) {
        setError('Failed to load documents');
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  return (
    <div className='space-y-6 animate-fade-in p-4 md:p-6'>
      <PageHeader
        title='Document Library'
        subtitle='Access and manage all shared project documents'
        icon={FileText}
        badge={`${documents.length} Documents`}
        actions={
          <button
            onClick={() => navigate('/resource-upload')}
            className='flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all dark:shadow-none'
          >
            <Upload size={16} />
            Upload Document
          </button>
        }
      />
      <div className='overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'>
        <div className='overflow-x-auto'>
          {loading ? (
            <div className='p-8 text-center text-slate-500 dark:text-slate-400'>
              Loading documents...
            </div>
          ) : error ? (
            <div className='p-8 text-center text-red-500'>{error}</div>
          ) : (
            <table className='min-w-full divide-y divide-slate-200 dark:divide-slate-700'>
              <thead className='bg-slate-50 dark:bg-slate-700'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                    Document Title
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                    Category
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                    Uploaded By
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                    Date
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                    Size
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-800'>
                {documents.map((doc) => (
                  <DocumentRow key={doc.id || doc._id} doc={doc} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
});

DocumentLibrary.displayName = 'DocumentLibrary';

export default DocumentLibrary;
