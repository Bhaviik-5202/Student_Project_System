import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AssignmentList = () => {
  const navigate = useNavigate();
  const [assignments] = useState([
    {
      id: 1,
      title: "Database Design",
      course: "CS402",
      dueDate: "Jan 20, 2024",
      status: "Pending",
      points: 100,
    },
    {
      id: 2,
      title: "Web App Prototype",
      course: "CS403",
      dueDate: "Jan 22, 2024",
      status: "In Progress",
      points: 150,
    },
    {
      id: 3,
      title: "Algorithm Analysis",
      course: "CS404",
      dueDate: "Jan 25, 2024",
      status: "Not Started",
      points: 120,
    },
    {
      id: 4,
      title: "Research Paper",
      course: "CS401",
      dueDate: "Jan 18, 2024",
      status: "Submitted",
      points: 200,
    },
    {
      id: 5,
      title: "ML Model Implementation",
      course: "CS405",
      dueDate: "Jan 30, 2024",
      status: "Not Started",
      points: 180,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
            <p className="text-gray-600">View and manage all assignments</p>
          </div>
          <button
            onClick={() => navigate("/assignments/new")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            New Assignment
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {assignment.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {assignment.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {assignment.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          assignment.status === "Submitted"
                            ? "bg-green-100 text-green-800"
                            : assignment.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : assignment.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {assignment.points}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() =>
                          navigate(`/assignments/${assignment.id}`)
                        }
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/assignments/${assignment.id}/submit`)
                        }
                        className="text-green-600 hover:text-green-900"
                      >
                        Submit
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

export default AssignmentList;
