import React, { memo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

const FAQ = memo(() => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await api.get("/help/faq");
        setFaqs(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch FAQs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

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
          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading FAQs...</div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No FAQs available.</div>
          ) : (
            faqs.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  {section.category}
                </h2>
                <div className="space-y-3">
                  {section.questions?.map((faq, faqIndex) => {
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
                            {faq.q || faq.question}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            {activeIndex === index ? "−" : "+"}
                          </span>
                        </button>
                        {activeIndex === index && (
                          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                            <p className="text-slate-600 dark:text-slate-400">
                              {faq.a || faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
});

FAQ.displayName = "FAQ";

export default FAQ;
