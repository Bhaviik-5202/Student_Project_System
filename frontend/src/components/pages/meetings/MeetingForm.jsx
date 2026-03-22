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
import "../../../assets/styles/meetings.css";

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
    <div className="meeting-page">
      <div className="meeting-container" style={{ maxWidth: '800px' }}>
        <div className="meeting-card">
          {/* Header */}
          <div className="meeting-card-header">
            <div>
              <h1 className="meeting-title">
                {isViewing ? "Meeting Details" : isEditing ? "Edit Meeting" : "Schedule Meeting"}
              </h1>
              <p className="meeting-subtitle mt-1">Project Synchronization</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {initialLoading ? (
            <div className="p-20 text-center">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="meeting-subtitle mt-4">Loading...</p>
            </div>
          ) : (
            <div className="meeting-card-body">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 meeting-form-group">
                    <label className="meeting-label">Meeting Title</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      readOnly={isViewing}
                      placeholder="e.g. Design Review"
                      className="meeting-input"
                    />
                  </div>

                  <div className="meeting-form-group">
                    <label className="meeting-label">Date</label>
                    <input
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      readOnly={isViewing}
                      className="meeting-input"
                    />
                  </div>

                  <div className="meeting-form-group">
                    <label className="meeting-label">Time</label>
                    <input
                      type="time"
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      readOnly={isViewing}
                      className="meeting-input"
                    />
                  </div>

                  <div className="md:col-span-2 meeting-form-group">
                    <label className="meeting-label">Location / Link</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        readOnly={isViewing}
                        placeholder="e.g. Room 101 or https://meet.google.com/abc-defg-hij"
                        className="meeting-input pl-10"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 meeting-form-group">
                    <label className="meeting-label">Agenda & Description</label>
                    <textarea
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                      readOnly={isViewing}
                      placeholder="What will be discussed?"
                      className="meeting-textarea"
                    />
                  </div>

                  <div className="md:col-span-2 meeting-form-group">
                    <label className="meeting-label">Attendees (IDs)</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="attendees"
                        value={formData.attendees}
                        onChange={handleChange}
                        readOnly={isViewing}
                        placeholder="e.g. 507f1f1... (Comma-separated User IDs)"
                        className="meeting-input pl-10"
                      />
                    </div>
                  </div>
                </div>

                {!isViewing && (
                  <div className="flex gap-4 pt-8 border-t border-gray-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="meeting-btn meeting-btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="meeting-btn meeting-btn-primary flex-1"
                    >
                      {loading ? "Saving..." : id ? "Update Meeting" : "Schedule Meeting"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

MeetingForm.displayName = "MeetingForm";
export default MeetingForm;
