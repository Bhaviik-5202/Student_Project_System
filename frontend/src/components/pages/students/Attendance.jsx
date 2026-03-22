import React, { memo, useMemo, useState, useEffect, useCallback } from "react";
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Activity,
  History,
  ChevronDown,
  ChevronUp,
  Clock
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import attendanceService from "../../../services/attendanceService";

const AttendanceRow = memo(({ record }) => {
  const getStatusConfig = (status) => {
    switch(status.toLowerCase()) {
      case "present": return { class: "status-active", icon: CheckCircle2 };
      case "absent": return { class: "status-error", icon: XCircle };
      default: return { class: "status-warning", icon: AlertCircle };
    }
  };

  const config = getStatusConfig(record.status);
  const Icon = config.icon;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors group">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
        {new Date(record.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider text-[10px]">
        {record.day}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-400" />
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 transition-colors">
            {record.meeting}
          </p>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
          <Clock size={12} />
          {record.time}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`table-status ${config.class} flex items-center gap-1.5 w-fit`}>
          <Icon size={12} />
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
    attendancePercentage: allRecords.length > 0 
      ? ((allRecords.filter(r => r.status === "Present").length / allRecords.length) * 100).toFixed(1)
      : "0.0",
  };

  return (
    <div className="p-4 md:p-6 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Attendance Tracking</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Detailed history of your academic sessions and presencia</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
          <History size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Semester Logs</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Sessions", value: stats.totalMeetings, icon: Calendar, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800" },
          { label: "Present Days", value: stats.present, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800" },
          { label: "Absent Days", value: stats.absent, icon: XCircle, color: "text-rose-600 bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-rose-800" },
          { label: "Presence Rate", value: `${stats.attendancePercentage}%`, icon: Activity, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-800" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="card hover:shadow-lg transition-all duration-300">
              <div className="card-body flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${stat.color} shadow-sm transition-transform hover:scale-110`}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attendance History Table */}
      <div className="table-container shadow-md">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <History size={18} className="text-indigo-500" />
            Session History
          </h3>
          <span className="text-xs font-bold px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full">
            Showing {displayedRecords.length} of {allRecords.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="w-40">Date</th>
                <th className="w-32">Day</th>
                <th>Academic Session</th>
                <th className="w-32">Time</th>
                <th className="w-32">Presence</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center text-gray-400 font-medium italic animate-pulse">
                    Accessing attendance archives...
                  </td>
                </tr>
              ) : displayedRecords.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-50 dark:bg-slate-700/30 rounded-full flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-700">
                        <Calendar size={24} className="text-gray-300" />
                      </div>
                      <p className="text-gray-400 font-bold italic">No attendance records found</p>
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
        
        {allRecords.length > 4 && (
          <div className="p-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800 text-center">
            <button 
              onClick={() => setShowAll(!showAll)}
              className="btn btn-secondary text-xs uppercase tracking-widest font-bold py-2 mx-auto"
            >
              {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showAll ? "Show Less" : `View Full History (${allRecords.length})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

StudentAttendance.displayName = "StudentAttendance";
export default StudentAttendance;
