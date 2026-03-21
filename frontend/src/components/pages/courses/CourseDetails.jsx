import React, { useState, useEffect, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  BookOpen, 
  User, 
  Clock, 
  MapPin, 
  GraduationCap,
  FileText,
  Users,
  CheckCircle,
  MessageCircle,
  Video,
  Info,
  ArrowRight
} from "lucide-react";
import courseService from "../../../services/courseService";
import { toast } from "react-hot-toast";

const CourseDetails = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await courseService.getCourseById(id);
        if (res.success) {
          setCourse(res.data);
        } else {
          toast.error(res.message || "Course not found");
          navigate("/courses/catalog");
        }
      } catch (err) {
        console.error("Failed to fetch course details", err);
        toast.error("Error loading course details");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="course-loading-container">
        <div className="course-spinner"></div>
        <p className="course-loading-text">Loading module insights...</p>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="course-page">
      <button
        onClick={() => navigate("/courses/catalog")}
        className="course-btn course-btn-secondary"
        style={{ marginBottom: "24px", color: "var(--course-text-muted)" }}
      >
        <ChevronLeft className="course-icon-md" /> Back to Catalog
      </button>

      <div className="course-details-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="course-card-simple">
            <div className="course-section-header" style={{ backgroundColor: "rgba(0,0,0,0.02)", margin: "-16px -16px 24px", padding: "16px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span className="course-badge course-badge-blue">{course.code}</span>
                <span className="course-badge course-badge-gray">{course.semester || "Spring 2024"}</span>
              </div>
              <h1 className="course-title" style={{ fontSize: "28px" }}>
                {course.name || course.title}
              </h1>
            </div>
            <div style={{ padding: "0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--course-primary)", marginBottom: "16px" }}>
                <Info className="course-icon-md" />
                <h3 style={{ fontSize: "18px", fontWeight: "700" }}>Course Synopsis</h3>
              </div>
              <p style={{ color: "var(--course-text-muted)", lineHeight: "1.6", marginBottom: "32px" }}>
                {course.description || "This comprehensive module covers the fundamental and advanced principles of the subject, providing students with both theoretical knowledge and practical applications."}
              </p>

              <div className="course-info-card-grid">
                <div className="course-info-card-item">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--course-text-muted)", marginBottom: "4px" }}>
                    <Clock className="course-icon-sm" />
                    <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase" }}>Schedule</span>
                  </div>
                  <p style={{ fontSize: "14px", fontWeight: "600" }}>{course.schedule || "Mon, Wed 10:00 AM"}</p>
                </div>
                <div className="course-info-card-item">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--course-text-muted)", marginBottom: "4px" }}>
                    <MapPin className="course-icon-sm" />
                    <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase" }}>Location</span>
                  </div>
                  <p style={{ fontSize: "14px", fontWeight: "600" }}>{course.room || "Lab 402, Block B"}</p>
                </div>
                <div className="course-info-card-item">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--course-text-muted)", marginBottom: "4px" }}>
                    <GraduationCap className="course-icon-sm" />
                    <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase" }}>Credits</span>
                  </div>
                  <p style={{ fontSize: "14px", fontWeight: "600" }}>{course.credits || 4} Units</p>
                </div>
              </div>
            </div>
          </div>

          <div className="course-card-simple">
            <div className="course-card-header">
              <h3 style={{ fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                <FileText className="course-icon-md" style={{ color: "var(--course-primary)" }} /> Curriculum Map
              </h3>
              <button
                onClick={() => navigate(`/courses/${id}/syllabus`)}
                className="course-btn course-btn-secondary"
                style={{ fontSize: "12px", padding: "4px 12px" }}
              >
                Full Roadmap <ArrowRight className="course-icon-sm course-ml-1" />
              </button>
            </div>
            <div className="course-card-body">
              <div className="course-curriculum-list">
                {(course.syllabus && course.syllabus.length > 0) ? (
                  course.syllabus.slice(0, 3).map((topic, index) => (
                    <div key={index} className="course-curriculum-item">
                      <div className="course-week-number">
                        {topic.week || index + 1}
                      </div>
                      <div>
                        <h4 style={{ fontWeight: "700", fontSize: "14px" }}>
                          {topic.topic || topic.title}
                        </h4>
                        <p style={{ fontSize: "12px", color: "var(--course-text-muted)", marginTop: "4px", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {topic.description || "Core concepts and specialized case studies."}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: "center", padding: "32px" }}>
                    <p style={{ fontSize: "14px", color: "var(--course-text-muted)", fontStyle: "italic" }}>Syllabus details coming soon.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="course-card-simple course-instructor-card">
            <div className="course-section-header" style={{ marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700" }}>Lead Instructor</h3>
            </div>
            <div className="course-instructor-avatar">
              <User className="course-icon-xl" style={{ color: "var(--course-primary)" }} />
            </div>
            <h4 style={{ fontSize: "18px", fontWeight: "700" }}>{course.faculty?.name || course.instructor || "Visiting Lead"}</h4>
            <p style={{ fontSize: "11px", color: "var(--course-text-muted)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700", margin: "4px 0 16px" }}>Professor</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px" }}>
              <button className="course-btn course-btn-secondary" style={{ width: "100%" }}>
                <MessageCircle className="course-icon-sm" /> Message
              </button>
              <button className="course-btn course-btn-secondary" style={{ width: "100%" }}>
                <Video className="course-icon-sm" /> Office Hours
              </button>
            </div>
          </div>

          <div className="course-promo-banner">
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Registration Open</h3>
            <p style={{ fontSize: "14px", opacity: "0.9", marginBottom: "24px" }}>
              Enrollment for academic session 2024 is currently active.
            </p>
            <button
              onClick={() => navigate("/courses/register")}
              className="course-btn"
              style={{ backgroundColor: "white", color: "var(--course-primary)", width: "100%", fontWeight: "700" }}
            >
              Enroll in Course
            </button>
          </div>

          <div className="course-card-simple">
            <div className="course-card-header">
              <h3 style={{ fontSize: "16px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                <BookOpen className="course-icon-md" style={{ color: "var(--course-primary)" }} /> Learning Resources
              </h3>
            </div>
            <div className="course-card-body">
              <p style={{ fontSize: "14px", color: "var(--course-text-muted)", marginBottom: "16px" }}>Access course materials, readings, and repository.</p>
              <button
                onClick={() => navigate(`/courses/${id}/materials`)}
                className="course-btn course-btn-secondary"
                style={{ width: "100%" }}
              >
                Access Repository
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CourseDetails.displayName = "CourseDetails";

export default CourseDetails;
