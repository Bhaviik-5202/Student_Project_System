import React from "react";

const ExportOptions = ({ onExport }) => {
  const formats = ["PDF", "Excel", "CSV", "JSON"];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Export Data</h3>
      <div className="space-y-2">
        {formats.map((format) => (
          <button
            key={format}
            onClick={() => onExport(format.toLowerCase())}
            className="block w-full text-left p-2 hover:bg-gray-100 rounded"
          >
            Export as {format}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExportOptions;
