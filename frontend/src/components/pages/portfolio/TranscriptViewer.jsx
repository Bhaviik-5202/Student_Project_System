import React, { useState, useMemo, useCallback } from "react";

const TranscriptViewer = () => {
  const [selectedYear, setSelectedYear] = useState("all");
  const [viewMode, setViewMode] = useState("detailed");

  const studentInfo = useMemo(() => ({
    name: "Alex Johnson",
    studentId: "S2024001",
    program: "Bachelor of Computer Science",
    enrollmentDate: "Fall 2020",
    expectedGraduation: "Spring 2024",
    advisor: "Dr. Sarah Wilson",
    department: "Computer Science",
  }), []);

  const academicYears = useMemo(() => [
    { id: "all", name: "All Years" },
    { id: "2023-2024", name: "2023-2024", gpa: 3.8 },
    { id: "2022-2023", name: "2022-2023", gpa: 3.6 },
    { id: "2021-2022", name: "2021-2022", gpa: 3.7 },
    { id: "2020-2021", name: "2020-2021", gpa: 3.5 },
  ], []);

  const courses = useMemo(() => [
    {
      id: 1,
      code: "CS401",
      name: "Advanced Algorithms",
      semester: "Fall 2023",
      credits: 3,
      grade: "A",
      points: 4.0,
      status: "Completed",
      instructor: "Dr. Robert Kim",
    },
    {
      id: 2,
      code: "CS402",
      name: "Machine Learning",
      semester: "Fall 2023",
      credits: 4,
      grade: "A-",
      points: 3.7,
      status: "Completed",
      instructor: "Dr. Sarah Wilson",
    },
    {
      id: 3,
      code: "CS403",
      name: "Software Engineering",
      semester: "Fall 2023",
      credits: 3,
      grade: "B+",
      points: 3.3,
      status: "Completed",
      instructor: "Prof. Mike Chen",
    },
    {
      id: 4,
      code: "MATH301",
      name: "Discrete Mathematics",
      semester: "Fall 2023",
      credits: 3,
      grade: "A",
      points: 4.0,
      status: "Completed",
      instructor: "Dr. Lisa Park",
    },
    {
      id: 5,
      code: "CS301",
      name: "Data Structures",
      semester: "Spring 2023",
      credits: 4,
      grade: "A-",
      points: 3.7,
      status: "Completed",
      instructor: "Dr. Robert Kim",
    },
    {
      id: 6,
      code: "CS302",
      name: "Database Systems",
      semester: "Spring 2023",
      credits: 3,
      grade: "B+",
      points: 3.3,
      status: "Completed",
      instructor: "Prof. Emma Wilson",
    },
    {
      id: 7,
      code: "CS201",
      name: "Object-Oriented Programming",
      semester: "Fall 2022",
      credits: 3,
      grade: "A",
      points: 4.0,
      status: "Completed",
      instructor: "Dr. Sarah Wilson",
    },
    {
      id: 8,
      code: "CS202",
      name: "Computer Networks",
      semester: "Fall 2022",
      credits: 3,
      grade: "B",
      points: 3.0,
      status: "Completed",
      instructor: "Prof. David Lee",
    },
  ], []);

  const filteredCourses = useMemo(() =>
    selectedYear === "all"
      ? courses
      : courses.filter((course) =>
          course.semester.includes(selectedYear.split("-")[0])
        ), [courses, selectedYear]);

  const calculateStats = useCallback(() => {
    const relevantCourses = selectedYear === "all" ? courses : filteredCourses;
    const totalCredits = relevantCourses.reduce(
      (sum, course) => sum + course.credits,
      0
    );
    const totalPoints = relevantCourses.reduce(
      (sum, course) => sum + course.points * course.credits,
      0
    );
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;

    const gradeDistribution = {
      A: relevantCourses.filter((c) => c.grade === "A").length,
      "A-": relevantCourses.filter((c) => c.grade === "A-").length,
      "B+": relevantCourses.filter((c) => c.grade === "B+").length,
      B: relevantCourses.filter((c) => c.grade === "B").length,
      Other: relevantCourses.filter(
        (c) => !["A", "A-", "B+", "B"].includes(c.grade)
      ).length,
    };

    return { totalCredits, gpa, gradeDistribution };
  }, [courses, filteredCourses, selectedYear]);

  const stats = useMemo(() => calculateStats(), [calculateStats]);

  const getGradeColor = useCallback((grade) => {
    switch (grade) {
      case "A":
        return "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200";
      case "A-":
        return "bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-200";
      case "B+":
        return "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200";
      case "B":
        return "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-200";
      case "B-":
        return "bg-amber-50 dark:bg-amber-900/50 text-amber-600 dark:text-amber-200";
      case "C+":
        return "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200";
      case "C":
        return "bg-orange-50 dark:bg-orange-900/50 text-orange-600 dark:text-orange-200";
      default:
        return "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300";
    }
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleDownload = useCallback((format) => {
    alert(`Downloading transcript as ${format.toUpperCase()}`);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Academic Transcript
            </h2>
            <p className="text-gray-600 mt-1">
              Official record of academic performance
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={handlePrint}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <i className="fas fa-print mr-2"></i>
              Print
            </button>
            <div className="relative">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <i className="fas fa-download mr-2"></i>
                Download
              </button>
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg hidden">
                {["PDF", "Excel", "CSV"].map((format) => (
                  <button
                    key={format}
                    onClick={() => handleDownload(format)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Student Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">Student Name</div>
            <div className="font-bold text-gray-800">{studentInfo.name}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600">Student ID</div>
            <div className="font-bold text-gray-800">
              {studentInfo.studentId}
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600">Program</div>
            <div className="font-bold text-gray-800">{studentInfo.program}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div className="flex space-x-3 mb-4 lg:mb-0">
          {academicYears.map((year) => (
            <button
              key={year.id}
              onClick={() => setSelectedYear(year.id)}
              className={`px-4 py-2 rounded-lg ${
                selectedYear === year.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {year.name}
              {year.gpa && ` (GPA: ${year.gpa})`}
            </button>
          ))}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode("detailed")}
            className={`px-4 py-2 rounded-lg ${
              viewMode === "detailed"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Detailed View
          </button>
          <button
            onClick={() => setViewMode("summary")}
            className={`px-4 py-2 rounded-lg ${
              viewMode === "summary"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Summary View
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.gpa}</div>
            <div className="text-sm text-gray-600">Cumulative GPA</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.totalCredits}
            </div>
            <div className="text-sm text-gray-600">Total Credits</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {filteredCourses.length}
            </div>
            <div className="text-sm text-gray-600">Courses Completed</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">95%</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      {viewMode === "detailed" ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {course.code}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{course.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {course.semester}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {course.credits}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(
                        course.grade
                      )}`}
                    >
                      {course.grade} ({course.points})
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.instructor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-6">
          {academicYears
            .filter((year) => year.id !== "all")
            .map((year) => {
              const yearCourses = courses.filter((course) =>
                course.semester.includes(year.id.split("-")[0])
              );
              const yearCredits = yearCourses.reduce(
                (sum, course) => sum + course.credits,
                0
              );
              const yearPoints = yearCourses.reduce(
                (sum, course) => sum + course.points * course.credits,
                0
              );
              const yearGPA =
                yearCredits > 0 ? (yearPoints / yearCredits).toFixed(2) : 0;

              return (
                <div
                  key={year.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800">{year.name}</h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">
                        {yearCourses.length} courses
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                        GPA: {yearGPA}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {yearCourses.map((course) => (
                      <div
                        key={course.id}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium">{course.code}</div>
                            <div className="text-sm text-gray-600">
                              {course.name}
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs ${getGradeColor(
                              course.grade
                            )}`}
                          >
                            {course.grade}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {course.credits} credits • {course.instructor}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Grade Distribution */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Grade Distribution
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">By Grade</h4>
            <div className="space-y-3">
              {Object.entries(stats.gradeDistribution).map(([grade, count]) => (
                <div key={grade} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 ${getGradeColor(
                        grade
                      )} rounded-lg flex items-center justify-center mr-3`}
                    >
                      {grade}
                    </div>
                    <span className="text-gray-700">{grade}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          getGradeColor(grade).split(" ")[0]
                        } rounded-full`}
                        style={{
                          width: `${(count / filteredCourses.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="font-medium">{count}</span>
                    <span className="text-gray-500">
                      ({Math.round((count / filteredCourses.length) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-3">
              Academic Progress
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Credit Completion</span>
                  <span>{stats.totalCredits} / 120 credits</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${(stats.totalCredits / 120) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>GPA Trend</span>
                  <span>3.8 → 3.6 → 3.7 → 3.5</span>
                </div>
                <div className="h-24 bg-gray-50 rounded-lg p-4">
                  {/* Simple chart visualization */}
                  <div className="flex items-end h-full space-x-2">
                    {[3.5, 3.7, 3.6, 3.8].map((gpa, index) => (
                      <div
                        key={index}
                        className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                        style={{ height: `${gpa * 20}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript Footer */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex justify-between">
          <div>
            <p>Issued by: {studentInfo.department}</p>
            <p>Date of Issue: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <p>Advisor: {studentInfo.advisor}</p>
            <p>Status: Active</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p>
            This is an unofficial transcript. Official transcripts require
            university seal.
          </p>
        </div>
      </div>
    </div>
  );
};

TranscriptViewer.displayName = 'TranscriptViewer';

export default React.memo(TranscriptViewer);
