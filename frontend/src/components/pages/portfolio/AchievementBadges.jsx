import React, { useState, useMemo, useCallback, useEffect } from 'react';
import api from '../../../utils/api';

const AchievementBadges = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [userBadges, setUserBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await api.get('/portfolio/badges');
        const data = response.data || {};
        if (data.badges) setUserBadges(data.badges);
      } catch (error) {
        console.error('Failed to fetch badges', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, []);

  const filters = useMemo(
    () => [
      { id: 'all', name: 'All Badges', count: userBadges.length },
      {
        id: 'earned',
        name: 'Earned',
        count: userBadges.filter((b) => b.earned).length,
      },
      {
        id: 'available',
        name: 'Available',
        count: userBadges.filter((b) => !b.earned).length,
      },
      {
        id: 'recent',
        name: 'Recent',
        count: userBadges.filter((b) => b.earned && b.date).length,
      },
    ],
    [userBadges]
  );

  const filteredBadges = useMemo(
    () =>
      userBadges.filter((badge) => {
        if (selectedFilter === 'earned') return badge.earned;
        if (selectedFilter === 'available') return !badge.earned;
        if (selectedFilter === 'recent') return badge.earned && badge.date;
        return true;
      }),
    [userBadges, selectedFilter]
  );

  if (loading)
    return (
      <div className='p-6 text-center text-slate-500'>Loading badges...</div>
    );

  return (
    <div className='p-6\ rounded-lg bg-white shadow dark:bg-slate-900'>
      {/* Header */}
      <div className='mb-8 flex flex-col justify-between md:flex-row md:items-center'>
        <div>
          <h2 className='dark:text-white\ text-2xl font-bold text-slate-900'>
            Achievement Badges
          </h2>
          <p className='mt-1\ text-slate-600 dark:text-slate-400'>
            Track your accomplishments and milestones
          </p>
        </div>
        <div className='mt-4 flex items-center space-x-2 md:mt-0'>
          <div className='rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200'>
            {userBadges.filter((b) => b.earned).length} / {userBadges.length}{' '}
            Badges Earned
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className='mb-8 grid grid-cols-2 gap-4 md:grid-cols-4'>
        <div className='rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-4'>
          <div className='text-2xl font-bold text-blue-600'>5</div>
          <div className='text-sm text-gray-700'>Badges Earned</div>
        </div>
        <div className='rounded-lg bg-gradient-to-r from-green-50 to-green-100 p-4'>
          <div className='text-2xl font-bold text-green-600'>3</div>
          <div className='text-sm text-gray-700'>Available</div>
        </div>
        <div className='rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 p-4'>
          <div className='text-2xl font-bold text-purple-600'>2</div>
          <div className='text-sm text-gray-700'>This Month</div>
        </div>
        <div className='rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 p-4'>
          <div className='text-2xl font-bold text-yellow-600'>62%</div>
          <div className='text-sm text-gray-700'>Completion</div>
        </div>
      </div>

      {/* Filters */}
      <div className='mb-6 flex space-x-2 overflow-x-auto pb-2'>
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 ${
              selectedFilter === filter.id
                ? 'bg-blue-600 font-medium text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.name} ({filter.count})
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {filteredBadges.map((badge) => (
          <div
            key={badge.id}
            className={`rounded-lg border p-5 text-center transition-all ${
              badge.earned
                ? 'border-gray-200 hover:shadow-md'
                : 'border-gray-100 opacity-75'
            }`}
          >
            {/* Badge Icon */}
            <div
              className={`h-20 w-20 rounded-full ${
                badge.color.split(' ')[1]
              } mx-auto mb-4 flex items-center justify-center`}
            >
              <i
                className={`${badge.icon} ${
                  badge.color.split(' ')[0]
                } text-3xl`}
              ></i>
            </div>

            {/* Badge Info */}
            <h3 className='mb-1 font-bold text-gray-800'>{badge.name}</h3>
            <p className='mb-3 text-sm text-gray-600'>{badge.description}</p>

            {/* Status */}
            <div
              className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                badge.earned
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {badge.earned ? (
                <>
                  <i className='fas fa-check mr-1'></i>
                  Earned {badge.date}
                </>
              ) : (
                'Not Earned Yet'
              )}
            </div>

            {/* Progress (if applicable) */}
            {!badge.earned && (
              <div className='mt-4'>
                <div className='h-2 overflow-hidden rounded-full bg-gray-200'>
                  <div
                    className='h-full rounded-full bg-blue-500'
                    style={{ width: '40%' }}
                  ></div>
                </div>
                <div className='mt-1 text-xs text-gray-500'>40% complete</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredBadges.length === 0 && (
        <div className='py-12 text-center'>
          <i className='fas fa-trophy mb-3 text-4xl text-gray-300'></i>
          <h3 className='mb-2 text-lg font-medium text-gray-700'>
            No badges found
          </h3>
          <p className='text-gray-500'>Try selecting a different filter</p>
        </div>
      )}

      {/* Recent Activity */}
      <div className='dark:border-slate-700\ mt-8 border-t border-slate-200 pt-6'>
        <h3 className='mb-4 font-medium text-gray-700'>Recent Activity</h3>
        <div className='space-y-3'>
          {userBadges
            .filter((b) => b.earned && b.date)
            .slice(0, 3)
            .map((badge) => (
              <div
                key={badge.id}
                className='flex items-center rounded-lg bg-gray-50 p-3'
              >
                <div
                  className={`h-10 w-10 rounded-full ${
                    badge.color.split(' ')[1]
                  } mr-3 flex items-center justify-center`}
                >
                  <i
                    className={`${badge.icon} ${badge.color.split(' ')[0]}`}
                  ></i>
                </div>
                <div className='flex-1'>
                  <div className='font-medium text-gray-800'>{badge.name}</div>
                  <div className='text-sm text-gray-500'>
                    Earned on {badge.date}
                  </div>
                </div>
                <button className='text-blue-600 hover:text-blue-800'>
                  <i className='fas fa-share-alt'></i>
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

AchievementBadges.displayName = 'AchievementBadges';

export default React.memo(AchievementBadges);
