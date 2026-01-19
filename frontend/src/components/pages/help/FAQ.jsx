import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FAQ = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click on Register button on login page and fill out the registration form.",
        },
        {
          q: "What information do I need to register?",
          a: "You need your full name, email address, student ID, and department information.",
        },
        {
          q: "How do I access my dashboard?",
          a: "After login, you will be automatically redirected to your dashboard.",
        },
      ],
    },
    {
      category: "Projects",
      questions: [
        {
          q: "How do I submit a project proposal?",
          a: "Navigate to Projects → New Proposal, fill out the form, and submit for review.",
        },
        {
          q: "What is the project submission deadline?",
          a: "Deadlines vary by course. Check your course materials for specific dates.",
        },
        {
          q: "Can I edit my project after submission?",
          a: "Yes, until the deadline. After deadline, contact your instructor.",
        },
      ],
    },
    {
      category: "Grades",
      questions: [
        {
          q: "How often are grades updated?",
          a: "Grades are typically updated within 2 weeks of assignment submission.",
        },
        {
          q: "How can I dispute a grade?",
          a: "Contact your instructor directly through the messaging system.",
        },
        {
          q: "Where can I see my GPA?",
          a: "Your GPA is displayed on your profile and grades dashboard.",
        },
      ],
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/help")}
            className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
          >
            ← Back to Help Center
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600">
            Find answers to common questions about the system
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.questions.map((faq, faqIndex) => {
                  const index = sectionIndex * 10 + faqIndex;
                  return (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg"
                    >
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 rounded-lg"
                      >
                        <span className="font-medium text-gray-900">
                          {faq.q}
                        </span>
                        <span className="text-gray-500">
                          {activeIndex === index ? "−" : "+"}
                        </span>
                      </button>
                      {activeIndex === index && (
                        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                          <p className="text-gray-600">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
