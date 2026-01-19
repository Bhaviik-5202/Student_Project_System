import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SubmissionHistory = () => {
  const navigate = useNavigate();
  const [submissions] = useState([
    {
      id: 1,
      assignment: "Database Design Project",
      course: "CS402",
      submittedDate: "2024-01-15 14:30:00",
      grade: "A-",
      status: "Graded",
      files: 3,
    },
    {
      id: 2,
      assignment: "Web App Prototype",
      course: "CS403",
      submittedDate: "2024-01-14 11:45:00",
      grade: "B+",
      status: "Graded",
      files: 2,
    },
    {
      id: 3,
      assignment: "Algorithm Analysis",
      course: "CS404",
      submittedDate: "2024-01-12 09:20:00",
      grade: "A",
      status: "Graded",
      files: 1,
    },
    {
      id: 4,
      assignment: "Research Paper",
      course: "CS401",
      submittedDate: "2024-01-10 16:15:00",
      grade: "Pending",
      status: "Under Review",
      files: 2,
    },
    {
      id: 5,
      assignment: "ML Model Implementation",
      course: "CS405",
      submittedDate: "2024-01-08 13:50:00",
      grade: "B",
      status: "Graded",
      files: 4,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Submission History
            </h1>
            <p className="text-gray-600">
              View your assignment submissions and grades
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Download All
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Files
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {submission.assignment}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {submission.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {submission.submittedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          submission.grade === "A"
                            ? "bg-green-100 text-green-800"
                            : submission.grade === "A-"
                            ? "bg-green-100 text-green-800"
                            : submission.grade === "B+"
                            ? "bg-blue-100 text-blue-800"
                            : submission.grade === "B"
                            ? "bg-blue-100 text-blue-800"
                            : submission.grade === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {submission.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          submission.status === "Graded"
                            ? "bg-green-100 text-green-800"
                            : submission.status === "Under Review"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {submission.files} file(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        View
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionHistory;
