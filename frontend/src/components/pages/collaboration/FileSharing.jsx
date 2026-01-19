import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FileSharing = () => {
  const navigate = useNavigate();
  const [files] = useState([
    {
      id: 1,
      name: "Project_Report.pdf",
      sharedBy: "Team A",
      sharedDate: "Jan 10, 2024",
      size: "4.2 MB",
      downloads: 12,
    },
    {
      id: 2,
      name: "Presentation_Slides.pptx",
      sharedBy: "Team B",
      sharedDate: "Jan 12, 2024",
      size: "8.7 MB",
      downloads: 8,
    },
    {
      id: 3,
      name: "Source_Code.zip",
      sharedBy: "Team C",
      sharedDate: "Jan 14, 2024",
      size: "15.3 MB",
      downloads: 5,
    },
    {
      id: 4,
      name: "Research_Paper.docx",
      sharedBy: "Team D",
      sharedDate: "Jan 15, 2024",
      size: "2.1 MB",
      downloads: 20,
    },
    {
      id: 5,
      name: "Data_Analysis.xlsx",
      sharedBy: "Team A",
      sharedDate: "Jan 16, 2024",
      size: "3.8 MB",
      downloads: 15,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">File Sharing</h1>
            <p className="text-gray-600">
              Share and access files with your team
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Share File
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shared By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Shared
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {file.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {file.sharedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {file.sharedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {file.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {file.downloads}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Download
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Share
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileSharing;
