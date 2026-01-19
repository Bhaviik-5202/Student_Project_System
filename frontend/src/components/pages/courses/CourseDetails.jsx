import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourse({
        id,
        code: "CS401",
        title: "Software Engineering",
        instructor: "Dr. John Smith",
        semester: "Fall 2024",
        credits: 3,
        description:
          "This course covers software engineering principles and practices.",
        schedule: "Mon/Wed 10:00 AM - 11:30 AM",
        room: "Room 301",
        students: 45,
        assignments: 8,
        materials: 12,
      });
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/courses")}
            className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
          >
            ← Back to Courses
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {course.title}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-gray-600">{course.code}</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                  {course.credits} Credits
                </span>
                <span className="text-gray-600">{course.semester}</span>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Enroll Now
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Course Description
              </h3>
              <p className="text-gray-600">{course.description}</p>
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {course.students}
                </div>
                <div className="text-gray-600">Enrolled Students</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {course.assignments}
                </div>
                <div className="text-gray-600">Assignments</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {course.materials}
                </div>
                <div className="text-gray-600">Learning Materials</div>
              </div>
            </div>

            {/* Syllabus */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Course Syllabus
              </h3>
              <div className="space-y-3">
                {[
                  "Week 1: Introduction to Software Engineering",
                  "Week 2-3: Requirements Engineering",
                  "Week 4-5: System Design Principles",
                  "Week 6-7: Software Development Methodologies",
                  "Week 8-9: Testing and Quality Assurance",
                  "Week 10-12: Project Development",
                  "Week 13-14: Deployment and Maintenance",
                  "Week 15: Final Presentations",
                ].map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <div className="font-medium text-gray-900">{topic}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructor Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Instructor
              </h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <div className="font-medium text-gray-900">
                    {course.instructor}
                  </div>
                  <div className="text-sm text-gray-600">
                    Professor of Computer Science
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">📧</span>
                  john.smith@university.edu
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">🏢</span>
                  Office: Room 205, CS Building
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">⏰</span>
                  Office Hours: Mon/Wed 2-4 PM
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Course Details
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Schedule</div>
                  <div className="font-medium">{course.schedule}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Room</div>
                  <div className="font-medium">{course.room}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Credits</div>
                  <div className="font-medium">{course.credits}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Semester</div>
                  <div className="font-medium">{course.semester}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/courses/${id}/materials`)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View Materials
                </button>
                <button
                  onClick={() => navigate(`/courses/${id}/assignments`)}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  View Assignments
                </button>
                <button
                  onClick={() => navigate(`/courses/${id}/grades`)}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  View Grades
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
