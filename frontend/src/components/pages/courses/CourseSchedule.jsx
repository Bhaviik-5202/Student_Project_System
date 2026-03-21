import React, { memo, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Coffee,
  Layout,
  ArrowRight
} from "lucide-react";
import courseService from "../../../services/courseService";

const CourseSchedule = memo(() => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days.includes(today) ? today : "Monday";
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await courseService.getMyCourses();
        if (response?.success && Array.isArray(response.data)) {
          setCourses(response.data);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching schedule", error);
        toast.error("Failed to load your schedule");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  const todaySchedule = useMemo(() => {
    if (!Array.isArray(courses)) return [];
    
    const dayShort = selectedDay.substring(0, 3);
    
    return courses
      .filter(c => {
        if (!c) return false;
        const schedule = String(c.schedule || "");
        return schedule.includes(dayShort);
      })
      .map(c => {
        const scheduleStr = String(c.schedule || "");
        const parts = scheduleStr.split(" ");
        const timePart = parts.length > 1 ? parts.slice(1).join(" ") : "TBA";
        
        return {
          id: c.id || c._id,
          name: c.name || c.title || "Untitled Module",
          code: c.code || "N/A",
          time: timePart,
          room: c.room || "Digital Library",
          faculty: c.faculty?.name || c.instructor || "Visiting Professor"
        };
      });
  }, [courses, selectedDay]);

  const totalCredits = useMemo(() => {
    if (!Array.isArray(courses)) return 0;
    return courses.reduce((acc, c) => acc + (Number(c?.credits) || 0), 0);
  }, [courses]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-500 font-medium">Compiling timetable...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content tracking-tight">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Weekly Schedule
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track your lectures and manage your academic time
          </p>
        </div>
        <div className="card py-2 px-4 flex items-center gap-3 bg-white/50 backdrop-blur-sm">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-gray-900 dark:text-white">
            {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${selectedDay === day
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 scale-105"
              : "bg-white dark:bg-gray-800 text-gray-500 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-2 px-1">
            <Layout className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {selectedDay} Modules
            </h3>
          </div>

          {todaySchedule.length === 0 ? (
            <div className="card p-16 text-center border-dashed border-2 bg-gray-50/30">
              <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Coffee className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No lectures today</h3>
              <p className="text-gray-500 font-medium">Enjoy your break or catch up on self-study.</p>
            </div>
          ) : (
            todaySchedule.map((item, index) => (
              <div key={item.id || index} className="card transition-all hover:shadow-md hover:border-indigo-200 active:scale-[0.99]">
                <div className="card-body flex flex-col md:flex-row md:items-center justify-between gap-6 p-5">
                  <div className="flex items-start md:items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex flex-col items-center justify-center border border-indigo-100 dark:border-indigo-800/50 shrink-0">
                      <span className="text-[10px] font-bold text-indigo-400 dark:text-indigo-500 uppercase tracking-tighter">START</span>
                      <span className="text-base font-bold text-indigo-700 dark:text-indigo-300">{item.time.split("-")[0].trim()}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="badge badge-primary py-0.5 px-2 text-[10px] mb-1.5">{item.code}</span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate">{item.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-indigo-400" /> {item.room}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4 text-indigo-400" /> {item.faculty}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/courses/${item.id}`)}
                    className="btn btn-secondary w-full md:w-auto h-11 flex items-center justify-center gap-2 group whitespace-nowrap"
                  >
                    Enter Module <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-6">
          <div className="card bg-indigo-600 text-white border-0 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 -m-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <div className="card-body relative z-10">
              <h3 className="text-lg font-bold mb-6 opacity-90 uppercase tracking-widest text-xs">Semester Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <span className="font-medium opacity-80 text-sm">Active Modules</span>
                  <span className="text-2xl font-bold">{courses.length}</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <span className="font-medium opacity-80 text-sm">Total Units</span>
                  <span className="text-2xl font-bold">{totalCredits}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header border-b border-gray-50 dark:border-gray-800">
              <h3 className="card-title text-sm">Quick Actions</h3>
            </div>
            <div className="card-body flex flex-col gap-3 p-4">
              <button
                onClick={() => navigate("/courses/catalog")}
                className="btn btn-secondary w-full justify-between h-11 text-sm font-bold"
              >
                Browse Catalog <ArrowRight className="w-4 h-4 opacity-50" />
              </button>
              <button
                onClick={() => navigate("/courses/register")}
                className="btn btn-secondary w-full justify-between h-11 text-sm font-bold"
              >
                Enrollment <ArrowRight className="w-4 h-4 opacity-50" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CourseSchedule.displayName = "CourseSchedule";

export default CourseSchedule;
