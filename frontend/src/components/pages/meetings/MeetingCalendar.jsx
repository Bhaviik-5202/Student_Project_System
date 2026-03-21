import React, { useState, useCallback, memo, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Plus,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import meetingService from "../../../services/meetingService";
import { toast } from "react-hot-toast";
const MeetingCalendar = memo(() => {
  const [viewDate, setViewDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [meetingForm, setMeetingForm] = useState({
    title: "",
    date: "",
    time: "",
    duration: "1.5",
    location: "",
    description: "",
    participants: [],
  });
  const [selectedDate, setSelectedDate] = useState(null);

  const [meetings, setMeetings] = useState([]);
  const [calendarDays, setCalendarDays] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMeetings = useCallback(async () => {
    try {
      const response = await meetingService.getMeetings();
      if (response.success) {
        setMeetings(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch meetings", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  useEffect(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, month: "prev", meetings: 0 });
    }

    const now = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayMeetings = meetings.filter(m => m.date && m.date.startsWith(dateStr)).length;
      days.push({
        day: i,
        month: "current",
        current: i === now.getDate() && month === now.getMonth() && year === now.getFullYear(),
        meetings: dayMeetings
      });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, month: "next", meetings: 0 });
    }

    setCalendarDays(days);
  }, [viewDate, meetings]);

  const changeMonth = (offset) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setMeetingForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleScheduleMeeting = useCallback(async () => {
    if (!meetingForm.title || !meetingForm.date || !meetingForm.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await meetingService.createMeeting(meetingForm);
      if (response.success) {
        toast.success("Meeting scheduled successfully!");
        setShowModal(false);
        setMeetingForm({
          title: "", date: "", time: "", duration: "1.5",
          location: "", description: "", participants: [],
        });
        fetchMeetings();
      } else {
        toast.error(response.message || "Failed to schedule meeting");
      }
    } catch (error) {
      toast.error("Failed to schedule meeting");
    }
  }, [meetingForm, fetchMeetings]);

  const monthName = viewDate.toLocaleString('default', { month: 'long' });
  const yearName = viewDate.getFullYear();

  const filteredMeetings = useMemo(() => {
    if (!selectedDate) return meetings;
    return meetings.filter(m => m.date && m.date.startsWith(selectedDate));
  }, [meetings, selectedDate]);

  const handleDayClick = (dayObj) => {
    if (dayObj.month !== "current") return;
    const dateStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(dayObj.day).padStart(2, '0')}`;
    setSelectedDate(selectedDate === dateStr ? null : dateStr);
  };

  return (
    <div className="dashboard-content">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Meeting Calendar
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Monitor and schedule your project sessions
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus className="w-5 h-5" /> Schedule Meeting
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="card-header flex justify-between items-center">
            <h2 className="card-title">
              {monthName} {yearName}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={() => changeMonth(-1)} className="btn btn-secondary btn-sm">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setViewDate(new Date())} className="btn btn-secondary btn-sm">
                Today
              </button>
              <button onClick={() => changeMonth(1)} className="btn btn-secondary btn-sm">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-900/50">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-gray-800">
              {calendarDays.map((day, index) => {
                const dateStr = day.month === "current" 
                  ? `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`
                  : null;
                const isSelected = selectedDate === dateStr;
                const dayMeetings = meetings.filter(m => m.date && m.date.startsWith(dateStr));

                return (
                  <div 
                    key={index} 
                    onClick={() => handleDayClick(day)}
                    className={`min-h-[110px] bg-white dark:bg-slate-800 p-2 transition-all cursor-pointer border-r border-b border-gray-100 dark:border-gray-800 ${
                      day.month !== "current" ? "bg-gray-50/50 dark:bg-slate-900/30 opacity-30 pointer-events-none" : "hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10"
                    } ${isSelected ? "ring-2 ring-inset ring-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20" : ""}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs font-bold ${
                        day.current ? "bg-indigo-600 text-white w-6 h-6 flex items-center justify-center rounded-lg shadow-md shadow-indigo-200" : "text-gray-500 dark:text-gray-400"
                      }`}>
                        {day.day}
                      </span>
                    </div>
                    <div className="mt-1 space-y-1 overflow-hidden">
                      {dayMeetings.slice(0, 2).map((m, i) => (
                        <div key={i} className="px-1.5 py-0.5 bg-indigo-100/50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[9px] font-bold rounded border border-indigo-200/50 dark:border-indigo-800/50 truncate">
                          {m.title}
                        </div>
                      ))}
                      {dayMeetings.length > 2 && (
                        <div className="text-[9px] text-gray-400 font-bold pl-1">
                          +{dayMeetings.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card flex flex-col h-full border-indigo-100 dark:border-indigo-900/30 shadow-indigo-100/20 shadow-xl">
          <div className="card-header flex justify-between items-center">
            <h2 className="card-title">
              {selectedDate ? "Day Schedule" : "Upcoming Sessions"}
            </h2>
            {selectedDate && (
              <button 
                onClick={() => setSelectedDate(null)}
                className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline"
              >
                View All
              </button>
            )}
          </div>
          <div className="card-body overflow-y-auto max-h-[600px] space-y-4">
            {loading ? (
              <div className="text-center py-10 text-gray-400">Loading...</div>
            ) : filteredMeetings.length === 0 ? (
              <div className="text-center py-14">
                <Calendar className="w-12 h-12 text-gray-100 dark:text-gray-800 mx-auto mb-4" />
                <p className="text-gray-400 text-sm font-medium">No sessions {selectedDate ? "on this date" : "scheduled"}</p>
              </div>
            ) : (
              filteredMeetings.map((meeting) => (
                <div key={meeting.id || meeting._id} className="p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-800 hover:bg-white dark:hover:bg-gray-900 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                      {meeting.title}
                    </h3>
                    <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                      <Video className="w-3.5 h-3.5 text-indigo-500" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                    {meeting.description || "Project alignment session."}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" /> {meeting.time || "10:00 AM"}
                    </span>
                    <span className="flex items-center gap-1.5 truncate max-w-[120px]">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {meeting.location || "Online"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content max-w-lg">
            <div className="modal-header">
              <h2 className="modal-title">Schedule New Session</h2>
              <button
                onClick={() => setShowModal(false)}
                className="modal-close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="modal-body space-y-4">
              <div className="form-group">
                <label className="form-label">Session Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={meetingForm.title}
                  onChange={handleFormChange}
                  className="form-control"
                  placeholder="e.g. Project Review, Sprint Planning"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={meetingForm.date}
                    onChange={handleFormChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    name="time"
                    required
                    value={meetingForm.time}
                    onChange={handleFormChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Location / Link</label>
                <input
                  type="text"
                  name="location"
                  value={meetingForm.location}
                  onChange={handleFormChange}
                  className="form-control"
                  placeholder="Physical room or meeting URL"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Agenda</label>
                <textarea
                  name="description"
                  rows="3"
                  value={meetingForm.description}
                  onChange={handleFormChange}
                  className="form-control resize-none"
                  placeholder="What will be discussed during this session?"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleScheduleMeeting} className="btn btn-primary">
                Confirm Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

MeetingCalendar.displayName = "MeetingCalendar";

export default MeetingCalendar;
