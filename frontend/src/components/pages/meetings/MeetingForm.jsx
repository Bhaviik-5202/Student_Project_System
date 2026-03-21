import React, { useState, useCallback, memo, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import meetingService from "../../../services/meetingService";

const MeetingForm = memo(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isEditing = location.pathname.endsWith("/edit");
  const isViewing = id && !isEditing;

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    attendees: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      const fetchMeeting = async () => {
        setInitialLoading(true);
        const res = await meetingService.getMeetingById(id);
        if (res.success) {
          const m = res.data;
          setFormData({
            title: m.title || "",
            date: m.date ? m.date.split("T")[0] : "",
            time: m.time || (m.date ? new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : ""),
            location: m.location || "",
            description: m.description || "",
            attendees: m.participants ? m.participants.map(p => p._id || p).join(", ") : "",
          });
        } else {
          toast.error("Failed to load meeting details");
          navigate("/meetings/list");
        }
        setInitialLoading(false);
      };
      fetchMeeting();
    }
  }, [id, navigate]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const potentialParticipants = formData.attendees
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id && /^[0-9a-fA-F]{24}$/.test(id));

        const meetingData = {
          ...formData,
          date: new Date(`${formData.date}T${formData.time}`),
          participants: potentialParticipants,
        };

        const res = isEditing 
          ? await meetingService.updateMeeting(id, meetingData)
          : await meetingService.createMeeting(meetingData);

        if (res.success) {
          toast.success(`Meeting ${isEditing ? "updated" : "scheduled"} successfully`);
          navigate("/meetings/list");
        } else {
          toast.error(res.message || `Failed to ${isEditing ? "update" : "schedule"} meeting`);
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate, id, isEditing],
  );

  if (initialLoading) {
    return (
      <div className="p-12 text-center text-gray-400 text-sm italic">
        Loading session particulars...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isViewing ? "Meeting Particulars" : isEditing ? "Modify Meeting" : "Schedule Meeting"}
          </h2>
          <p className="text-sm text-gray-500">
            {isViewing ? "Review session details and agenda" : isEditing ? "Update existing session details" : "Orchestrate a new collaborative session"}
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
                  readOnly={isViewing}
                  className={`w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none ${isViewing ? 'cursor-not-allowed opacity-70' : ''}`}
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
                    readOnly={isViewing}
                    className={`w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none ${isViewing ? 'cursor-not-allowed opacity-70' : ''}`}
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
                    readOnly={isViewing}
                    className={`w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none ${isViewing ? 'cursor-not-allowed opacity-70' : ''}`}
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
                  readOnly={isViewing}
                  className={`w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none ${isViewing ? 'cursor-not-allowed opacity-70' : ''}`}
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
                  readOnly={isViewing}
                  className={`w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none resize-none ${isViewing ? 'cursor-not-allowed opacity-70' : ''}`}
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
                  readOnly={isViewing}
                  className={`w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg px-4 py-3 text-sm font-semibold transition-all outline-none resize-none ${isViewing ? 'cursor-not-allowed opacity-70' : ''}`}
                  placeholder="User ObjectIds (24 characters)..."
                />
                {!isViewing && (
                  <p className="text-[10px] text-gray-400 mt-2 italic">
                    Note: Only valid User IDs will be registered as participants.
                  </p>
                )}
              </div>
              
              {!isViewing && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-50"
                >
                  {loading ? (isEditing ? "Updating..." : "Scheduling...") : (isEditing ? "Update Meeting" : "Schedule Meeting")}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
});

MeetingForm.displayName = "MeetingForm";
export default MeetingForm;
