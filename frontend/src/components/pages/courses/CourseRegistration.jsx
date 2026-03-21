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
      <div className="course-loading-container">
        <div className="course-spinner"></div>
        <p className="course-loading-text">Loading registration data...</p>
      </div>
    );
  }

  return (
    <div className="course-page">
      <div className="course-header">
        <div>
          <h1 className="course-title">Course Registration</h1>
          <p className="course-subtitle">Select modules to build your academic schedule</p>
        </div>
        <button
          onClick={() => navigate("/courses/catalog")}
          className="course-btn course-btn-secondary"
        >
          <ChevronLeft className="course-icon-md course-mr-1" /> Back to Catalog
        </button>
      </div>

      <div className="course-details-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="course-card-simple" style={{ position: "sticky", top: "24px", zIndex: "5", backgroundColor: "white" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="course-search-container" style={{ maxWidth: "none" }}>
                <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "var(--course-text-muted)" }} />
                <input
                  type="text"
                  placeholder="Filter by name, code, or instructor..."
                  className="course-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "24px" }}>
                <div>
                  <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--course-text-muted)", textTransform: "uppercase" }}>Credits</span>
                  <p style={{ fontSize: "18px", fontWeight: "700", color: currentCredits > maxCredits ? "#ef4444" : "var(--course-primary)" }}>
                    {currentCredits} / {maxCredits}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--course-text-muted)", textTransform: "uppercase" }}>Selected</span>
                  <p style={{ fontSize: "18px", fontWeight: "700" }}>{selectedCourses.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="course-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {filteredCourses.length === 0 ? (
              <div className="course-card-simple" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "48px" }}>
                <p style={{ color: "var(--course-text-muted)" }}>No modules match your search criteria.</p>
              </div>
            ) : (
              filteredCourses.map(course => {
                const id = course.id || course._id;
                const isSelected = selectedCourses.includes(id);
                return (
                  <div
                    key={id}
                    onClick={() => toggleCourse(id)}
                    className="course-card-simple"
                    style={{ 
                      cursor: "pointer", 
                      borderColor: isSelected ? "var(--course-primary)" : "var(--course-border)",
                      borderWidth: isSelected ? "2px" : "1px",
                      backgroundColor: isSelected ? "rgba(37, 99, 235, 0.05)" : "white"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div>
                        <span className="course-badge course-badge-blue" style={{ marginBottom: "4px" }}>{course.code}</span>
                        <h4 style={{ fontWeight: "700", fontSize: "15px" }}>{course.name || course.title}</h4>
                      </div>
                      <div style={{ 
                        width: "20px", 
                        height: "20px", 
                        borderRadius: "50%", 
                        border: "1px solid var(--course-border)", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        backgroundColor: isSelected ? "var(--course-primary)" : "transparent",
                        borderColor: isSelected ? "var(--course-primary)" : "var(--course-border)"
                      }}>
                        {isSelected && <CheckCircle2 className="course-icon-sm" style={{ color: "white" }} />}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "12px", color: "var(--course-text-muted)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <CreditCard className="course-icon-sm" /> {course.credits} Cr
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock className="course-icon-sm" /> {course.schedule?.split(" ")[0] || "TBA"}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="course-card-simple" style={{ position: "sticky", top: "24px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--course-border)" }}>Registration Summary</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px", maxHeight: "300px", overflowY: "auto" }}>
              {selectedCourses.length === 0 ? (
                <p style={{ fontSize: "12px", color: "var(--course-text-muted)", fontStyle: "italic", textAlign: "center", padding: "16px" }}>Select modules to begin</p>
              ) : (
                selectedCourses.map(id => {
                  const course = availableCourses.find(c => (c.id || c._id) === id);
                  return (
                    <div key={id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", fontSize: "12px" }}>
                      <div style={{ overflow: "hidden" }}>
                        <p style={{ fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{course?.name || course?.title}</p>
                        <span style={{ fontSize: "10px", color: "var(--course-text-muted)", fontWeight: "700" }}>{course?.code} ({course?.credits} Cr)</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleCourse(id); }}
                        style={{ border: "none", backgroundColor: "transparent", cursor: "pointer", color: "var(--course-text-muted)", padding: "4px" }}
                      >
                        <X className="course-icon-sm" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div style={{ paddingTop: "16px", borderTop: "1px solid var(--course-border)", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span>Total Credits</span>
                <span style={{ fontWeight: "800", color: currentCredits > maxCredits ? "#ef4444" : "inherit" }}>{currentCredits} / {maxCredits}</span>
              </div>

              {currentCredits > maxCredits && (
                <div style={{ padding: "8px", backgroundColor: "#fef2f2", color: "#991b1b", borderRadius: "8px", fontSize: "11px", display: "flex", gap: "6px", alignItems: "center" }}>
                  <AlertCircle className="course-icon-sm" /> Credit limit reached.
                </div>
              )}

              <button
                onClick={handleRegister}
                disabled={registering || selectedCourses.length === 0 || currentCredits > maxCredits}
                className="course-btn course-btn-primary"
                style={{ width: "100%", height: "48px" }}
              >
                {registering ? (
                  <div className="course-progress-bar-fill" style={{ width: "30%", height: "4px", margin: "0 auto" }}></div>
                ) : (
                  <>Confirm Enrollment <ArrowRight className="course-icon-sm course-ml-2" /></>
                )}
              </button>
            </div>
          </div>

          <div className="course-card-simple" style={{ backgroundColor: "var(--course-bg-light)", borderStyle: "dashed" }}>
            <h4 style={{ fontSize: "12px", fontWeight: "700", marginBottom: "12px", color: "var(--course-primary)" }}>Information</h4>
            <ul style={{ listStyle: "none", padding: "0", margin: "0", display: "flex", flexDirection: "column", gap: "8px", fontSize: "11px", color: "var(--course-text-muted)" }}>
              <li>• Registration is binding for current semester.</li>
              <li>• Attendance requirement: 75% per module.</li>
              <li>• Check timetable for potential conflicts.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});

CourseRegistration.displayName = "CourseRegistration";

export default CourseRegistration;
