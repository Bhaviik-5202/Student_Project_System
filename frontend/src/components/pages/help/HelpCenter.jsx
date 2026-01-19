import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HelpCenter = () => {
  const navigate = useNavigate();
  const [faqs] = useState([
    {
      id: 1,
      question: "How do I submit a project proposal?",
      category: "Projects",
      answer: "Navigate to Projects → New Proposal and fill out the form.",
    },
    {
      id: 2,
      question: "How can I view my grades?",
      category: "Grades",
      answer: "Go to Grades section to view all your course grades.",
    },
    {
      id: 3,
      question: "How do I schedule a meeting?",
      category: "Meetings",
      answer: "Navigate to Meetings → Schedule Meeting and select a time slot.",
    },
    {
      id: 4,
      question: "How can I reset my password?",
      category: "Account",
      answer:
        "Click on Forgot Password on login page or go to Profile → Security.",
    },
    {
      id: 5,
      question: "How do I upload assignments?",
      category: "Assignments",
      answer: "Go to Assignments → Select assignment → Click Submit.",
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Projects",
    "Grades",
    "Meetings",
    "Account",
    "Assignments",
    "Technical",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to frequently asked questions and get support for
            common issues
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-3 top-3 text-gray-400">🔍</button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs
              .filter(
                (faq) =>
                  selectedCategory === "All" ||
                  faq.category === selectedCategory
              )
              .map((faq) => (
                <div
                  key={faq.id}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {faq.category}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Still need help?
            </h3>
            <p className="text-gray-600 mb-4">
              Contact our support team for further assistance
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
