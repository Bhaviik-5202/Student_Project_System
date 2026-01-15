import React, { useState } from "react";

const StudentForm = ({ onSubmit, initialData = {} }) => {
  const [name, setName] = useState(initialData.name || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [rollNumber, setRollNumber] = useState(initialData.rollNumber || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, rollNumber });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Roll Number</label>
        <input
          type="text"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {initialData.id ? "Update Student" : "Add Student"}
      </button>
    </form>
  );
};

export default StudentForm;
