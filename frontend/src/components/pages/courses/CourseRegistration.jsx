import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const CourseRegistration = () => {
  const navigate = useNavigate();
  const [availableCourses] = useState([
    {
      id: 1,
      code: "CS401",
      title: "Software Engineering",
      instructor: "Dr. Smith",
      credits: 3,
      schedule: "Mon/Wed 10:00 AM",
      seats: 15,
    },
    {
      id: 2,
      code: "CS402",
      title: "Database Systems",
      instructor: "Dr. Johnson",
      credits: 3,
      schedule: "Tue/Thu 2:00 PM",
      seats: 20,
    },
    {
      id: 3,
      code: "CS403",
      title: "Web Development",
      instructor: "Dr. Williams",
      credits: 3,
      schedule: "Mon/Wed 1:00 PM",
      seats: 12,
    },
    {
      id: 4,
      code: "CS404",
      title: "Data Structures",
      instructor: "Dr. Brown",
      credits: 4,
      schedule: "Tue/Thu 9:00 AM",
      seats: 18,
    },
    {
      id: 5,
      code: "CS405",
      title: "Machine Learning",
      instructor: "Dr. Davis",
      credits: 4,
      schedule: "Mon/Wed 3:00 PM",
      seats: 10,
    },
  ]);

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleCourseSelection = (courseId) => {
    setSelectedCourses(
      selectedCourses.includes(courseId)
        ? selectedCourses.filter((id) => id !== courseId)
        : [...selectedCourses, courseId]
    );
  };

  const handleRegistration = async () => {
    if (selectedCourses.length === 0) {
      toast.error("Please select at least one course");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      toast.success(
        `Successfully registered for ${selectedCourses.length} course(s)`
      );
      setLoading(false);
      setSelectedCourses([]);
      navigate("/courses/my");
    }, 1500);
  };

  const totalCredits = selectedCourses.reduce((total, courseId) => {
    const course = availableCourses.find((c) => c.id === courseId);
    return total + (course?.credits || 0);
  }, 0);

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
          <h1 className="text-2xl font-bold text-gray-900">
            Course Registration
          </h1>
          <p className="text-gray-600">
            Register for courses for the upcoming semester
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Available Courses
              </h3>
              <div className="space-y-4">
                {availableCourses.map((course) => (
                  <div
                    key={course.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          checked={selectedCourses.includes(course.id)}
                          onChange={() => toggleCourseSelection(course.id)}
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">
                            {course.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {course.code} • {course.instructor}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {course.schedule} • {course.credits} Credits •{" "}
                            {course.seats} seats available
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {course.credits} Credits
                        </div>
                        <div
                          className={`text-sm ${
                            course.seats > 5 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {course.seats} seats left
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Registration Summary */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Registration Summary
              </h3>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-gray-600">Selected Courses</div>
                  <div className="font-medium">{selectedCourses.length}</div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-gray-600">Total Credits</div>
                  <div className="font-medium">{totalCredits}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-gray-600">Maximum Allowed</div>
                  <div className="font-medium">18 Credits</div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Selected Courses
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedCourses.map((courseId) => {
                    const course = availableCourses.find(
                      (c) => c.id === courseId
                    );
                    return (
                      <div
                        key={courseId}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <div className="text-sm font-medium text-gray-900">
                          {course?.code}
                        </div>
                        <div className="text-sm text-gray-600">
                          {course?.credits} credits
                        </div>
                      </div>
                    );
                  })}
                  {selectedCourses.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No courses selected
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">
                  Registration Deadline
                </div>
                <div className="font-medium text-gray-900">
                  January 30, 2024
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Late registration may incur fees
                </div>
              </div>

              <button
                onClick={handleRegistration}
                disabled={
                  loading || selectedCourses.length === 0 || totalCredits > 18
                }
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Registration...
                  </div>
                ) : totalCredits > 18 ? (
                  "Credit Limit Exceeded"
                ) : (
                  `Register for ${selectedCourses.length} Course(s)`
                )}
              </button>

              {totalCredits > 18 && (
                <div className="mt-3 text-sm text-red-600 text-center">
                  Maximum credit limit is 18 credits
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseRegistration;
