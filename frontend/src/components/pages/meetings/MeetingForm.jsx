import React, { useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const MeetingForm = memo(() => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    attendees: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const meetingData = {
          ...formData,
          // Combine date and time into a single ISO string for the backend if needed,
          // or send separately if the backend handles it.
          // Based on the model, 'date' is a Date object.
          date: new Date(`${formData.date}T${formData.time}`),
          participants: formData.attendees.split(",").map(id => id.trim()).filter(id => id),
        };

        const res = await meetingService.createMeeting(meetingData);
        if (res.success) {
          toast.success("Meeting scheduled successfully");
          navigate("/meetings/list");
        } else {
          toast.error(res.message || "Failed to schedule meeting");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate],
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6\">
          <button
            onClick={() => navigate("/meetings")}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center mb-4 font-medium transition-colors"
          >
            ← Back to Meetings
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white\">
            Schedule New Meeting
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fill in the details to schedule a new meeting
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meeting Title
              </label>
              <input
                type="text"
                required
                name="title"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter meeting title"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  required
                  name="date"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  required
                  name="time"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                required
                name="location"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter meeting location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                rows="4"
                name="description"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter meeting description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Attendees (comma separated)
              </label>
              <textarea
                rows="2"
                name="attendees"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                value={formData.attendees}
                onChange={handleChange}
                placeholder="Enter attendee names separated by commas"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-lg disabled:opacity-50"
              >
                {loading ? "Scheduling..." : "Schedule Meeting"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/meetings")}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

MeetingForm.displayName = "MeetingForm";

export default MeetingForm;
