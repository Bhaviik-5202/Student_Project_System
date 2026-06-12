import React, { memo, useMemo, useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Activity,
  History,
  ChevronDown,
  ChevronUp,
  Clock,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import attendanceService from '../../../services/attendanceService';

const AttendanceRow = memo(({ record }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'present':
        return { class: 'status-active', icon: CheckCircle2 };
      case 'absent':
        return { class: 'status-error', icon: XCircle };
      default:
        return { class: 'status-warning', icon: AlertCircle };
    }
  };

  const config = getStatusConfig(record.status);
  const Icon = config.icon;

  return (
    <tr className='group transition-colors hover:bg-gray-50 dark:hover:bg-slate-900/50'>
      <td className='whitespace-nowrap px-6 py-4 text-sm font-bold text-gray-900 dark:text-white'>
        {new Date(record.date).toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </td>
      <td className='whitespace-nowrap px-6 py-4 text-[10px] text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400'>
        {record.day}
      </td>
      <td className='whitespace-nowrap px-6 py-4'>
        <div className='flex items-center gap-2'>
          <div className='h-2 w-2 rounded-full bg-indigo-400' />
          <p className='text-sm font-bold text-gray-800 transition-colors group-hover:text-indigo-600 dark:text-gray-200'>
            {record.meeting}
          </p>
        </div>
      </td>
      <td className='whitespace-nowrap px-6 py-4'>
        <div className='flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400'>
          <Clock size={12} />
          {record.time}
        </div>
      </td>
      <td className='whitespace-nowrap px-6 py-4'>
        <span
          className={`table-status ${config.class} flex w-fit items-center gap-1.5`}
        >
          <Icon size={12} />
          {record.status}
        </span>
      </td>
    </tr>
  );
});

AttendanceRow.displayName = 'AttendanceRow';

const StudentAttendance = memo(() => {
  const { user } = useAuth();
  const [allRecords, setAllRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const { studentId: paramStudentId } = useParams();
  const targetStudentId = paramStudentId || user?.id || user?._id;

  const fetchAttendance = useCallback(async () => {
    if (!targetStudentId) return;
    setLoading(true);
    try {
      const res = await attendanceService.getAttendanceByStudent(targetStudentId);
        if (res.success || Array.isArray(res.data) || Array.isArray(res)) {
          const data = res.data || (Array.isArray(res) ? res : []);
        const mappedRecords = data.map((record) => ({
          date: record.date,
          day: new Date(record.date).toLocaleDateString('en-US', {
            weekday: 'long',
          }),
          meeting: record.meeting?.title || record.remarks || 'Session',
          time:
            record.time ||
            (record.meeting?.date
              ? new Date(record.meeting.date).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'TBD'),
          status:
            (record.status || 'unknown').charAt(0).toUpperCase() + (record.status || 'unknown').slice(1),
          statusColor:
            record.status === 'present'
              ? 'green'
              : record.status === 'absent'
                ? 'red'
                : 'yellow',
        }));
        setAllRecords(mappedRecords);
      }
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
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
    present: allRecords.filter((r) => r.status === 'Present').length,
    absent: allRecords.filter((r) => r.status === 'Absent').length,
    attendancePercentage:
      allRecords.length > 0
        ? (
            (allRecords.filter((r) => r.status === 'Present').length /
              allRecords.length) *
            100
          ).toFixed(1)
        : '0.0',
  };

  return (
    <div className='animate-fade-in space-y-8 p-4 md:p-6'>
      <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
        <div>
          <h2 className='text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white'>
            Attendance Tracking
          </h2>
          <p className='mt-1 text-sm font-medium text-gray-500 dark:text-gray-400'>
            Detailed history of your academic sessions and presence
          </p>
        </div>
        <div className='flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2 text-indigo-700 dark:border-indigo-800/30 dark:bg-indigo-900/20 dark:text-indigo-400'>
          <History size={16} />
          <span className='text-xs font-bold uppercase tracking-wider'>
            Semester Logs
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {[
          {
            label: 'Total Sessions',
            value: stats.totalMeetings,
            icon: Calendar,
            color:
              'text-blue-600 bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800',
          },
          {
            label: 'Present Days',
            value: stats.present,
            icon: CheckCircle2,
            color:
              'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800',
          },
          {
            label: 'Absent Days',
            value: stats.absent,
            icon: XCircle,
            color:
              'text-rose-600 bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-rose-800',
          },
          {
            label: 'Presence Rate',
            value: `${stats.attendancePercentage}%`,
            icon: Activity,
            color:
              'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-800',
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className='card transition-all duration-300 hover:shadow-lg'
            >
              <div className='card-body flex items-center gap-4'>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${stat.color} shadow-sm transition-transform hover:scale-110`}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <p className='mb-1 text-[10px] font-bold uppercase leading-none tracking-widest text-gray-400'>
                    {stat.label}
                  </p>
                  <p className='text-xl font-black text-gray-900 dark:text-white'>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attendance History Table */}
      <div className='table-container shadow-md'>
        <div className='flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-800'>
          <h3 className='flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white'>
            <History size={18} className='text-indigo-500' />
            Session History
          </h3>
          <span className='rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 dark:bg-slate-700 dark:text-gray-300'>
            Showing {displayedRecords.length} of {allRecords.length}
          </span>
        </div>
        <div className='overflow-x-auto'>
          <table className='table'>
            <thead>
              <tr>
                <th className='w-40'>Date</th>
                <th className='w-32'>Day</th>
                <th>Academic Session</th>
                <th className='w-32'>Time</th>
                <th className='w-32'>Presence</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan='5'
                    className='animate-pulse py-20 text-center font-medium italic text-gray-400'
                  >
                    Accessing attendance archives...
                  </td>
                </tr>
              ) : displayedRecords.length === 0 ? (
                <tr>
                  <td colSpan='5' className='py-20 text-center'>
                    <div className='flex flex-col items-center gap-3'>
                      <div className='flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-700/30'>
                        <Calendar size={24} className='text-gray-300' />
                      </div>
                      <p className='font-bold italic text-gray-400'>
                        No attendance records found
                      </p>
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
          <div className='border-t border-gray-100 bg-gray-50 p-4 text-center dark:border-slate-800 dark:bg-slate-900/50'>
            <button
              onClick={() => setShowAll(!showAll)}
              className='btn btn-secondary mx-auto py-2 text-xs font-bold uppercase tracking-widest'
            >
              {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showAll
                ? 'Show Less'
                : `View Full History (${allRecords.length})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

StudentAttendance.displayName = 'StudentAttendance';
export default StudentAttendance;
