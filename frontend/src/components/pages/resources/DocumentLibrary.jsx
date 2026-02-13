import { memo, useMemo } from "react";
import PropTypes from "prop-types";

const DocumentRow = memo(({ doc }) => (
  <tr className="hover:bg-slate-50 dark:hover:bg-slate-700">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="font-medium text-slate-900 dark:text-white">
        {doc.title}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-full">
        {doc.category}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white">
      {doc.uploadedBy}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white">
      {doc.date}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white">
      {doc.size}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3">
        Download
      </button>
      <button className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
        Preview
      </button>
    </td>
  </tr>
));

DocumentRow.displayName = "DocumentRow";

DocumentRow.propTypes = {
  doc: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    uploadedBy: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
  }).isRequired,
};

const DocumentLibrary = memo(() => {
  const documents = useMemo(
    () => [
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
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Document Library
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Access and manage all shared documents
            </p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
            Upload Document
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Document Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Uploaded By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {documents.map((doc) => (
                  <DocumentRow key={doc.id} doc={doc} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
});

DocumentLibrary.displayName = "DocumentLibrary";

export default DocumentLibrary;
