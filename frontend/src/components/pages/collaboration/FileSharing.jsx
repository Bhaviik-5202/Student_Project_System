import { useState, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";

const FileSharing = memo(() => {
  const navigate = useNavigate();
  const files = useMemo(
    () => [
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
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              File Sharing
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Share and access files with your team
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800">
            Share File
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Shared By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Date Shared
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {files.map((file) => (
                  <tr
                    key={file.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {file.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white">
                      {file.sharedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white">
                      {file.sharedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white">
                      {file.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white">
                      {file.downloads}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3">
                        Download
                      </button>
                      <button className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
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
});

FileSharing.displayName = "FileSharing";

export default FileSharing;
