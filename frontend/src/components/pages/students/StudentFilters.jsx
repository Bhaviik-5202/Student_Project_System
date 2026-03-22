import React, { useState, memo, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { Filter, RotateCcw, CheckCircle2, Building, GraduationCap } from "lucide-react";

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
      { value: "", label: "All Academic Years" },
      { value: "1", label: "1st Year (Freshman)" },
      { value: "2", label: "2nd Year (Sophomore)" },
      { value: "3", label: "3rd Year (Junior)" },
      { value: "4", label: "4th Year (Senior)" },
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
    <div className="card shadow-md animate-fade-in border-t-4 border-indigo-500">
      <div className="card-body space-y-6">
        <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-slate-800">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Filter size={20} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Advanced Search & Filters
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              <GraduationCap size={14} className="text-gray-400" />
              Academic Year
            </label>
            <select
              name="year"
              value={filters.year}
              onChange={handleChange}
              className="form-control appearance-none"
            >
              {yearOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              <Building size={14} className="text-gray-400" />
              Department
            </label>
            <select
              name="department"
              value={filters.department}
              onChange={handleChange}
              className="form-control appearance-none"
            >
              {departmentOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              <CheckCircle2 size={14} className="text-gray-400" />
              Enrollment Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="form-control appearance-none"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={handleApply}
            className="btn btn-primary flex-1"
          >
            <Filter size={18} />
            Apply Selection
          </button>
          <button
            onClick={handleReset}
            className="btn btn-secondary px-8"
          >
            <RotateCcw size={18} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
});

StudentFilters.displayName = "StudentFilters";

StudentFilters.propTypes = {
  onFilter: PropTypes.func.isRequired,
};

export default StudentFilters;
