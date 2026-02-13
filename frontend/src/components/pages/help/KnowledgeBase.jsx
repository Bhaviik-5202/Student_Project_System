import React, { memo, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const KnowledgeBase = memo(() => {
  const navigate = useNavigate();
  const categories = useMemo(
    () => [
      {
        id: 1,
        name: "Getting Started",
        articles: [
          { id: 1, title: "How to Create an Account", views: 245 },
          { id: 2, title: "Navigating the Dashboard", views: 189 },
          { id: 3, title: "First-Time Setup Guide", views: 156 },
        ],
      },
      {
        id: 2,
        name: "Projects",
        articles: [
          { id: 4, title: "Creating a Project Proposal", views: 312 },
          { id: 5, title: "Managing Project Teams", views: 278 },
          { id: 6, title: "Project Submission Guide", views: 234 },
        ],
      },
      {
        id: 3,
        name: "Assignments",
        articles: [
          { id: 7, title: "Submitting Assignments", views: 456 },
          { id: 8, title: "Understanding Grading Rubrics", views: 321 },
          { id: 9, title: "Late Submission Policy", views: 189 },
        ],
      },
    ],
    [],
  );

  const popularArticles = useMemo(
    () => [
      {
        title: "How to Reset Your Password",
        category: "Account",
        views: 512,
      },
      {
        title: "Project Evaluation Process",
        category: "Projects",
        views: 489,
      },
      {
        title: "Using the Calendar Feature",
        category: "Features",
        views: 421,
      },
      {
        title: "Team Collaboration Tools",
        category: "Collaboration",
        views: 398,
      },
      { title: "Exporting Reports", category: "Reports", views: 356 },
    ],
    [],
  );

  const [searchTerm, setSearchTerm] = useState("");

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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Knowledge Base
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Find detailed guides, tutorials, and documentation for all system
              features
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search knowledge base..."
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute right-3 top-3 text-slate-400 dark:text-slate-500">
              🔍
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                {category.name}
              </h3>
              <div className="space-y-3">
                {category.articles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => navigate(`/help?article=${article.id}`)}
                    className="block w-full text-left p-3 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <div className="font-medium text-slate-900 dark:text-white">
                      {article.title}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {article.views} views
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Popular Articles */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Popular Articles
          </h3>
          <div className="space-y-4">
            {popularArticles.map((article, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-600 rounded-lg"
              >
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    {article.title}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {article.category} • {article.views} views
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  Read →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

KnowledgeBase.displayName = "KnowledgeBase";

export default KnowledgeBase;
