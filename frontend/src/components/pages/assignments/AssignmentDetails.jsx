// src/components/pages/assignments/AssignmentDetails.jsx
import { memo } from "react";
import { useParams } from "react-router-dom";

const AssignmentDetails = memo(() => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Assignment Details</h1>
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
          ID: {id || "ASG-001"}
        </span>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-md p-6">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Assignment Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-slate-800 dark:text-white mb-3">Basic Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">Title</label>
                <p className="font-medium text-slate-900 dark:text-white">
                  Web Development Project - E-commerce Platform
                </p>
              </div>
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">Course</label>
                <p className="font-medium text-slate-900 dark:text-white">CS401 - Advanced Web Technologies</p>
              </div>
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">Due Date</label>
                <p className="font-medium text-rose-600 dark:text-rose-400">April 30, 2024</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-slate-800 dark:text-white mb-3">
              Submission Status
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">Status</label>
                <span className="ml-2 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded text-xs">
                  Pending
                </span>
              </div>
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">Submitted Files</label>
                <p className="font-medium text-slate-900 dark:text-white">3 files</p>
              </div>
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">Grade</label>
                <p className="font-medium text-slate-900 dark:text-white">Not yet graded</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-medium text-slate-800 dark:text-white mb-4">
            Assignment Description
          </h3>
          <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
            <p className="text-slate-700 dark:text-slate-300">
              Create a fully functional e-commerce platform with user
              authentication, product catalog, shopping cart, and payment
              integration. The platform should include admin panel for managing
              products, orders, and users.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-medium text-slate-800 dark:text-white mb-4">Requirements</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li className="text-slate-700 dark:text-slate-300">
              User registration and login system
            </li>
            <li className="text-slate-700 dark:text-slate-300">Product catalog with categories</li>
            <li className="text-slate-700 dark:text-slate-300">Shopping cart functionality</li>
            <li className="text-slate-700 dark:text-slate-300">Payment gateway integration</li>
            <li className="text-slate-700 dark:text-slate-300">Admin dashboard</li>
            <li className="text-slate-700 dark:text-slate-300">Order management system</li>
          </ul>
        </div>

        <div className="mt-8 flex gap-4">
          <button className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800">
            Submit Assignment
          </button>
          <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
            Download Resources
          </button>
        </div>
      </div>
    </div>
  );
});

AssignmentDetails.displayName = "AssignmentDetails";

export default AssignmentDetails;
