// src/components/pages/assignments/AssignmentDetails.jsx
import React from "react";
import { useParams } from "react-router-dom";

const AssignmentDetails = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Assignment Details</h1>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          ID: {id || "ASG-001"}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Assignment Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Basic Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Title</label>
                <p className="font-medium">
                  Web Development Project - E-commerce Platform
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Course</label>
                <p className="font-medium">CS401 - Advanced Web Technologies</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Due Date</label>
                <p className="font-medium text-red-600">April 30, 2024</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-3">
              Submission Status
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Status</label>
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                  Pending
                </span>
              </div>
              <div>
                <label className="text-sm text-gray-600">Submitted Files</label>
                <p className="font-medium">3 files</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Grade</label>
                <p className="font-medium">Not yet graded</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-medium text-gray-800 mb-4">
            Assignment Description
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              Create a fully functional e-commerce platform with user
              authentication, product catalog, shopping cart, and payment
              integration. The platform should include admin panel for managing
              products, orders, and users.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-medium text-gray-800 mb-4">Requirements</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li className="text-gray-700">
              User registration and login system
            </li>
            <li className="text-gray-700">Product catalog with categories</li>
            <li className="text-gray-700">Shopping cart functionality</li>
            <li className="text-gray-700">Payment gateway integration</li>
            <li className="text-gray-700">Admin dashboard</li>
            <li className="text-gray-700">Order management system</li>
          </ul>
        </div>

        <div className="mt-8 flex gap-4">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Submit Assignment
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Download Resources
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetails;
