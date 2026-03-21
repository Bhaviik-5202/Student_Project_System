import React, { memo, useMemo, useState } from "react";

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
  const [showAll, setShowAll] = useState(false);

  const allRecords = useMemo(
    () => [
      { date: "2024-02-15", day: "Thursday", meeting: "Project Review Meeting", time: "10:00 AM - 11:30 AM", status: "Present", statusColor: "green" },
      { date: "2024-02-13", day: "Tuesday", meeting: "Weekly Sync", time: "2:00 PM - 3:00 PM", status: "Present", statusColor: "green" },
      { date: "2024-02-08", day: "Thursday", meeting: "Group Discussion", time: "11:00 AM - 12:30 PM", status: "Absent", statusColor: "red" },
      { date: "2024-02-06", day: "Tuesday", meeting: "Project Planning", time: "3:00 PM - 4:00 PM", status: "Present", statusColor: "green" },
      { date: "2024-02-01", day: "Thursday", meeting: "Review Session", time: "10:00 AM - 11:00 AM", status: "Present", statusColor: "green" },
      { date: "2024-01-30", day: "Tuesday", meeting: "Sprint Planning", time: "2:00 PM - 3:00 PM", status: "Present", statusColor: "green" },
      { date: "2024-01-25", day: "Thursday", meeting: "Tech Talk", time: "11:00 AM - 12:00 PM", status: "Late", statusColor: "yellow" },
      { date: "2024-01-23", day: "Tuesday", meeting: "Status Update", time: "3:00 PM - 3:30 PM", status: "Present", statusColor: "green" },
    ],
    [],
  );

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
              {displayedRecords.map((record, index) => (
                <AttendanceRow key={index} record={record} />
              ))}
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
