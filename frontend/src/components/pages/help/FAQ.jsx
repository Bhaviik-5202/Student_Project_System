import React, { memo, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const FAQ = memo(() => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = useMemo(
    () => [
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
    ],
    [],
  );

  const toggleFAQ = useCallback((index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/help")}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center mb-4"
          >
            ← Back to Help Center
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Find answers to common questions about the system
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.questions.map((faq, faqIndex) => {
                  const index = sectionIndex * 10 + faqIndex;
                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                    >
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg"
                      >
                        <span className="font-medium text-slate-900 dark:text-white">
                          {faq.q}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {activeIndex === index ? "−" : "+"}
                        </span>
                      </button>
                      {activeIndex === index && (
                        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                          <p className="text-slate-600 dark:text-slate-400">
                            {faq.a}
                          </p>
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
});

FAQ.displayName = "FAQ";

export default FAQ;
