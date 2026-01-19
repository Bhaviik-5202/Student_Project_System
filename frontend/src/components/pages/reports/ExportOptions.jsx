import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const ExportOptions = () => {
  const navigate = useNavigate();
  const [exportType, setExportType] = useState("pdf");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [includeData, setIncludeData] = useState({
    students: true,
    projects: true,
    meetings: true,
    grades: false,
  });
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);

    try {
      // Simulate export process
      setTimeout(() => {
        toast.success(
          `Report exported successfully as ${exportType.toUpperCase()}`
        );
        setLoading(false);
      }, 1500);
    } catch (error) {
      toast.error("Export failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/reports")}
            className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
          >
            ← Back to Reports
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Export Reports</h1>
          <p className="text-gray-600">Generate and download system reports</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-3xl">
          <div className="space-y-8">
            {/* Export Format */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Export Format
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["pdf", "excel", "csv"].map((format) => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => setExportType(format)}
                    className={`px-4 py-3 rounded-lg border text-center transition-colors ${
                      exportType === format
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium">{format.toUpperCase()}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {format === "pdf" && "Portable Document Format"}
                      {format === "excel" && "Microsoft Excel"}
                      {format === "csv" && "Comma Separated Values"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Date Range
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Include Data */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Include Data
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(includeData).map(([key, value]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setIncludeData({
                          ...includeData,
                          [key]: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700 capitalize">{key}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Export Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleExport}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Export Report as {exportType.toUpperCase()}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;
