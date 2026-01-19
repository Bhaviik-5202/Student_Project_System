import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DocumentLibrary = () => {
  const navigate = useNavigate();
  const [documents] = useState([
    {
      id: 1,
      title: "Project Guidelines",
      category: "General",
      uploadedBy: "Admin",
      date: "Jan 5, 2024",
      size: "1.2 MB",
    },
    {
      id: 2,
      title: "Research Paper Template",
      category: "Templates",
      uploadedBy: "Dr. Smith",
      date: "Jan 7, 2024",
      size: "0.8 MB",
    },
    {
      id: 3,
      title: "Coding Standards",
      category: "Development",
      uploadedBy: "Faculty",
      date: "Jan 10, 2024",
      size: "0.5 MB",
    },
    {
      id: 4,
      title: "Presentation Template",
      category: "Templates",
      uploadedBy: "Admin",
      date: "Jan 12, 2024",
      size: "2.1 MB",
    },
    {
      id: 5,
      title: "Lab Manual",
      category: "General",
      uploadedBy: "Dr. Johnson",
      date: "Jan 15, 2024",
      size: "3.4 MB",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Document Library
            </h1>
            <p className="text-gray-600">
              Access and manage all shared documents
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Upload Document
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {doc.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {doc.uploadedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {doc.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {doc.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Download
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Preview
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

export default DocumentLibrary;
