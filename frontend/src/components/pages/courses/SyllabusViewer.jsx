import React, { memo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { 
  ChevronLeft, 
  Printer, 
  CheckCircle2, 
  Clock, 
  BookOpen,
  Target,
  BarChart3,
  Calendar,
  FileText,
  AlertCircle
} from "lucide-react";
import courseService from "../../../services/courseService";

const SyllabusViewer = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeWeek, setActiveWeek] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await courseService.getCourseById(id);
        if (response.success) {
          setCourse(response.data);
        } else {
          toast.error(response.message || "Failed to load syllabus");
          navigate(`/courses/${id}`);
        }
      } catch (error) {
        console.error("Error fetching course", error);
        toast.error("An error occurred while loading syllabus");
        navigate(`/courses/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading syllabus...</p>
      </div>
    );
  }

  const syllabus = course?.syllabus || [];

  return (
    <div className="dashboard-content">
      <div className="mb-8">
        <button
          onClick={() => navigate(`/courses/${id}`)}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 font-semibold transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Module
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Course Syllabus
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Academic roadmap for {course?.name || course?.title}
            </p>
          </div>
          <button 
            className="btn btn-secondary flex items-center gap-2"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4" /> Print Syllabus
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="card">
            <div className="card-header flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h3 className="card-title text-sm uppercase tracking-wider">Timeline</h3>
            </div>
            <div className="card-body p-2">
              <div className="space-y-1">
                {syllabus.length === 0 ? (
                  <p className="text-sm text-gray-500 italic p-4 text-center">No modules defined</p>
                ) : (
                  syllabus.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveWeek(index)}
                      className={`w-full p-4 text-left rounded-xl transition-all ${
                        activeWeek === index
                          ? "bg-indigo-600 text-white shadow-md"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className={`text-[10px] font-bold uppercase mb-1 ${
                        activeWeek === index ? "text-indigo-100" : "text-indigo-600"
                      }`}>
                        Session {index + 1}
                      </div>
                      <div className="font-bold text-sm truncate">
                        {item.topic || item.title}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {syllabus[activeWeek] ? (
            <div className="card min-h-[500px]">
              <div className="card-body p-8 lg:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <span className="badge badge-primary">Module {activeWeek + 1}</span>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold uppercase">
                    <Clock className="w-3.5 h-3.5" /> Week {syllabus[activeWeek].week || activeWeek + 1}
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  {syllabus[activeWeek].topic || syllabus[activeWeek].title}
                </h2>

                <div className="space-y-10">
                  <section>
                    <div className="flex items-center gap-2 mb-4 text-gray-400 uppercase tracking-wider text-[10px] font-bold">
                      <FileText className="w-4 h-4" /> Description
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {syllabus[activeWeek].description || "Conceptual framework and practical implementation strategies for this session."}
                    </p>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 mb-4 text-gray-400 uppercase tracking-wider text-[10px] font-bold">
                         <Target className="w-4 h-4" /> Learning Outcomes
                      </div>
                      <ul className="space-y-4">
                        {[
                          "Core principles and methodologies",
                          "Practical implementation skills",
                          "Collaborative problem solving"
                        ].map((text, i) => (
                          <li key={i} className="flex gap-3 items-start">
                            <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/50">
                      <div className="flex items-center gap-2 mb-4 text-gray-400 uppercase tracking-wider text-[10px] font-bold">
                         <BarChart3 className="w-4 h-4" /> Assessment Weight
                      </div>
                      <div className="space-y-4">
                        {[
                          { label: "Participation", weight: "10%" },
                          { label: "Lab Work", weight: "20%" },
                          { label: "Final Quiz", weight: "70%" }
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center py-1.5 border-b border-indigo-100/30 dark:border-indigo-800/30 last:border-0 pb-0">
                            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{item.label}</span>
                            <span className="text-lg font-bold text-indigo-600">{item.weight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-20 text-center border-dashed">
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <BookOpen className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Syllabus Not Available</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Detailed roadmap for this module is currently under review.
              </p>
            </div>
          )}

          <div className="card bg-gray-900 dark:bg-white/5 text-white p-6 border-0">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Academic Policy</h4>
                  <p className="text-xs text-gray-400 max-w-md">
                    Submissions are subject to verification. Late work incurs 10% daily deduction. 
                    75% attendance required for exam eligibility.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

SyllabusViewer.displayName = "SyllabusViewer";

export default SyllabusViewer;
