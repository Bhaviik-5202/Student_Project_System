import { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Card Component
 *
 * A fundamental layout primitive for grouping related content.
 * Supports theme-adaptive shadows, dark-mode specific elevation,
 * and optional hover-state transformations for interactive tiles.
 */
const Card = memo(({ children, className = '', hoverable = false }) => {
  return (
    <div
      className={`rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-950 ${
        hoverable
          ? 'cursor-pointer transition-shadow duration-300 hover:shadow-lg dark:hover:shadow-xl'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  hoverable: PropTypes.bool,
};

Card.defaultProps = {
  className: '',
  hoverable: false,
};

export default Card;
