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


import { useEffect, useState } from "react";
import documentService from "../../../services/documentService";

const DocumentLibrary = memo(() => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await documentService.getAll();
        if (res.success) {
          setDocuments(res.data || []);
        } else {
          setError(res.message || "Failed to load documents");
        }
      } catch (err) {
        setError("Failed to load documents");
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);


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
            {loading ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading documents...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : (
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
                    <DocumentRow key={doc.id || doc._id} doc={doc} />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

DocumentLibrary.displayName = "DocumentLibrary";

export default DocumentLibrary;
