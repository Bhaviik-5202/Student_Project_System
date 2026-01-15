import React, { useState } from "react";

const FileUpload = ({ onUpload, accept = "*", multiple = false }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    onUpload(selectedFiles);
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input
        type="file"
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer block">
        <div className="text-gray-600">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mt-2">Click to upload files</p>
          <p className="text-sm text-gray-500">or drag and drop</p>
        </div>
      </label>
      {files.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium">Selected files:</p>
          <ul className="mt-2 space-y-1">
            {files.map((file, index) => (
              <li key={index} className="text-sm text-gray-600">
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
