import React, { useState, useMemo, useCallback, memo, useEffect } from "react";
import resourceService from "../../../services/resourceService";

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
  const [activeVideo, setActiveVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await resourceService.getAll({ type: "video" });
        if (response.success) {
          const fetchedVideos = response.data || [];
          setVideos(fetchedVideos);
          if (fetchedVideos.length > 0) {
            setActiveVideo(fetchedVideos[0]._id || fetchedVideos[0].id);
          }
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
    () => videos.find((video) => (video._id || video.id) === activeVideo),
    [videos, activeVideo],
  );

  const videoCategories = useMemo(() => {
    const cats = videos.reduce((acc, v) => {
      const cat = v.type || "other";
      if (!acc[cat]) acc[cat] = { id: cat, name: cat.charAt(0).toUpperCase() + cat.slice(1), count: 0 };
      acc[cat].count++;
      return acc;
    }, {});
    return [{ id: "all", name: "All Videos", count: videos.length }, ...Object.values(cats)];
  }, [videos]);

  const filteredVideos = useMemo(() => {
    const lowered = searchTerm.toLowerCase();
    return videos.filter((video) => {
      const matchesSearch =
        video.title.toLowerCase().includes(lowered) ||
        (video.description && video.description.toLowerCase().includes(lowered));
      const matchesCategory =
        selectedCategory === "all" || video.type === selectedCategory;
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
              <div className="bg-gray-900 rounded-lg overflow-hidden mb-4 relative aspect-video">
                {currentVideo?.url?.includes("embed") ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={currentVideo.url}
                    title={currentVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <i className="fas fa-play-circle text-white text-6xl mb-4 opacity-50"></i>
                      <p className="text-white">Video preview not available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800 dark:text-white">
                    Video Information
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {currentVideo ? new Date(currentVideo.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Category:</span>
                    <span className="font-medium ml-2 capitalize text-gray-800 dark:text-white">
                      {currentVideo?.type}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Uploaded By:</span>
                    <span className="font-medium ml-2 text-gray-800 dark:text-white">
                      {currentVideo?.uploadedBy?.name || "Faculty"}
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
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

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">
              Video Lectures
            </h3>
            {filteredVideos.map((video) => (
              <button
                key={video._id || video.id}
                onClick={() => handleSelectVideo(video._id || video.id)}
                className={`w-full p-3 rounded-lg border text-left transition-colors ${
                  activeVideo === (video._id || video.id)
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-24 h-16 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden flex items-center justify-center">
                      <i className="fas fa-play text-gray-400 opacity-50" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-white text-sm mb-1 line-clamp-2">
                      {video.title}
                    </h4>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(video.createdAt).toLocaleDateString()}
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
              Total Tutorials
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {videos.filter(v => v.type === 'video').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Video Modules
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">4.8</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avg. Rating
            </div>
          </div>
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">100%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Accessibility
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

TutorialVideos.displayName = "TutorialVideos";

export default TutorialVideos;
