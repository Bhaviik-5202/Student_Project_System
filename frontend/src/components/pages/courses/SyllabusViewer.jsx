import React, { memo, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SyllabusViewer = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();

  const syllabus = useMemo(
    () => ({
      courseTitle: "Software Engineering",
      courseCode: "CS401",
      instructor: "Dr. John Smith",
      semester: "Fall 2024",
      weeks: [
        {
          week: 1,
          title: "Introduction to Software Engineering",
          topics: [
            "Course Overview",
            "Software Engineering Principles",
            "SDLC Models",
          ],
          readings: ["Chapter 1: Fundamentals", "Article: Agile Manifesto"],
          assignments: "Reading assignment: Review syllabus",
        },
        {
          week: 2,
          title: "Requirements Engineering",
          topics: [
            "Requirements Gathering",
            "Use Case Modeling",
            "Requirements Documentation",
          ],
          readings: ["Chapter 2: Requirements", "Case Study: Banking System"],
          assignments: "Assignment 1: Requirements Document",
        },
        {
          week: 3,
          title: "System Design",
          topics: ["Architectural Design", "UML Diagrams", "Design Patterns"],
          readings: ["Chapter 3: System Design", "Book: Design Patterns"],
          assignments: "Project: Design Proposal",
        },
        {
          week: 4,
          title: "Implementation",
          topics: ["Coding Standards", "Version Control", "Code Review"],
          readings: ["Chapter 4: Implementation", "Git Documentation"],
          assignments: "Lab 1: Git Setup",
        },
        {
          week: 5,
          title: "Testing",
          topics: ["Test Planning", "Unit Testing", "Integration Testing"],
          readings: ["Chapter 5: Software Testing", "JUnit Guide"],
          assignments: "Assignment 2: Test Cases",
        },
      ],
      grading: [
        {
          component: "Assignments",
          weight: "30%",
          description: "Weekly assignments",
        },
        { component: "Project", weight: "40%", description: "Group project" },
        {
          component: "Midterm Exam",
          weight: "15%",
          description: "In-class exam",
        },
        {
          component: "Final Exam",
          weight: "15%",
          description: "Comprehensive exam",
        },
      ],
    }),
    [],
  );

  const [activeWeek, setActiveWeek] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/courses/${id}`)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center mb-4"
          >
            ← Back to Course
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Course Syllabus
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-slate-600 dark:text-slate-400">
                  {syllabus.courseCode} - {syllabus.courseTitle}
                </span>
                <span className="text-slate-600 dark:text-slate-400">
                  {syllabus.semester}
                </span>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
              Download PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Week Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Course Weeks
              </h3>
              <div className="space-y-2">
                {syllabus.weeks.map((week, index) => (
                  <button
                    key={week.week}
                    onClick={() => setActiveWeek(index)}
                    className={`w-full p-3 text-left rounded-lg transition-colors ${
                      activeWeek === index
                        ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 border"
                        : "border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <div className="font-medium text-slate-900 dark:text-white">
                      Week {week.week}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 truncate">
                      {week.title}
                    </div>
                  </button>
                ))}
              </div>

              {/* Grading Information */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-medium text-slate-900 dark:text-white mb-3">
                  Grading Policy
                </h4>
                <div className="space-y-3">
                  {syllabus.grading.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {item.component}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          {item.description}
                        </div>
                      </div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {item.weight}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Week Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              {syllabus.weeks[activeWeek] && (
                <>
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Week {syllabus.weeks[activeWeek].week}:{" "}
                        {syllabus.weeks[activeWeek].title}
                      </h2>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                          Previous
                        </button>
                        <button className="px-3 py-1 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                          Next
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Topics */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Topics Covered
                    </h3>
                    <div className="space-y-2">
                      {syllabus.weeks[activeWeek].topics.map((topic, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-gray-700">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Readings */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                      Required Readings
                    </h3>
                    <div className="space-y-2">
                      {syllabus.weeks[activeWeek].readings.map(
                        (reading, index) => (
                          <div
                            key={index}
                            className="flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg"
                          >
                            <span className="text-slate-400 dark:text-slate-500 mr-3">
                              📚
                            </span>
                            <span className="text-slate-700 dark:text-slate-200">
                              {reading}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Assignments */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                      Assignments & Activities
                    </h3>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="font-medium text-slate-900 dark:text-white mb-2">
                        Due This Week
                      </div>
                      <div className="text-slate-700 dark:text-slate-200">
                        {syllabus.weeks[activeWeek].assignments}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        Due: Friday, 11:59 PM
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Course Policies */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mt-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Course Policies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                    Attendance Policy
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Attendance is mandatory. More than 3 unexcused absences may
                    result in grade reduction.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                    Late Submission
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Assignments submitted late will incur a 10% penalty per day,
                    up to 3 days maximum.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                    Academic Integrity
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    All work must be original. Plagiarism will result in failure
                    of the course.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                    Communication
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Use course forum for questions. Allow 24 hours for email
                    responses.
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
