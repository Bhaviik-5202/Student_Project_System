import React, { useState } from "react";

const MeetingForm = ({ onSubmit, initialData = {} }) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [date, setDate] = useState(initialData.date || "");
  const [time, setTime] = useState(initialData.time || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, date, time });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Meeting Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Meeting
      </button>
    </form>
  );
};

export default MeetingForm;
