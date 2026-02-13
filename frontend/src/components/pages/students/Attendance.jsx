import React, { memo, useMemo } from "react";

const AttendanceRow = memo(({ record }) => {
  const statusStyles = {
    green: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
    red: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
    yellow:
      "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
  };

  const statusClass = statusStyles[record.statusColor] || statusStyles.green;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {new Date(record.date).toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {record.day}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
            <i className="fas fa-calendar-check text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {record.meeting}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {record.time}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}
        >
          {record.status}
        </span>
      </td>
    </tr>
  );
});

AttendanceRow.displayName = "AttendanceRow";

const StudentAttendance = memo(() => {
  const attendanceRecords = useMemo(
    () => [
      {
        date: "2024-02-15",
        day: "Thursday",
        meeting: "Project Review Meeting",
        time: "10:00 AM - 11:30 AM",
        status: "Present",
        statusColor: "green",
      },
      {
        date: "2024-02-13",
        day: "Tuesday",
        meeting: "Weekly Sync",
        time: "2:00 PM - 3:00 PM",
        status: "Present",
        statusColor: "green",
      },
      {
        date: "2024-02-08",
        day: "Thursday",
        meeting: "Group Discussion",
        time: "11:00 AM - 12:30 PM",
        status: "Absent",
        statusColor: "red",
      },
      {
        date: "2024-02-06",
        day: "Tuesday",
        meeting: "Project Planning",
        time: "3:00 PM - 4:00 PM",
        status: "Present",
        statusColor: "green",
      },
    ],
    [],
  );

  const stats = useMemo(
    () => ({
      totalMeetings: 12,
      present: 10,
      absent: 1,
      late: 1,
      attendancePercentage: 83.3,
    }),
    [],
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Attendance
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your meeting attendance records
        </p>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Meetings
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalMeetings}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <i className="fas fa-calendar-alt text-blue-600 dark:text-blue-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Present
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.present}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <i className="fas fa-check-circle text-green-600 dark:text-green-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Absent
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.absent}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <i className="fas fa-times-circle text-red-600 dark:text-red-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Attendance %
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.attendancePercentage}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <i className="fas fa-chart-line text-purple-600 dark:text-purple-400 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Attendance Records
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Day
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Meeting
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {attendanceRecords.map((record, index) => (
                <AttendanceRow key={index} record={record} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
            View All Records
          </button>
        </div>
      </div>
    </div>
  );
});

StudentAttendance.displayName = "StudentAttendance";

export default StudentAttendance;
