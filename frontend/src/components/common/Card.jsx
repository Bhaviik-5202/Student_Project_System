import React from "react";

const Card = ({ children, className = "", hoverable = false }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 ${
        hoverable ? "hover:shadow-lg transition-shadow duration-300" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
