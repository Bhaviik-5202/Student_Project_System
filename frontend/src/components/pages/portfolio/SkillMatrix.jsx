import React, { useState, useMemo, useCallback, useEffect } from 'react';
import api from '../../../utils/api';

const SkillMatrix = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('level');

  const [categories, setCategories] = useState([
    { id: 'all', name: 'All Skills', count: 0 },
  ]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get('/portfolio/skills');
        const data = response.data || {};
        if (data.categories)
          setCategories([
            { id: 'all', name: 'All Skills', count: data.skills?.length || 0 },
            ...data.categories,
          ]);
        if (data.skills) setSkills(data.skills);
      } catch (error) {
        console.error('Failed to fetch skills', error);
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
            selectedCategory === 'all' || skill.category === selectedCategory
        )
        .sort((a, b) => {
          if (sortBy === 'level') return b.level - a.level;
          if (sortBy === 'name') return a.name.localeCompare(b.name);
          if (sortBy === 'recent')
            return new Date(b.lastUsed) - new Date(a.lastUsed);
          return 0;
        }),
    [skills, selectedCategory, sortBy]
  );

  const getLevelColor = useCallback((level) => {
    if (level >= 80) return 'bg-emerald-500 dark:bg-emerald-400';
    if (level >= 60) return 'bg-amber-500 dark:bg-amber-400';
    return 'bg-rose-500 dark:bg-rose-400';
  }, []);

  const getLevelLabel = useCallback((level) => {
    if (level >= 80) return 'Expert';
    if (level >= 60) return 'Intermediate';
    return 'Beginner';
  }, []);

  const getCategoryColor = useCallback((category) => {
    switch (category) {
      case 'technical':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200';
      case 'soft':
        return 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200';
      case 'tools':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  }, []);

  // Calculate average level per category
  const categoryStats = useMemo(
    () =>
      categories.map((cat) => {
        const categorySkills =
          cat.id === 'all'
            ? skills
            : skills.filter((s) => s.category === cat.id);
        const avgLevel =
          categorySkills.length > 0
            ? Math.round(
                categorySkills.reduce((sum, s) => sum + s.level, 0) /
                  categorySkills.length
              )
            : 0;

        return {
          ...cat,
          avgLevel,
          skillCount: categorySkills.length,
        };
      }),
    [categories, skills]
  );

  if (loading)
    return (
      <div className='p-6 text-center text-slate-500'>Loading skills...</div>
    );

  return (
    <div className='p-6\ rounded-lg bg-white shadow dark:bg-slate-900'>
      {/* Header */}
      <div className='mb-8 flex flex-col justify-between lg:flex-row lg:items-center'>
        <div>
          <h2 className='text-2xl font-bold text-gray-800'>Skill Matrix</h2>
          <p className='mt-1 text-gray-600'>
            Track and visualize skill development across categories
          </p>
        </div>
        <div className='mt-4 flex items-center space-x-3 lg:mt-0'>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='rounded-lg border border-gray-300 px-4 py-2'
          >
            <option value='level'>Sort by Level</option>
            <option value='name'>Sort by Name</option>
            <option value='recent'>Sort by Recent Use</option>
          </select>
          <button className='rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
            <i className='fas fa-plus mr-2'></i>
            Add Skill
          </button>
        </div>
      </div>

      {/* Category Overview */}
      <div className='mb-8 grid grid-cols-2 gap-4 md:grid-cols-4'>
        {categoryStats.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`cursor-pointer rounded-lg p-4 transition-all ${
              selectedCategory === cat.id
                ? 'bg-blue-50 ring-2 ring-blue-500'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className='mb-2 flex items-center justify-between'>
              <span className='font-medium text-gray-800'>{cat.name}</span>
              <span
                className={`rounded-full px-2 py-1 text-xs ${getCategoryColor(
                  cat.id
                )}`}
              >
                {cat.skillCount}
              </span>
            </div>
            <div className='mb-2 text-2xl font-bold text-gray-900'>
              {cat.avgLevel}%
            </div>
            <div className='h-2 overflow-hidden rounded-full bg-gray-200'>
              <div
                className={`h-full ${getLevelColor(cat.avgLevel)} rounded-full`}
                style={{ width: `${cat.avgLevel}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Skills Table */}
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Skill
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Category
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Level
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Last Used
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Projects
              </th>
              <th className='px6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {filteredSkills.map((skill) => (
              <tr key={skill.id} className='hover:bg-gray-50'>
                <td className='whitespace-nowrap px-6 py-4'>
                  <div className='flex items-center'>
                    <div className='ml-4'>
                      <div className='text-sm font-medium text-gray-900'>
                        {skill.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className='whitespace-nowrap px-6 py-4'>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${getCategoryColor(
                      skill.category
                    )}`}
                  >
                    {skill.category}
                  </span>
                </td>
                <td className='whitespace-nowrap px-6 py-4'>
                  <div className='flex items-center'>
                    <div className='mr-3 w-32'>
                      <div className='h-2 overflow-hidden rounded-full bg-gray-200'>
                        <div
                          className={`h-full ${getLevelColor(
                            skill.level
                          )} rounded-full`}
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className='text-sm text-gray-900'>
                      {skill.level}% ({getLevelLabel(skill.level)})
                    </div>
                  </div>
                </td>
                <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                  {skill.lastUsed}
                </td>
                <td className='whitespace-nowrap px-6 py-4'>
                  <div className='text-sm text-gray-900'>{skill.projects}</div>
                </td>
                <td className='whitespace-nowrap px-6 py-4 text-sm font-medium'>
                  <button className='mr-3 text-blue-600 hover:text-blue-900'>
                    <i className='fas fa-edit'></i>
                  </button>
                  <button className='text-red-600 hover:text-red-900'>
                    <i className='fas fa-trash'></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredSkills.length === 0 && (
        <div className='py-12 text-center'>
          <i className='fas fa-chart-bar mb-3 text-4xl text-gray-300'></i>
          <h3 className='mb-2 text-lg font-medium text-gray-700'>
            No skills found
          </h3>
          <p className='text-gray-500'>Try selecting a different category</p>
        </div>
      )}

      {/* Skill Distribution Chart */}
      <div className='dark:border-slate-700\ mt-8 border-t border-slate-200 pt-6'>
        <h3 className='mb-4 text-lg font-bold text-gray-800'>
          Skill Distribution
        </h3>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div>
            <h4 className='mb-3 font-medium text-gray-700'>By Category</h4>
            <div className='space-y-4'>
              {categories
                .filter((c) => c.id !== 'all')
                .map((cat) => {
                  const categorySkills = skills.filter(
                    (s) => s.category === cat.id
                  );
                  const avgLevel =
                    categorySkills.length > 0
                      ? Math.round(
                          categorySkills.reduce((sum, s) => sum + s.level, 0) /
                            categorySkills.length
                        )
                      : 0;

                  return (
                    <div key={cat.id} className='flex items-center'>
                      <span className='w-24 text-sm text-gray-600'>
                        {cat.name}
                      </span>
                      <div className='ml-4 flex-1'>
                        <div className='mb-1 flex justify-between text-sm'>
                          <span>{categorySkills.length} skills</span>
                          <span>{avgLevel}% avg</span>
                        </div>
                        <div className='h-2 overflow-hidden rounded-full bg-gray-200'>
                          <div
                            className={`h-full ${getLevelColor(
                              avgLevel
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
            <h4 className='mb-3 font-medium text-gray-700'>
              Skill Levels Overview
            </h4>
            <div className='space-y-4'>
              {[
                {
                  level: 'Expert (80-100%)',
                  count: skills.filter((s) => s.level >= 80).length,
                  color: 'bg-green-500',
                },
                {
                  level: 'Intermediate (60-79%)',
                  count: skills.filter((s) => s.level >= 60 && s.level < 80)
                    .length,
                  color: 'bg-yellow-500',
                },
                {
                  level: 'Beginner (0-59%)',
                  count: skills.filter((s) => s.level < 60).length,
                  color: 'bg-red-500',
                },
              ].map((item) => (
                <div
                  key={item.level}
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center'>
                    <div
                      className={`h-3 w-3 ${item.color} mr-3 rounded-full`}
                    ></div>
                    <span className='text-sm text-gray-600'>{item.level}</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='font-medium'>{item.count} skills</span>
                    <span className='text-gray-500'>
                      ({Math.round((item.count / skills.length) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Overall Stats */}
            <div className='mt-6 grid grid-cols-2 gap-4'>
              <div className='rounded-lg bg-blue-50 p-4'>
                <div className='text-2xl font-bold text-blue-600'>
                  {Math.round(
                    skills.reduce((sum, s) => sum + s.level, 0) / skills.length
                  )}
                  %
                </div>
                <div className='text-sm text-gray-600'>Overall Proficiency</div>
              </div>
              <div className='rounded-lg bg-green-50 p-4'>
                <div className='text-2xl font-bold text-green-600'>
                  {skills.filter((s) => s.level >= 80).length}
                </div>
                <div className='text-sm text-gray-600'>Expert Skills</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SkillMatrix.displayName = 'SkillMatrix';

export default React.memo(SkillMatrix);
