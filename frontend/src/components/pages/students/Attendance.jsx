import React, { memo, useMemo, useState, useEffect, useCallback } from "react";
import useAuth from "../../../hooks/useAuth";
import attendanceService from "../../../services/attendanceService";

const AttendanceRow = memo(({ record }) => {
  const statusStyles = {
    green: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    red: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  };

  const statusClass = statusStyles[record.statusColor] || statusStyles.green;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
        {new Date(record.date).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {record.day}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {record.meeting}
        </p>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {record.time}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${statusClass}`}>
          {record.status}
        </span>
      </td>
    </tr>
  );
});

AttendanceRow.displayName = "AttendanceRow";

const StudentAttendance = memo(() => {
  const { user } = useAuth();
  const [allRecords, setAllRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const fetchAttendance = useCallback(async () => {
    if (!user?.id && !user?._id) return;
    setLoading(true);
    try {
      const res = await attendanceService.getAttendanceByStudent(user.id || user._id);
      if (res.success || Array.isArray(res.data)) {
        const data = res.data || res;
        const mappedRecords = data.map(record => ({
          date: record.date,
          day: new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' }),
          meeting: record.meeting?.title || record.remarks || "Session",
          time: record.time || (record.meeting?.date ? new Date(record.meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "TBD"),
          status: record.status.charAt(0).toUpperCase() + record.status.slice(1),
          statusColor: record.status === "present" ? "green" : record.status === "absent" ? "red" : "yellow"
        }));
        setAllRecords(mappedRecords);
      }
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const displayedRecords = showAll ? allRecords : allRecords.slice(0, 4);

  const stats = {
    totalMeetings: allRecords.length,
    present: allRecords.filter(r => r.status === "Present").length,
    absent: allRecords.filter(r => r.status === "Absent").length,
    attendancePercentage: ((allRecords.filter(r => r.status === "Present").length / allRecords.length) * 100).toFixed(1),
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Attendance Overview</h2>
        <p className="text-sm text-gray-500">Track and monitor academic presence</p>
      </div>

      {/* Basic Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Meetings", value: stats.totalMeetings, icon: "fa-calendar", color: "text-blue-600 bg-blue-50" },
          { label: "Present", value: stats.present, icon: "fa-check", color: "text-green-600 bg-green-50" },
          { label: "Absent", value: stats.absent, icon: "fa-times", color: "text-red-600 bg-red-50" },
          { label: "Attendance %", value: `${stats.attendancePercentage}%`, icon: "fa-percent", color: "text-indigo-600 bg-indigo-50" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color} dark:bg-opacity-10`}>
              <i className={`fas ${stat.icon}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Attendance List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 dark:text-white">Recent Sessions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Day</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Meeting</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-400 text-sm italic">Synchronizing logs...</td>
                </tr>
              ) : displayedRecords.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <i className="fas fa-calendar-times text-gray-200 text-4xl mb-3" />
                      <p className="text-gray-400 text-sm font-medium">No attendance records found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedRecords.map((record, index) => (
                  <AttendanceRow key={index} record={record} />
                ))
              )}
            </tbody>
          </table>
        </div>
        {!showAll && allRecords.length > 4 && (
          <div className="p-4 bg-gray-50 dark:bg-slate-900/30 text-center">
            <button 
              onClick={() => setShowAll(true)}
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              View All Records
            </button>
          </div>
        )}
        {showAll && (
          <div className="p-4 bg-gray-50 dark:bg-slate-900/30 text-center">
            <button 
              onClick={() => setShowAll(false)}
              className="text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
            >
              Show Less
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

StudentAttendance.displayName = "StudentAttendance";
export default StudentAttendance;
