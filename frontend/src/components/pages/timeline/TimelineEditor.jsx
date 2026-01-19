import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const TimelineEditor = () => {
  const navigate = useNavigate();
  const [timeline, setTimeline] = useState({
    name: "Project Development Timeline",
    description: "Timeline for the database design project",
    milestones: [
      {
        id: 1,
        name: "Project Kickoff",
        date: "2024-01-10",
        description: "Initial project meeting",
      },
      {
        id: 2,
        name: "Requirements Finalized",
        date: "2024-01-20",
        description: "Finalize project requirements",
      },
      {
        id: 3,
        name: "Design Complete",
        date: "2024-02-01",
        description: "Complete system design",
      },
      {
        id: 4,
        name: "Development Complete",
        date: "2024-02-15",
        description: "Finish development phase",
      },
    ],
  });

  const [newMilestone, setNewMilestone] = useState({
    name: "",
    date: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const addMilestone = () => {
    if (!newMilestone.name || !newMilestone.date) {
      toast.error("Please fill in milestone name and date");
      return;
    }

    const newId = Math.max(...timeline.milestones.map((m) => m.id)) + 1;
    setTimeline({
      ...timeline,
      milestones: [...timeline.milestones, { ...newMilestone, id: newId }],
    });
    setNewMilestone({ name: "", date: "", description: "" });
    toast.success("Milestone added");
  };

  const removeMilestone = (id) => {
    setTimeline({
      ...timeline,
      milestones: timeline.milestones.filter(
        (milestone) => milestone.id !== id
      ),
    });
    toast.success("Milestone removed");
  };

  const saveTimeline = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success("Timeline saved successfully");
      setLoading(false);
      navigate("/timeline");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/timeline")}
            className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
          >
            ← Back to Timeline
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Timeline Editor
              </h1>
              <p className="text-gray-600">Create and edit project timelines</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={saveTimeline}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Timeline"}
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Preview
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          {/* Timeline Info */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={timeline.name}
                  onChange={(e) =>
                    setTimeline({ ...timeline, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={timeline.description}
                  onChange={(e) =>
                    setTimeline({ ...timeline, description: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Add New Milestone */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Milestone
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Milestone Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newMilestone.name}
                  onChange={(e) =>
                    setNewMilestone({ ...newMilestone, name: e.target.value })
                  }
                  placeholder="Enter milestone name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newMilestone.date}
                  onChange={(e) =>
                    setNewMilestone({ ...newMilestone, date: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newMilestone.description}
                  onChange={(e) =>
                    setNewMilestone({
                      ...newMilestone,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description"
                />
              </div>
            </div>
            <button
              onClick={addMilestone}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Milestone
            </button>
          </div>

          {/* Milestones List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Milestones ({timeline.milestones.length})
            </h3>
            <div className="space-y-4">
              {timeline.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {milestone.name}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {milestone.description}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        Date: {milestone.date}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200">
                        Edit
                      </button>
                      <button
                        onClick={() => removeMilestone(milestone.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Preview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

            {/* Milestones */}
            <div className="space-y-8">
              {timeline.milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative pl-16">
                  {/* Timeline Dot */}
                  <div className="absolute left-6 top-2 w-4 h-4 bg-blue-500 rounded-full border-4 border-white"></div>

                  {/* Milestone Card */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {milestone.name}
                      </h4>
                      <span className="text-sm text-gray-600">
                        {milestone.date}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineEditor;
