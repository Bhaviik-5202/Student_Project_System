import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Clock,
  Layers,
  ChevronLeft,
  X,
  CreditCard,
  Target,
  Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import courseService from "../../../services/courseService";
import { toast } from "react-hot-toast";

const CourseRegistration = memo(() => {
  const navigate = useNavigate();
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const maxCredits = 18;
  const currentCredits = useMemo(() => {
    return selectedCourses.reduce((sum, id) => {
      const course = availableCourses.find(c => (c.id || c._id) === id);
      return sum + (course?.credits || 0);
    }, 0);
  }, [selectedCourses, availableCourses]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await courseService.getAllCourses();
        if (res.success) {
          setAvailableCourses(res.data || []);
        }
      } catch (err) {
        toast.error("Failed to load available courses");
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const toggleCourse = useCallback((id) => {
    setSelectedCourses(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  }, []);

  const handleRegister = async () => {
    if (selectedCourses.length === 0) {
      toast.error("Please select at least one course");
      return;
    }

    if (currentCredits > maxCredits) {
      toast.error(`Maximum credit limit is ${maxCredits}`);
      return;
    }

    setRegistering(true);
    let successCount = 0;
    let failCount = 0;
    let lastError = "";

    try {
      for (const id of selectedCourses) {
        try {
          const res = await courseService.enroll(id);
          if (res.success) {
            successCount++;
          } else {
            failCount++;
            lastError = res.message || "Server error";
          }
        } catch (err) {
          failCount++;
          lastError = err.message || "Network error";
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully registered for ${successCount} course(s)`);
        if (failCount === 0) {
          navigate("/courses/my");
        }
      }

      if (failCount > 0) {
        toast.error(`Failed to register for ${failCount} course(s): ${lastError}`);
      }
    } finally {
      setRegistering(false);
    }
  };

  const filteredCourses = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return availableCourses.filter(course => {
      const name = (course.name || course.title || "").toLowerCase();
      const code = (course.code || "").toLowerCase();
      const instructor = (course.faculty?.name || course.instructor || "Visiting Lead").toLowerCase();
      const credits = (course.credits || "").toString();

      return (
        name.includes(searchLower) ||
        code.includes(searchLower) ||
        instructor.includes(searchLower) ||
        credits.includes(searchLower)
      );
    });
  }, [availableCourses, searchTerm]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading registration data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Course Registration
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Select modules to build your academic schedule
          </p>
        </div>
        <button
          onClick={() => navigate("/courses/catalog")}
          className="btn btn-secondary flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Catalog
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="card sticky top-4 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
            <div className="card-body py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="Filter modules by name, code, instructor or credits..."
                  className="form-control pl-10 h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-6 whitespace-nowrap">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Credits</span>
                  <span className={`text-lg font-bold ${currentCredits > maxCredits ? "text-red-500" : "text-indigo-600"}`}>
                    {currentCredits} / {maxCredits}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Selected</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedCourses.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCourses.length === 0 ? (
              <div className="col-span-full card p-12 text-center text-gray-500">
                No modules found matching your search.
              </div>
            ) : (
              filteredCourses.map(course => {
                const id = course.id || course._id;
                const isSelected = selectedCourses.includes(id);
                return (
                  <div
                    key={id}
                    onClick={() => toggleCourse(id)}
                    className={`card cursor-pointer transition-all ${isSelected
                      ? "border-indigo-500 ring-2 ring-indigo-500/10 bg-indigo-50/5"
                      : "hover:border-gray-300"
                      }`}
                  >
                    <div className="card-body p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{course.code}</span>
                          <h4 className="font-bold text-gray-900 dark:text-white mt-0.5 line-clamp-1">{course.name || course.title}</h4>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${isSelected ? "bg-indigo-600 border-indigo-600" : "border-gray-200"
                          }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1 font-medium">
                          <CreditCard className="w-3.5 h-3.5 text-indigo-500" /> {course.credits} Units
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {course.schedule || "Flexible"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card sticky top-4">
            <div className="card-header">
              <h3 className="card-title">Registration Summary</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3 mb-6">
                {selectedCourses.length === 0 ? (
                  <p className="text-sm text-gray-400 italic text-center py-4">
                    Select modules to enroll
                  </p>
                ) : (
                  selectedCourses.map(id => {
                    const course = availableCourses.find(c => (c.id || c._id) === id);
                    return (
                      <div key={id} className="flex justify-between items-center gap-2 text-sm">
                        <div className="flex-1 truncate">
                          <p className="font-bold text-gray-900 dark:text-white truncate">{course?.name || course?.title}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">{course?.code}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleCourse(id); }}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Total Credits</span>
                  <span className={`font-bold ${currentCredits > maxCredits ? "text-red-500" : "text-gray-900 dark:text-white"}`}>
                    {currentCredits} / {maxCredits}
                  </span>
                </div>

                {currentCredits > maxCredits && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-xs font-medium flex gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Credit limit exceeded.</span>
                  </div>
                )}

                <button
                  onClick={handleRegister}
                  disabled={registering || selectedCourses.length === 0 || currentCredits > maxCredits}
                  className="btn btn-primary w-full py-3 h-auto text-base font-bold flex items-center justify-center gap-2"
                >
                  {registering ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>Commit Registration <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-gray-50 dark:bg-gray-900/50 border-dashed">
            <div className="card-body p-4">
              <div className="flex items-center gap-2 mb-3 text-indigo-600">
                <Target className="w-4 h-4" />
                <h4 className="text-sm font-bold">Policy Reminder</h4>
              </div>
              <ul className="text-[11px] text-gray-500 space-y-2 font-medium">
                <li>• No changes allowed after deadline.</li>
                <li>• Attendance starts from session 1.</li>
                <li>• Check for schedule overlaps.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CourseRegistration.displayName = "CourseRegistration";

export default CourseRegistration;
