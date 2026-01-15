import React, { useState } from "react";

const ProfileSettings = ({ user, onSave }) => {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [bio, setBio] = useState(user.bio || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, email, bio });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 border rounded"
          rows="3"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </form>
  );
};

export default ProfileSettings;
