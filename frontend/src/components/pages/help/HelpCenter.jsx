import React, { memo, useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

const HelpCenter = memo(() => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHelpData = async () => {
      try {
        const response = await api.get("/help/overview");
        const data = response.data || {};
        if (data.faqs) setFaqs(data.faqs);
        if (data.categories) {
          setCategories(["All", ...data.categories]);
        }
      } catch (error) {
        console.error("Failed to fetch help center data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHelpData();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredFaqs = useMemo(
    () =>
      faqs.filter(
        (faq) =>
          selectedCategory === "All" || faq.category === selectedCategory,
      ),
    [faqs, selectedCategory],
  );

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Help Center
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
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
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <button className="absolute right-3 top-3 text-slate-400 dark:text-slate-500">
              🔍
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 dark:bg-blue-500 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          {loading ? (
            <div className="text-center py-8 text-slate-500">Loading help center...</div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.length > 0 ? filteredFaqs.map((faq) => (
                <div
                  key={faq.id || faq._id}
                  className="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-b-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {faq.answer}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-full">
                      {faq.category}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-4 text-slate-500">No FAQs found for this category.</div>
              )}
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Still need help?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Contact our support team for further assistance
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

HelpCenter.displayName = "HelpCenter";

export default HelpCenter;
