import React, { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import meetingService from "../../../services/meetingService";

const MeetingRow = memo(({ meeting, onView }) => {
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
        <button className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Meeting Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage all meetings. Find useful resources and tips
              below.
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            Schedule New Meeting
          </button>
        </div>

        {/* Related Resources Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Related Resources
          </h2>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li>
              <a
                href="https://www.mindtools.com/meeting-management"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400"
              >
                Effective Meeting Management Tips
              </a>
            </li>
            <li>
              <a
                href="https://www.atlassian.com/work-management/meeting-notes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400"
              >
                How to Take Meeting Notes
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/watch?v=O2Q2FZp4R6A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400"
              >
                Video: Running Productive Meetings
              </a>
            </li>
          </ul>
        </div>

        {/* ...existing code... */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading meetings...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : meetings.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
                <i className="fas fa-calendar-times text-4xl mb-3 text-gray-400"></i>
                <p>No meetings scheduled</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {meetings.map((meeting) => (
                    <MeetingRow
                      key={meeting.id}
                      meeting={meeting}
                      onView={handleView}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

MeetingList.displayName = "MeetingList";

export default MeetingList;
