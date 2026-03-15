import React, { useState, useMemo, useCallback, useEffect } from "react";
import api from "../../../utils/api";

const SkillMatrix = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("level");

  const [categories, setCategories] = useState([{ id: "all", name: "All Skills", count: 0 }]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get('/portfolio/skills');
        const data = response.data?.data || {};
        if (data.categories) setCategories([{ id: "all", name: "All Skills", count: data.skills?.length || 0 }, ...data.categories]);
        if (data.skills) setSkills(data.skills);
      } catch (error) {
        console.error("Failed to fetch skills", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const filteredSkills = useMemo(
    () =>
      skills
        .filter(
          (skill) =>
            selectedCategory === "all" || skill.category === selectedCategory,
        )
        .sort((a, b) => {
          if (sortBy === "level") return b.level - a.level;
          if (sortBy === "name") return a.name.localeCompare(b.name);
          if (sortBy === "recent")
            return new Date(b.lastUsed) - new Date(a.lastUsed);
          return 0;
        }),
    [skills, selectedCategory, sortBy],
  );

  const getLevelColor = useCallback((level) => {
    if (level >= 80) return "bg-emerald-500 dark:bg-emerald-400";
    if (level >= 60) return "bg-amber-500 dark:bg-amber-400";
    return "bg-rose-500 dark:bg-rose-400";
  }, []);

  const getLevelLabel = useCallback((level) => {
    if (level >= 80) return "Expert";
    if (level >= 60) return "Intermediate";
    return "Beginner";
  }, []);

  const getCategoryColor = useCallback((category) => {
    switch (category) {
      case "technical":
        return "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200";
      case "soft":
        return "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200";
      case "tools":
        return "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200";
      default:
        return "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300";
    }
  }, []);

  // Calculate average level per category
  const categoryStats = useMemo(
    () =>
      categories.map((cat) => {
        const categorySkills =
          cat.id === "all"
            ? skills
            : skills.filter((s) => s.category === cat.id);
        const avgLevel =
          categorySkills.length > 0
            ? Math.round(
                categorySkills.reduce((sum, s) => sum + s.level, 0) /
                  categorySkills.length,
              )
            : 0;

        return {
          ...cat,
          avgLevel,
          skillCount: categorySkills.length,
        };
      }),
    [categories, skills],
  );

  if (loading) return <div className="p-6 text-center text-slate-500">Loading skills...</div>;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6\">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Skill Matrix</h2>
          <p className="text-gray-600 mt-1">
            Track and visualize skill development across categories
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="level">Sort by Level</option>
            <option value="name">Sort by Name</option>
            <option value="recent">Sort by Recent Use</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <i className="fas fa-plus mr-2"></i>
            Add Skill
          </button>
        </div>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {categoryStats.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              selectedCategory === cat.id
                ? "ring-2 ring-blue-500 bg-blue-50"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-800">{cat.name}</span>
              <span
                className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(
                  cat.id,
                )}`}
              >
                {cat.skillCount}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {cat.avgLevel}%
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getLevelColor(cat.avgLevel)} rounded-full`}
                style={{ width: `${cat.avgLevel}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Skills Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Skill
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Used
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Projects
              </th>
              <th className="px6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSkills.map((skill) => (
              <tr key={skill.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {skill.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${getCategoryColor(
                      skill.category,
                    )}`}
                  >
                    {skill.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-32 mr-3">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getLevelColor(
                            skill.level,
                          )} rounded-full`}
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-900">
                      {skill.level}% ({getLevelLabel(skill.level)})
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {skill.lastUsed}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{skill.projects}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-chart-bar text-gray-300 text-4xl mb-3"></i>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No skills found
          </h3>
          <p className="text-gray-500">Try selecting a different category</p>
        </div>
      )}

      {/* Skill Distribution Chart */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700\">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Skill Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">By Category</h4>
            <div className="space-y-4">
              {categories
                .filter((c) => c.id !== "all")
                .map((cat) => {
                  const categorySkills = skills.filter(
                    (s) => s.category === cat.id,
                  );
                  const avgLevel =
                    categorySkills.length > 0
                      ? Math.round(
                          categorySkills.reduce((sum, s) => sum + s.level, 0) /
                            categorySkills.length,
                        )
                      : 0;

                  return (
                    <div key={cat.id} className="flex items-center">
                      <span className="w-24 text-sm text-gray-600">
                        {cat.name}
                      </span>
                      <div className="flex-1 ml-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{categorySkills.length} skills</span>
                          <span>{avgLevel}% avg</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getLevelColor(
                              avgLevel,
                            )} rounded-full`}
                            style={{ width: `${avgLevel}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-3">
              Skill Levels Overview
            </h4>
            <div className="space-y-4">
              {[
                {
                  level: "Expert (80-100%)",
                  count: skills.filter((s) => s.level >= 80).length,
                  color: "bg-green-500",
                },
                {
                  level: "Intermediate (60-79%)",
                  count: skills.filter((s) => s.level >= 60 && s.level < 80)
                    .length,
                  color: "bg-yellow-500",
                },
                {
                  level: "Beginner (0-59%)",
                  count: skills.filter((s) => s.level < 60).length,
                  color: "bg-red-500",
                },
              ].map((item) => (
                <div
                  key={item.level}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 ${item.color} rounded-full mr-3`}
                    ></div>
                    <span className="text-sm text-gray-600">{item.level}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{item.count} skills</span>
                    <span className="text-gray-500">
                      ({Math.round((item.count / skills.length) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Overall Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(
                    skills.reduce((sum, s) => sum + s.level, 0) / skills.length,
                  )}
                  %
                </div>
                <div className="text-sm text-gray-600">Overall Proficiency</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {skills.filter((s) => s.level >= 80).length}
                </div>
                <div className="text-sm text-gray-600">Expert Skills</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SkillMatrix.displayName = "SkillMatrix";

export default React.memo(SkillMatrix);
