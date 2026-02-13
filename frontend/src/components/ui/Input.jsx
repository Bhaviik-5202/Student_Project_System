import { memo, useCallback } from "react";
import PropTypes from "prop-types";

const Input = memo(
  ({
    type = "text",
    value,
    onChange,
    placeholder = "",
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
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
            error
              ? "border-red-500 dark:border-red-600"
              : "border-gray-300 dark:border-gray-600"
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
};

Input.defaultProps = {
  type: "text",
  placeholder: "",
  className: "",
};

export default Input;
