import React, { memo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

const UserGuide = memo(() => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const response = await api.get("/help/guide");
        setChapters(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch user guide", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, []);

  const [activeChapter, setActiveChapter] = useState(1);

  const handleChapterChange = useCallback((chapterId) => {
    setActiveChapter(chapterId);
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              User Guide
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Complete user manual and documentation for the Project Management
              System
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chapters Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Chapters
              </h3>
              <div className="space-y-2">
                {loading ? (
                  <div className="text-slate-500 text-sm">Loading chapters...</div>
                ) : chapters.map((chapter, idx) => (
                  <button
                    key={chapter.id || chapter._id || idx}
                    onClick={() => handleChapterChange(chapter.id || idx + 1)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeChapter === (chapter.id || idx + 1)
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <div className="font-medium">{chapter.title}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chapter Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              {chapters.find((ch, idx) => (ch.id || idx + 1) === activeChapter) && (
                <>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                    {chapters.find((ch, idx) => (ch.id || idx + 1) === activeChapter)?.title}
                  </h2>

                  <div className="prose max-w-none space-y-6">
                    {chapters.find((ch, idx) => (ch.id || idx + 1) === activeChapter)?.sections?.map((section, idx) => (
                      <div key={idx}>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                          {section.title || section}
                        </h3>
                        {section.content && (
                          <div
                            className="text-slate-700 dark:text-slate-300"
                            dangerouslySetInnerHTML={{ __html: section.content }}
                          />
                        )}
                        {!section.content && section.body && (
                          <p className="text-slate-700 dark:text-slate-300">{section.body}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between">
                      <button
                        onClick={() =>
                          handleChapterChange(Math.max(1, activeChapter - 1))
                        }
                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                        disabled={activeChapter === 1}
                      >
                        ← Previous Chapter
                      </button>
                      <button
                        onClick={() =>
                          handleChapterChange(
                            Math.min(chapters.length, activeChapter + 1),
                          )
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        disabled={activeChapter === chapters.length}
                      >
                        Next Chapter →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

UserGuide.displayName = "UserGuide";

export default UserGuide;
