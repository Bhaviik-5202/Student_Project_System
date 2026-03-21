import React, { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Plus,
  User,
  Info,
  Library,
  GraduationCap,
  Clock,
  Layout,
  ArrowRight
} from "lucide-react";
import courseService from "../../../services/courseService";

const MyCourses = memo(() => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await courseService.getMyCourses();
        if (res.success) {
          setCourses(res.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch my courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  if (loading) {
    return (
      <div className="course-loading-container">
        <div className="course-spinner"></div>
        <p className="course-loading-text">Loading your courses...</p>
      </div>
    );
  }

  return (
    <div className="course-page">
      <div className="course-header">
        <div>
          <h1 className="course-title">My Learning Journey</h1>
          <p className="course-subtitle">Track your academic progress and enrolled modules</p>
        </div>
        <button
          onClick={() => navigate("/courses/register")}
          className="course-btn course-btn-primary"
        >
          <Plus className="course-icon-md course-mr-2" /> New Enrollment
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="course-card-simple" style={{ textAlign: "center", padding: "64px", maxWidth: "600px", margin: "40px auto" }}>
          <div style={{ width: "80px", height: "80px", backgroundColor: "var(--course-bg-light)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <BookOpen className="course-icon-xl" style={{ color: "var(--course-text-muted)" }} />
          </div>
          <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>No active courses</h3>
          <p style={{ color: "var(--course-text-muted)", marginBottom: "32px" }}>You haven't registered for any modules this semester yet.</p>
          <button
            onClick={() => navigate("/courses/register")}
            className="course-btn course-btn-primary"
          >
            Start Registration <ArrowRight className="course-icon-md course-ml-2" />
          </button>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => {
            const progress = course.progress || 0;
            return (
              <div key={course.id || course._id} className="course-card-simple course-card-details">
                <div className="course-card-header">
                  <div>
                    <span className="course-badge course-badge-blue">{course.code}</span>
                    <h3 className="course-card-title" style={{ marginTop: "8px" }}>{course.name || course.title}</h3>
                  </div>
                  <div style={{ padding: "8px", backgroundColor: "var(--course-bg-light)", borderRadius: "8px" }}>
                    <GraduationCap className="course-icon-md" style={{ color: "var(--course-primary)" }} />
                  </div>
                </div>

                <div className="course-card-body">
                  <div className="course-card-info-row">
                    <User className="course-icon-sm" /> 
                    <span>{course.faculty?.name || course.instructor || "Lead Faculty"}</span>
                  </div>
                  <div className="course-card-info-row">
                    <Clock className="course-icon-sm" /> 
                    <span>Next: {course.nextSession || "Mon, 10:00 AM"}</span>
                  </div>

                  <div className="course-progress-container">
                    <div className="course-progress-text">
                      <span>Module Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="course-progress-bar-bg">
                      <div 
                        className="course-progress-bar-fill" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <button
                    onClick={() => navigate(`/courses/${course.id || course._id}`)}
                    className="course-btn course-btn-secondary"
                    style={{ fontSize: "12px" }}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => navigate(`/courses/${course.id || course._id}/materials`)}
                    className="course-btn course-btn-primary"
                    style={{ fontSize: "12px" }}
                  >
                    Resources
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

MyCourses.displayName = "MyCourses";
export default MyCourses;
