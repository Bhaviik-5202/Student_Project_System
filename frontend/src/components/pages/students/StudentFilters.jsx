import React, { useState } from "react";

const StudentFilters = ({ onFilter }) => {
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");

  const handleApply = () => {
    onFilter({ year, department, status });
  };

  const handleReset = () => {
    setYear("");
    setDepartment("");
    setStatus("");
    onFilter({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <h3 className="font-semibold">Filter Students</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">All Years</option>
            <option value="1">First Year</option>
            <option value="2">Second Year</option>
            <option value="3">Third Year</option>
            <option value="4">Fourth Year</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">All Departments</option>
            <option value="cs">Computer Science</option>
            <option value="it">Information Technology</option>
            <option value="ece">Electronics</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleApply}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default StudentFilters;
