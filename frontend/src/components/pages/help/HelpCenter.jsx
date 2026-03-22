import React, { memo, useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, BookOpen, HelpCircle, PlayCircle, Loader2 } from "lucide-react";
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
        if (response.success && response.data) {
          if (response.data.faqs) setFaqs(response.data.faqs);
          if (response.data.categories) {
            setCategories(["All", ...response.data.categories]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch help center data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHelpData();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredFaqs = useMemo(
    () =>
      faqs.filter(
        (faq) =>
          (selectedCategory === "All" || faq.category === selectedCategory) &&
          (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
           faq.answer.toLowerCase().includes(searchTerm.toLowerCase())),
      ),
    [faqs, selectedCategory, searchTerm],
  );

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Help Center
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Search our knowledge base or contact support for assistance
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mb-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all"
            />
            <div className="absolute left-4 top-3.5 text-slate-400">
              <Search size={18} />
            </div>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { title: "User Guide", icon: <BookOpen className="text-blue-600 dark:text-blue-400" size={20} />, desc: "Browse full documentation", link: "/user-guide", color: "blue" },
            { title: "FAQs", icon: <HelpCircle className="text-indigo-600 dark:text-indigo-400" size={20} />, desc: "Common questions & answers", link: "/faq", color: "indigo" },
            { title: "Tutorials", icon: <PlayCircle className="text-emerald-600 dark:text-emerald-400" size={20} />, desc: "Watch help videos", link: "/help/tutorials", color: "emerald" },
          ].map((card) => (
            <button
              key={card.title}
              onClick={() => navigate(card.link)}
              className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all text-left"
            >
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 rounded bg-${card.color}-100 dark:bg-${card.color}-900/30 flex items-center justify-center mr-3`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {card.title}
                </h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {card.desc}
              </p>
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-1.5 rounded text-sm font-medium border transition-all ${
                selectedCategory === category
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-500"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-12">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Trending Articles
            </h2>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {loading ? (
              <div className="p-8 text-center text-slate-500">
                <Loader2 size={24} className="animate-spin mr-2 inline-block" /> Loading...
              </div>
            ) : filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div key={faq.id || faq._id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {faq.question}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded">
                      {faq.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 italic">
                No matching results found.
              </div>
            )}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Can't find what you're looking for?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Our support team is ready to help you with any technical or administrative issues.
          </p>
          <button 
            onClick={() => navigate("/support")}
            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors shadow-sm"
          >
            Submit Support Ticket
          </button>
        </div>
      </div>
    </div>
  );
});

HelpCenter.displayName = "HelpCenter";

export default HelpCenter;
