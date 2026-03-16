import { useState, memo, useCallback } from "react";
import PropTypes from "prop-types";

const FileUpload = memo(({ onUpload, accept = "*", multiple = false }) => {
  const [files, setFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileChange = useCallback(
    (selectedFiles) => {
      setFiles(Array.from(selectedFiles));
      onUpload?.(Array.from(selectedFiles));
    },
    [onUpload],
  );

  const handleInputChange = useCallback(
    (e) => {
      handleFileChange(e.target.files);
    },
    [handleFileChange],
  );

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileChange(e.dataTransfer.files);
      }
    },
    [handleFileChange],
  );

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragActive
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      role="presentation"
    >
      <input
        type="file"
        onChange={handleInputChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer block">
        <div className="text-gray-600 dark:text-gray-400">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mt-2 text-gray-900 dark:text-white">
            Click to upload files
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            or drag and drop
          </p>
        </div>
      </label>
      {files.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Selected files:
          </p>
          <ul className="mt-2 space-y-1">
            {files.map((file, index) => (
              <li
                key={index}
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                <i className="fas fa-file mr-2" aria-hidden="true"></i>
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

FileUpload.displayName = "FileUpload";

FileUpload.propTypes = {
  onUpload: PropTypes.func,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
};

FileUpload.defaultProps = {
  accept: "*",
  multiple: false,
};

export default FileUpload;
