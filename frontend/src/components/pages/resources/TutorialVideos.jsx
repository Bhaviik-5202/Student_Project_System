import React, { useState, useMemo, useCallback, memo, useEffect } from "react";
import api from "../../../utils/api";

const CategoryPill = memo(({ category, isActive, onSelect }) => (
  <button
    onClick={() => onSelect(category.id)}
    className={`px-3 py-1 text-sm border rounded-full ${
      isActive
        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
    }`}
  >
    {category.name} ({category.count})
  </button>
));

CategoryPill.displayName = "CategoryPill";

const TutorialVideos = memo(() => {
  const [activeVideo, setActiveVideo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [videos, setVideos] = useState([]);
  const [videoCategories, setVideoCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get("/resources/videos");
        const data = response.data || {};
        if (data.videos) {
          setVideos(data.videos);
          if (data.videos.length > 0 && !activeVideo) {
            setActiveVideo(data.videos[0].id || data.videos[0]._id);
          }
        }
        if (data.categories) {
          setVideoCategories([{ id: "all", name: "All Videos", count: data.videos?.length || 0 }, ...data.categories]);
        }
      } catch (error) {
        console.error("Failed to fetch tutorial videos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const currentVideo = useMemo(
    () => videos.find((video) => (video.id || video._id) === activeVideo),
    [videos, activeVideo],
  );

  const filteredVideos = useMemo(() => {
    const lowered = searchTerm.toLowerCase();
    return videos.filter((video) => {
      const matchesSearch =
        video.title.toLowerCase().includes(lowered) ||
        video.description.toLowerCase().includes(lowered);
      const matchesCategory =
        selectedCategory === "all" || video.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [videos, searchTerm, selectedCategory]);

  const handleSelectVideo = useCallback((id) => {
    setActiveVideo(id);
  }, []);

  const handleSelectCategory = useCallback((id) => {
    setSelectedCategory(id);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-md p-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Video Player */}
        <div className="lg:w-2/3">
          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading tutorials...</div>
          ) : (
            <>
              <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {currentVideo?.title || "Select a video"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {currentVideo?.description}
            </p>
          </div>

          {/* Video Player */}
          <div className="bg-gray-900 rounded-lg overflow-hidden mb-4">
            <div className="aspect-w-16 aspect-h-9">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <i className="fas fa-play-circle text-white text-6xl mb-4 opacity-50"></i>
                  <p className="text-white">Click a video to play</p>
                </div>
              </div>
            </div>
          </div>

          {/* Video Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-lg">
                <i className="fas fa-play mr-2" />
                Play
              </button>
              <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <i className="fas fa-expand" />
              </button>
              <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <i className="fas fa-volume-up" />
              </button>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Duration: {currentVideo?.duration}
            </div>
          </div>

          {/* Video Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-800 dark:text-white">
                Video Information
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentVideo?.date}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Views:</span>
                <span className="font-medium ml-2 text-gray-800 dark:text-white">
                  {currentVideo?.views.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Category:
                </span>
                <span className="font-medium ml-2 capitalize text-gray-800 dark:text-white">
                  {currentVideo?.category.replace("-", " ")}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Likes:</span>
                <span className="font-medium ml-2 text-gray-800 dark:text-white">
                  142
                </span>
              </div>
            </div>
          </div>
            </>
          )}
        </div>

        {/* Right Column - Video List */}
        <div className="lg:w-1/3">
          <div className="mb-4">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search tutorials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {videoCategories.map((category) => (
                <CategoryPill
                  key={category.id}
                  category={category}
                  isActive={selectedCategory === category.id}
                  onSelect={handleSelectCategory}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">
              Recommended Videos
            </h3>
            {filteredVideos.map((video) => (
              <button
                key={video.id || video._id}
                onClick={() => handleSelectVideo(video.id || video._id)}
                className={`w-full p-3 rounded-lg border text-left transition-colors ${
                  activeVideo === (video.id || video._id)
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-24 h-16 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <i className="fas fa-play text-white" />
                      </div>
                    </div>
                    <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                      {video.duration}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-white text-sm mb-1">
                      {video.title}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center mr-3">
                        <i className="fas fa-eye mr-1" />
                        {video.views?.toLocaleString()}
                      </span>
                      <span>{video.date}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{videos.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Videos
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <div className="text-2xl font-bold text-green-600">4.5K</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Views
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">6.2</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avg. Rating
            </div>
          </div>
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">98%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Satisfaction
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

TutorialVideos.displayName = "TutorialVideos";

export default TutorialVideos;
