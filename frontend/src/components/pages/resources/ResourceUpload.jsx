import React, { useState, useCallback, useMemo, memo } from 'react';
import useNotification from '../../../hooks/useNotification';
import resourceService from '../../../services/resourceService';

const ResourceUpload = memo(() => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [resourceType, setResourceType] = useState('document');
  const { showSuccess, showError } = useNotification();

  const resourceTypes = useMemo(
    () => [
      { value: 'document', label: 'Document', icon: 'fas fa-file-alt' },
      { value: 'video', label: 'Video', icon: 'fas fa-video' },
      { value: 'template', label: 'Template', icon: 'fas fa-layer-group' },
    ],
    []
  );

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  }, []);

  const handleUpload = useCallback(async () => {
    if (files.length === 0) {
      showError('Please select files to upload');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('type', resourceType);
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await resourceService.upload(formData);

      if (response.success) {
        showSuccess(
          response.message || `${files.length} file(s) uploaded successfully`
        );
        setFiles([]);
      } else {
        showError(response.message || 'Upload failed. Please try again.');
      }
    } catch (error) {
      showError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [files, resourceType, showError, showSuccess]);

  const removeFile = useCallback(
    (index) => {
      setFiles(files.filter((_, i) => i !== index));
    },
    [files]
  );

  const handleSelectType = useCallback((value) => {
    setResourceType(value);
  }, []);

  return (
    <div className='rounded-lg bg-white p-6 shadow dark:bg-gray-800 dark:shadow-md'>
      <h2 className='mb-6 text-2xl font-bold text-gray-800 dark:text-white'>
        Upload Resources
      </h2>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        {/* Left Column - Upload Form */}
        <div>
          <div className='space-y-6'>
            {/* Resource Type Selection */}
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Resource Type
              </label>
              <div className='grid grid-cols-3 gap-2'>
                {resourceTypes.map((type) => (
                  <button
                    key={type.value}
                    type='button'
                    onClick={() => handleSelectType(type.value)}
                    className={`flex flex-col items-center justify-center rounded-lg border p-3 transition-all ${
                      resourceType === type.value
                        ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <i className={`${type.icon} mb-1 text-lg`} />
                    <span className='text-xs'>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload Area */}
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Select Files
              </label>
              <div className='rounded-lg border-2 border-dashed border-gray-300 bg-white p-8 text-center transition-colors hover:border-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-blue-500'>
                <input
                  type='file'
                  onChange={handleFileSelect}
                  multiple
                  className='hidden'
                  id='resource-upload'
                />
                <label htmlFor='resource-upload' className='cursor-pointer'>
                  <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-600'>
                    <i className='fas fa-cloud-upload-alt text-xl text-gray-400 dark:text-gray-300' />
                  </div>
                  <p className='mb-2 text-gray-600 dark:text-gray-300'>
                    Drag & drop files here or click to browse
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Supports PDF, DOCX, PPT, Images, Videos
                  </p>
                  <p className='mt-1 text-xs text-gray-400 dark:text-gray-500'>
                    Max file size: 50MB
                  </p>
                </label>
              </div>
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              className='flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-medium text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 dark:focus:ring-blue-400'
            >
              {uploading ? (
                <>
                  <i className='fas fa-spinner fa-spin mr-2' />
                  Uploading...
                </>
              ) : (
                <>
                  <i className='fas fa-upload mr-2' />
                  Upload Resources
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column - File Preview */}
        <div>
          <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white'>
            Selected Files ({files.length})
          </h3>

          {files.length === 0 ? (
            <div className='rounded-lg border-2 border-dashed border-gray-200 py-12 text-center dark:border-gray-700'>
              <i className='fas fa-folder-open mb-3 text-4xl text-gray-300 dark:text-gray-600' />
              <p className='text-gray-500 dark:text-gray-400'>
                No files selected
              </p>
            </div>
          ) : (
            <div className='max-h-96 space-y-3 overflow-y-auto'>
              {files.map((file, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
                >
                  <div className='flex items-center space-x-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded bg-blue-100 dark:bg-blue-900'>
                      <i className='fas fa-file text-blue-600 dark:text-blue-400' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-gray-800 dark:text-white'>
                        {file.name}
                      </p>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className='text-red-500 hover:text-red-700'
                  >
                    <i className='fas fa-times' />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Guidelines */}
          <div className='mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700'>
            <h4 className='mb-2 font-medium text-gray-700 dark:text-gray-200'>
              Upload Guidelines
            </h4>
            <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-300'>
              <li className='flex items-center'>
                <i className='fas fa-check-circle mr-2 text-xs text-green-500' />
                Ensure files are properly named and organized
              </li>
              <li className='flex items-center'>
                <i className='fas fa-check-circle mr-2 text-xs text-green-500' />
                Scan for viruses before uploading
              </li>
              <li className='flex items-center'>
                <i className='fas fa-check-circle mr-2 text-xs text-green-500' />
                Respect copyright and intellectual property
              </li>
              <li className='flex items-center'>
                <i className='fas fa-check-circle mr-2 text-xs text-green-500' />
                Compress large files when possible
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});

ResourceUpload.displayName = 'ResourceUpload';

export default ResourceUpload;
