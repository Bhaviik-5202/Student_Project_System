import React, { useState, memo, useCallback, useMemo } from "react";
import PropTypes from "prop-types";

const StudentFilters = memo(({ onFilter }) => {
  const [filters, setFilters] = useState({
    year: "",
    department: "",
    status: "",
  });

  const handleChange = useCallback(
    (e) => {
      setFilters({
        ...filters,
        [e.target.name]: e.target.value,
      });
    },
    [filters],
  );

  const handleApply = useCallback(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  const handleReset = useCallback(() => {
    const emptyFilters = { year: "", department: "", status: "" };
    setFilters(emptyFilters);
    onFilter({});
  }, [onFilter]);

  const yearOptions = useMemo(
    () => [
      { value: "", label: "All Years" },
      { value: "1", label: "First Year" },
      { value: "2", label: "Second Year" },
      { value: "3", label: "Third Year" },
      { value: "4", label: "Fourth Year" },
    ],
    [],
  );

  const departmentOptions = useMemo(
    () => [
      { value: "", label: "All Departments" },
      { value: "cs", label: "Computer Science" },
      { value: "it", label: "Information Technology" },
      { value: "ece", label: "Electronics" },
    ],
    [],
  );

  const statusOptions = useMemo(
    () => [
      { value: "", label: "All Status" },
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
    [],
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-md space-y-4">
      <h3 className="font-semibold text-gray-900 dark:text-white">
        Filter Students
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Year
          </label>
          <select
            name="year"
            value={filters.year}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
          >
            {yearOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Department
          </label>
          <select
            name="department"
            value={filters.department}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
          >
            {departmentOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleApply}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          Apply Filters
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
});

StudentFilters.displayName = "StudentFilters";

StudentFilters.propTypes = {
  onFilter: PropTypes.func.isRequired,
};

export default StudentFilters;
