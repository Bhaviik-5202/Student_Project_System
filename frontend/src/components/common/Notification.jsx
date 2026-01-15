import React from "react";

const Notification = ({ type = "info", message, onClose }) => {
  const bgColor = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
  };

  return (
    <div className={`border rounded p-3 mb-2 ${bgColor[type]}`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        {onClose && (
          <button onClick={onClose} className="ml-2">
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Notification;
