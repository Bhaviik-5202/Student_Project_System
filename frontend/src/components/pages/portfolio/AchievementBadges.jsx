import React, { useState, useMemo, useCallback, useEffect } from "react";
import api from "../../../utils/api";

const AchievementBadges = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [userBadges, setUserBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await api.get("/portfolio/badges");
        const data = response.data || {};
        if (data.badges) setUserBadges(data.badges);
      } catch (error) {
        console.error("Failed to fetch badges", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, []);

  const filters = useMemo(
    () => [
      { id: "all", name: "All Badges", count: userBadges.length },
      { id: "earned", name: "Earned", count: userBadges.filter(b => b.earned).length },
      { id: "available", name: "Available", count: userBadges.filter(b => !b.earned).length },
      { id: "recent", name: "Recent", count: userBadges.filter(b => b.earned && b.date).length },
    ],
    [userBadges]
  );

  const filteredBadges = useMemo(
    () =>
      userBadges.filter((badge) => {
        if (selectedFilter === "earned") return badge.earned;
        if (selectedFilter === "available") return !badge.earned;
        if (selectedFilter === "recent") return badge.earned && badge.date;
        return true;
      }),
    [userBadges, selectedFilter],
  );

  if (loading) return <div className="p-6 text-center text-slate-500">Loading badges...</div>;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6\">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white\">
            Achievement Badges
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1\">
            Track your accomplishments and milestones
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full font-medium">
            {userBadges.filter((b) => b.earned).length} / {userBadges.length}{" "}
            Badges Earned
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">5</div>
          <div className="text-sm text-gray-700">Badges Earned</div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">3</div>
          <div className="text-sm text-gray-700">Available</div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">2</div>
          <div className="text-sm text-gray-700">This Month</div>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">62%</div>
          <div className="text-sm text-gray-700">Completion</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              selectedFilter === filter.id
                ? "bg-blue-600 text-white font-medium"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filter.name} ({filter.count})
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredBadges.map((badge) => (
          <div
            key={badge.id}
            className={`border rounded-lg p-5 text-center transition-all ${
              badge.earned
                ? "border-gray-200 hover:shadow-md"
                : "border-gray-100 opacity-75"
            }`}
          >
            {/* Badge Icon */}
            <div
              className={`w-20 h-20 rounded-full ${
                badge.color.split(" ")[1]
              } flex items-center justify-center mx-auto mb-4`}
            >
              <i
                className={`${badge.icon} ${
                  badge.color.split(" ")[0]
                } text-3xl`}
              ></i>
            </div>

            {/* Badge Info */}
            <h3 className="font-bold text-gray-800 mb-1">{badge.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{badge.description}</p>

            {/* Status */}
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                badge.earned
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {badge.earned ? (
                <>
                  <i className="fas fa-check mr-1"></i>
                  Earned {badge.date}
                </>
              ) : (
                "Not Earned Yet"
              )}
            </div>

            {/* Progress (if applicable) */}
            {!badge.earned && (
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: "40%" }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">40% complete</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredBadges.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-trophy text-gray-300 text-4xl mb-3"></i>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No badges found
          </h3>
          <p className="text-gray-500">Try selecting a different filter</p>
        </div>
      )}

      {/* Recent Activity */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700\">
        <h3 className="font-medium text-gray-700 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {userBadges
            .filter((b) => b.earned && b.date)
            .slice(0, 3)
            .map((badge) => (
              <div
                key={badge.id}
                className="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                <div
                  className={`w-10 h-10 rounded-full ${
                    badge.color.split(" ")[1]
                  } flex items-center justify-center mr-3`}
                >
                  <i
                    className={`${badge.icon} ${badge.color.split(" ")[0]}`}
                  ></i>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{badge.name}</div>
                  <div className="text-sm text-gray-500">
                    Earned on {badge.date}
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  <i className="fas fa-share-alt"></i>
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

AchievementBadges.displayName = "AchievementBadges";

export default React.memo(AchievementBadges);
