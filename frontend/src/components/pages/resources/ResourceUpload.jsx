import React, { useState, useCallback, useMemo, memo } from "react";
import useNotification from "../../../hooks/useNotification";
import resourceService from "../../../services/resourceService";

const ResourceUpload = memo(() => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [resourceType, setResourceType] = useState("document");
  const { showSuccess, showError } = useNotification();

  const resourceTypes = useMemo(
    () => [
      { value: "document", label: "Document", icon: "fas fa-file-alt" },
      { value: "video", label: "Video", icon: "fas fa-video" },
      { value: "template", label: "Template", icon: "fas fa-layer-group" },
    ],
    [],
  );

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  }, []);

  const handleUpload = useCallback(async () => {
    if (files.length === 0) {
      showError("Please select files to upload");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("type", resourceType);
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await resourceService.upload(formData);
      
      if (response.success) {
        showSuccess(response.message || `${files.length} file(s) uploaded successfully`);
        setFiles([]);
      } else {
        showError(response.message || "Upload failed. Please try again.");
      }
    } catch (error) {
      showError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [files, resourceType, showError, showSuccess]);

  const removeFile = useCallback(
    (index) => {
      setFiles(files.filter((_, i) => i !== index));
    },
    [files],
  );

  const handleSelectType = useCallback((value) => {
    setResourceType(value);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Upload Resources
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Upload Form */}
        <div>
          <div className="space-y-6">
            {/* Resource Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Resource Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {resourceTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleSelectType(type.value)}
                    className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
                      resourceType === type.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <i className={`${type.icon} text-lg mb-1`} />
                    <span className="text-xs">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Files
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-white dark:bg-gray-700">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  multiple
                  className="hidden"
                  id="resource-upload"
                />
                <label htmlFor="resource-upload" className="cursor-pointer">
                  <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-cloud-upload-alt text-gray-400 dark:text-gray-300 text-xl" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Drag & drop files here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Supports PDF, DOCX, PPT, Images, Videos
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Max file size: 50MB
                  </p>
                </label>
              </div>
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              {uploading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <i className="fas fa-upload mr-2" />
                  Upload Resources
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column - File Preview */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Selected Files ({files.length})
          </h3>

          {files.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
              <i className="fas fa-folder-open text-gray-300 dark:text-gray-600 text-4xl mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No files selected
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                      <i className="fas fa-file text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white text-sm">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Guidelines */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">
              Upload Guidelines
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2 text-xs" />
                Ensure files are properly named and organized
              </li>
              <li className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2 text-xs" />
                Scan for viruses before uploading
              </li>
              <li className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2 text-xs" />
                Respect copyright and intellectual property
              </li>
              <li className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2 text-xs" />
                Compress large files when possible
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});

ResourceUpload.displayName = "ResourceUpload";

export default ResourceUpload;
