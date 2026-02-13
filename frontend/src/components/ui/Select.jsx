import { memo, useCallback } from "react";
import PropTypes from "prop-types";

const Select = memo(
  ({
    value,
    onChange,
    options = [],
    label,
    error,
    className = "",
    ...props
  }) => {
    const handleChange = useCallback(
      (e) => {
        onChange?.(e);
      },
      [onChange],
    );

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <select
          value={value}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
            error
              ? "border-red-500 dark:border-red-600"
              : "border-gray-300 dark:border-gray-600"
          } ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

Select.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  label: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
};

Select.defaultProps = {
  options: [],
  className: "",
};

export default Select;
