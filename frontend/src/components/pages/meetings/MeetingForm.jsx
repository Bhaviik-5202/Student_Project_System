import React, { useState, useCallback, memo, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  X,
  Plus,
  Save,
  Users,
  Info,
  ChevronRight,
  UserPlus,
  ArrowLeft
} from "lucide-react";
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
          navigate("/meetings");
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

  const handleClose = useCallback(() => {
    if (location.pathname.startsWith("/meetings/list")) {
      navigate("/meetings/list");
    } else {
      navigate("/meetings");
    }
  }, [navigate, location.pathname]);

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
          handleClose();
        } else {
          toast.error(res.message || `Failed to ${isEditing ? "update" : "schedule"} meeting`);
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    },
    [formData, id, isEditing, handleClose],
  );

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in mb-20">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Header Card (Mirroring StudentForm Registry style) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 p-6 md:p-8">
            <div className="flex items-center gap-5">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {isViewing ? "Meeting Management" : isEditing ? "Meeting Management" : "Meeting Management"}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                  {isViewing ? "Reviewing project coordination" : "Create a new meeting entry in the system"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all p-2.5 rounded-xl"
              title="Discard changes"
            >
              <X size={20} />
            </button>
          </div>
        </div>


        {initialLoading ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-20 text-center shadow-sm">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-400 font-medium italic">Fetching session data...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Meeting Title - Full Width */}
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block ml-1">
                    Session Title
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                    <Video size={18} className="text-indigo-500" />
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      readOnly={isViewing}
                      className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400"
                      placeholder={isViewing ? "" : "e.g. Weekly Sprint Alignment"}
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block ml-1">
                    Scheduled Date
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                    <Calendar size={18} className="text-gray-400" />
                    <input
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      readOnly={isViewing}
                      className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block ml-1">
                    Session Timing
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                    <Clock size={18} className="text-gray-400" />
                    <input
                      type="time"
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      readOnly={isViewing}
                      className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block ml-1">
                    Venue / Meeting URL
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                    <MapPin size={18} className="text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      readOnly={isViewing}
                      className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400"
                      placeholder={isViewing ? "" : "Physical room or digital link"}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block ml-1">
                    Meeting Agenda
                  </label>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                    <Info size={18} className="text-gray-400 mt-1" />
                    <textarea
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      readOnly={isViewing}
                      className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 resize-none"
                      placeholder={isViewing ? "" : "Outline key objectives..."}
                    />
                  </div>
                </div>

                {/* Participants */}
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block ml-1">
                    Collaborators (User IDs)
                  </label>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                    <UserPlus size={18} className="text-gray-400 mt-1" />
                    <textarea
                      name="attendees"
                      rows="2"
                      value={formData.attendees}
                      onChange={handleChange}
                      readOnly={isViewing}
                      className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 resize-none"
                      placeholder={isViewing ? "" : "User ObjectIds separated by commas..."}
                    />
                  </div>
                  {!isViewing && (
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-3 flex items-center gap-2 opacity-60">
                      <ChevronRight size={10} className="text-indigo-500" />
                      Participants will be registered by their unique system identifiers
                    </p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              {!isViewing && (
                <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-gray-50 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 h-12 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={16} />
                    Back to List
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] h-12 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Syncing...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        {isEditing ? "Update Session Profile" : "Execute Schedule Registry"}
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
});

MeetingForm.displayName = "MeetingForm";
export default MeetingForm;
