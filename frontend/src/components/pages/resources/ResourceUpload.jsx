import React, { useState } from "react";

const ResourceUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [resourceType, setResourceType] = useState("document");
  const { showSuccess, showError } = useNotification();

  const resourceTypes = [
    { value: "document", label: "Document", icon: "fas fa-file-alt" },
    { value: "video", label: "Video", icon: "fas fa-video" },
    { value: "image", label: "Image", icon: "fas fa-image" },
    { value: "audio", label: "Audio", icon: "fas fa-music" },
    { value: "template", label: "Template", icon: "fas fa-layer-group" },
    { value: "other", label: "Other", icon: "fas fa-file" },
  ];

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      showError("Please select files to upload");
      return;
    }

    setUploading(true);
    try {
      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showSuccess(`${files.length} file(s) uploaded successfully`);
      setFiles([]);
    } catch (error) {
      showError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Upload Resources
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Upload Form */}
        <div>
          <div className="space-y-6">
            {/* Resource Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {resourceTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setResourceType(type.value)}
                    className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
                      resourceType === type.value
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <i className={`${type.icon} text-lg mb-1`}></i>
                    <span className="text-xs">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Files
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  multiple
                  className="hidden"
                  id="resource-upload"
                />
                <label htmlFor="resource-upload" className="cursor-pointer">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-cloud-upload-alt text-gray-400 text-xl"></i>
                  </div>
                  <p className="text-gray-600 mb-2">
                    Drag & drop files here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PDF, DOCX, PPT, Images, Videos
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Max file size: 50MB
                  </p>
                </label>
              </div>
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {uploading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="fas fa-upload mr-2"></i>
                  Upload Resources
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column - File Preview */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Selected Files ({files.length})
          </h3>

          {files.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
              <i className="fas fa-folder-open text-gray-300 text-4xl mb-3"></i>
              <p className="text-gray-500">No files selected</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                      <i className="fas fa-file text-blue-600"></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Guidelines */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">
              Upload Guidelines
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2 text-xs"></i>
                Ensure files are properly named and organized
              </li>
              <li className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2 text-xs"></i>
                Scan for viruses before uploading
              </li>
              <li className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2 text-xs"></i>
                Respect copyright and intellectual property
              </li>
              <li className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2 text-xs"></i>
                Compress large files when possible
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceUpload;
