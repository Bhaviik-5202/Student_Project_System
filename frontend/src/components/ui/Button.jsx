import { memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

const Button = memo(
  ({
    children,
    type = 'button',
    variant = 'primary',
    onClick,
    disabled = false,
    className = '',
  }) => {
    const variants = useMemo(
      () => ({
        primary:
          'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white',
        secondary:
          'bg-gray-600 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-800 text-white',
        danger:
          'bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 text-white',
        success:
          'bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 text-white',
        outline:
          'bg-transparent border border-gray-600 dark:border-gray-400 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700',
      }),
      []
    );

    const handleClick = useCallback(
      (e) => {
        if (!disabled && onClick) {
          onClick(e);
        }
      },
      [onClick, disabled]
    );

    return (
      <button
        type={type}
        onClick={handleClick}
        disabled={disabled}
        className={`rounded px-4 py-2 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900 ${
          variants[variant]
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'danger',
    'success',
    'outline',
  ]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

Button.defaultProps = {
  type: 'button',
  variant: 'primary',
  disabled: false,
  className: '',
};

export default Button;
