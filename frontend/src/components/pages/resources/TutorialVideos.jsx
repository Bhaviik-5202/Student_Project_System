import React, { useState } from "react";

const TutorialVideos = () => {
  const [activeVideo, setActiveVideo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const videoCategories = [
    { id: "all", name: "All Videos", count: 24 },
    { id: "getting-started", name: "Getting Started", count: 6 },
    { id: "projects", name: "Projects", count: 8 },
    { id: "reports", name: "Reports", count: 4 },
    { id: "collaboration", name: "Collaboration", count: 6 },
  ];

  const videos = [
    {
      id: 1,
      title: "Getting Started with Project Management",
      category: "getting-started",
      duration: "12:45",
      views: 1560,
      date: "2024-01-10",
      thumbnail: "https://via.placeholder.com/300x180",
      description: "Learn the basics of using our project management system",
    },
    {
      id: 2,
      title: "Creating Your First Project",
      category: "projects",
      duration: "18:30",
      views: 980,
      date: "2024-01-12",
      thumbnail: "https://via.placeholder.com/300x180",
      description: "Step-by-step guide to creating and managing projects",
    },
    {
      id: 3,
      title: "Advanced Reporting Features",
      category: "reports",
      duration: "22:15",
      views: 720,
      date: "2024-01-08",
      thumbnail: "https://via.placeholder.com/300x180",
      description: "Master the reporting and analytics tools",
    },
    {
      id: 4,
      title: "Team Collaboration Tools",
      category: "collaboration",
      duration: "15:20",
      views: 890,
      date: "2024-01-05",
      thumbnail: "https://via.placeholder.com/300x180",
      description: "How to effectively collaborate with your team",
    },
    {
      id: 5,
      title: "Time Management & Deadlines",
      category: "projects",
      duration: "20:10",
      views: 640,
      date: "2024-01-03",
      thumbnail: "https://via.placeholder.com/300x180",
      description: "Manage project timelines and meet deadlines",
    },
    {
      id: 6,
      title: "Mobile App Tutorial",
      category: "getting-started",
      duration: "14:25",
      views: 1120,
      date: "2024-01-15",
      thumbnail: "https://via.placeholder.com/300x180",
      description: "Using the project management app on mobile devices",
    },
  ];

  const getVideoById = (id) => videos.find((video) => video.id === id);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Video Player */}
        <div className="lg:w-2/3">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {getVideoById(activeVideo)?.title || "Select a video"}
            </h2>
            <p className="text-gray-600">
              {getVideoById(activeVideo)?.description}
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
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <i className="fas fa-play mr-2"></i>
                Play
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <i className="fas fa-expand"></i>
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <i className="fas fa-volume-up"></i>
              </button>
            </div>
            <div className="text-gray-600">
              Duration: {getVideoById(activeVideo)?.duration}
            </div>
          </div>

          {/* Video Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Video Information</span>
              <span className="text-sm text-gray-500">
                {getVideoById(activeVideo)?.date}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Views:</span>
                <span className="font-medium ml-2">
                  {getVideoById(activeVideo)?.views.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Category:</span>
                <span className="font-medium ml-2 capitalize">
                  {getVideoById(activeVideo)?.category.replace("-", " ")}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Likes:</span>
                <span className="font-medium ml-2">142</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Video List */}
        <div className="lg:w-1/3">
          <div className="mb-4">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search tutorials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium text-gray-700 mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {videoCategories.map((category) => (
                <button
                  key={category.id}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50"
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Recommended Videos</h3>
            {videos.map((video) => (
              <button
                key={video.id}
                onClick={() => setActiveVideo(video.id)}
                className={`w-full p-3 rounded-lg border text-left transition-colors ${
                  activeVideo === video.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden">
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <i className="fas fa-play text-white"></i>
                      </div>
                    </div>
                    <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                      {video.duration}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm mb-1">
                      {video.title}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="flex items-center mr-3">
                        <i className="fas fa-eye mr-1"></i>
                        {video.views.toLocaleString()}
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
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-sm text-gray-600">Total Videos</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">4.5K</div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">6.2</div>
            <div className="text-sm text-gray-600">Avg. Rating</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">98%</div>
            <div className="text-sm text-gray-600">Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialVideos;
