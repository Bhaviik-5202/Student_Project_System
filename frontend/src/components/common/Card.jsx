import React, { memo } from "react";
import PropTypes from "prop-types";

/**
 * Card Component
 * 
 * A fundamental layout primitive for grouping related content. 
 * Supports theme-adaptive shadows, dark-mode specific elevation, 
 * and optional hover-state transformations for interactive tiles.
 */
const Card = memo(({ children, className = "", hoverable = false }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg dark:shadow-gray-950 p-4 ${
        hoverable
          ? "hover:shadow-lg dark:hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  hoverable: PropTypes.bool,
};

Card.defaultProps = {
  className: "",
  hoverable: false,
};

export default Card;
