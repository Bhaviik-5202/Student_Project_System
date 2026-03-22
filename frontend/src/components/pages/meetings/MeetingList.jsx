import React, { useState, useEffect, useCallback, memo } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import meetingService from "../../../services/meetingService";

const MeetingRow = memo(({ meeting, onView, onEdit }) => {
  const statusStyles = {
    Upcoming:
      "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200",
    Cancelled: "bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200",
    Completed:
      "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200",
  };
  const statusClass = statusStyles[meeting.status] || statusStyles.Completed;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-slate-900 dark:text-white">
          {meeting.title}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-slate-900 dark:text-white">{meeting.date}</div>
        <div className="text-slate-500 dark:text-slate-400 text-sm">
          {meeting.time}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white">
        {meeting.location}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs rounded-full ${statusClass}`}>
          {meeting.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={() => onView(meeting.id)}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
        >
          View
        </button>
        <button
          onClick={() => onEdit(meeting.id)}
          className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          Edit
        </button>
      </td>
    </tr>
  );
});

MeetingRow.displayName = "MeetingRow";

const MeetingList = memo(() => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      setLoading(true);
      setError(null);
      const res = await meetingService.getAllMeetings();
      if (res.success) {
        setMeetings(
          (res.data || []).map(m => ({
            id: m._id || m.id,
            title: m.title,
            date: m.date ? m.date.split("T")[0] : "TBD",
            time: m.time || "TBD",
            location: m.location || "Online",
            attendees: m.attendees || [],
            status: m.status || "Upcoming",
          }))
        );
      } else {
        setError(res.message || "Failed to load meetings");
      }
      setLoading(false);
    };
    fetchMeetings();
  }, []);

  // Schedule Meeting button handler
  const handleCreate = useCallback(() => {
    navigate("/meetings/new");
  }, [navigate]);

  const handleView = useCallback(
    (id) => {
      navigate(`/meetings/${id}`);
    },
    [navigate],
  );

  const handleEdit = useCallback(
    (id) => {
      navigate(`/meetings/${id}/edit`);
    },
    [navigate],
  );

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Header Section (Standardized with Project Catalog style) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-5">

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Meeting Management</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View and manage all scheduled academic sessions</p>
          </div>
        </div>
        <button
          onClick={handleCreate}
          className="btn btn-secondary"
        >
          Schedule New Meeting
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-gray-400 text-sm italic">Loading sessions...</div>
          ) : error ? (
            <div className="p-12 text-center text-red-500 text-sm font-semibold">{error}</div>
          ) : meetings.length === 0 ? (
            <div className="p-12 text-center text-gray-400 flex flex-col items-center">
              <p className="text-sm italic">No meetings scheduled at this time.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {meetings.map((meeting) => (
                  <MeetingRow
                    key={meeting.id}
                    meeting={meeting}
                    onView={handleView}
                    onEdit={handleEdit}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
});

MeetingList.displayName = "MeetingList";

export default MeetingList;
