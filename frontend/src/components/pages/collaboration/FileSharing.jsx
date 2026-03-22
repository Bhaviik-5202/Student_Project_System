import { useState, useEffect, useCallback, memo } from 'react';
import collaborationService from '../../../services/collaborationService';
import projectService from '../../../services/projectService';
import useNotification from '../../../hooks/useNotification';

const FileSharing = memo(() => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { showSuccess, showError } = useNotification();

  const fetchProjects = useCallback(async () => {
    try {
      const response = await projectService.getAllProjects();
      if (response.data?.success) {
        const projectList = response.data.data;
        setProjects(projectList);
        if (projectList.length > 0) {
          setSelectedProjectId(projectList[0]._id || projectList[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch projects', error);
    }
  }, []);

  const fetchFiles = useCallback(
    async (projectId) => {
      if (!projectId) return;
      try {
        setLoading(true);
        const response = await collaborationService.getSharedFiles(projectId);
        if (response.success) {
          setFiles(response.data);
        }
      } catch (error) {
        showError('Failed to fetch shared files');
      } finally {
        setLoading(false);
      }
    },
    [showError]
  );

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchFiles(selectedProjectId);
    }
  }, [selectedProjectId, fetchFiles]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedProjectId) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await collaborationService.shareFile(
        selectedProjectId,
        formData
      );
      if (response.success) {
        showSuccess('File shared successfully');
        fetchFiles(selectedProjectId);
      }
    } catch (error) {
      showError('Failed to share file');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (file) => {
    const link = document.createElement('a');
    link.href = `${process.env.REACT_APP_API_URL || ''}/${file.url}`;
    link.setAttribute('download', file.name);
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess(`Started download: ${file.name}`);
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this shared file?'))
      return;
    try {
      const response = await collaborationService.deleteFile(fileId);
      if (response.success) {
        showSuccess('File deleted successfully');
        fetchFiles(selectedProjectId);
      }
    } catch (error) {
      showError('Failed to delete file');
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
              File Sharing
            </h1>
            <p className='text-slate-600 dark:text-slate-400'>
              Share and access files with your team
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className='rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white'
            >
              {projects.map((p) => (
                <option key={p.id || p._id} value={p.id || p._id}>
                  {p.title}
                </option>
              ))}
            </select>
            <input
              type='file'
              id='file-upload'
              className='hidden'
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <label
              htmlFor='file-upload'
              className={`cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 ${uploading ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {uploading ? 'Uploading...' : 'Share File'}
            </label>
          </div>
        </div>

        <div className='overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-slate-200 dark:divide-slate-700'>
              <thead className='bg-slate-50 dark:bg-slate-700'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                    File Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                    Shared By
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                    Date Shared
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                    Size
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                    Downloads
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-300'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-800'>
                {loading ? (
                  <tr>
                    <td
                      colSpan='6'
                      className='px-6 py-4 text-center text-slate-500'
                    >
                      Loading shared files...
                    </td>
                  </tr>
                ) : files.length === 0 ? (
                  <tr>
                    <td
                      colSpan='6'
                      className='px-6 py-4 text-center text-slate-500'
                    >
                      No files shared yet.
                    </td>
                  </tr>
                ) : (
                  files.map((file) => (
                    <tr
                      key={file._id || file.id}
                      className='hover:bg-slate-50 dark:hover:bg-slate-700'
                    >
                      <td className='whitespace-nowrap px-6 py-4'>
                        <div className='font-medium text-slate-900 dark:text-white'>
                          {file.name}
                        </div>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-slate-900 dark:text-white'>
                        {file.sharedBy?.name || 'Anonymous'}
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-slate-900 dark:text-white'>
                        {new Date(file.createdAt).toLocaleDateString()}
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-slate-900 dark:text-white'>
                        {file.size}
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-slate-900 dark:text-white'>
                        {file.downloads || 0}
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm font-medium'>
                        <button
                          onClick={() => handleDownload(file)}
                          className='mr-3 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300'
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleDelete(file._id || file.id)}
                          className='text-red-600 hover:text-red-900'
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
});

FileSharing.displayName = 'FileSharing';

export default FileSharing;
