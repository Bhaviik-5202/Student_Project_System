import React, { useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import meetingService from "../../../services/meetingService";

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
        // Sanitize attendees: check if they are valid MongoDB ObjectIds
        // If not, we skip them to prevent backend BSON errors for now.
        const potentialParticipants = formData.attendees
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id && /^[0-9a-fA-F]{24}$/.test(id));

        const meetingData = {
          ...formData,
          date: new Date(`${formData.date}T${formData.time}`),
          participants: potentialParticipants,
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
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Schedule Meeting
          </h2>
          <p className="text-sm text-gray-500">
            Orchestrate a new collaborative session
          </p>
        </div>
        <button
          onClick={() => navigate("/meetings")}
          className="text-gray-400 hover:text-gray-600 text-xs font-bold uppercase tracking-widest"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Principal Data</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Meeting Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none"
                  placeholder="Official session name..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none"
                  placeholder="Physical room or virtual link..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Session Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Agenda & Description
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none resize-none"
                  placeholder="Items to discuss and key takeaways..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Participants</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Member IDs (Comma Separated)
                </label>
                <textarea
                  name="attendees"
                  rows="3"
                  value={formData.attendees}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none resize-none"
                  placeholder="User ObjectIds (24 characters)..."
                />
                <p className="text-[10px] text-gray-400 mt-2 italic">
                  Note: Only valid User IDs will be registered as participants.
                </p>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-50"
              >
                {loading ? "Scheduling..." : "Schedule Meeting"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
});

MeetingForm.displayName = "MeetingForm";
export default MeetingForm;
